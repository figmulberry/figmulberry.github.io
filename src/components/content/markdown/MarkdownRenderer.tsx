import React, {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
} from 'react';
import GithubSlugger from 'github-slugger';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  ArticleCallout,
} from
  '@/components/content/markdown/ArticleCallout';

import type {
  ArticleCalloutType,
} from
  '@/components/content/markdown/ArticleCallout';

import { resolveArticleMarkdown } from
  '@/lib/content/resolveArticleMarkdown';

type MarkdownRendererProps = {
  markdown: string;
  articleSlug: string;
};

type RecognizedCallout = {
  type: ArticleCalloutType;
  title: string;
  collapsible: boolean;
};

const calloutLabels: Record<
  string,
  Omit<
    RecognizedCallout,
    'collapsible'
  >
> = {
  important: {
    type: 'important',
    title: 'Important',
  },

  tip: {
    type: 'tip',
    title: 'Tip',
  },

  note: {
    type: 'note',
    title: 'Note',
  },

  warning: {
    type: 'warning',
    title: 'Warning',
  },

  caution: {
    type: 'caution',
    title: 'Caution',
  },

  'see also': {
    type: 'see-also',
    title: 'See Also',
  },

  'how this publication works': {
    type: 'publication-info',
    title: 'How this publication works',
  },

  'machine-readable index': {
    type: 'machine-readable',
    title: 'Machine-readable index',
  },
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

function recognizeCallout(
  value: string,
): RecognizedCallout | undefined {
  const collapsible =
    /\[collapsible\]\s*$/i.test(value);

  const normalized = value
    .replace(
      /\[collapsible\]\s*$/i,
      '',
    )
    .trim()
    .toLocaleLowerCase();

  const definition =
    calloutLabels[normalized];

  if (!definition) {
    return undefined;
  }

  return {
    ...definition,
    collapsible:
        definition.type === 'tip'
        ? true: collapsible,
  };
}

function renderBlockquote(
  children: React.ReactNode,
): React.ReactNode {
  const blockChildren =
    Children.toArray(children);

  const firstParagraphIndex =
    blockChildren.findIndex(
      (child) =>
        isValidElement(child) &&
        child.type === 'p',
    );

  if (firstParagraphIndex < 0) {
    return (
      <blockquote>
        {children}
      </blockquote>
    );
  }

  const firstParagraph =
    blockChildren[firstParagraphIndex];

  if (
    !isValidElement<{
      children?: React.ReactNode;
    }>(firstParagraph)
  ) {
    return (
      <blockquote>
        {children}
      </blockquote>
    );
  }

  const paragraphChildren =
    Children.toArray(
      firstParagraph.props.children,
    );

  const firstInline =
    paragraphChildren[0];

  if (
    !isValidElement<{
      children?: React.ReactNode;
    }>(firstInline) ||
    firstInline.type !== 'strong'
  ) {
    return (
      <blockquote>
        {children}
      </blockquote>
    );
  }

  const definition = recognizeCallout(
    getNodeText(
      firstInline.props.children,
    ),
  );

  if (!definition) {
    return (
      <blockquote>
        {children}
      </blockquote>
    );
  }

  const remainingInline =
    paragraphChildren
      .slice(1)
      .filter(
        (child) =>
          typeof child !== 'string' ||
          child.trim().length > 0,
      );

  const calloutChildren = [
    ...blockChildren,
  ];

  if (remainingInline.length === 0) {
    calloutChildren.splice(
      firstParagraphIndex,
      1,
    );
  } else {
    calloutChildren[
      firstParagraphIndex
    ] = cloneElement(
      firstParagraph,
      undefined,
      remainingInline,
    );
  }

  return (
    <ArticleCallout
      type={definition.type}
      title={definition.title}
      collapsible={
        definition.collapsible
      }
    >
      {calloutChildren}
    </ArticleCallout>
  );
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

      blockquote: ({
        children,
      }: {
        children?: React.ReactNode;
      }) =>
        renderBlockquote(children),

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
          className="h-auto w-full rounded-sm border border-border"
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
      className={[
        'prose prose-neutral',
        'dark:prose-invert',
        'max-w-none',
        'prose-headings:scroll-mt-28',
        'prose-headings:font-semibold',
        'prose-a:text-accent',
        'prose-a:decoration-accent/40',
        'hover:prose-a:decoration-accent',
        'prose-blockquote:border-l-accent',
        'prose-blockquote:bg-muted/35',
        'prose-blockquote:px-5',
        'prose-blockquote:py-3',
        'prose-blockquote:not-italic',
        'prose-img:my-8',
        'prose-pre:rounded-sm',
        'prose-pre:overflow-x-auto',
        'prose-table:text-sm',
      ].join(' ')}
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