const articleImageModules = import.meta.glob(
  '/src/content/articles/*/images/*.{png,jpg,jpeg,webp,gif,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>;

const markdownImagePattern =
  /(!\[[^\]]*\]\()\.\/*images\/([^)]+)(\))/g;

export function resolveArticleMarkdown(
  markdown: string,
  articleSlug: string,
): string {
  return markdown.replace(
    markdownImagePattern,
    (
      fullMatch,
      opening: string,
      filename: string,
      closing: string,
    ) => {
      const normalizedFilename = filename.trim();

      const sourcePath =
        `/src/content/articles/${articleSlug}/images/${normalizedFilename}`;

      const resolvedUrl =
        articleImageModules[sourcePath];

      if (!resolvedUrl) {
        throw new Error(
          `Missing article image: ${sourcePath}`,
        );
      }

      return `${opening}${resolvedUrl}${closing}`;
    },
  );
}