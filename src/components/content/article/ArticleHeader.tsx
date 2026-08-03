import React from 'react';
import {
  CalendarDays,
  Clock3,
  Layers3,
  UserRound,
} from 'lucide-react';

import type {
  ArticleContent,
} from '@/content/engine/types';

type ArticleHeaderProps = {
  article: ArticleContent;
  seriesTitle?: string;
};

function formatPublicationDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'en',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    },
  ).format(new Date(value));
}

export function ArticleHeader({
  article,
  seriesTitle,
}: ArticleHeaderProps) {
  const authorNames = article.authors
    .map((author) => author.name)
    .join(', ');

  return (
    <header className="mb-12">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {article.category}
        </span>

        {seriesTitle && article.seriesPart && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Layers3 className="h-3.5 w-3.5" />
            {seriesTitle} · Part {article.seriesPart}
          </span>
        )}

        {article.difficulty && (
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {article.difficulty}
          </span>
        )}
      </div>

      <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="mt-4 max-w-4xl text-xl font-medium text-accent sm:text-2xl">
          {article.subtitle}
        </p>
      )}

      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          {authorNames}
        </span>

        <time
          dateTime={article.publishedAt}
          className="inline-flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          {formatPublicationDate(
            article.publishedAt,
          )}
        </time>

        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {article.readingMinutes} min read
        </span>
      </div>

      {article.banner && (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
          <img
            src={article.banner.src}
            alt={article.banner.alt}
            width={article.banner.width}
            height={article.banner.height}
            decoding="async"
            fetchPriority="high"
            className="h-auto w-full object-cover"
          />

          {article.banner.caption && (
            <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              {article.banner.caption}
            </figcaption>
          )}
        </figure>
      )}

      {article.tags.length > 0 && (
        <div
          className="mt-6 flex flex-wrap gap-2"
          aria-label="Article topics"
        >
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}