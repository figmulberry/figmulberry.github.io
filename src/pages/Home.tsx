import React from 'react';

import {
  Link,
} from 'wouter';

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Clock3,
  MapPinned,
  Tag,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  portfolioProjects,
} from '@/data/content';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDailyFeaturedArticles,
} from '@/lib/content/getDailyFeaturedArticles';

import {
  getHomepageFeaturedProjects,
} from '@/lib/content/getHomepageFeaturedProjects';

import BuiltWith from
  '@/built-with/BuiltWith';

import CoreCapabilities from
  '@/core-capabilities/CoreCapabilities';

import GeoHero from
  '@/home-hero/GeoHero';

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
    new Date(
      value,
    ),
  );
}

function formatArticleAuthors(
  names: readonly string[],
): string {
  if (
    names.length === 0
  ) {
    return 'The Kalabash Mosaics';
  }

  if (
    names.length === 1
  ) {
    return names[0];
  }

  return 'Multiple Authors';
}

function getProjectVisual(
  category: string,
) {
  if (
    category.includes(
      'GeoAI',
    )
  ) {
    return BrainCircuit;
  }

  if (
    category.includes(
      'Data Analytics',
    )
  ) {
    return BarChart3;
  }

  return MapPinned;
}

function hasRealProjectThumbnail(
  thumbnail:
    | string
    | undefined,
): boolean {
  return Boolean(
    thumbnail &&
      !thumbnail.endsWith(
        '/placeholder.webp',
      ),
  );
}

export default function Home() {
  const featuredProjects =
    getHomepageFeaturedProjects(
      portfolioProjects,
      3,
    );

  const featuredArticles =
    getDailyFeaturedArticles(
      contentRegistry,
      3,
    );

  return (
    <div className="w-full">
      {/* Hero */}

      <GeoHero />

      {/* Built With */}

      <BuiltWith />

      {/* Core Capabilities */}

      <CoreCapabilities />

      {/* Featured Projects */}

      <section
        className={[
          'w-full',
          'py-14',
          'sm:py-16',
          'lg:py-20',
        ].join(' ')}
      >
        <div
          className={[
            'container',
            'mx-auto',
            'max-w-7xl',
            'px-4',
            'sm:px-6',
            'lg:px-8',
          ].join(' ')}
        >
          <div
            className={[
              'mb-8',
              'flex',
              'flex-col',
              'gap-5',
              'sm:mb-10',
              'sm:flex-row',
              'sm:items-end',
              'sm:justify-between',
            ].join(' ')}
          >
            <div
              className={[
                'max-w-2xl',
              ].join(' ')}
            >
              <h2
                className={[
                  'text-3xl',
                  'font-bold',
                  'tracking-tight',
                  'sm:text-4xl',
                ].join(' ')}
              >
                Featured Projects
              </h2>

              <p
                className={[
                  'mt-3',
                  'max-w-xl',
                  'text-sm',
                  'leading-6',
                  'text-muted-foreground',
                  'sm:text-base',
                ].join(' ')}
              >
                A selection of projects that turn
                complex problems into practical
                solutions.
              </p>
            </div>

            <Button
              asChild
              variant="ghost"
              className={[
                'w-fit',
                'shrink-0',
              ].join(' ')}
            >
              <Link href="/portfolio">
                View All Projects

                <ArrowRight
                  className={[
                    'ml-2',
                    'h-4',
                    'w-4',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <div
            className={[
              'grid',
              'grid-cols-1',
              'items-stretch',
              'gap-5',
              'md:grid-cols-2',
              'md:gap-6',
              'lg:grid-cols-3',
            ].join(' ')}
          >
            {featuredProjects.map(
              (
                project,
              ) => {
                const ProjectVisual =
                  getProjectVisual(
                    project.category,
                  );

                const useRealThumbnail =
                  hasRealProjectThumbnail(
                    project.thumbnail,
                  );

                return (
                  <Link
                    key={
                      project.id
                    }
                    href={`/portfolio/${project.slug}`}
                    aria-label={
                      `Read more about ${project.title}`
                    }
                    className={[
                      'group',
                      'flex',
                      'h-full',
                      'min-w-0',
                      'flex-col',
                      'overflow-hidden',
                      'border',
                      'border-border',
                      'bg-card',
                      'transition-[transform,border-color,box-shadow]',
                      'duration-200',
                      'ease-out',
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
                    <div
                      className={[
                        'relative',
                        'aspect-[16/9]',
                        'overflow-hidden',
                        'border-b',
                        'border-border/70',
                        'bg-muted/40',
                      ].join(' ')}
                    >
                      {useRealThumbnail ? (
                        <img
                          src={
                            project.thumbnail
                          }
                          alt={
                            `${project.title} project thumbnail`
                          }
                          width={800}
                          height={450}
                          loading="lazy"
                          className={[
                            'h-full',
                            'w-full',
                            'object-cover',
                            'transition-transform',
                            'duration-300',
                            'ease-out',
                            'group-hover:scale-[1.025]',
                          ].join(' ')}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className={[
                            'relative',
                            'flex',
                            'h-full',
                            'w-full',
                            'items-center',
                            'justify-center',
                            'overflow-hidden',
                            'bg-gradient-to-br',
                            'from-background',
                            'via-muted/45',
                            'to-accent/[0.08]',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              'absolute',
                              '-right-12',
                              '-top-12',
                              'h-40',
                              'w-40',
                              'rounded-full',
                              'bg-accent/[0.07]',
                              'blur-3xl',
                            ].join(' ')}
                          />

                          <div
                            className={[
                              'absolute',
                              '-bottom-16',
                              '-left-10',
                              'h-44',
                              'w-44',
                              'rounded-full',
                              'bg-accent/[0.05]',
                              'blur-3xl',
                            ].join(' ')}
                          />

                          <div
                            className={[
                              'relative',
                              'flex',
                              'flex-col',
                              'items-center',
                              'gap-4',
                              'px-8',
                              'text-center',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                'grid',
                                'h-14',
                                'w-14',
                                'place-items-center',
                                'border',
                                'border-accent/25',
                                'bg-background/65',
                                'text-accent',
                                'shadow-sm',
                                'backdrop-blur-sm',
                              ].join(' ')}
                            >
                              <ProjectVisual
                                className="h-6 w-6"
                              />
                            </div>

                            <span
                              className={[
                                'max-w-[15rem]',
                                'text-[0.68rem]',
                                'font-semibold',
                                'uppercase',
                                'leading-5',
                                'tracking-[0.16em]',
                                'text-muted-foreground',
                              ].join(' ')}
                            >
                              {
                                project.category
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={[
                        'flex',
                        'min-h-0',
                        'flex-1',
                        'flex-col',
                        'p-5',
                        'sm:p-6',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'inline-flex',
                          'w-fit',
                          'items-center',
                          'text-[0.68rem]',
                          'font-semibold',
                          'uppercase',
                          'leading-5',
                          'tracking-[0.12em]',
                          'text-accent',
                        ].join(' ')}
                      >
                        {
                          project.category
                        }
                      </div>

                      <h3
                        className={[
                          'mt-4',
                          'text-xl',
                          'font-semibold',
                          'leading-snug',
                          'tracking-tight',
                          'transition-colors',
                          'duration-200',
                          'group-hover:text-accent',
                        ].join(' ')}
                      >
                        {
                          project.title
                        }
                      </h3>

                      <p
                        className={[
                          'mt-3',
                          'text-sm',
                          'leading-6',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        {
                          project.description
                        }
                      </p>

                      <div
                        className={[
                          'mt-5',
                          'flex',
                          'flex-wrap',
                          'gap-x-3',
                          'gap-y-2',
                        ].join(' ')}
                      >
                        {
                          project.tools.map(
                            (
                              tool,
                            ) => (
                              <span
                                key={
                                  tool
                                }
                                className={[
                                  'text-[0.72rem]',
                                  'font-medium',
                                  'text-muted-foreground',
                                ].join(' ')}
                              >
                                {tool}
                              </span>
                            ),
                          )
                        }
                      </div>

                      <div
                        className={[
                          'mt-auto',
                          'pt-6',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'inline-flex',
                            'items-center',
                            'gap-1.5',
                            'text-sm',
                            'font-medium',
                            'text-accent',
                          ].join(' ')}
                        >
                          Read more

                          <ArrowRight
                            className={[
                              'h-4',
                              'w-4',
                              'transition-transform',
                              'duration-200',
                              'group-hover:translate-x-1',
                            ].join(' ')}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles */}

      <section
        className={[
          'w-full',
          'bg-muted/30',
          'py-14',
          'sm:py-16',
          'lg:py-20',
        ].join(' ')}
      >
        <div
          className={[
            'container',
            'mx-auto',
            'max-w-7xl',
            'px-4',
            'sm:px-6',
            'lg:px-8',
          ].join(' ')}
        >
          <div
            className={[
              'mb-8',
              'flex',
              'flex-col',
              'gap-5',
              'sm:mb-10',
              'sm:flex-row',
              'sm:items-end',
              'sm:justify-between',
            ].join(' ')}
          >
            <div className="max-w-2xl">
              <h2
                className={[
                  'text-3xl',
                  'font-bold',
                  'tracking-tight',
                  'sm:text-4xl',
                ].join(' ')}
              >
                Featured Articles
              </h2>

              <p
                className={[
                  'mt-3',
                  'max-w-xl',
                  'text-sm',
                  'leading-6',
                  'text-muted-foreground',
                  'sm:text-base',
                ].join(' ')}
              >
                Practical insights on geospatial
                analysis, GeoAI, cartography,
                data, and the methods behind
                reproducible technical work.
              </p>

            </div>

            <Button
              asChild
              variant="ghost"
              className={[
                'w-fit',
                'shrink-0',
              ].join(' ')}
            >
              <Link href="/articles">
                View All Articles

                <ArrowRight
                  className={[
                    'ml-2',
                    'h-4',
                    'w-4',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <div
            className={[
              'grid',
              'grid-cols-1',
              'items-stretch',
              'gap-5',
              'md:grid-cols-2',
              'md:gap-6',
              'lg:grid-cols-3',
            ].join(' ')}
          >
            {
              featuredArticles.map(
                (
                  article,
                ) => {
                  const image =
                    article.thumbnail ??
                    article.banner;

                  const authorLabel =
                    formatArticleAuthors(
                      article.authors.map(
                        (
                          author,
                        ) =>
                          author.name,
                      ),
                    );

                  return (
                    <Link
                      key={
                        article.id
                      }
                      href={`/articles/${article.slug}`}
                      aria-label={
                        `Read ${article.title}`
                      }
                      className={[
                        'group',
                        'flex',
                        'h-full',
                        'min-w-0',
                        'flex-col',
                        'overflow-hidden',
                        'border',
                        'border-border',
                        'bg-card',
                        'transition-[transform,border-color,box-shadow]',
                        'duration-200',
                        'ease-out',
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
                      <div
                        className={[
                          'relative',
                          'aspect-[16/9]',
                          'overflow-hidden',
                          'border-b',
                          'border-border/70',
                          'bg-muted',
                        ].join(' ')}
                      >
                        {
                          image ? (
                            <img
                              src={
                                image.src
                              }
                              alt={
                                image.alt
                              }
                              loading="lazy"
                              className={[
                                'h-full',
                                'w-full',
                                'object-cover',
                                'transition-transform',
                                'duration-300',
                                'ease-out',
                                'group-hover:scale-[1.025]',
                              ].join(' ')}
                            />
                          ) : (
                            <div
                              className={[
                                'flex',
                                'h-full',
                                'items-center',
                                'justify-center',
                                'bg-gradient-to-br',
                                'from-background',
                                'via-muted/60',
                                'to-accent/[0.06]',
                                'px-8',
                                'text-center',
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  'text-[0.68rem]',
                                  'font-semibold',
                                  'uppercase',
                                  'tracking-[0.16em]',
                                  'text-muted-foreground',
                                ].join(' ')}
                              >
                                The Kalabash Mosaics
                              </span>
                            </div>
                          )
                        }
                      </div>

                      <div
                        className={[
                          'flex',
                          'min-h-0',
                          'flex-1',
                          'flex-col',
                          'p-5',
                          'sm:p-6',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            'flex',
                            'flex-wrap',
                            'items-center',
                            'gap-x-2',
                            'gap-y-1',
                            'text-[0.72rem]',
                            'leading-5',
                            'text-muted-foreground',
                          ].join(' ')}
                        >
                          <span>
                            {
                              authorLabel
                            }
                          </span>

                          <span aria-hidden="true">
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

                          <span aria-hidden="true">
                            ·
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
                            'mt-4',
                            'flex',
                            'flex-wrap',
                            'items-center',
                            'gap-2',
                          ].join(' ')}
                        >
                          {
                            article.seriesPart !==
                              undefined && (
                              <span
                                className={[
                                  'inline-flex',
                                  'items-center',
                                  'text-[0.68rem]',
                                  'font-semibold',
                                  'uppercase',
                                  'tracking-[0.12em]',
                                  'text-accent',
                                ].join(' ')}
                              >
                                Part{' '}
                                {
                                  article.seriesPart
                                }
                              </span>
                            )
                          }

                          <span
                            className={[
                              'inline-flex',
                              'items-center',
                              'gap-1.5',
                              'text-[0.72rem]',
                              'font-medium',
                              'text-accent',
                            ].join(' ')}
                          >
                            <Tag
                              className="h-3 w-3"
                              aria-hidden="true"
                            />

                            {
                              article.category
                            }
                          </span>
                        </div>

                        <h3
                          className={[
                            'article-display-font',
                            'mt-4',
                            'text-xl',
                            'font-semibold',
                            'leading-snug',
                            'tracking-tight',
                            'transition-colors',
                            'duration-200',
                            'group-hover:text-accent',
                          ].join(' ')}
                        >
                          {
                            article.title
                          }
                        </h3>

                        <p
                          className={[
                            'mt-3',
                            'text-sm',
                            'leading-6',
                            'text-muted-foreground',
                          ].join(' ')}
                        >
                          {
                            article.description
                          }
                        </p>

                        <div
                          className={[
                            'mt-auto',
                            'pt-6',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'inline-flex',
                              'items-center',
                              'gap-1.5',
                              'text-sm',
                              'font-medium',
                              'text-accent',
                            ].join(' ')}
                          >
                            Read article

                            <ArrowRight
                              className={[
                                'h-4',
                                'w-4',
                                'transition-transform',
                                'duration-200',
                                'group-hover:translate-x-1',
                              ].join(' ')}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )
            }
          </div>
        </div>
      </section>
      {/* The Kalabash Mosaics */}

      <section
        className={[
          'w-full',
          'py-14',
          'sm:py-16',
          'lg:py-20',
        ].join(' ')}
      >
        <div
          className={[
            'container',
            'mx-auto',
            'max-w-7xl',
            'px-4',
            'sm:px-6',
            'lg:px-8',
          ].join(' ')}
        >
          <div
            className={[
              'grid',
              'overflow-hidden',
              'border',
              'border-border',
              'bg-card',
              'lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]',
            ].join(' ')}
          >
            <div
              className={[
                'flex',
                'flex-col',
                'justify-center',
                'p-7',
                'sm:p-9',
                'lg:p-12',
              ].join(' ')}
            >
              <h2
                className={[
                  'text-3xl',
                  'font-bold',
                  'tracking-tight',
                  'sm:text-4xl',
                ].join(' ')}
              >
                The Kalabash Mosaics
              </h2>

              <p
                className={[
                  'mt-4',
                  'max-w-2xl',
                  'text-base',
                  'leading-7',
                  'text-muted-foreground',
                  'sm:text-lg',
                ].join(' ')}
              >
                The Kalabash Mosaics is my
                media and learning initiative
                for sharing practical
                geospatial knowledge through
                tutorials, demonstrations,
                and open-learning resources.
              </p>

              <div
                className={[
                  'mt-8',
                  'flex',
                  'flex-col',
                  'items-start',
                  'gap-3',
                  'sm:flex-row',
                  'sm:items-center',
                ].join(' ')}
              >
                <Button
                  asChild
                  size="lg"
                >
                  <Link href="/media">
                    Explore Media

                    <ArrowRight
                      className={[
                        'ml-2',
                        'h-4',
                        'w-4',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                >
                  <Link href="/about">
                    About the Initiative
                  </Link>
                </Button>
              </div>
            </div>

            <div
              className={[
                'relative',
                'border-t',
                'border-border',
                'bg-muted/30',
                'p-7',
                'sm:p-9',
                'lg:border-l',
                'lg:border-t-0',
                'lg:p-12',
              ].join(' ')}
            >
              <div
                aria-hidden="true"
                className={[
                  'absolute',
                  '-right-16',
                  '-top-16',
                  'h-48',
                  'w-48',
                  'rounded-full',
                  'bg-accent/[0.07]',
                  'blur-3xl',
                ].join(' ')}
              />

              <div
                className={[
                  'relative',
                  'grid',
                  'gap-6',
                ].join(' ')}
              >
                <div>
                  <p
                    className={[
                      'text-[0.68rem]',
                      'font-semibold',
                      'uppercase',
                      'tracking-[0.18em]',
                      'text-accent',
                    ].join(' ')}
                  >
                    Tutorials
                  </p>

                  <p
                    className={[
                      'mt-2',
                      'text-sm',
                      'leading-6',
                      'text-muted-foreground',
                    ].join(' ')}
                  >
                    Practical walkthroughs
                    across GIS, GeoAI, spatial
                    data, and technical
                    workflows.
                  </p>
                </div>

                <div
                  className={[
                    'h-px',
                    'w-full',
                    'bg-border',
                  ].join(' ')}
                  aria-hidden="true"
                />

                <div>
                  <p
                    className={[
                      'text-[0.68rem]',
                      'font-semibold',
                      'uppercase',
                      'tracking-[0.18em]',
                      'text-accent',
                    ].join(' ')}
                  >
                    Demonstrations
                  </p>

                  <p
                    className={[
                      'mt-2',
                      'text-sm',
                      'leading-6',
                      'text-muted-foreground',
                    ].join(' ')}
                  >
                    Applied demonstrations
                    that connect methods,
                    tools, and real technical
                    problem-solving.
                  </p>
                </div>

                <div
                  className={[
                    'h-px',
                    'w-full',
                    'bg-border',
                  ].join(' ')}
                  aria-hidden="true"
                />

                <div>
                  <p
                    className={[
                      'text-[0.68rem]',
                      'font-semibold',
                      'uppercase',
                      'tracking-[0.18em]',
                      'text-accent',
                    ].join(' ')}
                  >
                    Open Learning
                  </p>

                  <p
                    className={[
                      'mt-2',
                      'text-sm',
                      'leading-6',
                      'text-muted-foreground',
                    ].join(' ')}
                  >
                    Accessible resources that
                    make advanced geospatial
                    practice easier to learn,
                    reproduce, and apply.
                  </p>
                </div>

                <div
                  className={[
                    'pt-2',
                    'text-[0.72rem]',
                    'font-semibold',
                    'uppercase',
                    'tracking-[0.16em]',
                    'text-muted-foreground',
                  ].join(' ')}
                >
                  GIS · GeoAI · Data · Workflows
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}