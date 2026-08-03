import React, {
  useEffect,
  useState,
} from 'react';
import { ArrowUp } from 'lucide-react';

const visibilityThreshold = 640;

export function BackToTop() {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateVisibility = () => {
      setVisible(
        window.scrollY >
          visibilityThreshold,
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      animationFrame =
        window.requestAnimationFrame(
          updateVisibility,
        );
    };

    updateVisibility();

    window.addEventListener(
      'scroll',
      scheduleUpdate,
      {
        passive: true,
      },
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      window.removeEventListener(
        'scroll',
        scheduleUpdate,
      );
    };
  }, []);

  const returnToTop = () => {
    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? 'auto'
        : 'smooth',
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={returnToTop}
      aria-label="Back to top"
      title="Back to top"
      className={[
        'fixed bottom-5 right-5 z-40',
        'inline-flex h-11 w-11',
        'items-center justify-center',
        'rounded-sm',
        'border border-border',
        'bg-background/95',
        'text-foreground',
        'shadow-md backdrop-blur',
        'transition-colors',
        'hover:border-accent',
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-accent',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
      ].join(' ')}
    >
      <ArrowUp
        className="h-5 w-5"
        aria-hidden="true"
      />
    </button>
  );
}