import React, {
  useMemo,
  useState,
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
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDiscoverableByType,
} from '@/content/engine/queries';

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

export default function Articles() {
  const articles = useMemo(
    () =>
      getDiscoverableByType(
        contentRegistry,
        'article',
      ),
    [],
  );

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          articles.map(
            (article) =>
              article.category,
          ),
        ),
      ),
    ],
    [articles],
  );

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All');

  const filteredArticles = useMemo(
    () =>
      selectedCategory === 'All'
        ? articles
        : articles.filter(
            (article) =>
              article.category ===
              selectedCategory,
          ),
    [
      articles,
      selectedCategory,
    ],
  );

  return (
    <main className="w-full py-16">
      <div
        className={[
          'container mx-auto',
          'max-w-7xl',
          'px-4 sm:px-6 lg:px-8',
        ].join(' ')}
      >
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
          <h1
            className={[
              'article-display-font',
              'mb-4',
              'text-4xl font-bold',
              'sm:text-5xl',
            ].join(' ')}
          >
            Articles
          </h1>

          <p
            className={[
              'mx-auto max-w-2xl',
              'text-lg',
              'text-muted-foreground',
            ].join(' ')}
          >
            Technical guides, tutorials, and
            deep dives on geospatial analysis,
            GeoAI, cartography, and data
            workflows.
          </p>
        </motion.header>

        {categories.length > 1 && (
          <div
            className={[
              'mb-12 flex flex-wrap',
              'justify-center gap-2',
            ].join(' ')}
            aria-label="Filter articles by category"
          >
            {categories.map(
              (category) => {
                const isSelected =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(
                        category,
                      );
                    }}
                    aria-pressed={
                      isSelected
                    }
                    className={[
                      'px-4 py-2',
                      'text-sm font-medium',
                      'transition-colors',
                      'focus-visible:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-ring',
                      'focus-visible:ring-offset-2',
                      isSelected
                        ? [
                            'bg-accent',
                            'text-accent-foreground',
                          ].join(' ')
                        : [
                            'bg-muted',
                            'text-foreground',
                            'hover:bg-muted/80',
                          ].join(' '),
                    ].join(' ')}
                  >
                    {category}
                  </button>
                );
              },
            )}
          </div>
        )}

        <div
          className={[
            'grid gap-6',
            'md:grid-cols-2',
          ].join(' ')}
        >
          {filteredArticles.map(
            (article, index) => {
              const image =
                article.thumbnail ??
                article.banner;

              const authorLabel =
                article.authors.length === 1
                  ? article.authors[0].name
                  : article.authors.length > 1
                    ? 'Multiple Authors'
                    : 'The Kalabash Mosaics';

              return (
                <motion.article
                  key={article.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className={[
                    'group overflow-hidden',
                    'border border-border',
                    'bg-card',
                    'transition-[transform,box-shadow,border-color]',
                    'duration-200 ease-out',
                    'hover:-translate-y-0.5',
                    'hover:border-accent/40',
                    'hover:shadow-md',
                  ].join(' ')}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className={[
                      'block',
                      'focus-visible:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-ring',
                      'focus-visible:ring-inset',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'aspect-[16/9]',
                        'overflow-hidden',
                        'bg-muted',
                      ].join(' ')}
                    >
                      {image ? (
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={
                            index < 2
                              ? 'eager'
                              : 'lazy'
                          }
                          className={[
                            'h-full w-full',
                            'object-cover',
                            'transition-transform',
                            'duration-200 ease-out',
                            'group-hover:scale-[1.02]',
                          ].join(' ')}
                        />
                      ) : (
                        <div
                          className={[
                            'flex h-full',
                            'items-center',
                            'justify-center',
                            'px-6 text-center',
                            'text-xs font-semibold',
                            'uppercase',
                            'tracking-[0.12em]',
                            'text-muted-foreground',
                          ].join(' ')}
                        >
                          The Kalabash Mosaics
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {article.seriesPart !==
                        undefined && (
                        <p
                          className={[
                            'mb-2',
                            'text-xs font-semibold',
                            'uppercase',
                            'tracking-[0.12em]',
                            'text-accent',
                          ].join(' ')}
                        >
                          Part{' '}
                          {
                            article.seriesPart
                          }
                        </p>
                      )}

                      <div
                        className={[
                          'mb-3 flex',
                          'flex-wrap',
                          'items-center',
                          'gap-x-2 gap-y-1',
                          'text-xs',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        <span>
                          {authorLabel}
                        </span>

                        <span
                          aria-hidden="true"
                        >
                          ·
                        </span>

                        <time
                          dateTime={
                            article.publishedAt
                          }
                        >
                          {
                            formatPublicationDate(
                              article.publishedAt,
                            )
                          }
                        </time>

                        <span
                          aria-hidden="true"
                        >
                          |
                        </span>

                        <span
                          className={[
                            'inline-flex',
                            'items-center',
                            'gap-1.5',
                          ].join(' ')}
                        >
                          <Clock3
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />

                          {
                            article.readingMinutes
                          }{' '}
                          min read
                        </span>
                      </div>

                      <div
                        className={[
                          'mb-3 inline-flex',
                          'items-center gap-1.5',
                          'bg-accent/10',
                          'px-2 py-1',
                          'text-xs font-medium',
                          'text-accent',
                        ].join(' ')}
                      >
                        <Tag
                          className="h-3 w-3"
                          aria-hidden="true"
                        />

                        {article.category}
                      </div>

                      <h2
                        className={[
                          'article-display-font',
                          'mb-3',
                          'text-2xl font-semibold',
                          'leading-tight',
                          'transition-colors',
                          'group-hover:text-accent',
                        ].join(' ')}
                      >
                        {article.title}
                      </h2>

                      <p
                        className={[
                          'text-sm leading-6',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        {article.description}
                      </p>

                      <p
                        className={[
                          'mt-5',
                          'text-sm font-medium',
                          'text-accent',
                          'underline-offset-4',
                          'group-hover:underline',
                        ].join(' ')}
                      >
                        Read Article →
                      </p>
                    </div>
                  </Link>
                </motion.article>
              );
            },
          )}
        </div>

        {filteredArticles.length ===
          0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No published articles are
              available in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
