import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import CapabilityCanvas from
  './CapabilityCanvas';

import CapabilityPanel from
  './CapabilityPanel';

import CapabilityOrb from
  './CapabilityOrb';

import {
  capabilityFamilies,
} from './capabilityData';

import {
  capabilityAccentStyles,
} from './accentStyles';

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

export default function CoreCapabilities() {
  const collapseTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  /*
   * Pointer refs are the authoritative
   * interaction state.
   *
   * We also keep React state where useful,
   * but refs prevent stale values during
   * rapid mount/unmount transitions.
   */
  const pointerInCloudRef =
    useRef(false);

  const pointerInPanelRef =
    useRef(false);

  const [
    selectedNodeId,
    setSelectedNodeId,
  ] = useState<string | null>(
    null,
  );

  const [
    selectedFamilyId,
    setSelectedFamilyId,
  ] =
    useState<CapabilityFamilyId | null>(
      null,
    );

  const [
    panelFamilyId,
    setPanelFamilyId,
  ] =
    useState<CapabilityFamilyId>(
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
          (family) =>
            family.id ===
            panelFamilyId,
        ),
      [panelFamilyId],
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
        setTimeout(() => {
          /*
           * Re-check actual pointer state
           * when the timer fires.
           *
           * This prevents a delayed timer
           * collapsing the panel after the
           * visitor has already moved back in.
           */
          if (
            pointerInCloudRef.current ||
            pointerInPanelRef.current
          ) {
            collapseTimerRef.current =
              null;

            return;
          }

          setPanelState(
            (current) =>
              current ===
              'temporary'
                ? 'collapsed'
                : current,
          );

          collapseTimerRef.current =
            null;
        }, COLLAPSE_DELAY);
    }, [clearCollapseTimer]);

  function handleCanvasHover(
    nodeId: string | null,
    familyId:
      CapabilityFamilyId | null,
  ) {
    if (
      nodeId &&
      familyId
    ) {
      /*
       * Pointer is actively over a cloud word.
       */
      pointerInCloudRef.current =
        true;

      clearCollapseTimer();

      setPanelFamilyId(
        familyId,
      );

      /*
       * Hover previews the relevant family.
       *
       * A pinned panel stays pinned.
       * Any other state becomes temporary-open,
       * including the previously CLOSED state.
       */
      setPanelState(
        (current) =>
          current ===
          'pinned'
            ? 'pinned'
            : 'temporary',
      );

      return;
    }

    /*
     * Pointer has left all interactive
     * cloud words.
     */
    pointerInCloudRef.current =
      false;

    /*
     * If the visitor has moved directly
     * into the panel, do not collapse.
     */
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

    setSelectedNodeId(
      nodeId,
    );

    setSelectedFamilyId(
      familyId,
    );

    setPanelFamilyId(
      familyId,
    );

    setPanelState(
      (current) =>
        current ===
        'pinned'
          ? 'pinned'
          : 'temporary',
    );
  }

  function selectFamilyByIndex(
    nextIndex: number,
  ) {
    clearCollapseTimer();

    const count =
      capabilityFamilies.length;

    const wrappedIndex =
      ((nextIndex % count) +
        count) %
      count;

    const family =
      capabilityFamilies[
        wrappedIndex
      ];

    setPanelFamilyId(
      family.id,
    );

    setSelectedFamilyId(
      family.id,
    );

    setSelectedNodeId(
      family.id,
    );

    setPanelState(
      (current) =>
        current ===
        'pinned'
          ? 'pinned'
          : 'temporary',
    );
  }

  function handlePreviousFamily() {
    selectFamilyByIndex(
      activeFamilyIndex - 1,
    );
  }

  function handleNextFamily() {
    selectFamilyByIndex(
      activeFamilyIndex + 1,
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
      (current) => {
        if (
          current ===
          'pinned'
        ) {
          /*
           * Returning from pinned to
           * temporary mode.
           */
          if (
            !pointerInCloudRef.current &&
            !pointerInPanelRef.current
          ) {
            /*
             * Schedule after this state
             * transition has completed.
             */
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

    /*
     * IMPORTANT:
     *
     * The open panel is about to disappear.
     * PointerLeave may therefore never fire.
     *
     * Reset panel-presence explicitly.
     */
    pointerInPanelRef.current =
      false;

    setPanelState(
      'collapsed',
    );
  }

  function handleClose() {
    clearCollapseTimer();

    /*
     * CRITICAL BUG FIX:
     *
     * Clicking X destroys the panel while the
     * pointer is still physically over it.
     *
     * The browser may never send pointerleave
     * for the element that just unmounted.
     *
     * Therefore we explicitly clear its
     * presence state here.
     */
    pointerInPanelRef.current =
      false;

    setPanelState(
      'closed',
    );

    setSelectedNodeId(
      null,
    );

    setSelectedFamilyId(
      null,
    );
  }

  function handleRailClick() {
    clearCollapseTimer();

    /*
     * Explicit manual opening.
     *
     * Hovering the rail still does nothing.
     */
    pointerInPanelRef.current =
      false;

    setPanelState(
      'temporary',
    );
  }

  const layoutColumns =
    isPanelOpen
      ? 'lg:grid-cols-[minmax(0,1fr)_340px]'
      : panelState ===
          'collapsed'
        ? 'lg:grid-cols-[minmax(0,1fr)_64px]'
        : 'grid-cols-1';

  return (
    <section
      aria-labelledby="core-capabilities-title"
      className="w-full py-10"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h2
            id="core-capabilities-title"
            className="text-3xl font-bold sm:text-4xl"
          >
            Core Capabilities
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore the technologies,
            methods, and technical
            disciplines that shape my work.
          </p>
        </div>

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
              selectedFamilyId={
                selectedFamilyId
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
                'hidden',
                'h-[400px]',
                'min-h-[400px]',
                'lg:flex',
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
                  'focus-visible:ring-offset-2',
                ].join(' ')}
              >
                <CapabilityOrb
                  accent={
                    activeFamily.accent
                  }
                  size={32}
                />
              </button>

              <button
                type="button"
                onClick={
                  handleRailClick
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
                  'transition-colors',
                  'hover:text-foreground',
                ].join(' ')}
              >
                <X
                  className="h-4 w-4"
                />
              </button>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}