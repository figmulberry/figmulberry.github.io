import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ArrowUpRight,
  X,
} from 'lucide-react';

import {
  Link,
} from 'wouter';

import {
  contentRegistry,
} from '@/content/engine/registry';

import CapabilityCanvas from
  './CapabilityCanvas';

import CapabilityPanel from
  './CapabilityPanel';

import CapabilityFamilyIcon from
  './CapabilityFamilyIcon';

import {
  capabilityFamilies,
} from './capabilityData';

import {
  capabilityAccentStyles,
} from './accentStyles';

import {
  getCapabilityProjects,
} from './capabilityContent';

import type {
  CapabilityFamilyId,
} from './types';

type PanelState =
  | 'collapsed'
  | 'temporary'
  | 'pinned'
  | 'closed';

const DEFAULT_FAMILY:
  CapabilityFamilyId =
    'spatial-analysis';

const COLLAPSE_DELAY =
  250;

const DESKTOP_QUERY =
  '(min-width: 1024px)';

function useDesktopLayout():
  boolean {
  const [
    isDesktop,
    setIsDesktop,
  ] =
    useState(
      () =>
        typeof window !==
          'undefined' &&
        window.matchMedia(
          DESKTOP_QUERY,
        ).matches,
    );

  useEffect(() => {
    const media =
      window.matchMedia(
        DESKTOP_QUERY,
      );

    function update() {
      setIsDesktop(
        media.matches,
      );
    }

    update();

    media.addEventListener(
      'change',
      update,
    );

    return () => {
      media.removeEventListener(
        'change',
        update,
      );
    };
  }, []);

  return isDesktop;
}

export default function CoreCapabilities() {
  const isDesktop =
    useDesktopLayout();

  const collapseTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const pointerInCloudRef =
    useRef(false);

  const pointerInPanelRef =
    useRef(false);

  const [
    activeFamilyId,
    setActiveFamilyId,
  ] =
    useState<CapabilityFamilyId>(
      DEFAULT_FAMILY,
    );

  const [
    selectedNodeId,
    setSelectedNodeId,
  ] =
    useState<string | null>(
      DEFAULT_FAMILY,
    );

  const [
    panelState,
    setPanelState,
  ] =
    useState<PanelState>(
      'collapsed',
    );

  const activeFamilyIndex =
    useMemo(
      () =>
        capabilityFamilies.findIndex(
          (
            family,
          ) =>
            family.id ===
            activeFamilyId,
        ),
      [
        activeFamilyId,
      ],
    );

  const activeFamily =
    capabilityFamilies[
      Math.max(
        0,
        activeFamilyIndex,
      )
    ];

  const accent =
    capabilityAccentStyles[
      activeFamily.accent
    ];

  const isPanelOpen =
    panelState ===
      'temporary' ||
    panelState ===
      'pinned';

  const isPinned =
    panelState ===
    'pinned';

  const clearCollapseTimer =
    useCallback(() => {
      if (
        collapseTimerRef.current
      ) {
        clearTimeout(
          collapseTimerRef.current,
        );

        collapseTimerRef.current =
          null;
      }
    }, []);

  const scheduleCollapse =
    useCallback(() => {
      clearCollapseTimer();

      collapseTimerRef.current =
        setTimeout(
          () => {
            if (
              pointerInCloudRef.current ||
              pointerInPanelRef.current
            ) {
              collapseTimerRef.current =
                null;

              return;
            }

            setPanelState(
              (
                current,
              ) =>
                current ===
                'temporary'
                  ? 'collapsed'
                  : current,
            );

            collapseTimerRef.current =
              null;
          },
          COLLAPSE_DELAY,
        );
    }, [
      clearCollapseTimer,
    ]);

  useEffect(() => {
    return () => {
      clearCollapseTimer();
    };
  }, [
    clearCollapseTimer,
  ]);

  function handleCanvasHover(
    nodeId: string | null,
    familyId:
      CapabilityFamilyId | null,
  ) {
    if (
      nodeId &&
      familyId
    ) {
      pointerInCloudRef.current =
        true;

      clearCollapseTimer();

      setActiveFamilyId(
        familyId,
      );

      setPanelState(
        (
          current,
        ) =>
          current ===
          'pinned'
            ? 'pinned'
            : 'temporary',
      );

      return;
    }

    pointerInCloudRef.current =
      false;

    if (
      !pointerInPanelRef.current
    ) {
      scheduleCollapse();
    }
  }

  function handleNodeClick(
    nodeId: string,
    familyId:
      CapabilityFamilyId,
  ) {
    clearCollapseTimer();

    setActiveFamilyId(
      familyId,
    );

    setSelectedNodeId(
      nodeId,
    );

    setPanelState(
      (
        current,
      ) =>
        current ===
        'pinned'
          ? 'pinned'
          : 'temporary',
    );
  }

  function activateCompactFamily(
    familyId:
      CapabilityFamilyId,
  ) {
    setActiveFamilyId(
      familyId,
    );

    setSelectedNodeId(
      familyId,
    );
  }

  function selectFamilyByIndex(
    nextIndex: number,
  ) {
    clearCollapseTimer();

    const count =
      capabilityFamilies.length;

    const wrappedIndex =
      (
        (
          nextIndex %
          count
        ) +
        count
      ) %
      count;

    const family =
      capabilityFamilies[
        wrappedIndex
      ];

    setActiveFamilyId(
      family.id,
    );

    setSelectedNodeId(
      family.id,
    );

    setPanelState(
      (
        current,
      ) =>
        current ===
        'pinned'
          ? 'pinned'
          : 'temporary',
    );
  }

  function handlePreviousFamily() {
    selectFamilyByIndex(
      activeFamilyIndex -
        1,
    );
  }

  function handleNextFamily() {
    selectFamilyByIndex(
      activeFamilyIndex +
        1,
    );
  }

  function handlePanelPointerEnter() {
    pointerInPanelRef.current =
      true;

    clearCollapseTimer();
  }

  function handlePanelPointerLeave() {
    pointerInPanelRef.current =
      false;

    if (
      !pointerInCloudRef.current
    ) {
      scheduleCollapse();
    }
  }

  function handleTogglePin() {
    clearCollapseTimer();

    setPanelState(
      (
        current,
      ) => {
        if (
          current ===
          'pinned'
        ) {
          if (
            !pointerInCloudRef.current &&
            !pointerInPanelRef.current
          ) {
            setTimeout(
              scheduleCollapse,
              0,
            );
          }

          return 'temporary';
        }

        return 'pinned';
      },
    );
  }

  function handleMinimize() {
    clearCollapseTimer();

    pointerInPanelRef.current =
      false;

    setPanelState(
      'collapsed',
    );
  }

  function handleClose() {
    clearCollapseTimer();

    pointerInPanelRef.current =
      false;

    setPanelState(
      'closed',
    );
  }

  function handleRailClick() {
    clearCollapseTimer();

    pointerInPanelRef.current =
      false;

    setPanelState(
      'temporary',
    );
  }

  const layoutColumns =
    isPanelOpen
      ? 'grid-cols-[minmax(0,1fr)_340px]'
      : panelState ===
          'collapsed'
        ? 'grid-cols-[minmax(0,1fr)_64px]'
        : 'grid-cols-1';

  const activeProjects =
    useMemo(
      () =>
        getCapabilityProjects(
          contentRegistry,
          activeFamily,
          3,
        ),
      [
        activeFamily,
      ],
    );

  const activeProject =
    activeProjects[
      0
    ] ??
    null;

  return (
    <section
      aria-labelledby="core-capabilities-title"
      className={[
        'w-full',
        'py-10',
        'sm:py-12',
        'lg:py-14',
      ].join(' ')}
    >
      <div
        className={[
          'container',
          'mx-auto',
          'max-w-7xl',
          'px-4',
          'sm:px-6',
          'lg:px-8',
        ].join(' ')}
      >
        <div
          className={[
            'mb-7',
            'sm:mb-8',
          ].join(' ')}
        >
          <h2
            id="core-capabilities-title"
            className={[
              'text-3xl',
              'font-bold',
              'tracking-tight',
              'sm:text-4xl',
            ].join(' ')}
          >
            Core Capabilities
          </h2>

          <p
            className={[
              'mt-3',
              'max-w-2xl',
              'text-sm',
              'leading-6',
              'text-muted-foreground',
              'sm:text-base',
            ].join(' ')}
          >
            Explore the technologies,
            methods, and technical
            disciplines that shape my work.
          </p>
        </div>

        {!isDesktop && (
          <div
            className="space-y-6"
          >
            <div
              className={[
                'grid',
                'grid-cols-3',
                'gap-x-3',
                'gap-y-5',
                'sm:grid-cols-6',
                'sm:gap-x-4',
              ].join(' ')}
            >
              {capabilityFamilies.map(
                (
                  family,
                ) => {
                  const familyAccent =
                    capabilityAccentStyles[
                      family.accent
                    ];

                  const isActive =
                    family.id ===
                    activeFamilyId;

                  return (
                    <button
                      key={
                        family.id
                      }
                      type="button"
                      onPointerEnter={
                        () =>
                          activateCompactFamily(
                            family.id,
                          )
                      }
                      onFocus={
                        () =>
                          activateCompactFamily(
                            family.id,
                          )
                      }
                      onClick={
                        () =>
                          activateCompactFamily(
                            family.id,
                          )
                      }
                      aria-label={
                        `Show ${family.label}`
                      }
                      aria-pressed={
                        isActive
                      }
                      className={[
                        'group',
                        'flex',
                        'min-w-0',
                        'flex-col',
                        'items-center',
                        'gap-2',
                        'border-0',
                        'bg-transparent',
                        'p-0',
                        'outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-offset-4',
                        'focus-visible:ring-offset-background',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'grid',
                          'h-14',
                          'w-14',
                          'place-items-center',
                          'border',
                          'transition-[transform,border-color,background-color,box-shadow,color,opacity]',
                          'duration-200',
                          'group-active:scale-95',

                          isActive
                            ? ''
                            : [
                                'border-border/55',
                                'bg-background/20',
                                'text-muted-foreground/45',
                                'dark:border-white/[0.10]',
                                'dark:bg-white/[0.015]',
                                'dark:text-white/30',
                              ].join(' '),
                        ].join(' ')}
                        style={
                          isActive
                            ? {
                                color:
                                  familyAccent.solid,

                                borderColor:
                                  familyAccent.solid,

                                background:
                                  familyAccent.soft,

                                boxShadow: [
                                  `0 0 0 1px ${familyAccent.soft}`,
                                  `0 8px 22px ${familyAccent.lightShadow}`,
                                ].join(', '),
                              }
                            : undefined
                        }
                      >
                        <CapabilityFamilyIcon
                          familyId={
                            family.id
                          }
                          className="h-6 w-6"
                        />
                      </span>

                      <span
                        className={[
                          'max-w-[6.5rem]',
                          'text-center',
                          'text-[0.68rem]',
                          'font-medium',
                          'leading-4',
                          'transition-[color,opacity]',
                          'duration-200',

                          isActive
                            ? 'text-foreground'
                            : [
                                'text-muted-foreground/55',
                                'dark:text-white/38',
                              ].join(' '),
                        ].join(' ')}
                      >
                        {
                          family.label
                        }
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <article
              className={[
                'relative',
                'overflow-hidden',
                'border',
                'bg-background/94',
                'p-5',
                'shadow-sm',
                'backdrop-blur-xl',
                'sm:p-6',
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
                  'transparent 28%',
                  ')',
                ].join(' '),
              }}
            >
              <div
                className={[
                  'flex',
                  'items-start',
                  'gap-3',
                ].join(' ')}
              >
                <span
                  className={[
                    'grid',
                    'h-11',
                    'w-11',
                    'shrink-0',
                    'place-items-center',
                    'border',
                    'bg-background/50',
                  ].join(' ')}
                  style={{
                    color:
                      accent.solid,

                    borderColor:
                      `${accent.solid}66`,

                    boxShadow:
                      `0 6px 18px ${accent.lightShadow}`,
                  }}
                >
                  <CapabilityFamilyIcon
                    familyId={
                      activeFamily.id
                    }
                    className="h-5 w-5"
                  />
                </span>

                <div
                  className="min-w-0"
                >
                  <h3
                    className={[
                      'text-xl',
                      'font-semibold',
                      'leading-tight',
                      'tracking-tight',
                    ].join(' ')}
                  >
                    {
                      activeFamily.label
                    }
                  </h3>

                  {activeFamily.metric ? (
                    <p
                      className={[
                        'mt-1.5',
                        'text-[0.68rem]',
                        'font-semibold',
                        'uppercase',
                        'tracking-[0.18em]',
                      ].join(' ')}
                      style={{
                        color:
                          accent.solid,
                      }}
                    >
                      {
                        activeFamily.metric
                          .value
                      }
                      {
                        activeFamily.metric
                          .suffix
                      }
                      {' '}
                      {
                        activeFamily.metric
                          .label
                      }
                    </p>
                  ) : (
                    <p
                      className={[
                        'mt-1.5',
                        'text-[0.68rem]',
                        'font-semibold',
                        'uppercase',
                        'tracking-[0.18em]',
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
              </div>

              <p
                className={[
                  'mt-4',
                  'text-sm',
                  'leading-6',
                  'text-muted-foreground',
                ].join(' ')}
              >
                {
                  activeFamily.description
                }
              </p>

              {activeProject && (
                <div
                  className={[
                    'mt-5',
                    'border-t',
                    'border-border/60',
                    'pt-4',
                  ].join(' ')}
                >
                  <p
                    className={[
                      'text-[0.65rem]',
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

                  <Link
                    href={
                      activeProject.href ??
                      '/articles'
                    }
                    aria-label={
                      `Read ${activeProject.title}`
                    }
                    className={[
                      'mt-3',
                      'flex',
                      'items-start',
                      'gap-3',
                      'outline-none',
                      'transition-[opacity,transform]',
                      'duration-200',
                      'hover:opacity-80',
                      'active:scale-[0.99]',
                      'focus-visible:ring-2',
                      'focus-visible:ring-ring',
                      'focus-visible:ring-offset-2',
                      'focus-visible:ring-offset-background',
                    ].join(' ')}
                  >
                    {activeProject.thumbnail && (
                      <div
                        className={[
                          'h-16',
                          'w-20',
                          'shrink-0',
                          'overflow-hidden',
                          'border',
                          'bg-muted',
                        ].join(' ')}
                        style={{
                          borderColor:
                            `${accent.solid}66`,
                        }}
                      >
                        <img
                          src={
                            activeProject.thumbnail
                          }
                          alt={
                            `${activeProject.title} article thumbnail`
                          }
                          className={[
                            'h-full',
                            'w-full',
                            'object-cover',
                          ].join(' ')}
                        />
                      </div>
                    )}

                    <div
                      className="min-w-0"
                    >
                      <h4
                        className={[
                          'text-sm',
                          'font-semibold',
                        ].join(' ')}
                      >
                        {
                          activeProject.title
                        }
                      </h4>

                      <p
                        className={[
                          'mt-1',
                          'text-xs',
                          'leading-5',
                          'text-muted-foreground',
                        ].join(' ')}
                      >
                        {
                          activeProject.description
                        }
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              <div
                className={[
                  'mt-5',
                  'flex',
                  'justify-end',
                ].join(' ')}
              >
                <Link
                  href={
                    activeProject?.href ??
                    '/articles'
                  }
                  className={[
                    'inline-flex',
                    'min-h-11',
                    'items-center',
                    'gap-1.5',
                    'px-2',
                    'text-sm',
                    'font-medium',
                    'transition-opacity',
                    'hover:opacity-70',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-background',
                  ].join(' ')}
                  style={{
                    color:
                      accent.solid,
                  }}
                >
                  Explore More

                  <ArrowUpRight
                    className="h-4 w-4"
                  />
                </Link>
              </div>
            </article>
          </div>
        )}

        {isDesktop && (
          <div
            className={[
              'grid',
              'items-stretch',
              'gap-5',
              'transition-[grid-template-columns]',
              'duration-500',
              layoutColumns,
            ].join(' ')}
          >
            <div
              className={[
                'relative',
                'h-[400px]',
                'min-h-[400px]',
                'w-full',
                'overflow-hidden',
              ].join(' ')}
            >
              <CapabilityCanvas
                selectedNodeId={
                  selectedNodeId
                }
                activeFamilyId={
                  activeFamilyId
                }
                onNodeClick={
                  handleNodeClick
                }
                onNodeHover={
                  handleCanvasHover
                }
              />
            </div>

            {isPanelOpen && (
              <div
                className="h-[400px]"
                onPointerEnter={
                  handlePanelPointerEnter
                }
                onPointerLeave={
                  handlePanelPointerLeave
                }
              >
                <CapabilityPanel
                  family={
                    activeFamily
                  }
                  familyIndex={
                    activeFamilyIndex
                  }
                  familyCount={
                    capabilityFamilies.length
                  }
                  isPinned={
                    isPinned
                  }
                  onPrevious={
                    handlePreviousFamily
                  }
                  onNext={
                    handleNextFamily
                  }
                  onTogglePin={
                    handleTogglePin
                  }
                  onMinimize={
                    handleMinimize
                  }
                  onClose={
                    handleClose
                  }
                />
              </div>
            )}

            {panelState ===
              'collapsed' && (
              <aside
                className={[
                  'relative',
                  'flex',
                  'h-[400px]',
                  'min-h-[400px]',
                  'flex-col',
                  'items-center',
                  'justify-between',
                  'border',
                  'bg-card/75',
                  'py-4',
                  'backdrop-blur-xl',
                ].join(' ')}
                style={{
                  borderColor:
                    `${accent.solid}55`,

                  boxShadow: [
                    `0 0 14px ${accent.soft}`,
                    `0 0 30px ${accent.lightShadow}`,
                  ].join(', '),
                }}
              >
                <button
                  type="button"
                  onClick={
                    handleRailClick
                  }
                  aria-label="Open capability details"
                  className={[
                    'border-0',
                    'bg-transparent',
                    'p-0',
                    'outline-none',
                    'transition-transform',
                    'hover:scale-105',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid',
                      'h-8',
                      'w-8',
                      'place-items-center',
                    ].join(' ')}
                    style={{
                      color:
                        accent.solid,
                    }}
                  >
                    <CapabilityFamilyIcon
                      familyId={
                        activeFamily.id
                      }
                      className="h-5 w-5"
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    handleRailClick
                  }
                  aria-label={
                    `Open ${activeFamily.label} capability details`
                  }
                  className={[
                    '[writing-mode:vertical-rl]',
                    'rotate-180',
                    'border-0',
                    'bg-transparent',
                    'px-1',
                    'text-[0.66rem]',
                    'font-semibold',
                    'uppercase',
                    'tracking-[0.2em]',
                    'outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                  style={{
                    color:
                      accent.solid,
                  }}
                >
                  {
                    activeFamily.label
                  }
                </button>

                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  aria-label="Close capability details"
                  className={[
                    'grid',
                    'h-9',
                    'w-9',
                    'place-items-center',
                    'border',
                    'border-border/60',
                    'bg-background/20',
                    'text-muted-foreground',
                    'outline-none',
                    'transition-colors',
                    'hover:text-foreground',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <X
                    className="h-4 w-4"
                  />
                </button>
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  );
}