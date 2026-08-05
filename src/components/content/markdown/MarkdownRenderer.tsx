import React, {
  Children,
  isValidElement,
  useMemo,
} from 'react';

import GithubSlugger from 'github-slugger';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Link,
} from 'wouter';

import {
  ArticleCallout,
} from '@/components/content/markdown/ArticleCallout';

import type {
  ArticleCalloutType,
} from '@/components/content/markdown/ArticleCallout';

import {
  resolveArticleMarkdown,
} from '@/lib/content/resolveArticleMarkdown';

import { remarkFigures } from
  '@/lib/content/remarkFigures';

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
  const explicitlyCollapsible =
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

    // Every Tip is collapsible automatically.
    // Other callouts collapse only when explicitly marked.
    collapsible:
      definition.type === 'tip'
        ? true
        : explicitlyCollapsible,
  };
}

function findRecognizedCallout(
  node: React.ReactNode,
): RecognizedCallout | undefined {
  const children = Children.toArray(node);

  for (const child of children) {
    if (
      !isValidElement<{
        children?: React.ReactNode;
      }>(child)
    ) {
      continue;
    }

    if (child.type === 'strong') {
      const definition = recognizeCallout(
        getNodeText(
          child.props.children,
        ),
      );

      if (definition) {
        return definition;
      }
    }

    const nestedDefinition =
      findRecognizedCallout(
        child.props.children,
      );

    if (nestedDefinition) {
      return nestedDefinition;
    }
  }

  return undefined;
}

function renderBlockquote(
  children: React.ReactNode,
): React.ReactNode {
  const blockChildren =
    Children.toArray(children);

  let calloutDefinition:
    | RecognizedCallout
    | undefined;

  let labelParagraphIndex = -1;

  for (
    let index = 0;
    index < blockChildren.length;
    index += 1
  ) {
    const child = blockChildren[index];

    if (
      !isValidElement<{
        children?: React.ReactNode;
      }>(child)
    ) {
      continue;
    }

    const definition =
      findRecognizedCallout(
        child.props.children,
      );

    if (definition) {
      calloutDefinition = definition;
      labelParagraphIndex = index;
      break;
    }
  }

  if (
    !calloutDefinition ||
    labelParagraphIndex < 0
  ) {
    return (
      <blockquote
        className={[
          'article-quotation',
          'relative',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none',
            'absolute',
            'left-5 top-2',
            'text-4xl leading-none',
            'text-accent/35',
          ].join(' ')}
        >
          ❝
        </span>

        <div className="pl-7">
          {children}
        </div>
      </blockquote>
    );
  }

  const calloutBody =
    blockChildren.filter(
      (
        _child,
        index,
      ) =>
        index !== labelParagraphIndex,
    );

  return (
    <ArticleCallout
      type={calloutDefinition.type}
      title={calloutDefinition.title}
      collapsible={
        calloutDefinition.collapsible
      }
    >
      {calloutBody}
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
    const slugger =
      new GithubSlugger();

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
          href?.startsWith(
            'http://',
          ) ||
          href?.startsWith(
            'https://',
          );

        if (
          !isExternal &&
          href?.startsWith('/')
        ) {
          return (
            <Link href={href}>
              {children}
            </Link>
          );
        }

        const linkTitle =
          href?.includes(
            'grid-label-tags.html',
          ) &&
          href.includes(
            'showDirections',
          )
            ? (
                'Open the Esri Grid Label Tags ' +
                'documentation at showDirections'
              )
            : href?.includes(
                  'grid-label-tags.html',
                ) &&
                href.includes(
                  'padMinutes',
                )
              ? (
                  'Open the Esri Grid Label Tags ' +
                  'documentation at padMinutes'
                )
              : undefined;

        return (
          <a
            href={href}
            title={linkTitle}
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

      figure: ({
        children,
      }: {
        children?: React.ReactNode;
      }) => (
        <figure className="article-figure not-prose">
          {children}
        </figure>
      ),

      figcaption: ({
        children,
      }: {
        children?: React.ReactNode;
      }) => (
        <figcaption className="article-figure-capture">
          {children}
        </figcaption>
      ),

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
          className="article-figure-image block h-auto w-full border border-border"
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
        'article-reading-font',
        'prose prose-neutral',
        'dark:prose-invert',
        'max-w-none',
        'prose-headings:scroll-mt-28',
        'prose-headings:font-semibold',
        'prose-a:text-accent',
        'prose-a:no-underline',
        'hover:prose-a:underline',
        'hover:prose-a:decoration-accent/60',
        'prose-a:underline-offset-4',
        'prose-blockquote:relative',
        'prose-blockquote:border-l-2',
        'prose-blockquote:border-l-accent/70',
        'prose-blockquote:bg-transparent',
        'prose-blockquote:px-6',
        'prose-blockquote:py-5',
        'prose-blockquote:italic',
        'prose-blockquote:text-lg',
        'prose-blockquote:font-medium',
        'prose-blockquote:text-foreground/90',
        'prose-code:font-mono',
        'prose-pre:font-mono',
        'prose-pre:rounded-sm',
        'prose-pre:overflow-x-auto',
        'prose-table:text-sm',
      ].join(' ')}
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkFigures
        ]}
        components={components}
      >
        {resolvedMarkdown}
      </ReactMarkdown>
    </div>
  );
}