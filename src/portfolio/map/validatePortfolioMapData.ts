import type {
  ProjectContent,
} from '@/content/engine/types';

import {
  ROOT_LOCATION_ID,
  type PortfolioLocation,
} from './semanticTypes';


type ValidatePortfolioMapDataArguments = {
  locations:
    readonly PortfolioLocation[];

  projects:
    readonly ProjectContent[];
};


const assertFiniteCoordinate =
  (
    value:
      number,

    label:
      string,
  ) => {
    if (
      !Number.isFinite(
        value,
      )
    ) {
      throw new Error(
        `Portfolio map validation: ${label} must be a finite number.`,
      );
    }
  };


export const validatePortfolioMapData =
  (
    {
      locations,
      projects,
    }:
      ValidatePortfolioMapDataArguments,
  ):
    void => {
    /*
     * =====================================================
     * LOCATION REGISTRY
     * =====================================================
     */

    const locationById =
      new Map<
        string,
        PortfolioLocation
      >();


    locations.forEach(
      (
        location,
      ) => {
        if (
          locationById.has(
            location.id,
          )
        ) {
          throw new Error(
            `Portfolio map validation: duplicate location id "${location.id}".`,
          );
        }


        const [
          longitude,
          latitude,
        ] =
          location.anchor;


        assertFiniteCoordinate(
          longitude,
          `${location.id} longitude`,
        );

        assertFiniteCoordinate(
          latitude,
          `${location.id} latitude`,
        );


        if (
          longitude <
            -180 ||
          longitude >
            180
        ) {
          throw new Error(
            `Portfolio map validation: longitude for "${location.id}" must be between -180 and 180.`,
          );
        }


        if (
          latitude <
            -90 ||
          latitude >
            90
        ) {
          throw new Error(
            `Portfolio map validation: latitude for "${location.id}" must be between -90 and 90.`,
          );
        }


        if (
          location.bounds
        ) {
          const [
            [
              west,
              south,
            ],
            [
              east,
              north,
            ],
          ] =
            location.bounds;


          [
            [
              west,
              `${location.id} west bound`,
            ],
            [
              south,
              `${location.id} south bound`,
            ],
            [
              east,
              `${location.id} east bound`,
            ],
            [
              north,
              `${location.id} north bound`,
            ],
          ].forEach(
            (
              [
                value,
                label,
              ],
            ) => {
              assertFiniteCoordinate(
                value as number,
                label as string,
              );
            },
          );


          if (
            west <
              -180 ||
            west >
              180 ||
            east <
              -180 ||
            east >
              180
          ) {
            throw new Error(
              `Portfolio map validation: longitude bounds for "${location.id}" are invalid.`,
            );
          }


          if (
            south <
              -90 ||
            south >
              90 ||
            north <
              -90 ||
            north >
              90
          ) {
            throw new Error(
              `Portfolio map validation: latitude bounds for "${location.id}" are invalid.`,
            );
          }


          if (
            south >
            north
          ) {
            throw new Error(
              `Portfolio map validation: south bound is greater than north bound for "${location.id}".`,
            );
          }
        }


        locationById.set(
          location.id,
          location,
        );
      },
    );


    const root =
      locationById.get(
        ROOT_LOCATION_ID,
      );


    if (
      !root
    ) {
      throw new Error(
        `Portfolio map validation: root location "${ROOT_LOCATION_ID}" is missing.`,
      );
    }


    if (
      root.parentId !==
      null
    ) {
      throw new Error(
        `Portfolio map validation: root location "${ROOT_LOCATION_ID}" must have parentId null.`,
      );
    }


    locations.forEach(
      (
        location,
      ) => {
        if (
          location.id ===
          ROOT_LOCATION_ID
        ) {
          return;
        }


        if (
          !location.parentId
        ) {
          throw new Error(
            `Portfolio map validation: non-root location "${location.id}" requires a parentId.`,
          );
        }


        if (
          location.parentId ===
          location.id
        ) {
          throw new Error(
            `Portfolio map validation: location "${location.id}" cannot be its own parent.`,
          );
        }


        if (
          !locationById.has(
            location.parentId,
          )
        ) {
          throw new Error(
            `Portfolio map validation: location "${location.id}" references missing parent "${location.parentId}".`,
          );
        }
      },
    );


    /*
     * Detect hierarchy cycles.
     */

    locations.forEach(
      (
        location,
      ) => {
        const visited =
          new Set<
            string
          >();


        let current:
          PortfolioLocation |
          undefined =
          location;


        while (
          current
        ) {
          if (
            visited.has(
              current.id,
            )
          ) {
            throw new Error(
              `Portfolio map validation: hierarchy cycle detected at "${current.id}".`,
            );
          }


          visited.add(
            current.id,
          );


          if (
            current.parentId ===
            null
          ) {
            break;
          }


          current =
            locationById.get(
              current.parentId,
            );
        }
      },
    );


    /*
     * =====================================================
     * PROJECT PLACEMENTS
     * =====================================================
     */

    projects.forEach(
      (
        project,
      ) => {
        const placements =
          project.mapPlacements ??
          [];


        /*
         * =====================================================
         * SEMANTIC MAP PLACEMENT CONTRACT
         * =====================================================
         *
         * mapPlacements is the authoritative geography used by
         * the semantic portfolio map.
         *
         * The older locations array remains only for migration
         * compatibility and must not silently drive map behavior.
         *
         * A project with neither representation is valid and is
         * simply not displayed on the map.
         * =====================================================
         */


        if (
          placements.length ===
            0 &&
          project.locations.length >
            0
        ) {
          throw new Error(
            `Portfolio map validation: project "${project.slug}" contains legacy locations but has no semantic mapPlacements.`,
          );
        }


        if (
          placements.length ===
            0
        ) {
          return;
        }


        const seenPlacementLocations =
          new Set<
            string
          >();


        placements.forEach(
          (
            placement,
          ) => {
            if (
              !locationById.has(
                placement.locationId,
              )
            ) {
              throw new Error(
                `Portfolio map validation: project "${project.slug}" references unknown map location "${placement.locationId}".`,
              );
            }


            if (
              seenPlacementLocations.has(
                placement.locationId,
              )
            ) {
              throw new Error(
                `Portfolio map validation: project "${project.slug}" contains duplicate placement "${placement.locationId}".`,
              );
            }


            seenPlacementLocations.add(
              placement.locationId,
            );
          },
        );
      },
    );
  };
