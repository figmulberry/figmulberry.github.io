import React, {
  useMemo,
  useState,
} from 'react';

import {
  ArrowUpRight,
} from 'lucide-react';

import {
  Link,
} from 'wouter';

import {
  getPortfolioFeaturedProjects,
  getPortfolioProjects,
} from '@/lib/content/getPortfolioProjects';

import PortfolioMap from
  '@/portfolio/PortfolioMap';

import {
  getActiveProjectCategories,
} from '@/portfolio/projectCategories';

import type {
  ProjectContent,
} from '@/content/engine/types';


const PROJECTS_PER_BATCH = 6;


function normalizeProjectCategory(
  project: ProjectContent,
): string {
  return project.category.trim();
}


function formatPortfolioDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      month:
        'short',
      year:
        'numeric',
      timeZone:
        'UTC',
    },
  ).format(
    date,
  );
}


function ProjectLandingMetadata({
  project,
}: {
  project: ProjectContent;
}) {
  const readingMinutes =
    project.caseStudy
      ?.readingMinutes;

  const items = [
    normalizeProjectCategory(
      project,
    ),
    formatPortfolioDate(
      project.publishedAt,
    ),
    readingMinutes
      ? `Estimated ${readingMinutes} min read`
      : undefined,
  ].filter(
    (
      item,
    ): item is string =>
      Boolean(
        item,
      ),
  );

  return (
    <p className="font-mono text-[0.625rem] font-normal uppercase tracking-[0.14em] text-muted-foreground/65 sm:text-[0.6875rem]">
      {items.map(
        (
          item,
          index,
        ) => (
          <React.Fragment
            key={`${item}:${index}`}
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="text-muted-foreground/70"
              >
                {' · '}
              </span>
            ) : null}

            <span
              className={
                index === 0
                  ? 'text-accent/75'
                  : ''
              }
            >
              {item}
            </span>
          </React.Fragment>
        ),
      )}
    </p>
  );
}


function getDailyFeaturedProject(
  projects: ProjectContent[],
  now = new Date(),
): ProjectContent | undefined {
  if (
    projects.length ===
      0
  ) {
    return undefined;
  }

  const localDayNumber =
    Math.floor(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ) /
        86_400_000,
    );

  const featuredIndex =
    localDayNumber %
    projects.length;

  return projects[
    featuredIndex
  ];
}


function ProjectThumbnail({
  project,
}: {
  project: ProjectContent;
}) {
  if (
    !project.thumbnail
  ) {
    return (
      <div
        aria-hidden="true"
        className={[
          'flex',
          'aspect-[16/9]',
          'items-center',
          'justify-center',
          'bg-muted/40',
        ].join(' ')}
      >
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Project visual
        </span>
      </div>
    );
  }

  return (
    <img
      src={
        project.thumbnail.src
      }
      alt={
        project.thumbnail.alt
      }
      width={
        project.thumbnail.width ??
        1600
      }
      height={
        project.thumbnail.height ??
        900
      }
      loading="lazy"
      className="aspect-[16/9] w-full object-cover"
    />
  );
}


function FeaturedProject({
  project,
}: {
  project: ProjectContent;
}) {
  return (
    <article
      className={[
        'grid',
        'gap-8',
        'lg:grid-cols-[0.85fr_1.15fr]',
        'lg:items-center',
      ].join(' ')}
    >
      <div>
        <ProjectLandingMetadata
          project={project}
        />

        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {
            project.title
          }
        </h2>

        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          {
            project.description
          }
        </p>


        <Link
          href={`/portfolio/${project.slug}`}
          className={[
            'mt-7',
            'inline-flex',
            'items-center',
            'gap-2',
            'text-sm',
            'font-semibold',
            'text-accent',
          ].join(' ')}
        >
          Explore project

          <ArrowUpRight
            className="h-4 w-4"
            aria-hidden="true"
          />
        </Link>
      </div>

      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`Explore ${project.title}`}
        className="group overflow-hidden"
      >
        <div className="transition-transform duration-300 group-hover:scale-[1.015]">
          <ProjectThumbnail
            project={
              project
            }
          />
        </div>
      </Link>
    </article>
  );
}


function SelectedProject({
  project,
}: {
  project: ProjectContent;
}) {
  return (
    <article>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-300 group-hover:scale-[1.015]">
            <ProjectThumbnail
              project={
                project
              }
            />
          </div>
        </div>

        <div className="pt-5">
          <ProjectLandingMetadata
            project={project}
          />

          <h3 className="mt-3 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
            {
              project.title
            }
          </h3>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {
              project.description
            }
          </p>
        </div>
      </Link>
    </article>
  );
}


export default function Portfolio() {
  const projects =
    getPortfolioProjects();

  const featuredProjects =
    getPortfolioFeaturedProjects();


  const activeCategories =
    useMemo(
      () =>
        getActiveProjectCategories(
          projects.map(
            (
              project,
            ) =>
              project.category,
          ),
        ),
      [
        projects,
      ],
    );


  const categories = [
    'All',
    ...activeCategories,
  ];

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(
      'All',
    );

  const [
    visibleProjectCount,
    setVisibleProjectCount,
  ] =
    useState(
      PROJECTS_PER_BATCH,
    );

  const primaryFeatured =
    getDailyFeaturedProject(
      featuredProjects,
    );

  const filteredProjects =
    useMemo(
      () => {
        if (
          selectedCategory ===
          'All'
        ) {
          return projects;
        }

        return projects.filter(
          (
            project,
          ) =>
            normalizeProjectCategory(
              project,
            ) ===
            selectedCategory,
        );
      },
      [
        projects,
        selectedCategory,
      ],
    );

  const visibleProjects =
    filteredProjects.slice(
      0,
      visibleProjectCount,
    );

  const hasMoreProjects =
    visibleProjectCount <
    filteredProjects.length;

  return (
    <main className="w-full">
      {/* ===================================================
          IMMERSIVE PORTFOLIO HERO

          This area owns its appearance.
          It intentionally does not change between
          light and dark mode.
         =================================================== */}

      <section
        className={[
          'relative',
          'w-full',
          'overflow-hidden',
          'bg-[#111820]',
          'text-white',
        ].join(' ')}
      >
        <div
          className={[
            'container',
            'mx-auto',
            'max-w-7xl',
            'px-4',
            'py-12',
            'sm:px-6',
            'sm:py-14',
            'lg:px-8',
            'lg:py-16',
          ].join(' ')}
        >
          <div
            className={[
              'grid',
              'grid-cols-1',
              'gap-10',
              'lg:grid-cols-[0.84fr_1.16fr]',
              'lg:items-stretch',
              'lg:gap-12',
            ].join(' ')}
          >
            {/* =============================================
                LEFT: PORTFOLIO INTRODUCTION
               ============================================= */}

            <div
              className={[
                'flex',
                'min-h-[30rem]',
                'flex-col',
                'lg:min-h-[34rem]',
              ].join(' ')}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a52]">
                Portfolio
              </p>

              <h1
                className={[
                  'mt-4',
                  'max-w-xl',
                  'text-4xl',
                  'font-bold',
                  'tracking-tight',
                  'text-white',
                  'sm:text-5xl',
                  'lg:text-[3.45rem]',
                  'lg:leading-[1.05]',
                ].join(' ')}
              >
                Selected work across geography, data and technology.
              </h1>

              <p
                className={[
                  'mt-6',
                  'max-w-xl',
                  'text-base',
                  'leading-7',
                  'text-white/70',
                  'sm:text-lg',
                  'sm:leading-8',
                ].join(' ')}
              >
                Maps are part of the story, but not the whole of it.
                This portfolio brings together spatial analysis,
                data products, research, technical workflows,
                AI work and tools built to make complex
                information useful.
              </p>

              <div
                className={[
                  'mt-auto',
                  'flex',
                  'flex-wrap',
                  'gap-x-5',
                  'gap-y-3',
                  'pt-9',
                ].join(' ')}
              >
                {categories.map(
                  (
                    category,
                  ) => (
                    <button
                      key={
                        category
                      }
                      type="button"
                      onClick={() => {
                        setSelectedCategory(
                          category,
                        );

                        setVisibleProjectCount(
                          PROJECTS_PER_BATCH,
                        );
                      }}
                      className={[
                        'relative',
                        'pb-2',
                        'text-sm',
                        'font-medium',
                        'transition-colors',
                        selectedCategory ===
                        category
                          ? 'text-white'
                          : 'text-white/55 hover:text-white/90',
                      ].join(' ')}
                    >
                      {category}

                      {selectedCategory ===
                        category && (
                        <span
                          aria-hidden="true"
                          className={[
                            'absolute',
                            'bottom-0',
                            'left-0',
                            'h-px',
                            'w-full',
                            'bg-[#ff5a52]',
                          ].join(' ')}
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>


            {/* =============================================
                RIGHT: INTERACTIVE GEOGRAPHIC INDEX

                IMPORTANT:
                This wrapper has an explicit HEIGHT,
                not merely min-height.

                PortfolioMap is absolute inset-0, so
                its parent must establish a real box.
               ============================================= */}

            <div
              aria-label="Interactive project map area"
              className={[
                'relative',
                'h-[28rem]',
                'w-full',
                'overflow-hidden',
                'sm:h-[31rem]',
                'lg:h-[34rem]',
              ].join(' ')}
            >
              <PortfolioMap />
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================
          CURATED PROJECT EXHIBITION

          Normal site light/dark theme resumes here.
         =================================================== */}

      <div
        className={[
          'container',
          'mx-auto',
          'max-w-7xl',
          'px-4',
          'pb-16',
          'sm:px-6',
          'sm:pb-20',
          'lg:px-8',
          'lg:pb-24',
        ].join(' ')}
      >
        {primaryFeatured && (
          <section className="pt-16 sm:pt-20 lg:pt-24">
            <FeaturedProject
              project={
                primaryFeatured
              }
            />
          </section>
        )}

        {filteredProjects.length > 0 && (
          <section className="pt-16 sm:pt-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              All Projects
            </p>

            <div
              className={[
                'mt-8',
                'grid',
                'gap-x-8',
                'gap-y-12',
                'md:grid-cols-2',
                'lg:grid-cols-3',
              ].join(' ')}
            >
              {visibleProjects.map(
                (
                  project,
                ) => (
                  <SelectedProject
                    key={
                      project.id
                    }
                    project={
                      project
                    }
                  />
                ),
              )}
            </div>

            {hasMoreProjects ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleProjectCount(
                      (
                        current,
                      ) =>
                        current +
                        PROJECTS_PER_BATCH,
                    );
                  }}
                  className={[
                    'border-b',
                    'border-current',
                    'pb-1',
                    'font-mono',
                    'text-xs',
                    'font-semibold',
                    'uppercase',
                    'tracking-[0.18em]',
                    'text-foreground',
                    'transition-colors',
                    'hover:text-accent',
                  ].join(' ')}
                >
                  See More
                </button>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
}