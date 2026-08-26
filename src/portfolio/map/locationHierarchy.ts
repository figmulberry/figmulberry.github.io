import {
  ROOT_LOCATION_ID,
  type LocationIndex,
  type PortfolioLocation,
} from './semanticTypes';


const compareLocations =
  (
    first:
      PortfolioLocation,
    second:
      PortfolioLocation,
  ) => {
    const firstOrder =
      first.sortOrder ??
      0;

    const secondOrder =
      second.sortOrder ??
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

    return first.label.localeCompare(
      second.label,
    );
  };


export const buildLocationIndex =
  (
    locations:
      readonly PortfolioLocation[],
  ):
    LocationIndex => {
    const byId =
      new Map<
        string,
        PortfolioLocation
      >();


    locations.forEach(
      (
        location,
      ) => {
        if (
          byId.has(
            location.id,
          )
        ) {
          throw new Error(
            `Duplicate portfolio location id: ${location.id}`,
          );
        }

        byId.set(
          location.id,
          location,
        );
      },
    );


    const root =
      byId.get(
        ROOT_LOCATION_ID,
      );


    if (
      !root
    ) {
      throw new Error(
        `The location registry must contain the root id "${ROOT_LOCATION_ID}".`,
      );
    }


    if (
      root.parentId !==
      null
    ) {
      throw new Error(
        `The root location "${ROOT_LOCATION_ID}" must have parentId: null.`,
      );
    }


    const childrenByParent =
      new Map<
        string,
        PortfolioLocation[]
      >();


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
            `Non-root location "${location.id}" must have a parentId.`,
          );
        }


        if (
          !byId.has(
            location.parentId,
          )
        ) {
          throw new Error(
            `Location "${location.id}" references missing parent "${location.parentId}".`,
          );
        }


        const siblings =
          childrenByParent.get(
            location.parentId,
          ) ??
          [];


        siblings.push(
          location,
        );


        childrenByParent.set(
          location.parentId,
          siblings,
        );
      },
    );


    childrenByParent.forEach(
      (
        children,
      ) => {
        children.sort(
          compareLocations,
        );
      },
    );


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
              `Cycle detected in portfolio locations at "${current.id}".`,
            );
          }


          visited.add(
            current.id,
          );


          if (
            current.parentId ===
            null
          ) {
            if (
              current.id !==
              ROOT_LOCATION_ID
            ) {
              throw new Error(
                `Location "${location.id}" does not resolve to the "${ROOT_LOCATION_ID}" root.`,
              );
            }

            break;
          }


          current =
            byId.get(
              current.parentId,
            );
        }
      },
    );


    return {
      byId,
      childrenByParent,
      root,
    };
  };


export const getLocationOrThrow =
  (
    index:
      LocationIndex,

    locationId:
      string,
  ):
    PortfolioLocation => {
    const location =
      index.byId.get(
        locationId,
      );


    if (
      !location
    ) {
      throw new Error(
        `Unknown portfolio location: ${locationId}`,
      );
    }


    return location;
  };


export const getAncestorPath =
  (
    index:
      LocationIndex,

    locationId:
      string,
  ):
    readonly PortfolioLocation[] => {
    const reversed:
      PortfolioLocation[] =
      [];


    let current =
      getLocationOrThrow(
        index,
        locationId,
      );


    while (
      true
    ) {
      reversed.push(
        current,
      );


      if (
        current.parentId ===
        null
      ) {
        break;
      }


      current =
        getLocationOrThrow(
          index,
          current.parentId,
        );
    }


    return reversed.reverse();
  };


export const getImmediateChildBelow =
  (
    index:
      LocationIndex,

    ancestorId:
      string,

    descendantId:
      string,
  ):
    PortfolioLocation |
    null => {
    if (
      ancestorId ===
      descendantId
    ) {
      return null;
    }


    const path =
      getAncestorPath(
        index,
        descendantId,
      );


    const ancestorIndex =
      path.findIndex(
        (
          location,
        ) =>
          location.id ===
          ancestorId,
      );


    if (
      ancestorIndex <
      0
    ) {
      return null;
    }


    return (
      path[
        ancestorIndex +
        1
      ] ??
      null
    );
  };


export const isDescendantOrSelf =
  (
    index:
      LocationIndex,

    ancestorId:
      string,

    locationId:
      string,
  ):
    boolean => {
    if (
      ancestorId ===
      locationId
    ) {
      return true;
    }


    return (
      getImmediateChildBelow(
        index,
        ancestorId,
        locationId,
      ) !==
      null
    );
  };
