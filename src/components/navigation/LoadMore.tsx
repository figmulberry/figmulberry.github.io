import React from 'react';

type LoadMoreProps = {
  visibleCount: number;
  totalCount: number;
  remainingCount: number;
  onLoadMore: () => void;
  label?: string;
};

export function LoadMore({
  visibleCount,
  totalCount,
  remainingCount,
  onLoadMore,
  label = 'Load more',
}: LoadMoreProps) {
  if (
    totalCount === 0 ||
    visibleCount >= totalCount
  ) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <p className="mb-3 text-xs text-muted-foreground">
        Showing {visibleCount} of{' '}
        {totalCount}
      </p>

      <button
        type="button"
        onClick={onLoadMore}
        className={[
          'inline-flex',
          'min-h-10',
          'items-center',
          'justify-center',
          'border',
          'border-border',
          'bg-background',
          'px-5',
          'text-sm',
          'font-medium',
          'text-foreground',
          'transition-colors',
          'duration-150',
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
        {label}

        <span className="ml-1.5 text-xs opacity-70">
          ({Math.min(
            remainingCount,
            totalCount -
              visibleCount,
          )})
        </span>
      </button>
    </div>
  );
}