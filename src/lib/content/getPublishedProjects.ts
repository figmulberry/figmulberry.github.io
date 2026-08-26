import {
  getDiscoverableByType,
} from '@/content/engine/queries';

import {
  contentRegistry,
} from '@/content/engine/registry';

import type {
  ProjectContent,
} from '@/content/engine/types';


export function getPublishedProjects(
  now = new Date(),
): ProjectContent[] {
  return getDiscoverableByType(
    contentRegistry,
    'project',
    now,
  );
}


export function getHomepageFeaturedProjects(
  limit = 3,
  now = new Date(),
): ProjectContent[] {
  if (
    !Number.isInteger(limit) ||
    limit < 0
  ) {
    throw new Error(
      'Featured project limit must be a non-negative integer.',
    );
  }

  return getPublishedProjects(
    now,
  )
    .filter(
      (
        project,
      ) =>
        project.homepageFeatured ===
        true,
    )
    .sort(
      (
        left,
        right,
      ) => {
        const leftOrder =
          left.homepageFeaturedOrder ??
          Number.MAX_SAFE_INTEGER;

        const rightOrder =
          right.homepageFeaturedOrder ??
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
    )
    .slice(
      0,
      limit,
    );
}