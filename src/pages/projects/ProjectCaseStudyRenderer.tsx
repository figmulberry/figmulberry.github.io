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
};

function ArticleBlock({
  block,
  blockIndex,
}: {
  block: ProjectCaseStudyArticleBlock;
  blockIndex: number;
}) {
  switch (block.type) {
    case 'paragraph':
      return <ProjectP>{block.body}</ProjectP>;

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
              />
            ))}
          </ProjectSection>
        );
      })}
    </>
  );
}
