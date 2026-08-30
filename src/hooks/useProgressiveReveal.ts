import {
  useEffect,
  useMemo,
  useState,
} from 'react';

type ProgressiveRevealOptions = {
  initialCount: number;
  increment: number;
};

export function useProgressiveReveal<T>(
  items: readonly T[],
  {
    initialCount,
    increment,
  }: ProgressiveRevealOptions,
) {
  const [
    visibleCount,
    setVisibleCount,
  ] = useState(initialCount);

  useEffect(
    () => {
      setVisibleCount(
        initialCount,
      );
    },
    [
      items,
      initialCount,
    ],
  );

  const visibleItems =
    useMemo(
      () =>
        items.slice(
          0,
          visibleCount,
        ),
      [
        items,
        visibleCount,
      ],
    );

  const totalCount =
    items.length;

  const canLoadMore =
    visibleCount < totalCount;

  const remainingCount =
    Math.max(
      totalCount - visibleCount,
      0,
    );

  const loadMore = () => {
    setVisibleCount(
      (current) =>
        Math.min(
          current + increment,
          totalCount,
        ),
    );
  };

  return {
    visibleItems,
    visibleCount:
      Math.min(
        visibleCount,
        totalCount,
      ),
    totalCount,
    remainingCount,
    canLoadMore,
    loadMore,
  };
}