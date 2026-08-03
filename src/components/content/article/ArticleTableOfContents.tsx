import React from 'react';
import { ListTree } from 'lucide-react';

import type {
  TableOfContentsItem,
} from '@/content/engine/types';

type ArticleTableOfContentsProps = {
  items: readonly TableOfContentsItem[];
};

export function ArticleTableOfContents({
  items,
}: ArticleTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-labelledby="article-toc-heading"
      className="rounded-xl border border-border bg-card/70 p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <ListTree
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        />

        <h2
          id="article-toc-heading"
          className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground"
        >
          On this page
        </h2>
      </div>

      <ol className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.level === 3
                ? 'pl-4'
                : undefined
            }
          >
            <a
              href={`#${item.id}`}
              className={[
                'block rounded-md px-2 py-1.5',
                'transition-colors',
                'hover:bg-muted hover:text-accent',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-accent',
                item.level === 3
                  ? 'text-xs text-muted-foreground'
                  : 'text-sm text-foreground/85',
              ].join(' ')}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}