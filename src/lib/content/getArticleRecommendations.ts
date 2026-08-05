import {
  isDiscoverableContent,
} from '@/content/engine/queries';

import type {
  ArticleContent,
  ContentRecord,
} from '@/content/engine/types';

type RecommendationOptions = {
  includeDrafts?: boolean;
  limit?: number;
  now?: Date;
};

type ScoredArticle = {
  article: ArticleContent;
  score: number;
};

const DEFAULT_LIMIT = 3;

const relationshipWeights = {
  extends: 80,
  follows: 80,
  precedes: 70,
  'relates-to': 65,
  references: 55,
  requires: 50,
  uses: 45,
  demonstrates: 45,
  implements: 45,
  produces: 40,
  documents: 40,
  supports: 40,
} as const;

function normalizeValue(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase();
}

function hasMatchingCategory(
  current: ArticleContent,
  candidate: ArticleContent,
): boolean {
  return (
    normalizeValue(current.category) ===
    normalizeValue(candidate.category)
  );
}

function countSharedValues(
  currentValues: readonly string[],
  candidateValues: readonly string[],
): number {
  const normalizedCurrent =
    new Set(
      currentValues.map(
        normalizeValue,
      ),
    );

  return candidateValues.reduce(
    (
      total,
      candidateValue,
    ) =>
      normalizedCurrent.has(
        normalizeValue(candidateValue),
      )
        ? total + 1
        : total,
    0,
  );
}

function getRelationshipScore(
  current: ArticleContent,
  candidate: ArticleContent,
): number {
  let score = 0;

  for (
    const relationship
    of current.relationships
  ) {
    if (
      relationship.targetId !==
      candidate.id
    ) {
      continue;
    }

    score +=
      relationshipWeights[
        relationship.type
      ] ?? 0;
  }

  for (
    const relationship
    of candidate.relationships
  ) {
    if (
      relationship.targetId !==
      current.id
    ) {
      continue;
    }

    score +=
      relationshipWeights[
        relationship.type
      ] ?? 0;
  }

  return score;
}

function scoreRelatedArticle(
  current: ArticleContent,
  candidate: ArticleContent,
): number {
  let score = 0;

  score += getRelationshipScore(
    current,
    candidate,
  );

  score +=
    countSharedValues(
      current.topicIds,
      candidate.topicIds,
    ) * 40;

  if (
    hasMatchingCategory(
      current,
      candidate,
    )
  ) {
    score += 30;
  }

  score +=
    countSharedValues(
      current.tags,
      candidate.tags,
    ) * 12;

  if (candidate.featured) {
    score += 2;
  }

  return score;
}

function comparePublicationDates(
  left: ArticleContent,
  right: ArticleContent,
): number {
  const dateDifference =
    new Date(
      right.publishedAt,
    ).getTime() -
    new Date(
      left.publishedAt,
    ).getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  const titleDifference =
    left.title.localeCompare(
      right.title,
    );

  if (titleDifference !== 0) {
    return titleDifference;
  }

  return left.id.localeCompare(
    right.id,
  );
}

function compareScoredArticles(
  left: ScoredArticle,
  right: ScoredArticle,
): number {
  const scoreDifference =
    right.score - left.score;

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  return comparePublicationDates(
    left.article,
    right.article,
  );
}

function isEligibleArticle(
  item: ContentRecord,
  includeDrafts: boolean,
  now: Date,
): item is ArticleContent {
  if (item.contentType !== 'article') {
    return false;
  }

  if (includeDrafts) {
    return item.status !== 'archived';
  }

  return isDiscoverableContent(
    item,
    now,
  );
}

function isFutureSeriesPart(
  current: ArticleContent,
  candidate: ArticleContent,
): boolean {
  return (
    current.seriesId !== undefined &&
    current.seriesPart !== undefined &&
    candidate.seriesId ===
      current.seriesId &&
    candidate.seriesPart !== undefined &&
    candidate.seriesPart >
      current.seriesPart
  );
}

function isEarlierOrCurrentSeriesPart(
  current: ArticleContent,
  candidate: ArticleContent,
): boolean {
  return (
    current.seriesId !== undefined &&
    current.seriesPart !== undefined &&
    candidate.seriesId ===
      current.seriesId &&
    candidate.seriesPart !== undefined &&
    candidate.seriesPart <=
      current.seriesPart
  );
}

function validateLimit(
  limit: number,
): void {
  if (
    !Number.isInteger(limit) ||
    limit <= 0
  ) {
    throw new Error(
      'Article recommendation limit must be a positive integer.',
    );
  }
}

export function getArticleRecommendations(
  records: readonly ContentRecord[],
  current: ArticleContent,
  options: RecommendationOptions = {},
): ArticleContent[] {
  const {
    includeDrafts = false,
    limit = DEFAULT_LIMIT,
    now = new Date(),
  } = options;

  validateLimit(limit);

  const eligibleArticles =
    records.filter(
      (
        item,
      ): item is ArticleContent =>
        isEligibleArticle(
          item,
          includeDrafts,
          now,
        ) &&
        item.id !== current.id,
    );

  const futureSeriesParts =
    eligibleArticles
      .filter((candidate) =>
        isFutureSeriesPart(
          current,
          candidate,
        ),
      )
      .sort((left, right) => {
        const partDifference =
          (
            left.seriesPart ?? 0
          ) -
          (
            right.seriesPart ?? 0
          );

        if (partDifference !== 0) {
          return partDifference;
        }

        return comparePublicationDates(
          left,
          right,
        );
      });

  const futureSeriesIds =
    new Set(
      futureSeriesParts.map(
        (article) => article.id,
      ),
    );

  const relatedArticles =
    eligibleArticles
      .filter(
        (candidate) =>
          !futureSeriesIds.has(
            candidate.id,
          ) &&
          !isEarlierOrCurrentSeriesPart(
            current,
            candidate,
          ),
      )
      .map(
        (
          candidate,
        ): ScoredArticle => ({
          article: candidate,
          score:
            scoreRelatedArticle(
              current,
              candidate,
            ),
        }),
      )
      .sort(compareScoredArticles)
      .map(
        ({ article }) => article,
      );

  const recommendations = [
    ...futureSeriesParts,
    ...relatedArticles,
  ].slice(0, limit);

  if (
    recommendations.length <
    limit
  ) {
    return [];
  }

  return recommendations;
}