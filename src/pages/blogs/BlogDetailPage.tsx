import React from 'react';

import {
  useRoute,
} from 'wouter';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDiscoverableByType,
} from '@/content/engine/queries';

export default function BlogDetailPage() {
  const [
    matched,
    params,
  ] = useRoute(
    '/blog/:slug',
  );

  if (!matched) {
    return null;
  }

  const post =
    getDiscoverableByType(
      contentRegistry,
      'blog',
    ).find(
      (item) =>
        item.slug ===
        params.slug,
    );

  if (!post) {
    return (
      <main className="w-full py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            This blog post could not be
            found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full py-16">
      <article className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {post.category}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {post.description}
          </p>
        </header>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          {post.body}
        </div>
      </article>
    </main>
  );
}