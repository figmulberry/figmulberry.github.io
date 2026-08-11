import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock3,
  Map,
  Tag,
} from 'lucide-react';
import { SiQgis, SiPython, SiJupyter } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import {
  portfolioProjects,
} from '@/data/content';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDailyFeaturedArticles,
} from '@/lib/content/getDailyFeaturedArticles';
import BuiltWith from '@/built-with/BuiltWith';
import CoreCapabilities from '@/core-capabilities/CoreCapabilities';

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

function formatArticleAuthors(
  names: readonly string[],
): string {
  if (names.length === 0) {
    return 'The Kalabash Mosaics';
  }

  if (names.length === 1) {
    return names[0];
  }

  return 'Multiple Authors';
}

export default function Home() {
  
  const featuredProjects =
    portfolioProjects.slice(0, 3);

  const featuredArticles =
    getDailyFeaturedArticles(
      contentRegistry,
      3,
    );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 sm:py-28 lg:py-32 hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Map className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turning complex geospatial and data problems into clear, reproducible solutions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Geospatial intelligence, data analytics, and AI-enabled technical workflows — from field data to decision-ready insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/portfolio">
                  View Portfolio <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/articles">Read Articles</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Built With Section */}
      <BuiltWith />

      {/* Core Capabilities Section */}
      <CoreCapabilities />

{/* Portfolio Preview */}
<section className="w-full py-16">
  <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-8 flex items-center justify-between">
      <h2 className="text-3xl font-bold">Featured Projects</h2>

      <Button asChild variant="ghost">
        <Link href="/portfolio">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredProjects.map((project) => (
        <Link
          key={project.id}
          href={`/portfolio/${project.slug}`}
          className="
            group
            block
            overflow-hidden
            rounded-lg
            border
            border-border
            bg-card
            transition-all
            hover:border-accent/50
            hover:shadow-lg
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
          aria-label={`Read more about ${project.title}`}
        >
          {/* Gradient thumbnail stage */}
          <div className="bg-gradient-to-br from-accent/20 to-muted px-5 pt-5">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={project.thumbnail ?? '/project-thumbnails/placeholder.webp'}
                alt={`${project.title} project thumbnail`}
                width={800}
                height={450}
                loading="lazy"
                className="block h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Project content */}
          <div className="relative z-10 -mt-px bg-card p-6">
            <div
              className="
                mb-3
                inline-block
                rounded
                bg-accent/10
                px-2
                py-1
                text-xs
                font-medium
                text-accent
              "
            >
              {project.category}
            </div>

            <h3
              className="
                mb-2
                text-lg
                font-semibold
                transition-colors
                group-hover:text-accent
              "
            >
              {project.title}
            </h3>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded bg-muted px-2 py-1 text-xs"
                >
                  {tool}
                </span>
              ))}
            </div>

            <span
              className="
                inline-flex
                items-center
                text-sm
                font-medium
                text-accent
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              Read more →
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Daily Featured Articles */}
      <section className="w-full bg-muted/30 py-16">
        <div
          className={[
            'container mx-auto',
            'max-w-7xl',
            'px-4 sm:px-6 lg:px-8',
          ].join(' ')}
        >
          <div
            className={[
              'mb-8 flex',
              'items-center',
              'justify-between',
              'gap-4',
            ].join(' ')}
          >
            <div>
              <h2 className="text-3xl font-bold">
                Featured Articles
              </h2>

              <p
                className={[
                  'mt-2 text-sm',
                  'text-muted-foreground',
                ].join(' ')}
              >
                Three selections from the
                published article library,
                refreshed daily.
              </p>
            </div>

            <Button
              asChild
              variant="ghost"
            >
              <Link href="/articles">
                View all Articles

                <ArrowRight
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <div
            className={[
              'grid grid-cols-1',
              'gap-6',
              'md:grid-cols-2',
              'lg:grid-cols-3',
            ].join(' ')}
          >
            {featuredArticles.map(
              (article) => {
                const image =
                  article.thumbnail ??
                  article.banner;

                const authorLabel =
                  formatArticleAuthors(
                    article.authors.map(
                      (author) =>
                        author.name,
                    ),
                  );

                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
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
                    aria-label={
                      `Read ${article.title}`
                    }
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

                    <div className="p-5">
                      {article.seriesPart !==
                        undefined && (
                        <p
                          className={[
                            'mb-1',
                            'text-[0.72rem]',
                            'font-semibold uppercase',
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
                          'flex flex-wrap',
                          'items-center',
                          'gap-x-2 gap-y-1',
                          'text-[0.72rem]',
                          'leading-5',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        <span>
                          {authorLabel}
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
                          'mt-3 inline-flex',
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

                      <h3
                        className={[
                          'article-display-font',
                          'mt-3',
                          'text-xl font-semibold',
                          'leading-snug',
                          'transition-colors',
                          'group-hover:text-accent',
                        ].join(' ')}
                      >
                        {article.title}
                      </h3>

                      <p
                        className={[
                          'mt-3',
                          'text-sm leading-6',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        {article.description}
                      </p>

                      <span
                        className={[
                          'mt-5 inline-flex',
                          'items-center',
                          'text-sm font-medium',
                          'text-accent',
                          'transition-transform',
                          'duration-200',
                          'group-hover:translate-x-1',
                        ].join(' ')}
                      >
                        Read Article →

                      </span>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">The Kalabash Mosaics</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A community-driven media initiative creating tutorials, demonstrations, and open-learning resources
              for the geospatial intelligence community. Building bridges between technical workflows and accessible education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/media">Watch Tutorials</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Explore My Work</h2>
            <p className="text-muted-foreground mb-8">
              Dive into my portfolio of geospatial projects, read technical articles, or review my professional background.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/portfolio">Portfolio</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/articles">Articles</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cv">CV</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
