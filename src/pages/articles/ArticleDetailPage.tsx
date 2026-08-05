import React, {
  useLayoutEffect,
} from 'react';

import {
  ArrowLeft,
} from 'lucide-react';

import { Link } from 'wouter';

import {
  ArticleHeader,
} from '@/components/content/article/ArticleHeader';

import {
  ArticleReferences,
} from '@/components/content/article/ArticleReferences';

import {
  ArticleQuickSummary,
} from '@/components/content/article/ArticleQuickSummary';

import {
  ArticleRecommendations,
} from '@/components/content/article/ArticleRecommendations';

import {
  ArticleTableOfContents,
} from '@/components/content/article/ArticleTableOfContents';

import {
  MarkdownRenderer,
} from '@/components/content/markdown/MarkdownRenderer';

import {
  BackToTop,
} from '@/components/navigation/BackToTop';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getArticleBySlug,
} from '@/content/engine/queries';

import {
  getReferencesByIds,
} from '@/content/references/registry';

import type {
  SeriesContent,
} from '@/content/engine/types';

import {
  extractQuickSummary,
} from '@/lib/content/extractQuickSummary';

import {
  getArticleRecommendations,
} from '@/lib/content/getArticleRecommendations';

type ArticleDetailPageProps = {
  slug: string;
  allowDraft?: boolean;
};

function getSeriesTitle(
  seriesId: string | undefined,
): string | undefined {
  if (!seriesId) {
    return undefined;
  }

  const series = contentRegistry.find(
    (
      item,
    ): item is SeriesContent =>
      item.id === seriesId &&
      item.contentType === 'series',
  );

  return series?.title;
}

export default function ArticleDetailPage({
  slug,
  allowDraft = false,
}: ArticleDetailPageProps) {
  const article = getArticleBySlug(
    contentRegistry,
    slug,
  );

  const articleIsAvailable =
    article !== undefined &&
    (
      article.status === 'published' ||
      article.status === 'archived' ||
      allowDraft
    );

  if (
    !article ||
    !articleIsAvailable
  ) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
          Article unavailable
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          This publication is not
          available yet.
        </h1>

        <p className="mt-4 text-muted-foreground">
          The article may still be in
          preparation, or the requested
          address may be incorrect.
        </p>

        <Link
          href="/articles"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />

          Return to Articles
        </Link>
      </section>
    );
  }

  const seriesTitle =
    getSeriesTitle(
      article.seriesId,
    );

  const {
    quickSummary,
    remainingBody,
  } = extractQuickSummary(
    article.body,
  );

  const recommendations =
    getArticleRecommendations(
      contentRegistry,
      article,
      {
        includeDrafts:
          allowDraft,
        limit: 3,
      },
    );

  const references =
    getReferencesByIds(
      article.referenceIds,
    );

  useLayoutEffect(() => {
    const destinationSlug =
      sessionStorage.getItem(
        'article-open-at-top',
      );

    if (destinationSlug === article.slug) {
      window.history.scrollRestoration =
        'manual';

      window.scrollTo(0, 0);

      const firstFrame =
        window.requestAnimationFrame(
          () => {
            window.scrollTo(0, 0);

            const secondFrame =
              window.requestAnimationFrame(
                () => {
                  window.scrollTo(0, 0);

                  sessionStorage.removeItem(
                    'article-open-at-top',
                  );
                },
              );

            (
              window as Window & {
                __articleScrollFrame?:
                  number;
              }
            ).__articleScrollFrame =
              secondFrame;
          },
        );

      return () => {
        window.cancelAnimationFrame(
          firstFrame,
        );

        const pendingFrame = (
          window as Window & {
            __articleScrollFrame?: number;
          }
        ).__articleScrollFrame;

        if (pendingFrame !== undefined) {
          window.cancelAnimationFrame(
            pendingFrame,
          );
        }
      };
    }

    const storedReturnLocation =
      sessionStorage.getItem(
        'article-return-location',
      );

    if (!storedReturnLocation) {
      return;
    }

    let returnLocation:
      | {
          articleSlug: string;
          anchor: string;
        }
      | undefined;

    try {
      returnLocation =
        JSON.parse(
          storedReturnLocation,
        ) as {
          articleSlug: string;
          anchor: string;
        };
    } catch {
      sessionStorage.removeItem(
        'article-return-location',
      );

      return;
    }

    if (
      returnLocation.articleSlug !==
      article.slug
    ) {
      return;
    }

    window.history.scrollRestoration =
      'manual';

    const firstFrame =
      window.requestAnimationFrame(
        () => {
          const secondFrame =
            window.requestAnimationFrame(
              () => {
                const target =
                  document.getElementById(
                    returnLocation.anchor,
                  );

                target?.scrollIntoView({
                  block: 'start',
                  behavior: 'auto',
                });

                sessionStorage.removeItem(
                  'article-return-location',
                );
              },
            );

          (
            window as Window & {
              __articleScrollFrame?:
                number;
            }
          ).__articleScrollFrame =
            secondFrame;
        },
      );

    return () => {
      window.cancelAnimationFrame(
        firstFrame,
      );

      const pendingFrame = (
        window as Window & {
          __articleScrollFrame?: number;
        }
      ).__articleScrollFrame;

      if (pendingFrame !== undefined) {
        window.cancelAnimationFrame(
          pendingFrame,
        );
      }
    };
  }, [article.slug]);

  return (
    <article className="w-full py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />

          Back to Articles
        </Link>

        {allowDraft &&
          article.status === 'draft' && (
            <div
              role="status"
              className="mb-8 rounded-sm border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
            >
              Draft preview — this article
              is not publicly published.
            </div>
          )}

        <ArticleHeader
          article={article}
          seriesTitle={seriesTitle}
        />

        <ArticleQuickSummary
          markdown={quickSummary}
          tags={article.tags}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <main className="min-w-0">
            <MarkdownRenderer
              markdown={remainingBody}
              articleSlug={article.slug}
            />

            <ArticleReferences
              references={references}
            />
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ArticleTableOfContents
              items={
                article.tableOfContents
              }
            />
          </aside>
        </div>

        <ArticleRecommendations
          currentArticle={article}
          recommendations={
            recommendations
          }
          preview={allowDraft}
        />
      </div>

      <BackToTop />
    </article>
  );
}