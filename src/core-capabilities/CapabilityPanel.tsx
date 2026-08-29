import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Pin,
  PinOff,
  X,
} from 'lucide-react';

import {
  Link,
} from 'wouter';

import {
  contentRegistry,
} from '@/content/engine/registry';

import CapabilityFamilyIcon from
  './CapabilityFamilyIcon';

import {
  capabilityAccentStyles,
} from './accentStyles';

import {
  getCapabilityArticleHref,
  getCapabilityArticles,
} from './capabilityContent';

import type {
  CapabilityFamily,
} from './types';

type CapabilityPanelProps = {
  family:
    CapabilityFamily;

  familyIndex:
    number;

  familyCount:
    number;

  isPinned:
    boolean;

  onPrevious:
    () => void;

  onNext:
    () => void;

  onTogglePin:
    () => void;

  onMinimize:
    () => void;

  onClose:
    () => void;
};

export default function CapabilityPanel({
  family,
  familyIndex,
  familyCount,
  isPinned,
  onPrevious,
  onNext,
  onTogglePin,
  onMinimize,
  onClose,
}: CapabilityPanelProps) {
  const [
    articleIndex,
    setArticleIndex,
  ] = useState(0);

  const accent =
    capabilityAccentStyles[
      family.accent
    ];

  const articles =
    useMemo(
      () =>
        getCapabilityArticles(
          contentRegistry,
          family,
          3,
        ),
      [
        family,
      ],
    );

  const activeArticle =
    articles.length > 0
      ? articles[
          articleIndex %
            articles.length
        ]
      : null;

  const exploreHref =
    activeArticle
      ? getCapabilityArticleHref(
          activeArticle,
        )
      : '/articles';

  useEffect(() => {
    setArticleIndex(0);
  }, [
    family.id,
  ]);

  function previousArticle() {
    if (
      articles.length <= 1
    ) {
      return;
    }

    setArticleIndex(
      (
        current,
      ) =>
        (
          current -
          1 +
          articles.length
        ) %
        articles.length,
    );
  }

  function nextArticle() {
    if (
      articles.length <= 1
    ) {
      return;
    }

    setArticleIndex(
      (
        current,
      ) =>
        (
          current +
          1
        ) %
        articles.length,
    );
  }

  const controlClass = [
    'grid',
    'h-8',
    'w-8',
    'place-items-center',
    'border-0',
    'bg-transparent',
    'p-0',
    'text-muted-foreground',
    'outline-none',
    'transition-[color,transform,opacity]',
    'duration-200',
    'hover:scale-105',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
  ].join(' ');

  return (
    <div
      className={[
        'relative',
        'h-[400px]',
        'min-h-[400px]',
        'max-h-[400px]',
        'min-w-0',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none',
          'absolute',
          '-inset-4',
          'hidden',
          'blur-[26px]',
          'dark:block',
        ].join(' ')}
        style={{
          background: [
            'radial-gradient(',
            'ellipse at 50% 52%,',
            `${accent.glowStrong} 0%,`,
            `${accent.glow} 30%,`,
            'transparent 72%',
            ')',
          ].join(' '),
        }}
      />

      <aside
        className={[
          'relative',
          'z-10',
          'flex',
          'h-full',
          'min-h-0',
          'flex-col',
          'overflow-hidden',
          'rounded-2xl',
          'border',
          'bg-background/94',
          'px-5',
          'pb-5',
          'pt-5',
          'backdrop-blur-xl',
          'dark:bg-card/92',
        ].join(' ')}
        style={{
          borderColor:
            `${accent.solid}55`,

          boxShadow: [
            `0 8px 26px ${accent.lightShadow}`,
            `0 0 0 1px ${accent.soft}`,
          ].join(', '),

          backgroundImage: [
            'radial-gradient(',
            'circle at 10% 5%,',
            `${accent.soft} 0%,`,
            'transparent 25%',
            ')',
          ].join(' '),
        }}
      >
        <div
          className={[
            'flex',
            'shrink-0',
            'items-center',
            'gap-2',
          ].join(' ')}
        >
          <span
            className={[
              'grid',
              'h-[34px]',
              'w-[34px]',
              'shrink-0',
              'place-items-center',
            ].join(' ')}
            style={{
              color:
                accent.solid,
            }}
          >
            <CapabilityFamilyIcon
              familyId={
                family.id
              }
              className="h-5 w-5"
            />
          </span>

          <div
            className={[
              'ml-auto',
              'flex',
              'items-center',
              'gap-0.5',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={
                onPrevious
              }
              aria-label="Previous capability"
              title="Previous capability"
              className={
                controlClass
              }
            >
              <ChevronLeft
                className="h-4 w-4"
              />
            </button>

            <span
              className={[
                'min-w-10',
                'text-center',
                'text-[0.68rem]',
                'font-medium',
                'tracking-[0.12em]',
                'text-muted-foreground',
              ].join(' ')}
            >
              {familyIndex + 1}
              {' / '}
              {familyCount}
            </span>

            <button
              type="button"
              onClick={
                onNext
              }
              aria-label="Next capability"
              title="Next capability"
              className={
                controlClass
              }
            >
              <ChevronRight
                className="h-4 w-4"
              />
            </button>

            <button
              type="button"
              onClick={
                onTogglePin
              }
              aria-label={
                isPinned
                  ? 'Unpin capability details'
                  : 'Keep capability details open'
              }
              title={
                isPinned
                  ? 'Return to automatic collapse'
                  : 'Keep open'
              }
              className={
                controlClass
              }
              style={{
                color:
                  isPinned
                    ? accent.solid
                    : undefined,
              }}
            >
              {isPinned ? (
                <PinOff
                  className="h-3.5 w-3.5"
                />
              ) : (
                <Pin
                  className="h-3.5 w-3.5"
                />
              )}
            </button>

            <button
              type="button"
              onClick={
                onMinimize
              }
              aria-label="Collapse capability details"
              title="Collapse"
              className={
                controlClass
              }
            >
              <Minus
                className="h-4 w-4"
              />
            </button>

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Close capability details"
              title="Close"
              className={
                controlClass
              }
            >
              <X
                className="h-4 w-4"
              />
            </button>
          </div>
        </div>

        <div
          className={[
            'mt-5',
            'shrink-0',
          ].join(' ')}
        >
          <h3
            className={[
              'text-[1.38rem]',
              'font-semibold',
              'leading-tight',
              'tracking-tight',
            ].join(' ')}
          >
            {family.label}
          </h3>

          {family.metric ? (
            <p
              className={[
                'mt-1.5',
                'text-[0.68rem]',
                'font-semibold',
                'uppercase',
                'tracking-[0.2em]',
              ].join(' ')}
              style={{
                color:
                  accent.solid,
              }}
            >
              {family.metric.value}
              {family.metric.suffix}
              {' '}
              {family.metric.label}
            </p>
          ) : (
            <p
              className={[
                'mt-1.5',
                'text-[0.68rem]',
                'font-semibold',
                'uppercase',
                'tracking-[0.2em]',
              ].join(' ')}
              style={{
                color:
                  accent.solid,
              }}
            >
              Core Capability
            </p>
          )}
        </div>

        <p
          className={[
            'mt-4',
            'shrink-0',
            'text-[0.78rem]',
            'leading-[1.45rem]',
            'text-muted-foreground',
          ].join(' ')}
        >
          {family.description}
        </p>

        <div
          className={[
            'my-4',
            'h-px',
            'shrink-0',
          ].join(' ')}
          style={{
            background:
              `linear-gradient(90deg, ${accent.solid}55, transparent)`,
          }}
        />

        <div
          className={[
            'min-h-0',
            'flex-1',
          ].join(' ')}
        >
          {activeArticle && (
          <p
            className={[
              'text-[0.64rem]',
              'font-semibold',
              'uppercase',
              'tracking-[0.18em]',
            ].join(' ')}
            style={{
              color:
                accent.solid,
            }}
          >
            Related Article
          </p>
          )}

          {activeArticle ? (
            <div
              className="mt-2"
            >
              <div
                className={[
                  'grid',
                  'grid-cols-[28px_minmax(0,1fr)_28px]',
                  'items-center',
                  'gap-1.5',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={
                    previousArticle
                  }
                  disabled={
                    articles.length <=
                    1
                  }
                  aria-label="Previous related article"
                  className={[
                    'grid',
                    'h-7',
                    'w-7',
                    'place-items-center',
                    'border-0',
                    'bg-transparent',
                    'p-0',
                    'text-muted-foreground',
                    'outline-none',
                    'disabled:opacity-30',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <ChevronLeft
                    className="h-3.5 w-3.5"
                  />
                </button>

                <Link
                  href={
                    getCapabilityArticleHref(
                      activeArticle,
                    )
                  }
                  aria-label={
                    `Read ${activeArticle.title}`
                  }
                  className={[
                    'grid',
                    'min-w-0',
                    'grid-cols-[68px_minmax(0,1fr)]',
                    'items-center',
                    'gap-2.5',
                    'outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'h-[58px]',
                      'w-[68px]',
                      'overflow-hidden',
                      'border',
                      'bg-muted',
                    ].join(' ')}
                    style={{
                      borderColor:
                        `${accent.solid}88`,

                      boxShadow:
                        `0 6px 14px ${accent.lightShadow}`,
                    }}
                  >
                    {activeArticle.thumbnail ? (
                      <img
                        src={
                          activeArticle.thumbnail.src
                        }
                        alt={
                          activeArticle.thumbnail.alt
                        }
                        className={[
                          'h-full',
                          'w-full',
                          'object-cover',
                        ].join(' ')}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="h-full w-full"
                        style={{
                          background:
                            `radial-gradient(circle at 30% 25%, ${accent.glowStrong}, ${accent.soft} 42%, transparent 75%)`,
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="min-w-0"
                  >
                    <h4
                      className={[
                        'truncate',
                        'text-xs',
                        'font-semibold',
                      ].join(' ')}
                    >
                      {activeArticle.title}
                    </h4>

                    <p
                      className={[
                        'mt-1',
                        'line-clamp-2',
                        'text-[0.68rem]',
                        'leading-4',
                        'text-muted-foreground',
                      ].join(' ')}
                    >
                      {activeArticle.description}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={
                    nextArticle
                  }
                  disabled={
                    articles.length <=
                    1
                  }
                  aria-label="Next related article"
                  className={[
                    'grid',
                    'h-7',
                    'w-7',
                    'place-items-center',
                    'border-0',
                    'bg-transparent',
                    'p-0',
                    'text-muted-foreground',
                    'outline-none',
                    'disabled:opacity-30',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <ChevronRight
                    className="h-3.5 w-3.5"
                  />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={[
            'mt-2',
            'flex',
            'shrink-0',
            'justify-end',
          ].join(' ')}
        >
          <Link
            href={
              exploreHref
            }
            className={[
              'inline-flex',
              'items-center',
              'gap-1.5',
              'text-[0.82rem]',
              'font-medium',
              'outline-none',
              'transition-opacity',
              'hover:opacity-70',
              'focus-visible:ring-2',
              'focus-visible:ring-ring',
              'focus-visible:ring-offset-2',
            ].join(' ')}
            style={{
              color:
                accent.solid,
            }}
          >
            <span>
              Explore More
            </span>

            <ArrowUpRight
              className="h-3.5 w-3.5"
            />
          </Link>
        </div>
      </aside>
    </div>
  );
}