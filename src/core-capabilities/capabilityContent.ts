import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import type {
  ArticleContent,
  ContentRecord,
} from '@/content/engine/types';

import type {
  CapabilityFamily,
  CapabilityProject,
} from './types';

export type CapabilityArticle =
  Pick<
    ArticleContent,
    | 'id'
    | 'slug'
    | 'title'
    | 'description'
    | 'thumbnail'
    | 'publishedAt'
    | 'tags'
    | 'topicIds'
  >;

type ScoredArticle = {
  article: ArticleContent;
  score: number;
};

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase();
}

function countMatches(
  leftValues: readonly string[],
  rightValues: readonly string[],
): number {
  const normalizedLeft =
    new Set(
      leftValues.map(
        normalize,
      ),
    );

  return rightValues.reduce(
    (
      total,
      value,
    ) =>
      normalizedLeft.has(
        normalize(
          value,
        ),
      )
        ? total + 1
        : total,
    0,
  );
}

function scoreArticleForCapability(
  family: CapabilityFamily,
  article: ArticleContent,
): number {
  const topicMatches =
    countMatches(
      family.relatedTopicIds,
      article.topicIds,
    );

  const tagMatches =
    countMatches(
      family.relatedTags,
      article.tags,
    );

  return (
    topicMatches * 40 +
    tagMatches * 12
  );
}

function compareScoredArticles(
  left: ScoredArticle,
  right: ScoredArticle,
): number {
  const scoreDifference =
    right.score -
    left.score;

  if (
    scoreDifference !== 0
  ) {
    return scoreDifference;
  }

  const dateDifference =
    new Date(
      right.article.publishedAt,
    ).getTime() -
    new Date(
      left.article.publishedAt,
    ).getTime();

  if (
    dateDifference !== 0
  ) {
    return dateDifference;
  }

  return left.article.title.localeCompare(
    right.article.title,
  );
}

export function getCapabilityArticles(
  records: readonly ContentRecord[],
  family: CapabilityFamily,
  limit = 3,
  now = new Date(),
): CapabilityArticle[] {
  if (
    !Number.isInteger(
      limit,
    ) ||
    limit < 0
  ) {
    throw new Error(
      'Capability article limit must be a non-negative integer.',
    );
  }

  if (
    limit === 0
  ) {
    return [];
  }

  return getDiscoverableByType(
    records,
    'article',
    now,
  )
    .map(
      (
        article,
      ): ScoredArticle => ({
        article,
        score:
          scoreArticleForCapability(
            family,
            article,
          ),
      }),
    )
    .filter(
      (
        result,
      ) =>
        result.score > 0,
    )
    .sort(
      compareScoredArticles,
    )
    .slice(
      0,
      limit,
    )
    .map(
      (
        result,
      ) =>
        result.article,
    );
}

export function getCapabilityArticleHref(
  article: CapabilityArticle,
): string {
  return `/articles/${article.slug}`;
}

export function getCapabilityProjects(
  records: readonly ContentRecord[],
  family: CapabilityFamily,
  limit = 3,
  now = new Date(),
): CapabilityProject[] {
  return getCapabilityArticles(
    records,
    family,
    limit,
    now,
  ).map(
    (
      article,
    ): CapabilityProject => ({
      id:
        article.id,

      title:
        article.title,

      description:
        article.description,

      thumbnail:
        article.thumbnail?.src,

      href:
        getCapabilityArticleHref(
          article,
        ),

      tags: [
        ...article.tags,
      ],
    }),
  );
}