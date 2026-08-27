import {
  getProjectBySlug as getProjectBySlugFromRecords,
  isRoutableContent,
} from '@/content/engine/queries';

import {
  contentRegistry,
} from '@/content/engine/registry';

import type {
  ProjectContent,
} from '@/content/engine/types';


export function getProjectBySlug(
  slug:
    string,

  now =
    new Date(),
):
  ProjectContent |
  undefined {
  const project =
    getProjectBySlugFromRecords(
      contentRegistry,
      slug,
    );


  if (
    !project ||
    !isRoutableContent(
      project,
      now,
    )
  ) {
    return undefined;
  }


  return project;
}
