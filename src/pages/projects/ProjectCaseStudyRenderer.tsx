import React from 'react';

import type {
  ProjectCaseStudyArticleBlock,
  ProjectCaseStudySection,
} from '@/content/engine/types';

import {
  ProjectBeforeAfter,
  ProjectFigure,
  ProjectP,
  ProjectPull,
  ProjectSection,
  ProjectWorkflow,
} from './ProjectArticle';

type ProjectCaseStudyRendererProps = {
  sections: ProjectCaseStudySection[];
  repositoryUrl?: string;
};

function renderParagraphBody(
  body: string,
  repositoryUrl?: string,
) {
  if (
    !repositoryUrl
  ) {
    return body;
  }

  const match =
    /\brepository\b/i.exec(
      body,
    );

  if (
    !match
  ) {
    return body;
  }

  const start =
    match.index;

  const end =
    start +
    match[0].length;

  return (
    <>
      {body.slice(
        0,
        start,
      )}

      <a
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
      >
        {body.slice(
          start,
          end,
        )}
      </a>

      {body.slice(
        end,
      )}
    </>
  );
}

function ArticleBlock({
  block,
  blockIndex,
  repositoryUrl,
}: {
  block: ProjectCaseStudyArticleBlock;
  blockIndex: number;
  repositoryUrl?: string;
}) {
  switch (block.type) {
    case 'paragraph':
      return (
        <ProjectP>
          {renderParagraphBody(
            block.body,
            repositoryUrl,
          )}
        </ProjectP>
      );

    case 'figure':
      return (
        <ProjectFigure
          src={block.image.src}
          alt={block.image.alt}
          caption={block.image.caption ?? block.image.alt}
          width={block.width}
          ratio={block.ratio}
        />
      );

    case 'pull':
      return <ProjectPull>{block.body}</ProjectPull>;

    case 'before-after':
      return (
        <ProjectBeforeAfter
          before={{
            src: block.before.src,
            alt: block.before.alt,
            caption: block.before.caption ?? block.before.alt,
          }}
          after={{
            src: block.after.src,
            alt: block.after.alt,
            caption: block.after.caption ?? block.after.alt,
          }}
        />
      );

    case 'workflow':
      return (
        <ProjectWorkflow
          steps={block.items.map((item) => ({
            title: item.title,
            body: item.description,
          }))}
        />
      );

    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}

export default function ProjectCaseStudyRenderer({
  sections,
  repositoryUrl,
}: ProjectCaseStudyRendererProps) {
  return (
    <>
      {sections.map((section) => {
        if (section.type !== 'article') {
          return null;
        }

        return (
          <ProjectSection
            key={section.id}
            id={section.id}
            title={section.title}
          >
            {section.blocks.map((block, blockIndex) => (
              <ArticleBlock
                key={`${section.id}:${blockIndex}`}
                block={block}
                blockIndex={blockIndex}
                repositoryUrl={repositoryUrl}
              />
            ))}
          </ProjectSection>
        );
      })}
    </>
  );
}
