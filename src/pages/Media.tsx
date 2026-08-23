import React, {
  useMemo,
} from 'react';

import {
  Play,
} from 'lucide-react';

import {
  LoadMore,
} from '@/components/navigation/LoadMore';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDiscoverableContent,
} from '@/content/engine/queries';

import {
  useProgressiveReveal,
} from '@/hooks/useProgressiveReveal';

import type {
  MediaContent,
} from '@/content/engine/types';

function isMediaContent(
  record:
    (typeof contentRegistry)[number],
): record is MediaContent {
  return (
    record.contentType ===
    'media'
  );
}

function getMediaLabel(
  media: MediaContent,
): string {
  switch (
    media.mediaType
  ) {
    case 'tutorial':
      return 'Tutorial';

    case 'presentation':
      return 'Presentation';

    case 'poetry':
      return 'Poetry';

    case 'lightning-talk':
      return 'Lightning Talk';

    case 'keynote':
      return 'Keynote';

    case 'interview':
      return 'Interview';

    case 'discussion':
      return 'Discussion';

    case 'demo':
      return 'Demo';

    case 'podcast':
      return 'Podcast';

    case 'gallery':
      return 'Gallery';

    case 'download':
      return 'Download';

    case 'video':
    default:
      return 'Video';
  }
}

function formatPublishedDate(
  date: string,
): string {
  return new Intl.DateTimeFormat(
    'en',
    {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  ).format(
    new Date(
      `${date}T00:00:00Z`,
    ),
  );
}

export default function Media() {
  const mediaItems =
    useMemo(
      () =>
        getDiscoverableContent(
          contentRegistry,
        )
          .filter(
            isMediaContent,
          )
          .sort(
            (
              left,
              right,
            ) =>
              Date.parse(
                right.publishedAt,
              ) -
              Date.parse(
                left.publishedAt,
              ),
          ),
      [],
    );

  const {
    visibleItems,
    visibleCount,
    totalCount,
    remainingCount,
    canLoadMore,
    loadMore,
  } = useProgressiveReveal(
    mediaItems,
    {
      initialCount: 3,
      increment: 3,
    },
  );

  return (
    <div className="w-full">
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14 lg:px-8 lg:py-16">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Media
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Watch. Listen.
            Read aloud.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Presentations,
            poetry, tutorials,
            conversations, and
            other work that finds
            a better home beyond
            the article page.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8 lg:py-14">
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map(
              (item) => (
                <article
                  key={item.id}
                  className={[
                    'group',
                    'flex',
                    'min-w-0',
                    'flex-col',
                    'overflow-hidden',
                    'border',
                    'border-border',
                    'bg-card',
                    'transition-colors',
                    'duration-200',
                    'hover:border-accent/50',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'bg-gradient-to-b',
                      'from-amber-500/[0.08]',
                      'via-amber-500/[0.035]',
                      'to-transparent',
                      'px-3',
                      'pt-3',
                    ].join(' ')}
                  >
                    {item.embedUrl ? (
                      <div className="aspect-video">
                        <iframe
                          src={
                            item.embedUrl
                          }
                          title={
                            item.title
                          }
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-muted">
                        <Play
                          className="h-8 w-8 text-accent"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
                    <div className="flex flex-wrap items-center text-xs text-muted-foreground">
                      <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent">
                        {getMediaLabel(
                          item,
                        )}
                      </span>

                      <span className="ml-3 border-l border-border pl-3">
                        {formatPublishedDate(
                          item.publishedAt,
                        )}
                      </span>

                      {item.platform && (
                        <span className="ml-3 border-l border-border pl-3">
                          {
                            item.platform
                          }
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.cardDescription ??
                        item.description}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>

          {canLoadMore && (
            <LoadMore
              visibleCount={
                visibleCount
              }
              totalCount={
                totalCount
              }
              remainingCount={
                remainingCount
              }
              onLoadMore={
                loadMore
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}