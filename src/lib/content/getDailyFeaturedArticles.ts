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
    hash ^= value.charCodeAt(index);

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
  let seed = initialSeed;

  return () => {
    seed += 0x6d2b79f5;

    let value = seed;

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^=
      value +
      Math.imul(
        value ^ (value >>> 7),
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
  articles: readonly ArticleContent[],
  seed: number,
): ArticleContent[] {
  const shuffled = [
    ...articles,
  ];

  const random =
    createRandom(seed);

  for (
    let index =
      shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const targetIndex =
      Math.floor(
        random() * (index + 1),
      );

    [
      shuffled[index],
      shuffled[targetIndex],
    ] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getSeriesKey(
  article: ArticleContent,
): string {
  return (
    article.seriesId ??
    article.id
  );
}

function chooseDiverseArticles(
  shuffled:
    readonly ArticleContent[],
  limit: number,
): ArticleContent[] {
  const selected:
    ArticleContent[] = [];

  const remaining = [
    ...shuffled,
  ];

  while (
    selected.length < limit &&
    remaining.length > 0
  ) {
    const selectedCategories =
      new Set(
        selected.map(
          (article) =>
            article.category,
        ),
      );

    const selectedSeries =
      new Set(
        selected.map(
          (article) =>
            getSeriesKey(article),
        ),
      );

    let chosenIndex =
      remaining.findIndex(
        (article) =>
          !selectedCategories.has(
            article.category,
          ) &&
          !selectedSeries.has(
            getSeriesKey(article),
          ),
      );

    if (chosenIndex < 0) {
      chosenIndex =
        remaining.findIndex(
          (article) =>
            !selectedCategories.has(
              article.category,
            ),
        );
    }

    if (chosenIndex < 0) {
      chosenIndex =
        remaining.findIndex(
          (article) =>
            !selectedSeries.has(
              getSeriesKey(article),
            ),
        );
    }

    if (chosenIndex < 0) {
      chosenIndex = 0;
    }

    const [
      chosenArticle,
    ] = remaining.splice(
      chosenIndex,
      1,
    );

    selected.push(
      chosenArticle,
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
    !Number.isInteger(limit) ||
    limit < 0
  ) {
    throw new Error(
      'Featured article limit must be a non-negative integer.',
    );
  }

  if (limit === 0) {
    return [];
  }

  const articles =
    getDiscoverableByType(
      records,
      'article',
      now,
    );

  if (articles.length <= limit) {
    return articles;
  }

  const dateKey =
    createDateKey(now);

  const seed =
    createSeed(
      `home-featured-articles:${dateKey}`,
    );

  const shuffled =
    shuffleArticles(
      articles,
      seed,
    );

  return chooseDiverseArticles(
    shuffled,
    limit,
  );
}
