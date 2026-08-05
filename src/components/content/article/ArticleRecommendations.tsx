import React from 'react';

import {
  ArrowRight,
  Clock3,
} from 'lucide-react';

import { Link } from 'wouter';

import type {
  ArticleContent,
  Author,
} from '@/content/engine/types';

type ArticleRecommendationsProps = {
  currentArticle: ArticleContent;
  recommendations:
    readonly ArticleContent[];
  preview?: boolean;
};

function formatPublicationDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'en',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    },
  ).format(new Date(value));
}

function formatCardAuthors(
  authors: readonly Author[],
): string {
  if (authors.length === 0) {
    return 'The Kalabash Mosaics';
  }

  if (authors.length === 1) {
    return authors[0].name;
  }

  return 'Multiple Authors';
}

function getSeriesPartLabel(
  currentArticle: ArticleContent,
  recommendation: ArticleContent,
): string | undefined {
  const isSameSeries =
    currentArticle.seriesId !==
      undefined &&
    recommendation.seriesId ===
      currentArticle.seriesId &&
    recommendation.seriesPart !==
      undefined;

  if (!isSameSeries) {
    return undefined;
  }

  return `Part ${recommendation.seriesPart}`;
}

export function ArticleRecommendations({
  currentArticle,
  recommendations,
  preview = false,
}: ArticleRecommendationsProps) {
  if (recommendations.length !== 3) {
    return null;
  }

  return (
    <section
      id="recommended-reading"
      aria-labelledby="recommended-reading-heading"
      className="mt-16 border-t border-border pt-8"
    >
      <div
        className={[
          'flex flex-col gap-3',
          'sm:flex-row sm:items-center',
          'sm:justify-between sm:gap-6',
        ].join(' ')}
      >
        <h2
          id="recommended-reading-heading"
          className={[
            'article-display-font',
            'text-2xl font-semibold',
            'tracking-normal',
            'text-foreground',
          ].join(' ')}
        >
          Recommended Reading
        </h2>

        <Link
          href="/articles"
          className={[
            'group/view-all inline-flex',
            'w-fit items-center gap-1.5',
            'text-sm font-medium',
            'text-accent',
            'transition-colors duration-150',
            'hover:underline',
            'underline-offset-4',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',
          ].join(' ')}
        >
          View all Articles

          <ArrowRight
            className={[
              'h-4 w-4 shrink-0',
              'transition-transform',
              'duration-150',
              'group-hover/view-all:translate-x-0.5',
            ].join(' ')}
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map(
          (recommendation) => {
            const image =
              recommendation.thumbnail ??
              recommendation.banner;

            const href = preview
              ? `/preview/articles/${recommendation.slug}`
              : `/articles/${recommendation.slug}`;

            const seriesPartLabel =
              getSeriesPartLabel(
                currentArticle,
                recommendation,
              );

            const authorLabel =
              formatCardAuthors(
                recommendation.authors,
              );

            const publicationDate =
              formatPublicationDate(
                recommendation.publishedAt,
              );

            return (
              <Link
                key={recommendation.id}
                href={href}
                onClick={() => {
                  window.history.scrollRestoration =
                    'manual';

                  sessionStorage.setItem(
                    'article-return-location',
                    JSON.stringify({
                      articleSlug:
                        currentArticle.slug,
                      anchor:
                        'recommended-reading',
                    }),
                  );

                  sessionStorage.setItem(
                    'article-open-at-top',
                    recommendation.slug,
                  );

                  window.scrollTo(0, 0);
                }}
                className={[
                  'group block',
                  'overflow-hidden',
                  'border border-border',
                  'bg-card',
                  'transition-[transform,box-shadow,border-color]',
                  'duration-200 ease-out',
                  'hover:-translate-y-0.5',
                  'hover:border-accent/40',
                  'hover:shadow-md',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                ].join(' ')}
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {image ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className={[
                        'h-full w-full',
                        'object-cover',
                        'transition-transform',
                        'duration-200 ease-out',
                        'group-hover:scale-[1.025]',
                      ].join(' ')}
                    />
                  ) : (
                    <div
                      className={[
                        'flex h-full',
                        'items-center',
                        'justify-center',
                        'px-6 text-center',
                        'text-[0.72rem]',
                        'font-semibold uppercase',
                        'tracking-[0.12em]',
                        'text-muted-foreground',
                      ].join(' ')}
                    >
                      The Kalabash Mosaics
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {seriesPartLabel && (
                    <p
                      className={[
                        'mb-1',
                        'text-[0.72rem]',
                        'font-semibold',
                        'uppercase',
                        'leading-none',
                        'tracking-[0.12em]',
                        'text-accent',
                      ].join(' ')}
                    >
                      {seriesPartLabel}
                    </p>
                  )}

                  <div
                    className={[
                      seriesPartLabel
                        ? 'mt-0'
                        : '',
                      'flex flex-wrap',
                      'items-center',
                      'gap-x-2 gap-y-1',
                      'text-[0.72rem]',
                      'leading-5',
                      'text-muted-foreground',
                    ].join(' ')}
                  >
                    <span>{authorLabel}</span>

                    <span
                      aria-hidden="true"
                      className="text-border"
                    >
                      ·
                    </span>

                    <time
                      dateTime={
                        recommendation.publishedAt
                      }
                    >
                      {publicationDate}
                    </time>

                    <span
                      aria-hidden="true"
                      className="text-border"
                    >
                      |
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />

                      {
                        recommendation.readingMinutes
                      }{' '}
                      min read
                    </span>
                  </div>

                  <h3
                    className={[
                      'mt-3',
                      'text-lg font-semibold',
                      'leading-snug',
                      'tracking-normal',
                      'text-foreground',
                      'transition-colors',
                      'duration-200',
                      'group-hover:text-accent',
                    ].join(' ')}
                  >
                    {recommendation.title}
                  </h3>
                </div>
              </Link>
            );
          },
        )}
      </div>
    </section>
  );
}