import {
  useEffect,
  useState,
} from 'react';

export function useActiveHeading(
  headingIds: readonly string[],
  topOffset = 144,
): string | undefined {
  const [activeId, setActiveId] =
    useState<string>();

  useEffect(() => {
    if (headingIds.length === 0) {
      setActiveId(undefined);
      return;
    }

    let animationFrame = 0;

    const updateActiveHeading = () => {
      const headings = headingIds
        .map((id) =>
          document.getElementById(id),
        )
        .filter(
          (
            heading,
          ): heading is HTMLElement =>
            heading !== null,
        );

      if (headings.length === 0) {
        setActiveId(undefined);
        return;
      }

      const pageBottom =
        window.innerHeight +
        window.scrollY >=
        document.documentElement.scrollHeight -
          12;

      if (pageBottom) {
        setActiveId(
          headings[headings.length - 1].id,
        );
        return;
      }

      let current = headings[0].id;

      for (const heading of headings) {
        const headingTop =
          heading.getBoundingClientRect().top;

        if (headingTop <= topOffset) {
          current = heading.id;
        } else {
          break;
        }
      }

      setActiveId(current);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      animationFrame =
        window.requestAnimationFrame(
          updateActiveHeading,
        );
    };

    updateActiveHeading();

    window.addEventListener(
      'scroll',
      scheduleUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      'resize',
      scheduleUpdate,
    );

    window.addEventListener(
      'hashchange',
      scheduleUpdate,
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      window.removeEventListener(
        'scroll',
        scheduleUpdate,
      );

      window.removeEventListener(
        'resize',
        scheduleUpdate,
      );

      window.removeEventListener(
        'hashchange',
        scheduleUpdate,
      );
    };
  }, [
    headingIds,
    topOffset,
  ]);

  return activeId;
}