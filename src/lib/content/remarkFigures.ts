type MarkdownNode = {
  type: string;
  value?: string;
  url?: string;
  alt?: string;
  title?: string | null;
  children?: MarkdownNode[];
  data?: {
    hName?: string;
    hProperties?: Record<
      string,
      unknown
    >;
  };
};

function getNodeText(
  node: MarkdownNode,
): string {
  if (typeof node.value === 'string') {
    return node.value;
  }

  return (
    node.children
      ?.map((child) =>
        getNodeText(child),
      )
      .join('') ?? ''
  );
}

function isImageParagraph(
  node: MarkdownNode,
): boolean {
  return (
    node.type === 'paragraph' &&
    node.children?.length === 1 &&
    node.children[0].type === 'image'
  );
}

function getCaptionContent(
  node: MarkdownNode,
): MarkdownNode[] | undefined {
  if (
    node.type !== 'paragraph' ||
    node.children?.length !== 1
  ) {
    return undefined;
  }

  const emphasis =
    node.children[0];

  if (
    emphasis.type !== 'emphasis' ||
    !emphasis.children
  ) {
    return undefined;
  }

  const captionText =
    getNodeText(emphasis).trim();

  if (captionText.length === 0) {
    return undefined;
  }

  return emphasizeFigureLabel(
    emphasis.children,
  );
}

function emphasizeFigureLabel(
  children: MarkdownNode[],
): MarkdownNode[] {
  const copiedChildren =
    children.map((child) => ({
      ...child,
      children: child.children
        ? [...child.children]
        : undefined,
    }));

  const firstChild =
    copiedChildren[0];

  if (
    firstChild?.type !== 'text' ||
    typeof firstChild.value !== 'string'
  ) {
    return copiedChildren;
  }

  const match =
    firstChild.value.match(
      /^(Figure\s+\d+:)\s*(.*)$/is,
    );

  if (!match) {
    return copiedChildren;
  }

  const [
    ,
    figureLabel,
    remainingText,
  ] = match;

  const replacement: MarkdownNode[] = [
    {
      type: 'strong',
      children: [
        {
          type: 'text',
          value: figureLabel,
        },
      ],
    },
  ];

  if (remainingText.length > 0) {
    replacement.push({
      type: 'text',
      value: ` ${remainingText}`,
    });
  }

  return [
    ...replacement,
    ...copiedChildren.slice(1),
  ];
}

export function remarkFigures() {
  return (tree: MarkdownNode) => {
    if (!tree.children) {
      return;
    }

    const groupedChildren:
      MarkdownNode[] = [];

    for (
      let index = 0;
      index < tree.children.length;
      index += 1
    ) {
      const current =
        tree.children[index];

      const next =
        tree.children[index + 1];

      if (
        !next ||
        !isImageParagraph(current)
      ) {
        groupedChildren.push(current);
        continue;
      }

      const captionChildren =
        getCaptionContent(next);

      if (!captionChildren) {
        groupedChildren.push(current);
        continue;
      }

      const imageNode =
        current.children?.[0];

      if (!imageNode) {
        groupedChildren.push(current);
        continue;
      }

      groupedChildren.push({
        type: 'paragraph',

        data: {
          hName: 'figure',
          hProperties: {
            className:
              'article-figure',
          },
        },

        children: [
          imageNode,

          {
            type: 'paragraph',

            data: {
              hName: 'figcaption',
              hProperties: {
                className:
                  'article-figure-caption',
              },
            },

            children:
              captionChildren,
          },
        ],
      });

      index += 1;
    }

    tree.children =
      groupedChildren;
  };
}