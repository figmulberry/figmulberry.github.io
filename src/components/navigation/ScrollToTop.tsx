import {
  useLayoutEffect,
  useRef,
} from 'react';

import {
  useLocation,
} from 'wouter';

type ScrollHistoryState = {
  [key: string]: unknown;

  __siteScrollX?: number;
  __siteScrollY?: number;
};

function saveCurrentHistoryPosition() {
  const currentState =
    (
      window.history.state &&
      typeof window.history.state ===
        'object'
    )
      ? window.history.state
      : {};

  const nextState: ScrollHistoryState = {
    ...currentState,

    __siteScrollX:
      window.scrollX,

    __siteScrollY:
      window.scrollY,
  };

  window.history.replaceState(
    nextState,
    '',
    window.location.href,
  );
}

function readHistoryPosition(
  state: unknown,
): {
  x: number;
  y: number;
} | null {
  if (
    !state ||
    typeof state !== 'object'
  ) {
    return null;
  }

  const historyState =
    state as ScrollHistoryState;

  if (
    typeof historyState.__siteScrollX !==
      'number' ||
    typeof historyState.__siteScrollY !==
      'number'
  ) {
    return null;
  }

  return {
    x:
      historyState.__siteScrollX,

    y:
      historyState.__siteScrollY,
  };
}

export function ScrollToTop() {
  const [location] =
    useLocation();

  const pendingHistoryPosition =
    useRef<{
      x: number;
      y: number;
    } | null>(null);

  const historyNavigation =
    useRef(false);

  /*
   * Browser scroll restoration is disabled
   * because this component manages SPA
   * restoration explicitly.
   */
  useLayoutEffect(() => {
    window.history.scrollRestoration =
      'manual';

    /*
     * Give the current history entry an
     * initial scroll position immediately.
     */
    saveCurrentHistoryPosition();

    /*
     * Save the current entry continuously
     * while the visitor scrolls.
     */
    /*
     * Save the current entry immediately before
     * an internal link navigation creates a new
     * browser-history entry.
     *
     * Scroll position is intentionally NOT written
     * continuously during scrolling. Frequent
     * history.replaceState calls can trigger browser
     * navigation throttling.
     */
    const handleDocumentClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target;

      if (
        !(target instanceof Element)
      ) {
        return;
      }

      const anchor =
        target.closest('a');

      if (!anchor) {
        return;
      }

      const href =
        anchor.getAttribute(
          'href',
        );

      if (
        !href ||
        href.startsWith('#') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      saveCurrentHistoryPosition();
    };

    /*
     * Back / Forward.
     *
     * Capture the scroll coordinates stored
     * in the destination history entry.
     */
    const handlePopState = (
      event: PopStateEvent,
    ) => {
      historyNavigation.current =
        true;

      pendingHistoryPosition.current =
        readHistoryPosition(
          event.state,
        );
    };

    document.addEventListener(
      'click',
      handleDocumentClick,
      true,
    );

    /*
     * Capture phase is intentional.
     * We want this information before the
     * SPA router completes its reaction to
     * the popstate event.
     */
    window.addEventListener(
      'popstate',
      handlePopState,
      true,
    );

    window.addEventListener(
      'pagehide',
      saveCurrentHistoryPosition,
    );

    return () => {

      document.removeEventListener(
        'click',
        handleDocumentClick,
        true,
      );

      window.removeEventListener(
        'popstate',
        handlePopState,
        true,
      );

      window.removeEventListener(
        'pagehide',
        saveCurrentHistoryPosition,
      );
};
  }, []);

  /*
   * Respond after Wouter has rendered the
   * destination route.
   */
  useLayoutEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    const restore =
      () => {
        /*
         * --------------------------------------------------
         * BACK / FORWARD NAVIGATION
         * --------------------------------------------------
         */

        if (
          historyNavigation.current
        ) {
          const savedPosition =
            pendingHistoryPosition.current;

          historyNavigation.current =
            false;

          pendingHistoryPosition.current =
            null;

          if (savedPosition) {
            window.scrollTo({
              left:
                savedPosition.x,

              top:
                savedPosition.y,

              behavior:
                'auto',
            });

            return;
          }
        }

        /*
         * --------------------------------------------------
         * HASH / ANCHOR NAVIGATION
         * --------------------------------------------------
         */

        if (
          window.location.hash
        ) {
          const elementId =
            decodeURIComponent(
              window.location.hash.slice(
                1,
              ),
            );

          const target =
            document.getElementById(
              elementId,
            );

          if (target) {
            target.scrollIntoView({
              block:
                'start',

              behavior:
                'auto',
            });

            return;
          }
        }

        /*
         * --------------------------------------------------
         * NORMAL NEW NAVIGATION
         * --------------------------------------------------
         *
         * A normal Link click should open
         * the destination at the top.
         */

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto',
        });

        /*
         * The destination entry now starts
         * at zero, so save that into its
         * own history state.
         */
        saveCurrentHistoryPosition();
      };

    /*
     * Two animation frames allow the newly
     * selected SPA route to commit its DOM
     * before restoration is attempted.
     */
    firstFrame =
      window.requestAnimationFrame(
        () => {
          secondFrame =
            window.requestAnimationFrame(
              restore,
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
  }, [location]);

  return null;
}