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

import {
  useActiveHeading,
} from '@/hooks/useActiveHeading';

import type {
  TableOfContentsItem,
} from '@/content/engine/types';

type ArticleTableOfContentsProps = {
  items:
    readonly TableOfContentsItem[];
};

export function ArticleTableOfContents({
  items,
}: ArticleTableOfContentsProps) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(true);

  const listRef =
    useRef<HTMLOListElement>(
      null,
    );

  const activeLinkRef =
    useRef<HTMLAnchorElement>(
      null,
    );

  const headingIds =
    useMemo(
      () =>
        items.map(
          (
            item,
          ) =>
            item.id,
        ),
      [
        items,
      ],
    );

  const activeId =
    useActiveHeading(
      headingIds,
    );

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const list =
      listRef.current;

    const activeLink =
      activeLinkRef.current;

    if (
      !list ||
      !activeLink
    ) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Do not use element.scrollIntoView()
     * here.
     *
     * scrollIntoView() can scroll every
     * scrollable ancestor, including the
     * document itself. On narrow screens
     * that previously caused the complete
     * article page to jump down toward the
     * Contents block.
     *
     * Instead, move only the TOC's own
     * internal scroll position.
     */
    const listRect =
      list.getBoundingClientRect();

    const linkRect =
      activeLink.getBoundingClientRect();

    const linkAboveViewport =
      linkRect.top <
      listRect.top;

    const linkBelowViewport =
      linkRect.bottom >
      listRect.bottom;

    if (
      !linkAboveViewport &&
      !linkBelowViewport
    ) {
      return;
    }

    const linkTopWithinList =
      activeLink.offsetTop;

    const centeredScrollTop =
      linkTopWithinList -
      list.clientHeight / 2 +
      activeLink.clientHeight / 2;

    const maximumScrollTop =
      Math.max(
        0,
        list.scrollHeight -
          list.clientHeight,
      );

    list.scrollTo({
      top:
        Math.min(
          maximumScrollTop,
          Math.max(
            0,
            centeredScrollTop,
          ),
        ),

      behavior:
        window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
          ? 'auto'
          : 'smooth',
    });
  }, [
    activeId,
    expanded,
  ]);

  if (
    items.length === 0
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Article contents"
      className={[
        'border-l-2',
        'border-border',
        'bg-background',
      ].join(' ')}
    >
      <button
        type="button"
        aria-expanded={
          expanded
        }
        aria-controls="article-contents-list"
        onClick={
          () =>
            setExpanded(
              (
                current,
              ) =>
                !current,
            )
        }
        className={[
          'flex',
          'w-full',
          'items-center',
          'justify-between',
          'gap-3',
          'border-b',
          'border-border',
          'px-4',
          'py-3',
          'text-left',
          'transition-colors',
          'hover:bg-muted/45',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-inset',
          'focus-visible:ring-accent',
        ].join(' ')}
      >
        <span
          className={[
            'inline-flex',
            'items-center',
            'gap-2',
          ].join(' ')}
        >
          <ListTree
            className={[
              'h-4',
              'w-4',
              'text-accent',
            ].join(' ')}
            aria-hidden="true"
          />

          <span
            className={[
              'text-sm',
              'font-semibold',
              'uppercase',
              'tracking-[0.14em]',
              'text-foreground',
            ].join(' ')}
          >
            Contents
          </span>
        </span>

        <ChevronDown
          className={[
            'h-4',
            'w-4',
            'transition-transform',
            'duration-200',

            expanded
              ? 'rotate-180'
              : 'rotate-0',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <ol
          ref={
            listRef
          }
          id="article-contents-list"
          className={[
            'max-h-[calc(100vh-10rem)]',
            'space-y-0.5',
            'overflow-y-auto',
            'overscroll-contain',
            'py-2',
          ].join(' ')}
        >
          {items.map(
            (
              item,
            ) => {
              const active =
                item.id ===
                activeId;

              return (
                <li
                  key={
                    item.id
                  }
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
                    href={
                      `#${item.id}`
                    }
                    aria-current={
                      active
                        ? 'location'
                        : undefined
                    }
                    className={[
                      'block',
                      'border-l-2',
                      'px-3',
                      'py-2',
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
                    {
                      item.title
                    }
                  </a>
                </li>
              );
            },
          )}
        </ol>
      )}
    </nav>
  );
}