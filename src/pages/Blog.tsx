import React, {
  useMemo,
} from 'react';

import {
  Clock3,
  Tag,
} from 'lucide-react';

import {
  motion,
} from 'framer-motion';

import {
  Link,
} from 'wouter';

import {
  LoadMore,
} from '@/components/navigation/LoadMore';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import {
  useProgressiveReveal,
} from '@/hooks/useProgressiveReveal';

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
  ).format(
    new Date(value),
  );
}

export default function Blog() {
  const posts = useMemo(
    () =>
      getDiscoverableByType(
        contentRegistry,
        'blog',
      )
        .slice()
        .sort(
          (left, right) =>
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
    visibleItems:
      visiblePosts,
    visibleCount,
    totalCount,
    remainingCount,
    canLoadMore,
    loadMore,
  } = useProgressiveReveal(
    posts,
    {
      initialCount: 6,
      increment: 6,
    },
  );

  return (
    <main className="w-full py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Blog
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Reflections, project notes,
            field observations, updates,
            and shorter pieces from the
            work behind the maps, data,
            and ideas.
          </p>
        </motion.header>

        {visiblePosts.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {visiblePosts.map(
                (
                  post,
                  index,
                ) => (
                  <motion.article
                    key={post.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    className={[
                      'group',
                      'border',
                      'border-border',
                      'bg-card',
                      'p-6',
                      'transition-[transform,box-shadow,border-color]',
                      'duration-200',
                      'hover:-translate-y-0.5',
                      'hover:border-accent/40',
                      'hover:shadow-md',
                    ].join(' ')}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <time
                        dateTime={
                          post.publishedAt
                        }
                      >
                        {formatPublicationDate(
                          post.publishedAt,
                        )}
                      </time>

                      <span
                        aria-hidden="true"
                      >
                        |
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />

                        {
                          post.readingMinutes
                        }{' '}
                        min read
                      </span>
                    </div>

                    <div className="mb-3 inline-flex items-center gap-1.5 bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                      <Tag
                        className="h-3 w-3"
                        aria-hidden="true"
                      />

                      {post.category}
                    </div>

                    <h2 className="mb-3 text-2xl font-semibold leading-tight">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {post.description}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Read Post →
                    </Link>
                  </motion.article>
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
          </>
        ) : (
          <section className="mx-auto max-w-2xl border-t border-border py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No blog posts published yet.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reflections, project notes,
              field observations, and
              shorter pieces will appear
              here as they are published.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}