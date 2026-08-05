type ExtractedArticleBody = {
  quickSummary: string;
  remainingBody: string;
};

const quickSummaryHeading =
  /^##\s+Quick Summary\s*$/im;

const nextLevelTwoHeading =
  /^##\s+/m;

export function extractQuickSummary(
  markdown: string,
): ExtractedArticleBody {
  const headingMatch =
    quickSummaryHeading.exec(markdown);

  if (!headingMatch) {
    return {
      quickSummary: '',
      remainingBody: markdown,
    };
  }

  const sectionStart =
    headingMatch.index;

  const contentStart =
    sectionStart +
    headingMatch[0].length;

  const contentAfterHeading =
    markdown.slice(contentStart);

  const nextHeadingMatch =
    nextLevelTwoHeading.exec(
      contentAfterHeading,
    );

  const sectionEnd =
    nextHeadingMatch
      ? contentStart +
        nextHeadingMatch.index
      : markdown.length;

  const quickSummary =
    markdown
      .slice(
        contentStart,
        sectionEnd,
      )
      .trim();

  const remainingBody = [
    markdown
      .slice(0, sectionStart)
      .trimEnd(),

    markdown
      .slice(sectionEnd)
      .trimStart(),
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim();

  return {
    quickSummary,
    remainingBody,
  };
}