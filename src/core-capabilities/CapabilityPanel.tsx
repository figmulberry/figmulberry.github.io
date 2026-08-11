import React, {
  useEffect,
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

import CapabilityOrb from
  './CapabilityOrb';

import {
  capabilityAccentStyles,
} from './accentStyles';

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
    projectIndex,
    setProjectIndex,
  ] = useState(0);

  const accent =
    capabilityAccentStyles[
      family.accent
    ];

  const projects =
    family.projects;

  const activeProject =
    projects.length > 0
      ? projects[
          projectIndex %
            projects.length
        ]
      : null;

  useEffect(() => {
    setProjectIndex(0);
  }, [family.id]);

  function previousProject() {
    if (
      projects.length <= 1
    ) {
      return;
    }

    setProjectIndex(
      (current) =>
        (current -
          1 +
          projects.length) %
        projects.length,
    );
  }

  function nextProject() {
    if (
      projects.length <= 1
    ) {
      return;
    }

    setProjectIndex(
      (current) =>
        (current + 1) %
        projects.length,
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
        <div className="flex shrink-0 items-center gap-2">
          <CapabilityOrb
            accent={
              family.accent
            }
            size={34}
          />

          <div className="ml-auto flex items-center gap-0.5">
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

            <span className="min-w-10 text-center text-[0.68rem] font-medium tracking-[0.12em] text-muted-foreground">
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

        <div className="mt-5 shrink-0">
          <h3 className="text-[1.38rem] font-semibold leading-tight tracking-tight">
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

        <p className="mt-4 shrink-0 text-[0.78rem] leading-[1.45rem] text-muted-foreground">
          {family.description}
        </p>

        <div
          className="my-4 h-px shrink-0"
          style={{
            background:
              `linear-gradient(90deg, ${accent.solid}55, transparent)`,
          }}
        />

        <div className="min-h-0 flex-1">
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
            Featured Project
          </p>

          {activeProject ? (
            <div className="mt-2">
              <div className="grid grid-cols-[28px_minmax(0,1fr)_28px] items-center gap-1.5">
                <button
                  type="button"
                  onClick={
                    previousProject
                  }
                  disabled={
                    projects.length <=
                    1
                  }
                  aria-label="Previous project"
                  className={[
                    'grid',
                    'h-7',
                    'w-7',
                    'place-items-center',
                    'border-0',
                    'bg-transparent',
                    'p-0',
                    'text-muted-foreground',
                    'disabled:opacity-30',
                  ].join(' ')}
                >
                  <ChevronLeft
                    className="h-3.5 w-3.5"
                  />
                </button>

                <div className="grid min-w-0 grid-cols-[68px_minmax(0,1fr)] items-center gap-2.5">
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
                    {activeProject.thumbnail ? (
                      <img
                        src={
                          activeProject.thumbnail
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background:
                            `radial-gradient(circle at 30% 25%, ${accent.glowStrong}, ${accent.soft} 42%, transparent 75%)`,
                        }}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-xs font-semibold">
                      {
                        activeProject.title
                      }
                    </h4>

                    <p className="mt-1 line-clamp-2 text-[0.68rem] leading-4 text-muted-foreground">
                      {
                        activeProject.description
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    nextProject
                  }
                  disabled={
                    projects.length <=
                    1
                  }
                  aria-label="Next project"
                  className={[
                    'grid',
                    'h-7',
                    'w-7',
                    'place-items-center',
                    'border-0',
                    'bg-transparent',
                    'p-0',
                    'text-muted-foreground',
                    'disabled:opacity-30',
                  ].join(' ')}
                >
                  <ChevronRight
                    className="h-3.5 w-3.5"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex h-[78px] items-center border border-border/50 bg-background/15 px-3.5 text-[0.7rem] leading-5 text-muted-foreground">
              Project evidence will
              appear here once mapped
              to this capability.
            </div>
          )}
        </div>

        <div className="mt-2 flex shrink-0 justify-end">
          <Link
            href="/articles"
            className={[
              'inline-flex',
              'items-center',
              'gap-1.5',
              'text-[0.82rem]',
              'font-medium',
              'transition-opacity',
              'hover:opacity-70',
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