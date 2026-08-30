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

  if (limit === 0) {
    return [];
  }

  const eligibleProjects =
    getPublishedProjects(now)
      .filter(
        (project) =>
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

          const dateDifference =
            new Date(
              right.publishedAt,
            ).getTime() -
            new Date(
              left.publishedAt,
            ).getTime();

          if (dateDifference !== 0) {
            return dateDifference;
          }

          return left.id.localeCompare(
            right.id,
          );
        },
      );

  if (
    eligibleProjects.length <
    limit
  ) {
    return [];
  }

  if (
    eligibleProjects.length ===
    limit
  ) {
    return eligibleProjects;
  }

  const combinations: ProjectContent[][] =
    [];

  for (
    let firstIndex = 0;
    firstIndex <
    eligibleProjects.length - 2;
    firstIndex++
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      eligibleProjects.length - 1;
      secondIndex++
    ) {
      for (
        let thirdIndex =
          secondIndex + 1;
        thirdIndex <
        eligibleProjects.length;
        thirdIndex++
      ) {
        combinations.push([
          eligibleProjects[
            firstIndex
          ],
          eligibleProjects[
            secondIndex
          ],
          eligibleProjects[
            thirdIndex
          ],
        ]);
      }
    }
  }

  const poolKey =
    eligibleProjects
      .map(
        (project) =>
          project.id,
      )
      .join('|');

  let seed =
    2166136261;

  for (
    let index = 0;
    index < poolKey.length;
    index++
  ) {
    seed ^=
      poolKey.charCodeAt(
        index,
      );

    seed =
      Math.imul(
        seed,
        16777619,
      ) >>>
      0;
  }

  function nextRandom(): number {
    seed +=
      0x6d2b79f5;

    let value =
      seed;

    value =
      Math.imul(
        value ^
          (
            value >>>
            15
          ),
        value | 1,
      );

    value ^=
      value +
      Math.imul(
        value ^
          (
            value >>>
            7
          ),
        value | 61,
      );

    return (
      (
        value ^
        (
          value >>>
          14
        )
      ) >>>
      0
    ) /
      4294967296;
  }

  for (
    let index =
      combinations.length - 1;
    index > 0;
    index--
  ) {
    const swapIndex =
      Math.floor(
        nextRandom() *
          (
            index + 1
          ),
      );

    [
      combinations[index],
      combinations[swapIndex],
    ] = [
      combinations[swapIndex],
      combinations[index],
    ];
  }

  const utcDayNumber =
    Math.floor(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
      ) /
        86_400_000,
    );

  const combinationIndex =
    utcDayNumber %
    combinations.length;

  return combinations[
    combinationIndex
  ];
}