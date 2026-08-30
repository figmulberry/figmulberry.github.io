import {
  getPublishedProjects,
} from './getPublishedProjects';

import type {
  ProjectContent,
} from '@/content/engine/types';


export function getPortfolioProjects(
  now = new Date(),
): ProjectContent[] {
  return getPublishedProjects(
    now,
  ).sort(
    (
      left,
      right,
    ) => {
      const leftOrder =
        left.portfolioOrder ??
        Number.MAX_SAFE_INTEGER;

      const rightOrder =
        right.portfolioOrder ??
        Number.MAX_SAFE_INTEGER;

      if (
        leftOrder !==
        rightOrder
      ) {
        return (
          leftOrder -
          rightOrder
        );
      }

      return (
        new Date(
          right.publishedAt,
        ).getTime() -
        new Date(
          left.publishedAt,
        ).getTime()
      );
    },
  );
}


export function getPortfolioFeaturedProjects(
  now = new Date(),
): ProjectContent[] {
  return getPortfolioProjects(
    now,
  ).filter(
    (
      project,
    ) =>
      project.portfolioFeatured ===
      true,
  );
}


export function getMappedPortfolioProjects(
  now = new Date(),
): ProjectContent[] {
  return getPortfolioProjects(
    now,
  ).filter(
    (
      project,
    ) =>
      (
        project.mapPlacements
          ?.length ??
        0
      ) >
        0 ||
      project.locations.length >
        0,
  );
}
