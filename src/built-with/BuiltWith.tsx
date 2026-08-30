import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import ToolCard from './ToolCard';
import ToolDialog from './ToolDialog';
import { toolData } from './toolData';
import type { Tool } from './types';

const toolOrder = [
  'arcgis-pro',
  'qgis',
  'postgresql-postgis',
  'machine-learning',
  'python',
  'jupyter',
  'power-bi',
  'microsoft-365',
  'librepcb',
  'github',
  'vs-code',
];

export default function BuiltWith() {
  const orderedTools = useMemo(() => {
    const orderMap = new Map(
      toolOrder.map((id, index) => [
        id,
        index,
      ]),
    );

    return toolData
      .filter(
        (tool) =>
          tool.featured,
      )
      .sort(
        (
          a,
          b,
        ) => {
          const aOrder =
            orderMap.get(a.id) ??
            Number.MAX_SAFE_INTEGER;

          const bOrder =
            orderMap.get(b.id) ??
            Number.MAX_SAFE_INTEGER;

          return (
            aOrder -
            bOrder
          );
        },
      );
  }, []);

  const [
    activeToolId,
    setActiveToolId,
  ] = useState(
    orderedTools[0]?.id ??
      '',
  );

  const [
    selectedTool,
    setSelectedTool,
  ] =
    useState<Tool | null>(
      null,
    );

  const [
    canScrollLeft,
    setCanScrollLeft,
  ] =
    useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] =
    useState(false);

  const carouselRef =
    useRef<HTMLDivElement>(
      null,
    );

  /*
   * Stores a reference to every carousel item so the
   * active card can be located and brought fully into view.
   */
  const toolItemRefs =
    useRef(
      new Map<
        string,
        HTMLDivElement
      >(),
    );

  /*
   * Holds the delayed visibility correction that runs
   * after the active card finishes expanding.
   */
  const revealTimeoutRef =
    useRef<
      number | null
    >(
      null,
    );

  /*
   * Determines whether the first and last cards are fully
   * visible, then enables or disables the navigation arrows.
   */
  const updateNavigationState =
    useCallback(
      () => {
        const carousel =
          carouselRef.current;

        if (!carousel) {
          return;
        }

        const items =
          Array.from(
            carousel.querySelectorAll<HTMLElement>(
              '[data-carousel-item]',
            ),
          );

        if (
          items.length === 0
        ) {
          setCanScrollLeft(
            false,
          );

          setCanScrollRight(
            false,
          );

          return;
        }

        const carouselRect =
          carousel.getBoundingClientRect();

        const firstItemRect =
          items[
            0
          ].getBoundingClientRect();

        const lastItemRect =
          items[
            items.length -
              1
          ].getBoundingClientRect();

        const tolerance =
          12;

        const firstCardIsAtStart =
          firstItemRect.left >=
          carouselRect.left -
            tolerance;

        const lastCardIsAtEnd =
          lastItemRect.right <=
          carouselRect.right +
            tolerance;

        setCanScrollLeft(
          !firstCardIsAtStart,
        );

        setCanScrollRight(
          !lastCardIsAtEnd,
        );
      },
      [],
    );

  /*
   * Ensures the active card is completely visible inside
   * the carousel after it expands.
   *
   * The carousel moves only when part of the active card
   * is clipped by the left or right edge.
   */
  const ensureToolIsFullyVisible =
    useCallback(
      (
        toolId: string,
      ) => {
        const carousel =
          carouselRef.current;

        const toolItem =
          toolItemRefs.current.get(
            toolId,
          );

        if (
          !carousel ||
          !toolItem
        ) {
          return;
        }

        const carouselRect =
          carousel.getBoundingClientRect();

        const toolRect =
          toolItem.getBoundingClientRect();

        /*
         * Adds a little breathing room so the expanded card
         * does not sit directly against the carousel edge.
         */
        const safePadding =
          20;

        const visibleLeftBoundary =
          carouselRect.left +
          safePadding;

        const visibleRightBoundary =
          carouselRect.right -
          safePadding;

        let horizontalAdjustment =
          0;

        if (
          toolRect.left <
          visibleLeftBoundary
        ) {
          horizontalAdjustment =
            toolRect.left -
            visibleLeftBoundary;
        } else if (
          toolRect.right >
          visibleRightBoundary
        ) {
          horizontalAdjustment =
            toolRect.right -
            visibleRightBoundary;
        }

        if (
          Math.abs(
            horizontalAdjustment,
          ) < 1
        ) {
          updateNavigationState();

          return;
        }

        carousel.scrollBy({
          left:
            horizontalAdjustment,
          behavior:
            'smooth',
        });
      },
      [
        updateNavigationState,
      ],
    );

  /*
   * Sets up initial arrow states and updates them when
   * the carousel or its card widths change.
   */
  useEffect(() => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstFrame =
      window.requestAnimationFrame(
        updateNavigationState,
      );

    const resizeObserver =
      new ResizeObserver(
        () => {
          updateNavigationState();
        },
      );

    resizeObserver.observe(
      carousel,
    );

    Array.from(
      carousel.children,
    ).forEach(
      (
        child,
      ) => {
        resizeObserver.observe(
          child,
        );
      },
    );

    window.addEventListener(
      'resize',
      updateNavigationState,
    );

    return () => {
      window.cancelAnimationFrame(
        firstFrame,
      );

      resizeObserver.disconnect();

      window.removeEventListener(
        'resize',
        updateNavigationState,
      );
    };
  }, [
    updateNavigationState,
  ]);

  /*
   * Rechecks navigation after the active card changes
   * width and height.
   */
  useEffect(() => {
    let secondFrame =
      0;

    const firstFrame =
      window.requestAnimationFrame(
        () => {
          updateNavigationState();

          secondFrame =
            window.requestAnimationFrame(
              updateNavigationState,
            );
        },
      );

    return () => {
      window.cancelAnimationFrame(
        firstFrame,
      );

      window.cancelAnimationFrame(
        secondFrame,
      );
    };
  }, [
    activeToolId,
    updateNavigationState,
  ]);

  /*
   * Clears any pending delayed visibility correction
   * when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (
        revealTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          revealTimeoutRef.current,
        );
      }
    };
  }, []);

  /*
   * Activates the hovered or focused card and makes sure
   * its expanded state becomes fully visible.
   */
  const activateTool = (
    tool: Tool,
  ) => {
    setActiveToolId(
      tool.id,
    );

    if (
      revealTimeoutRef.current !==
      null
    ) {
      window.clearTimeout(
        revealTimeoutRef.current,
      );
    }

    /*
     * First visibility check after React begins applying
     * the active state.
     */
    window.requestAnimationFrame(
      () => {
        ensureToolIsFullyVisible(
          tool.id,
        );
      },
    );

    /*
     * The card width transition lasts 300ms.
     * Recheck after expansion completes.
     */
    revealTimeoutRef.current =
      window.setTimeout(
        () => {
          ensureToolIsFullyVisible(
            tool.id,
          );

          updateNavigationState();

          revealTimeoutRef.current =
            null;
        },
        330,
      );
  };

  /*
   * Moves the carousel one adjacent card at a time when
   * the left or right navigation button is clicked.
   */
  const scrollToAdjacentCard =
    (
      direction:
        | 'left'
        | 'right',
    ) => {
      const carousel =
        carouselRef.current;

      if (!carousel) {
        return;
      }

      if (
        direction ===
          'left' &&
        !canScrollLeft
      ) {
        return;
      }

      if (
        direction ===
          'right' &&
        !canScrollRight
      ) {
        return;
      }

      const items =
        Array.from(
          carousel.querySelectorAll<HTMLElement>(
            '[data-carousel-item]',
          ),
        );

      if (
        items.length === 0
      ) {
        return;
      }

      const carouselRect =
        carousel.getBoundingClientRect();

      const tolerance =
        12;

      if (
        direction ===
        'right'
      ) {
        const nextItem =
          items.find(
            (
              item,
            ) => {
              const itemRect =
                item.getBoundingClientRect();

              return (
                itemRect.left >
                carouselRect.left +
                  tolerance
              );
            },
          );

        const target =
          nextItem ??
          items[
            items.length -
              1
          ];

        const firstOffset =
          items[
            0
          ].offsetLeft;

        carousel.scrollTo({
          left:
            target.offsetLeft -
            firstOffset,

          behavior:
            'smooth',
        });

        return;
      }

      const previousItem =
        [
          ...items,
        ]
          .reverse()
          .find(
            (
              item,
            ) => {
              const itemRect =
                item.getBoundingClientRect();

              return (
                itemRect.left <
                carouselRect.left -
                  tolerance
              );
            },
          );

      const target =
        previousItem ??
        items[0];

      const firstOffset =
        items[
          0
        ].offsetLeft;

      carousel.scrollTo({
        left:
          Math.max(
            0,
            target.offsetLeft -
              firstOffset,
          ),

        behavior:
          'smooth',
      });
    };

  /*
   * Supports keyboard navigation after the carousel
   * receives focus.
   */
  const handleKeyboard =
    (
      event:
        KeyboardEvent<HTMLDivElement>,
    ) => {
      if (
        event.key ===
        'ArrowLeft'
      ) {
        event.preventDefault();

        scrollToAdjacentCard(
          'left',
        );
      }

      if (
        event.key ===
        'ArrowRight'
      ) {
        event.preventDefault();

        scrollToAdjacentCard(
          'right',
        );
      }
    };

  return (
    <section
      className={[
        'w-full',
        'bg-background',
        'py-14',
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
        {/* Section heading */}
        <div
          className={[
            'mb-8',
            'max-w-2xl',
          ].join(' ')}
        >
          <h2
            className={[
              'text-3xl',
              'font-bold',
              'tracking-tight',
              'sm:text-4xl',
            ].join(' ')}
          >
            Built With
          </h2>

          <p
            className={[
              'mt-4',
              'text-base',
              'leading-7',
              'text-muted-foreground',
              'sm:text-lg',
            ].join(' ')}
          >
            The platforms, languages, and technologies
            I rely on to build geospatial, analytics,
            and AI-enabled solutions.
          </p>
        </div>

        <div className="relative">
          {/* Left navigation button */}
          <button
            type="button"
            disabled={
              !canScrollLeft
            }
            onClick={
              () =>
                scrollToAdjacentCard(
                  'left',
                )
            }
            className={[
              'absolute',
              'left-0',
              'top-1/2',
              'z-20',
              'inline-flex',
              'h-11',
              'w-11',
              '-translate-x-1/2',
              '-translate-y-1/2',
              'items-center',
              'justify-center',
              'rounded-full',
              'border',
              'border-border',
              'bg-background',
              'text-muted-foreground',
              'shadow-sm',
              'transition-[border-color,color,opacity]',
              'hover:border-accent',
              'hover:text-accent',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-ring',
              'disabled:pointer-events-none',
              'disabled:border-border/30',
              'disabled:text-muted-foreground/20',
              'disabled:opacity-25',
              'max-sm:left-2',
              'max-sm:translate-x-0',
            ].join(' ')}
            aria-label="Scroll Built With cards left"
          >
            <ChevronLeft
              className="h-5 w-5"
            />
          </button>

          {/* Horizontally scrollable card row */}
          <div
            ref={
              carouselRef
            }
            tabIndex={0}
            onScroll={
              updateNavigationState
            }
            onKeyDown={
              handleKeyboard
            }
            className={[
              'flex',
              'min-h-[398px]',
              'snap-x',
              'snap-mandatory',
              'items-center',
              'gap-4',
              'overflow-x-auto',
              'px-1',
              'py-3',
              '[scrollbar-width:none]',
              '[&::-webkit-scrollbar]:hidden',
            ].join(' ')}
            aria-label="Built With technology carousel"
          >
            {orderedTools.map(
              (
                tool,
              ) => (
                <div
                  key={
                    tool.id
                  }
                  ref={
                    (
                      element,
                    ) => {
                      if (
                        element
                      ) {
                        toolItemRefs.current.set(
                          tool.id,
                          element,
                        );
                      } else {
                        toolItemRefs.current.delete(
                          tool.id,
                        );
                      }
                    }
                  }
                  data-carousel-item
                  className={[
                    'flex',
                    'shrink-0',
                    'snap-start',
                    'items-center',
                  ].join(' ')}
                >
                  <ToolCard
                    tool={
                      tool
                    }
                    active={
                      tool.id ===
                      activeToolId
                    }
                    onActivate={
                      activateTool
                    }
                    onClick={
                      setSelectedTool
                    }
                  />
                </div>
              ),
            )}
          </div>

          {/* Right navigation button */}
          <button
            type="button"
            disabled={
              !canScrollRight
            }
            onClick={
              () =>
                scrollToAdjacentCard(
                  'right',
                )
            }
            className={[
              'absolute',
              'right-0',
              'top-1/2',
              'z-20',
              'inline-flex',
              'h-11',
              'w-11',
              'translate-x-1/2',
              '-translate-y-1/2',
              'items-center',
              'justify-center',
              'rounded-full',
              'border',
              'border-border',
              'bg-background',
              'text-muted-foreground',
              'shadow-sm',
              'transition-[border-color,color,opacity]',
              'hover:border-accent',
              'hover:text-accent',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-ring',
              'disabled:pointer-events-none',
              'disabled:border-border/30',
              'disabled:text-muted-foreground/20',
              'disabled:opacity-25',
              'max-sm:right-2',
              'max-sm:translate-x-0',
            ].join(' ')}
            aria-label="Scroll Built With cards right"
          >
            <ChevronRight
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* Supporting interaction hint */}
        <p
          className={[
            'mt-1',
            'text-center',
            'text-[0.7rem]',
            'tracking-wide',
            'text-muted-foreground/60',
          ].join(' ')}
        >
          Swipe or scroll horizontally to explore all tools
        </p>

        {/* Existing tool details popup */}
        <ToolDialog
          tool={
            selectedTool
          }
          open={
            selectedTool !==
            null
          }
          onClose={
            () =>
              setSelectedTool(
                null,
              )
          }
        />
      </div>
    </section>
  );
}