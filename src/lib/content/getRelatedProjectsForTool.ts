import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import type {
  ContentRecord,
  ProjectContent,
} from '@/content/engine/types';


type ScoredProject = {
  project: ProjectContent;
  score: number;
};


function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase();
}


function normalizeSearchText(
  values: unknown,
): string {
  return normalize(
    JSON.stringify(
      values ?? [],
    ),
  );
}


function getToolSearchTerms(
  toolName: string,
): string[] {
  const normalizedToolName =
    normalize(
      toolName,
    );

  const terms =
    normalizedToolName
      .split('/')
      .map(
        (
          value,
        ) =>
          normalize(
            value,
          ),
      )
      .filter(Boolean);

  return Array.from(
    new Set([
      normalizedToolName,
      ...terms,
    ]),
  );
}


function containsSearchTerm(
  value: string,
  searchTerms: readonly string[],
): boolean {
  const normalizedValue =
    normalize(
      value,
    );

  return searchTerms.some(
    (
      searchTerm,
    ) =>
      normalizedValue ===
        searchTerm ||
      normalizedValue.includes(
        searchTerm,
      ),
  );
}


function scoreProjectForTool(
  project: ProjectContent,
  searchTerms: readonly string[],
): number {
  let score = 0;

  const serializedTools =
    normalizeSearchText(
      project.tools,
    );

  if (
    searchTerms.some(
      (
        searchTerm,
      ) =>
        serializedTools.includes(
          searchTerm,
        ),
    )
  ) {
    score += 12;
  }


  if (
    project.tags.some(
      (
        tag,
      ) =>
        containsSearchTerm(
          tag,
          searchTerms,
        ),
    )
  ) {
    score += 9;
  }


  if (
    containsSearchTerm(
      project.title,
      searchTerms,
    )
  ) {
    score += 4;
  }


  if (
    containsSearchTerm(
      project.category,
      searchTerms,
    )
  ) {
    score += 3;
  }


  if (
    containsSearchTerm(
      project.description,
      searchTerms,
    )
  ) {
    score += 2;
  }


  return score;
}


export function getRelatedProjectsForTool(
  records: readonly ContentRecord[],
  toolName: string,
  limit = 3,
  now = new Date(),
): ProjectContent[] {
  if (
    !Number.isInteger(
      limit,
    ) ||
    limit < 0
  ) {
    throw new Error(
      'Related project limit must be a non-negative integer.',
    );
  }


  const searchTerms =
    getToolSearchTerms(
      toolName,
    );


  const scoredProjects:
    ScoredProject[] =
    getDiscoverableByType(
      records,
      'project',
      now,
    )
      .map(
        (
          project,
        ) => ({
          project,
          score:
            scoreProjectForTool(
              project,
              searchTerms,
            ),
        }),
      )
      .filter(
        (
          item,
        ) =>
          item.score > 0,
      )
      .sort(
        (
          left,
          right,
        ) => {
          if (
            right.score !==
            left.score
          ) {
            return (
              right.score -
              left.score
            );
          }

          return left.project.title
            .localeCompare(
              right.project.title,
            );
        },
      );


  return scoredProjects
    .slice(
      0,
      limit,
    )
    .map(
      (
        item,
      ) =>
        item.project,
    );
}