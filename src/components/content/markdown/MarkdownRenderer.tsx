import React, {
  isValidElement,
  useMemo,
} from 'react';
import GithubSlugger from 'github-slugger';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { resolveArticleMarkdown } from
  '@/lib/content/resolveArticleMarkdown';

type MarkdownRendererProps = {
  markdown: string;
  articleSlug: string;
};

function getNodeText(
  node: React.ReactNode,
): string {
  if (
    typeof node === 'string' ||
    typeof node === 'number'
  ) {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map((child) => getNodeText(child))
      .join('');
  }

  if (
    isValidElement<{
      children?: React.ReactNode;
    }>(node)
  ) {
    return getNodeText(
      node.props.children,
    );
  }

  return '';
}

export function MarkdownRenderer({
  markdown,
  articleSlug,
}: MarkdownRendererProps) {
  const resolvedMarkdown = useMemo(
    () =>
      resolveArticleMarkdown(
        markdown,
        articleSlug,
      ),
    [
      markdown,
      articleSlug,
    ],
  );

  const components = useMemo(() => {
    const slugger = new GithubSlugger();

    return {
      h2: ({
        children,
      }: {
        children?: React.ReactNode;
      }) => {
        const id = slugger.slug(
          getNodeText(children),
        );

        return (
          <h2
            id={id}
            className="scroll-mt-28"
          >
            {children}
          </h2>
        );
      },

      h3: ({
        children,
      }: {
        children?: React.ReactNode;
      }) => {
        const id = slugger.slug(
          getNodeText(children),
        );

        return (
          <h3
            id={id}
            className="scroll-mt-28"
          >
            {children}
          </h3>
        );
      },

      a: ({
        href,
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => {
        const isExternal =
          href?.startsWith('http://') ||
          href?.startsWith('https://');

        return (
          <a
            href={href}
            target={
              isExternal
                ? '_blank'
                : undefined
            }
            rel={
              isExternal
                ? 'noreferrer noopener'
                : undefined
            }
          >
            {children}
          </a>
        );
      },

      img: ({
        src,
        alt,
      }: {
        src?: string;
        alt?: string;
      }) => (
        <img
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-lg border border-border"
        />
      ),

      table: ({
        children,
      }: {
        children?: React.ReactNode;
      }) => (
        <div className="my-8 overflow-x-auto">
          <table>
            {children}
          </table>
        </div>
      ),
    };
  }, []);

  return (
    <div
      className="
        prose
        prose-neutral
        dark:prose-invert
        max-w-none
        prose-headings:scroll-mt-28
        prose-headings:font-semibold
        prose-a:text-accent
        prose-a:decoration-accent/40
        hover:prose-a:decoration-accent
        prose-blockquote:border-l-accent
        prose-blockquote:bg-muted/35
        prose-blockquote:px-5
        prose-blockquote:py-3
        prose-blockquote:not-italic
        prose-img:my-8
        prose-pre:overflow-x-auto
        prose-table:text-sm
      "
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}
        components={components}
      >
        {resolvedMarkdown}
      </ReactMarkdown>
    </div>
  );
}