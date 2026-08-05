import React from 'react';

import {
  CalendarDays,
  Clock3,
  Layers3,
  UserRound,
} from 'lucide-react';

import {
  ArticleActions,
} from '@/components/content/article/ArticleActions';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type {
  ArticleContent,
  Author,
} from '@/content/engine/types';

type ArticleHeaderProps = {
  article: ArticleContent;
  seriesTitle?: string;
};

const metadataTextClass =
  'text-[0.72rem] leading-5';

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

function OrcidMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={[
        'block h-[1.15rem] w-[1.15rem]',
        'shrink-0 overflow-visible',
      ].join(' ')}
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        className={[
          'fill-muted-foreground/70',
          'transition-colors duration-150',
          'group-hover:fill-[#a6ce39]',
          'group-focus-visible:fill-[#a6ce39]',
        ].join(' ')}
      />

      <text
        x="12"
        y="12.7"
        textAnchor="middle"
        dominantBaseline="middle"
        className={[
          'fill-background',
          'font-sans text-[8.2px]',
          'font-bold',
          'group-hover:fill-white',
          'group-focus-visible:fill-white',
        ].join(' ')}
      >
        iD
      </text>
    </svg>
  );
}

function ArticleAuthor({
  author,
}: {
  author: Author;
}) {
  return (
    <span
      className={[
        'inline-flex min-h-6',
        'items-center gap-1.5',
        'align-middle',
      ].join(' ')}
    >
      <UserRound
        className="h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      />

      <span>{author.name}</span>

      {author.orcid && (
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={author.orcid}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View ${author.name}'s ORCID profile`}
              className={[
                'group inline-flex',
                'h-6 w-5 flex-none',
                'items-center justify-center',
                'self-center align-middle',
                'focus-visible:outline-none',
              ].join(' ')}
            >
              <OrcidMark />
            </a>
          </TooltipTrigger>

          <TooltipContent side="top">
            View ORCID profile
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}

export function ArticleHeader({
  article,
  seriesTitle,
}: ArticleHeaderProps) {
  return (
    <header className="mb-10">
      <div
        className={[
          'mb-5',
          'flex flex-wrap',
          'items-center gap-1.5',
        ].join(' ')}
      >
        <span
          className={[
            'inline-flex items-center',
            'border border-border',
            'bg-muted/45',
            'px-2 py-0.5',
            metadataTextClass,
            'font-semibold uppercase',
            'tracking-[0.12em]',
            'text-muted-foreground',
          ].join(' ')}
        >
          {article.category}
        </span>

        {seriesTitle && article.seriesPart && (
          <span
            className={[
              'inline-flex items-center',
              'gap-1',
              'border border-accent/30',
              'bg-accent/10',
              'px-2 py-0.5',
              metadataTextClass,
              'font-medium',
              'text-accent',
            ].join(' ')}
          >
            <Layers3
              className="h-3 w-3 shrink-0"
              aria-hidden="true"
            />

            {seriesTitle} · Part {article.seriesPart}
          </span>
        )}
      </div>

      <div className="max-w-5xl">
        <h1
          className={[
            'article-display-font',
            'text-[2.15rem]',
            'font-bold',
            'leading-[1.08]',
            'tracking-normal',
            'text-foreground',
            'sm:text-[2.6rem]',
            'lg:text-[3rem]',
          ].join(' ')}
        >
          {article.title}
        </h1>

        {article.subtitle && (
          <p
            className={[
              'article-display-font',
              'mt-3 max-w-4xl',
              'text-base',
              'font-medium',
              'leading-snug',
              'text-accent',
              'sm:text-lg',
              'lg:text-xl',
            ].join(' ')}
          >
            {article.subtitle}
          </p>
        )}
      </div>

      <div
        className={[
          'mt-4',
          'border-b border-border',
          'pb-1.5',
          metadataTextClass,
          'text-muted-foreground',
          'md:flex',
          'md:items-center',
          'md:justify-between',
          'md:gap-6',
        ].join(' ')}
      >
        <div
          className={[
            'flex flex-wrap',
            'items-center',
            'gap-x-5 gap-y-2',
          ].join(' ')}
        >
          {article.authors.map(
            (author) => (
              <ArticleAuthor
                key={author.id}
                author={author}
              />
            ),
          )}

          <time
            dateTime={article.publishedAt}
            className="inline-flex items-center gap-1.5"
          >
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />

            {formatPublicationDate(
              article.publishedAt,
            )}
          </time>

          <span className="inline-flex items-center gap-1.5">
            <Clock3
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />

            {article.readingMinutes} min read
          </span>
        </div>

        <div className="mt-3 md:mt-0 md:shrink-0">
          <ArticleActions article={article} />
        </div>
      </div>
    </header>
  );
}