import {
  getImmediateChildBelow,
  getLocationOrThrow,
} from './locationHierarchy';

import {
  type ChildLocationNode,
  type DirectProjectNode,
  type DrilldownView,
  type LocationIndex,
  type SemanticProjectRecord,
} from './semanticTypes';


type BuildDrilldownViewArguments = {
  index:
    LocationIndex;

  currentLocationId:
    string;

  projects:
    readonly SemanticProjectRecord[];
};


/**
 * Builds the immediate semantic contents of one location.
 *
 * Example:
 *
 * currentLocationId = country:usa
 *
 * directProjects:
 * - projects whose placement is exactly country:usa
 *
 * childLocations:
 * - Acadia, Maine, California, or any other first child
 *   below country:usa that contains matching projects
 *
 * Descendant projects are grouped by the first child below
 * the current location. This is what allows one USA click to
 * reveal country-wide projects and Acadia simultaneously.
 */
export const buildDrilldownView =
  (
    {
      index,
      currentLocationId,
      projects,
    }:
      BuildDrilldownViewArguments,
  ):
    DrilldownView => {
    const currentLocation =
      getLocationOrThrow(
        index,
        currentLocationId,
      );


    const directByProjectId =
      new Map<
        string,
        DirectProjectNode
      >();


    const childProjects =
      new Map<
        string,
        Map<
          string,
          SemanticProjectRecord
        >
      >();


    const visibleProjectIds =
      new Set<
        string
      >();


    projects.forEach(
      (
        project,
      ) => {
        project.placements.forEach(
          (
            placement,
          ) => {
            const placementLocation =
              index.byId.get(
                placement.locationId,
              );


            if (
              !placementLocation
            ) {
              throw new Error(
                `Project "${project.projectId}" references unknown location "${placement.locationId}".`,
              );
            }


            if (
              placement.locationId ===
              currentLocationId
            ) {
              const directId =
                `${project.projectId}@${placement.locationId}`;


              if (
                !directByProjectId.has(
                  directId,
                )
              ) {
                directByProjectId.set(
                  directId,
                  {
                    kind:
                      'direct-project',

                    id:
                      `direct:${directId}`,

                    location:
                      currentLocation,

                    project,

                    placement,
                  },
                );
              }


              visibleProjectIds.add(
                project.projectId,
              );

              return;
            }


            const immediateChild =
              getImmediateChildBelow(
                index,
                currentLocationId,
                placement.locationId,
              );


            if (
              !immediateChild
            ) {
              return;
            }


            const projectsAtChild =
              childProjects.get(
                immediateChild.id,
              ) ??
              new Map<
                string,
                SemanticProjectRecord
              >();


            projectsAtChild.set(
              project.projectId,
              project,
            );


            childProjects.set(
              immediateChild.id,
              projectsAtChild,
            );


            visibleProjectIds.add(
              project.projectId,
            );
          },
        );
      },
    );


    const directProjects =
      [
        ...directByProjectId.values(),
      ].sort(
        (
          first,
          second,
        ) =>
          first.project.title.localeCompare(
            second.project.title,
          ),
      );


    const childLocations:
      ChildLocationNode[] =
      [
        ...childProjects.entries(),
      ]
        .map(
          (
            [
              locationId,
              projectMap,
            ],
          ) => {
            const location =
              getLocationOrThrow(
                index,
                locationId,
              );


            const groupedProjects =
              [
                ...projectMap.values(),
              ].sort(
                (
                  first,
                  second,
                ) =>
                  first.title.localeCompare(
                    second.title,
                  ),
              );


            return {
              kind:
                'child-location' as const,

              id:
                `location:${location.id}`,

              location,

              projects:
                groupedProjects,

              projectCount:
                groupedProjects.length,
            };
          },
        )
        .sort(
          (
            first,
            second,
          ) => {
            const firstOrder =
              first.location.sortOrder ??
              0;

            const secondOrder =
              second.location.sortOrder ??
              0;


            if (
              firstOrder !==
              secondOrder
            ) {
              return (
                firstOrder -
                secondOrder
              );
            }


            return first.location.label.localeCompare(
              second.location.label,
            );
          },
        );


    return {
      currentLocation,
      directProjects,
      childLocations,
      visibleProjectIds:
        [
          ...visibleProjectIds,
        ].sort(),
    };
  };
