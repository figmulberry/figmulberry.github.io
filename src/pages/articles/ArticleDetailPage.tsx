import React from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

import { ArticleHeader } from
  '@/components/content/article/ArticleHeader';
import { ArticleTableOfContents } from
  '@/components/content/article/ArticleTableOfContents';
import { MarkdownRenderer } from
  '@/components/content/markdown/MarkdownRenderer';

import { contentRegistry } from
  '@/content/engine/registry';
import { getArticleBySlug } from
  '@/content/engine/queries';

import type {
  SeriesContent,
} from '@/content/engine/types';
import { BackToTop } from '@/components/navigation/BackToTop';

type ArticleDetailPageProps = {
  slug: string;
  allowDraft?: boolean;
};

function getSeriesTitle(
  seriesId: string | undefined,
): string | undefined {
  if (!seriesId) {
    return undefined;
  }

  const series = contentRegistry.find(
    (
      item,
    ): item is SeriesContent =>
      item.id === seriesId &&
      item.contentType === 'series',
  );

  return series?.title;
}

export default function ArticleDetailPage({
  slug,
  allowDraft = false,
}: ArticleDetailPageProps) {
  const article = getArticleBySlug(
    contentRegistry,
    slug,
  );

  const articleIsAvailable =
    article !== undefined &&
    (
      article.status === 'published' ||
      article.status === 'archived' ||
      allowDraft
    );

  if (!article || !articleIsAvailable) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
          Article unavailable
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          This publication is not available yet.
        </h1>

        <p className="mt-4 text-muted-foreground">
          The article may still be in preparation, or the requested address may be incorrect.
        </p>

        <Link
          href="/articles"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Articles
        </Link>
      </section>
    );
  }

  const seriesTitle = getSeriesTitle(
    article.seriesId,
  );

  return (
    <article className="w-full py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        {allowDraft && article.status === 'draft' && (
          <div
            role="status"
            className="mb-8 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
          >
            Draft preview — this article is not publicly published.
          </div>
        )}

        <ArticleHeader
          article={article}
          seriesTitle={seriesTitle}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <main className="min-w-0">
            <MarkdownRenderer
              markdown={article.body}
              articleSlug={article.slug}
            />

            {article.canonicalSource && (
              <footer className="mt-16 border-t border-border pt-8">
                <a
                  href={article.canonicalSource}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  View the original LinkedIn publication
                  <ExternalLink className="h-4 w-4" />
                </a>
              </footer>
            )}
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ArticleTableOfContents
              items={article.tableOfContents}
            />
          </aside>
        </div>
      </div>

      <BackToTop />
    </article>
  );
}