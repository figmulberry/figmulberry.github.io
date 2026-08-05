import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import type {
  ArticleContent,
  ContentRecord,
} from '@/content/engine/types';

type ToolArticleResult = {
  articles: ArticleContent[];
  total: number;
};

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase();
}

export function getRelatedArticlesForTool(
  records: readonly ContentRecord[],
  toolName: string,
  limit = 3,
  now = new Date(),
): ToolArticleResult {
  if (
    !Number.isInteger(limit) ||
    limit < 0
  ) {
    throw new Error(
      'Related article limit must be a non-negative integer.',
    );
  }

  const normalizedToolName =
    normalize(toolName);

  const matches =
    getDiscoverableByType(
      records,
      'article',
      now,
    )
      .filter((article) =>
        article.tags.some(
          (tag) =>
            normalize(tag) ===
            normalizedToolName,
        ),
      )
      .sort(
        (left, right) =>
          new Date(
            right.publishedAt,
          ).getTime() -
          new Date(
            left.publishedAt,
          ).getTime(),
      );

  return {
    articles: matches.slice(
      0,
      limit,
    ),
    total: matches.length,
  };
}
