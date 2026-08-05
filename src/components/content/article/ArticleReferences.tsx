import React, {
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import type {
  ReferenceRecord,
} from '@/content/references/types';

type ArticleReferencesProps = {
  references:
    readonly ReferenceRecord[];
};

export function ArticleReferences({
  references,
}: ArticleReferencesProps) {
  const [
    isExpanded,
    setIsExpanded,
  ] = useState(true);

  if (references.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="article-references-heading"
      className="mt-16 border-t border-border pt-8"
    >
      <div
        className={[
          'flex items-center',
          'justify-between gap-4',
        ].join(' ')}
      >
        <h2
          id="article-references-heading"
          className={[
            'article-display-font',
            'text-2xl font-semibold',
            'tracking-normal',
            'text-foreground',
          ].join(' ')}
        >
          References
          {!isExpanded &&
            ` (${references.length})`}
        </h2>

        <button
          type="button"
          onClick={() => {
            setIsExpanded(
              (current) => !current,
            );
          }}
          aria-expanded={isExpanded}
          aria-controls="article-references-list"
          className={[
            'inline-flex items-center',
            'gap-1.5',
            'text-sm font-medium',
            'text-accent',
            'transition-colors',
            'hover:underline',
            'underline-offset-4',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',
          ].join(' ')}
        >
          {isExpanded
            ? 'Hide'
            : 'Show'}

          {isExpanded ? (
            <ChevronUp
              className="h-4 w-4"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              className="h-4 w-4"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {isExpanded && (
        <ol
          id="article-references-list"
          className={[
            'mt-4 list-none',
            'space-y-2 p-0',
          ].join(' ')}
        >
          {references.map(
            (reference, index) => (
              <li
                key={reference.id}
                id={`reference-${reference.id}`}
                className={[
                  'grid',
                  'grid-cols-[1.5rem_minmax(0,1fr)]',
                  'gap-x-2',
                  'text-[0.875rem]',
                  'leading-5',
                  'text-foreground',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'font-medium',
                    'tabular-nums',
                    'text-muted-foreground',
                  ].join(' ')}
                >
                  {index + 1}.
                </span>

                <div className="min-w-0">
                  <p className="m-0">
                    {reference.citation}
                  </p>

                  {reference.url && (
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={[
                        'mt-0.5 inline-block',
                        'max-w-full break-all',
                        'text-accent',
                        'no-underline',
                        'underline-offset-4',
                        'hover:underline',
                        'focus-visible:outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-ring',
                        'focus-visible:ring-offset-2',
                        'focus-visible:ring-offset-background',
                      ].join(' ')}
                    >
                      {
                        reference.linkLabel ??
                        reference.url
                      }
                    </a>
                  )}
                </div>
              </li>
            ),
          )}
        </ol>
      )}
    </section>
  );
}
