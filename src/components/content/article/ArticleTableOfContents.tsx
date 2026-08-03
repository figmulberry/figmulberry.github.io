import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronDown,
  ListTree,
} from 'lucide-react';

import { useActiveHeading } from
  '@/hooks/useActiveHeading';

import type {
  TableOfContentsItem,
} from '@/content/engine/types';

type ArticleTableOfContentsProps = {
  items: readonly TableOfContentsItem[];
};

export function ArticleTableOfContents({
  items,
}: ArticleTableOfContentsProps) {
  const [expanded, setExpanded] =
    useState(true);

  const activeLinkRef =
    useRef<HTMLAnchorElement>(null);

  const headingIds = useMemo(
    () => items.map((item) => item.id),
    [items],
  );

  const activeId = useActiveHeading(
    headingIds,
  );

  useEffect(() => {
    if (!expanded) {
      return;
    }

    activeLinkRef.current?.scrollIntoView({
      block: 'nearest',
    });
  }, [
    activeId,
    expanded,
  ]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Article contents"
      className="border-l-2 border-border bg-background"
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="article-contents-list"
        onClick={() =>
          setExpanded((current) => !current)
        }
        className={[
          'flex w-full items-center',
          'justify-between gap-3',
          'border-b border-border',
          'px-4 py-3',
          'text-left',
          'transition-colors',
          'hover:bg-muted/45',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-inset',
          'focus-visible:ring-accent',
        ].join(' ')}
      >
        <span className="inline-flex items-center gap-2">
          <ListTree
            className="h-4 w-4 text-accent"
            aria-hidden="true"
          />

          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Contents
          </span>
        </span>

        <ChevronDown
          className={[
            'h-4 w-4',
            'transition-transform duration-200',
            expanded
              ? 'rotate-180'
              : 'rotate-0',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <ol
          id="article-contents-list"
          className={[
            'max-h-[calc(100vh-10rem)]',
            'space-y-0.5',
            'overflow-y-auto',
            'py-2',
          ].join(' ')}
        >
          {items.map((item) => {
            const active =
              item.id === activeId;

            return (
              <li
                key={item.id}
                className={
                  item.level === 3
                    ? 'pl-4'
                    : undefined
                }
              >
                <a
                  ref={
                    active
                      ? activeLinkRef
                      : undefined
                  }
                  href={`#${item.id}`}
                  aria-current={
                    active
                      ? 'location'
                      : undefined
                  }
                  className={[
                    'block border-l-2',
                    'px-3 py-2',
                    'transition-colors',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-inset',
                    'focus-visible:ring-accent',
                    active
                      ? [
                          'border-l-accent',
                          'bg-accent/10',
                          'font-semibold',
                          'text-accent',
                        ].join(' ')
                      : [
                          'border-l-transparent',
                          'text-foreground/78',
                          'hover:border-l-border',
                          'hover:bg-muted/45',
                          'hover:text-foreground',
                        ].join(' '),
                    item.level === 3
                      ? 'text-xs'
                      : 'text-sm',
                  ].join(' ')}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}