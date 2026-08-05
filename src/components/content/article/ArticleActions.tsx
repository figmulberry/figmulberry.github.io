import React from 'react';
import { Link } from 'wouter';
import { SquarePen } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type {
  ArticleContent,
} from '@/content/engine/types';

type ArticleActionsProps = {
  article: ArticleContent;
};

type ExternalActionProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

const actionClassName = [
  'inline-flex h-7 flex-none',
  'items-center justify-center',
  'px-px',
  'text-muted-foreground',
  'transition-colors duration-150',
  'hover:text-foreground',
  'focus-visible:text-foreground',
  'focus-visible:outline-none',
  'dark:hover:text-white',
  'dark:focus-visible:text-white',
].join(' ');

function ExternalAction({
  href,
  label,
  children,
}: ExternalActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className={actionClassName}
        >
          {children}
        </a>
      </TooltipTrigger>

      <TooltipContent side="top">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function CreativeCommonsMark() {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex flex-none',
        'items-center',
        '-space-x-px',
        'whitespace-nowrap',
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] flex-none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <text
          x="12"
          y="15"
          textAnchor="middle"
          fill="currentColor"
          fontSize="8"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          CC
        </text>
      </svg>

      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] flex-none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle
          cx="12"
          cy="8"
          r="2.5"
          fill="currentColor"
        />

        <path
          d="M7.5 17c.6-3 2.1-4.5 4.5-4.5s3.9 1.5 4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function OpenAccessMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] flex-none"
      aria-hidden="true"
    >
      <path
        d="M8.5 10V7.5a4.5 4.5 0 0 1 8.2-2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="14"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="14"
        r="1.4"
        fill="currentColor"
      />
    </svg>
  );
}

function buildEditHref(
  article: ArticleContent,
): string {
  const parameters =
    new URLSearchParams({
      topic: 'article-feedback',
      article: article.slug,
      title: article.title,
    });

  return `/contact?${parameters.toString()}`;
}

export function ArticleActions({
  article,
}: ArticleActionsProps) {
  const publication =
    article.publication;

  if (!publication) {
    return null;
  }

  const hasActions =
    Boolean(publication.licenseUrl) ||
    Boolean(publication.openAccessUrl) ||
    publication.allowEditSuggestions === true;

  if (!hasActions) {
    return null;
  }

  return (
    <div
      className={[
        'inline-flex flex-none',
        'flex-nowrap items-center',
        'gap-px whitespace-nowrap',
      ].join(' ')}
      aria-label="Article actions"
    >
      {publication.licenseUrl && (
        <ExternalAction
          href={publication.licenseUrl}
          label="Creative Commons Attribution 4.0 license"
        >
          <CreativeCommonsMark />
        </ExternalAction>
      )}

      {publication.openAccessUrl && (
        <ExternalAction
          href={publication.openAccessUrl}
          label="Learn about Open Access"
        >
          <OpenAccessMark />
        </ExternalAction>
      )}

      {publication.allowEditSuggestions && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={buildEditHref(article)}
              aria-label="Suggest an edit to this article"
              className={actionClassName}
            >
              <SquarePen
                className="h-[18px] w-[18px] flex-none"
                aria-hidden="true"
              />
            </Link>
          </TooltipTrigger>

          <TooltipContent side="top">
            Suggest an edit
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}