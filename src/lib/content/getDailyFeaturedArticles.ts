import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import type {
  ArticleContent,
  ContentRecord,
} from '@/content/engine/types';

function createDateKey(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function createSeed(
  value: string,
): number {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^=
      value.charCodeAt(
        index,
      );

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

function createRandom(
  initialSeed: number,
): () => number {
  let seed =
    initialSeed;

  return () => {
    seed +=
      0x6d2b79f5;

    let value =
      seed;

    value =
      Math.imul(
        value ^
          (value >>> 15),
        value | 1,
      );

    value ^=
      value +
      Math.imul(
        value ^
          (value >>> 7),
        value | 61,
      );

    return (
      (
        value ^
        (value >>> 14)
      ) >>> 0
    ) / 4294967296;
  };
}

function shuffleArticles(
  articles:
    readonly ArticleContent[],
  seed: number,
): ArticleContent[] {
  const shuffled = [
    ...articles,
  ];

  const random =
    createRandom(
      seed,
    );

  for (
    let index =
      shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const targetIndex =
      Math.floor(
        random() *
          (index + 1),
      );

    [
      shuffled[index],
      shuffled[
        targetIndex
      ],
    ] = [
      shuffled[
        targetIndex
      ],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getSeriesKey(
  article:
    ArticleContent,
): string {
  return (
    article.seriesId ??
    article.id
  );
}

function getDiversityScore(
  article:
    ArticleContent,
  selected:
    readonly ArticleContent[],
): number {
  const selectedCategories =
    new Set(
      selected.map(
        (
          selectedArticle,
        ) =>
          selectedArticle.category,
      ),
    );

  const selectedSeries =
    new Set(
      selected.map(
        (
          selectedArticle,
        ) =>
          getSeriesKey(
            selectedArticle,
          ),
      ),
    );

  let score = 0;

  if (
    !selectedCategories.has(
      article.category,
    )
  ) {
    score += 2;
  }

  if (
    !selectedSeries.has(
      getSeriesKey(
        article,
      ),
    )
  ) {
    score += 3;
  }

  return score;
}

function chooseBestCandidate(
  candidates:
    readonly ArticleContent[],
  selected:
    readonly ArticleContent[],
): ArticleContent | null {
  if (
    candidates.length === 0
  ) {
    return null;
  }

  let bestCandidate =
    candidates[0];

  let bestScore =
    getDiversityScore(
      bestCandidate,
      selected,
    );

  for (
    let index = 1;
    index <
    candidates.length;
    index += 1
  ) {
    const candidate =
      candidates[index];

    const score =
      getDiversityScore(
        candidate,
        selected,
      );

    if (
      score >
      bestScore
    ) {
      bestCandidate =
        candidate;

      bestScore =
        score;
    }
  }

  return bestCandidate;
}

function removeArticle(
  articles:
    ArticleContent[],
  article:
    ArticleContent,
): void {
  const index =
    articles.findIndex(
      (
        candidate,
      ) =>
        candidate.id ===
        article.id,
    );

  if (
    index >= 0
  ) {
    articles.splice(
      index,
      1,
    );
  }
}

function chooseDailyArticles(
  featuredPool:
    readonly ArticleContent[],
  standardPool:
    readonly ArticleContent[],
  limit: number,
): ArticleContent[] {
  const featured = [
    ...featuredPool,
  ];

  const standard = [
    ...standardPool,
  ];

  const selected:
    ArticleContent[] = [];

  while (
    selected.length <
      limit &&
    (
      featured.length >
        0 ||
      standard.length >
        0
    )
  ) {
    const featuredCandidate =
      chooseBestCandidate(
        featured,
        selected,
      );

    const standardCandidate =
      chooseBestCandidate(
        standard,
        selected,
      );

    /*
     * Editorially featured articles receive
     * priority when they provide equally good
     * diversity.
     *
     * A standard article may win when it adds
     * meaningfully better category or series
     * diversity to the homepage selection.
     */
    let chosen:
      ArticleContent |
      null = null;

    if (
      featuredCandidate &&
      standardCandidate
    ) {
      const featuredScore =
        getDiversityScore(
          featuredCandidate,
          selected,
        );

      const standardScore =
        getDiversityScore(
          standardCandidate,
          selected,
        );

      chosen =
        standardScore >
        featuredScore
          ? standardCandidate
          : featuredCandidate;
    } else {
      chosen =
        featuredCandidate ??
        standardCandidate;
    }

    if (!chosen) {
      break;
    }

    selected.push(
      chosen,
    );

    removeArticle(
      featured,
      chosen,
    );

    removeArticle(
      standard,
      chosen,
    );
  }

  return selected;
}

export function getDailyFeaturedArticles(
  records:
    readonly ContentRecord[],
  limit = 3,
  now = new Date(),
): ArticleContent[] {
  if (
    !Number.isInteger(
      limit,
    ) ||
    limit < 0
  ) {
    throw new Error(
      'Featured article limit must be a non-negative integer.',
    );
  }

  if (
    limit === 0
  ) {
    return [];
  }

  const articles =
    getDiscoverableByType(
      records,
      'article',
      now,
    );

  if (
    articles.length <=
    limit
  ) {
    return articles;
  }

  const dateKey =
    createDateKey(
      now,
    );

  const featuredArticles =
    articles.filter(
      (
        article,
      ) =>
        article.featured,
    );

  const standardArticles =
    articles.filter(
      (
        article,
      ) =>
        !article.featured,
    );

  const featuredSeed =
    createSeed(
      `home-featured-articles:featured:${dateKey}`,
    );

  const standardSeed =
    createSeed(
      `home-featured-articles:standard:${dateKey}`,
    );

  const shuffledFeatured =
    shuffleArticles(
      featuredArticles,
      featuredSeed,
    );

  const shuffledStandard =
    shuffleArticles(
      standardArticles,
      standardSeed,
    );

  return chooseDailyArticles(
    shuffledFeatured,
    shuffledStandard,
    limit,
  );
}