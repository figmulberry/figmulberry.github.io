import React from 'react';

import {
  Link,
  useParams,
} from 'wouter';

import {
  getProjectBySlug,
} from '@/lib/content/getProjectBySlug';

import ProjectCaseStudyRenderer from
  './ProjectCaseStudyRenderer';

import {
  ProjectArticleBody,
  ProjectP,
  ProjectSection,
} from './ProjectArticle';

import ProjectIntro, {
  type ProjectIntroData,
  type ProjectIntroMode,
} from './ProjectIntro';

type ProjectPageParams = {
  slug?:
    string;
};

const formatProjectDate =
  (
    value:
      string |
      undefined,
  ) => {
    if (
      !value
    ) {
      return undefined;
    }

    const date =
      new Date(
        value,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return value;
    }

    return new Intl.DateTimeFormat(
      'en',
      {
        month:
          'short',
        year:
          'numeric',
        timeZone:
          'UTC',
      },
    ).format(
      date,
    );
  };

const formatProjectType =
  (
    value:
      string |
      undefined,
  ) =>
    value
      ?.replace(
        /\s*\/\s*/g,
        ' | ',
      )
      .replace(
        /\s*\|\s*/g,
        ' | ',
      );

const getDevelopmentIntroOverride =
  ():
    ProjectIntroMode |
    undefined => {
    if (
      !import.meta.env.DEV ||
      typeof window ===
        'undefined'
    ) {
      return undefined;
    }

    const candidate =
      new URLSearchParams(
        window.location.search,
      ).get(
        'intro',
      );

    if (
      candidate ===
        'image-left' ||
      candidate ===
        'image-right' ||
      candidate ===
        'overlay' ||
      candidate ===
        'wide'
    ) {
      return candidate;
    }

    return undefined;
  };

export default function ProjectPage() {
  const params =
    useParams<
      ProjectPageParams
    >();

  const slug =
    params.slug ??
    '';

  const project =
    getProjectBySlug(
      slug,
    );

  if (
    !project
  ) {
    return (
      <main className="pb-24 pt-8 md:pt-12">
        <div className="px-6 md:px-10 xl:px-16">
          <Link
            href="/portfolio"
            className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent"
          >
            &lt; Portfolio
          </Link>

          <div className="mx-auto mt-20 w-full max-w-[44rem] text-left">
            <h1 className="article-display-font text-[2rem] leading-[1.08] sm:text-[2.4rem]">
              Project not found
            </h1>

            <p className="article-reading-font mt-5 text-[1.1875rem] leading-[1.75] text-muted-foreground">
              The requested project does not exist or is not currently available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const heroImage =
    project.hero ??
    project.banner ??
    project.thumbnail;

  const readingMinutes =
    project.caseStudy
      ?.readingMinutes;

  const introData:
    ProjectIntroData =
    {
      meta: {
        category:
          project.category,
        projectType:
          formatProjectType(
            project.projectType,
          ),
        date:
          formatProjectDate(
            project.publishedAt,
          ),
        readingTime:
          readingMinutes
            ? `Estimated ${readingMinutes} min read`
            : undefined,
      },
      title:
        project.title,
      intro:
        project.caseStudy
          ?.introduction ??
        project.description,
      tools:
        project.tools
          ?.map(
            (
              tool,
            ) =>
              tool.name,
          ) ??
        [],
      image:
        heroImage
          ?.src ??
        '',
      imageAlt:
        heroImage
          ?.alt ??
        '',

    };

  const configuredIntroMode =
    (
      project as typeof project & {
        introMode?:
          ProjectIntroMode;
      }
    ).introMode;

  const introMode =
    getDevelopmentIntroOverride() ??
    configuredIntroMode ??
    'image-left';


  const exploreTargetId =
    project.caseStudy
      ?.sections[0]
      ?.id ??
    'project-body';

  return (
    <main className="pb-24 pt-4 md:pt-6">
      <div className="px-6 md:px-10 xl:px-16">
        <Link
          href="/portfolio"
          className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent"
        >
          &lt; Portfolio
        </Link>
      </div>

      <div className="mt-4 md:mt-5">
        {heroImage ? (
          <ProjectIntro
            mode={
              introMode
            }
            data={
              introData
            }
            targetId={
              exploreTargetId
            }
          />
        ) : (
          <div className="px-6 md:px-10 xl:px-16">
            <div className="mx-auto w-full max-w-[44rem] text-left">
              <h1 className="article-display-font max-w-[19ch] text-[2rem] leading-[1.08] tracking-[-0.02em] sm:text-[2.4rem] lg:text-[2.9rem]">
                {project.title}
              </h1>

              <p className="article-reading-font mt-6 text-[1.0625rem] leading-[1.75] text-foreground/90 sm:text-[1.125rem]">
                {
                  project.caseStudy
                    ?.introduction ??
                  project.description
                }
              </p>
            </div>
          </div>
        )}
      </div>

      <ProjectArticleBody
        id="project-body"
      >

        {project.caseStudy &&
        project.caseStudy.sections.length >
          0 ? (
          <ProjectCaseStudyRenderer
            sections={
              project.caseStudy.sections
            }
            repositoryUrl={
              project.repositoryUrl
            }
          />
        ) : (
          <ProjectSection
            title="Portfolio migration"
          >
            <ProjectP>
              This project is being migrated into the full editorial portfolio format. The project record remains available while its complete narrative, figures, process documentation, and supporting evidence are prepared.
            </ProjectP>
          </ProjectSection>
        )}

        <div className="mx-auto mt-14 w-full max-w-[44rem] border-t border-border pt-8 text-left">
          <Link
            href="/portfolio"
            className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent"
          >
            &lt; Explore all projects
          </Link>
        </div>
      </ProjectArticleBody>
    </main>
  );
}
