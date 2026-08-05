import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ArticleQuickSummaryProps = {
  markdown: string;
  tags: readonly string[];
};

export function ArticleQuickSummary({
  markdown,
  tags,
}: ArticleQuickSummaryProps) {
  if (
    markdown.length === 0 &&
    tags.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="quick-summary"
      aria-labelledby="quick-summary-heading"
      className="mb-12 max-w-4xl scroll-mt-28"
    >
      {markdown.length > 0 && (
        <>
          <h2
            id="quick-summary-heading"
            className="mb-4 text-xl font-semibold tracking-tight text-foreground"
          >
            Quick Summary
          </h2>

          <div
            className={[
              'bg-muted/55',
              'px-6 py-6',
              'text-base leading-8',
              'text-foreground/90',
              'sm:px-8 sm:py-7',
              'dark:bg-muted/40',
            ].join(' ')}
          >
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
              components={{
                p: ({
                  children,
                }) => (
                  <p className="m-0">
                    {children}
                  </p>
                ),

                a: ({
                  href,
                  children,
                }) => {
                  const external =
                    href?.startsWith(
                      'http://',
                    ) ||
                    href?.startsWith(
                      'https://',
                    );

                  return (
                    <a
                      href={href}
                      target={
                        external
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        external
                          ? 'noreferrer noopener'
                          : undefined
                      }
                      className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </>
      )}

      {tags.length > 0 && (
        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Article topics"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className={[
                'bg-muted',
                'px-2.5 py-1',
                'text-[0.72rem]',
                'leading-5',
                'text-muted-foreground',
              ].join(' ')}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}