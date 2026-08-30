import React, {
  useLayoutEffect,
} from 'react';

import {
  ArrowLeft,
} from 'lucide-react';

import {
  Link,
} from 'wouter';

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

type ArticleReturnLocation = {
  articleSlug: string;
  anchor: string;
};

function getSeriesTitle(
  seriesId:
    string |
    undefined,
): string | undefined {
  if (!seriesId) {
    return undefined;
  }

  const series =
    contentRegistry.find(
      (
        item,
      ): item is SeriesContent =>
        item.id ===
          seriesId &&
        item.contentType ===
          'series',
    );

  return series?.title;
}

export default function ArticleDetailPage({
  slug,
  allowDraft = false,
}: ArticleDetailPageProps) {
  const article =
    getArticleBySlug(
      contentRegistry,
      slug,
    );

  const articleIsAvailable =
    article !== undefined &&
    (
      article.status ===
        'published' ||
      article.status ===
        'archived' ||
      allowDraft
    );

  /*
   * Keep Hooks before conditional returns.
   *
   * This effect handles only the intentional
   * article-to-article recommendation return
   * behavior.
   *
   * Ordinary route navigation is handled by
   * the global ScrollToTop component.
   */
  useLayoutEffect(() => {
    if (!article) {
      return;
    }

    const destinationSlug =
      sessionStorage.getItem(
        'article-open-at-top',
      );

    if (
      destinationSlug ===
      article.slug
    ) {
      /*
       * This marker is written only by the
       * recommendation-card workflow.
       *
       * Clear it immediately after arrival.
       * Global ScrollToTop already owns the
       * actual top-of-page reset.
       */
      sessionStorage.removeItem(
        'article-open-at-top',
      );

      return;
    }

    const storedReturnLocation =
      sessionStorage.getItem(
        'article-return-location',
      );

    if (
      !storedReturnLocation
    ) {
      return;
    }

    let returnLocation:
      ArticleReturnLocation |
      undefined;

    try {
      returnLocation =
        JSON.parse(
          storedReturnLocation,
        ) as ArticleReturnLocation;
    } catch {
      sessionStorage.removeItem(
        'article-return-location',
      );

      return;
    }

    /*
     * A saved return location belongs only
     * to the article where it was created.
     *
     * It must never affect unrelated article
     * navigation from Home, Core
     * Capabilities, Articles, etc.
     */
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

                if (target) {
                  target.scrollIntoView({
                    block: 'start',

                    behavior:
                      window.matchMedia(
                        '(prefers-reduced-motion: reduce)',
                      ).matches
                        ? 'auto'
                        : 'smooth',
                  });
                }

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

      const pendingFrame =
        (
          window as Window & {
            __articleScrollFrame?:
              number;
          }
        ).__articleScrollFrame;

      if (
        pendingFrame !==
        undefined
      ) {
        window.cancelAnimationFrame(
          pendingFrame,
        );
      }
    };
  }, [
    article?.slug,
  ]);

  if (
    !article ||
    !articleIsAvailable
  ) {
    return (
      <section
        className={[
          'mx-auto',
          'w-full',
          'max-w-3xl',
          'px-4',
          'py-24',
          'text-center',
          'sm:px-6',
        ].join(' ')}
      >
        <p
          className={[
            'text-sm',
            'font-semibold',
            'uppercase',
            'tracking-[0.14em]',
            'text-accent',
          ].join(' ')}
        >
          Article unavailable
        </p>

        <h1
          className={[
            'mt-4',
            'text-4xl',
            'font-bold',
            'tracking-tight',
          ].join(' ')}
        >
          This publication is not
          available yet.
        </h1>

        <p
          className={[
            'mt-4',
            'text-muted-foreground',
          ].join(' ')}
        >
          The article may still be in
          preparation, or the requested
          address may be incorrect.
        </p>

        <Link
          href="/articles"
          className={[
            'mt-8',
            'inline-flex',
            'items-center',
            'gap-2',
            'text-sm',
            'font-medium',
            'text-accent',
            'hover:underline',
          ].join(' ')}
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
  } =
    extractQuickSummary(
      article.body,
    );

  const recommendations =
    getArticleRecommendations(
      contentRegistry,
      article,
      {
        includeDrafts:
          allowDraft,

        limit:
          3,
      },
    );

  const references =
    getReferencesByIds(
      article.referenceIds,
    );

  return (
    <article
      className={[
        'w-full',
        'py-12',
        'sm:py-16',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto',
          'max-w-7xl',
          'px-4',
          'sm:px-6',
          'lg:px-8',
        ].join(' ')}
      >
        <Link
          href="/articles"
          className={[
            'mb-8',
            'inline-flex',
            'items-center',
            'gap-2',
            'text-sm',
            'font-medium',
            'text-muted-foreground',
            'transition-colors',
            'hover:text-accent',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
          ].join(' ')}
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />

          Back to Articles
        </Link>

        {allowDraft &&
          article.status ===
            'draft' && (
            <div
              role="status"
              className={[
                'mb-8',
                'rounded-sm',
                'border',
                'border-amber-500/40',
                'bg-amber-500/10',
                'px-4',
                'py-3',
                'text-sm',
                'text-amber-700',
                'dark:text-amber-300',
              ].join(' ')}
            >
              Draft preview — this article
              is not publicly published.
            </div>
          )}

        <ArticleHeader
          article={
            article
          }
          seriesTitle={
            seriesTitle
          }
        />

        <ArticleQuickSummary
          markdown={
            quickSummary
          }
          tags={
            article.tags
          }
        />

        <div
          className={[
            'grid',
            'gap-12',
            'lg:grid-cols-[minmax(0,1fr)_18rem]',
          ].join(' ')}
        >
          <main
            className="min-w-0"
          >
            <MarkdownRenderer
              markdown={
                remainingBody
              }
              articleSlug={
                article.slug
              }
            />

            <ArticleReferences
              references={
                references
              }
            />
          </main>

          {/*
           * CONTENTS is deliberately desktop
           * only.
           *
           * On phone/tablet the article uses
           * one natural document scroll
           * surface. The TOC must not appear
           * below a long article or create a
           * second scrollable region.
           */}
          <aside
            className={[
              'hidden',
              'lg:block',
              'lg:sticky',
              'lg:top-24',
              'lg:self-start',
            ].join(' ')}
          >
            <ArticleTableOfContents
              items={
                article.tableOfContents
              }
            />
          </aside>
        </div>

        <ArticleRecommendations
          currentArticle={
            article
          }
          recommendations={
            recommendations
          }
          preview={
            allowDraft
          }
        />
      </div>

      <BackToTop />
    </article>
  );
}