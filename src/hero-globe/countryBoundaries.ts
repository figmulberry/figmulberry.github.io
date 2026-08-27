import * as THREE from 'three';

import type {
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Position,
} from 'geojson';


type CountryGeometry =
  | Polygon
  | MultiPolygon;


type WorldGeoJSON =
  FeatureCollection<
    CountryGeometry
  >;


const DEFAULT_BOUNDARY_RADIUS =
  1.0025;

const ANTIMERIDIAN_BREAK_DEGREES =
  180;


/**
 * Convert geographic longitude / latitude into the same
 * Earth-local Cartesian coordinate system used by HeroGlobe.
 *
 * HeroGlobe interprets geographic direction as:
 *
 *   latitude  = asin(y)
 *   longitude = atan2(-z, x)
 *
 * Therefore:
 *
 *   x = cos(lat) * cos(lon)
 *   y = sin(lat)
 *   z = -cos(lat) * sin(lon)
 */
function geographicToVector3(
  longitude: number,
  latitude: number,
  radius: number,
): THREE.Vector3 {

  const longitudeRadians =
    THREE.MathUtils.degToRad(
      longitude,
    );

  const latitudeRadians =
    THREE.MathUtils.degToRad(
      latitude,
    );

  const cosLatitude =
    Math.cos(
      latitudeRadians,
    );

  return new THREE.Vector3(
    radius *
      cosLatitude *
      Math.cos(
        longitudeRadians,
      ),

    radius *
      Math.sin(
        latitudeRadians,
      ),

    -radius *
      cosLatitude *
      Math.sin(
        longitudeRadians,
      ),
  );
}


/**
 * Split a GeoJSON ring whenever adjacent longitude values
 * jump across the antimeridian.
 *
 * Without this guard, geometry such as Fiji can produce
 * a line spanning almost the full globe.
 */
function splitRingAtAntimeridian(
  ring: Position[],
): Position[][] {

  const segments:
    Position[][] =
    [];

  let current:
    Position[] =
    [];

  for (
    let index = 0;
    index < ring.length;
    index += 1
  ) {

    const coordinate =
      ring[index];

    if (
      !coordinate ||
      coordinate.length < 2
    ) {
      continue;
    }

    const longitude =
      Number(
        coordinate[0],
      );

    const latitude =
      Number(
        coordinate[1],
      );

    if (
      !Number.isFinite(
        longitude,
      ) ||
      !Number.isFinite(
        latitude,
      )
    ) {
      continue;
    }

    if (
      current.length > 0
    ) {

      const previous =
        current[
          current.length - 1
        ];

      const previousLongitude =
        Number(
          previous?.[0],
        );

      if (
        Number.isFinite(
          previousLongitude,
        ) &&
        Math.abs(
          longitude -
            previousLongitude,
        ) >
          ANTIMERIDIAN_BREAK_DEGREES
      ) {

        if (
          current.length >= 2
        ) {
          segments.push(
            current,
          );
        }

        current = [];
      }
    }

    current.push(
      [
        longitude,
        latitude,
      ],
    );
  }

  if (
    current.length >= 2
  ) {
    segments.push(
      current,
    );
  }

  return segments;
}


function getGeometryRings(
  geometry: CountryGeometry,
): Position[][] {

  if (
    geometry.type ===
    'Polygon'
  ) {

    return geometry
      .coordinates
      .flatMap(
        (
          ring,
        ) =>
          splitRingAtAntimeridian(
            ring,
          ),
      );
  }

  return geometry
    .coordinates
    .flatMap(
      (
        polygon,
      ) =>
        polygon.flatMap(
          (
            ring,
          ) =>
            splitRingAtAntimeridian(
              ring,
            ),
        ),
    );
}


/**
 * Build a passive line-segment layer slightly above the
 * photorealistic Earth surface.
 *
 * This intentionally creates no fills, labels, hit targets,
 * or independent interaction.
 */
export function createCountryBoundaryLayer(
  world:
    WorldGeoJSON,
  radius:
    number =
      DEFAULT_BOUNDARY_RADIUS,
): THREE.LineSegments {

  const positions:
    number[] =
    [];

  for (
    const feature of
      world.features
  ) {

    if (
      !feature.geometry
    ) {
      continue;
    }

    const rings =
      getGeometryRings(
        feature.geometry,
      );

    for (
      const ring of rings
    ) {

      for (
        let index = 1;
        index < ring.length;
        index += 1
      ) {

        const previous =
          ring[
            index - 1
          ];

        const current =
          ring[index];

        if (
          !previous ||
          !current
        ) {
          continue;
        }

        const first =
          geographicToVector3(
            Number(
              previous[0],
            ),
            Number(
              previous[1],
            ),
            radius,
          );

        const second =
          geographicToVector3(
            Number(
              current[0],
            ),
            Number(
              current[1],
            ),
            radius,
          );

        positions.push(
          first.x,
          first.y,
          first.z,
          second.x,
          second.y,
          second.z,
        );
      }
    }
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3,
    ),
  );

  geometry.computeBoundingSphere();

  const material =
    new THREE.LineBasicMaterial({
      color:
        new THREE.Color(
          0xdbe6ec,
        ),

      transparent:
        true,

      opacity:
        0.10,

      depthTest:
        true,

      depthWrite:
        false,

      toneMapped:
        false,
    });

  const boundaries =
    new THREE.LineSegments(
      geometry,
      material,
    );

  boundaries.name =
    'homepage-country-boundaries';

  boundaries.renderOrder =
    2;

  return boundaries;
}


export type HoverCountry = {
  name: string;
  geometry: CountryGeometry;
};


function getCountryName(
  properties:
    Record<
      string,
      unknown
    > |
    null |
    undefined,
): string {

  if (!properties) {
    return 'Unknown';
  }

  const candidates = [
    properties.NAME_EN,
    properties.NAME,
    properties.NAME_LONG,
    properties.ADMIN,
  ];

  for (
    const candidate of
      candidates
  ) {

    if (
      typeof candidate ===
        'string' &&
      candidate.trim()
    ) {

      return candidate.trim();
    }
  }

  return 'Unknown';
}


function pointInRing(
  longitude: number,
  latitude: number,
  ring: Position[],
): boolean {

  let inside =
    false;

  for (
    let current = 0,
      previous =
        ring.length - 1;
    current < ring.length;
    previous = current++
  ) {

    const currentPoint =
      ring[current];

    const previousPoint =
      ring[previous];

    if (
      !currentPoint ||
      !previousPoint
    ) {
      continue;
    }

    const currentX =
      Number(
        currentPoint[0],
      );

    const currentY =
      Number(
        currentPoint[1],
      );

    const previousX =
      Number(
        previousPoint[0],
      );

    const previousY =
      Number(
        previousPoint[1],
      );

    if (
      !Number.isFinite(
        currentX,
      ) ||
      !Number.isFinite(
        currentY,
      ) ||
      !Number.isFinite(
        previousX,
      ) ||
      !Number.isFinite(
        previousY,
      )
    ) {
      continue;
    }

    const crossesLatitude =
      (
        currentY >
          latitude
      ) !==
      (
        previousY >
          latitude
      );

    if (!crossesLatitude) {
      continue;
    }

    const denominator =
      previousY -
      currentY;

    if (
      Math.abs(
        denominator,
      ) <
      Number.EPSILON
    ) {
      continue;
    }

    const crossingLongitude =
      (
        (
          previousX -
          currentX
        ) *
        (
          latitude -
          currentY
        )
      ) /
      denominator +
      currentX;

    if (
      longitude <
      crossingLongitude
    ) {

      inside =
        !inside;
    }
  }

  return inside;
}


function pointInPolygon(
  longitude: number,
  latitude: number,
  polygon:
    Position[][],
): boolean {

  const outerRing =
    polygon[0];

  if (
    !outerRing ||
    !pointInRing(
      longitude,
      latitude,
      outerRing,
    )
  ) {
    return false;
  }

  /*
   * Remaining rings are polygon holes.
   */
  for (
    let index = 1;
    index < polygon.length;
    index += 1
  ) {

    const hole =
      polygon[index];

    if (
      hole &&
      pointInRing(
        longitude,
        latitude,
        hole,
      )
    ) {
      return false;
    }
  }

  return true;
}


export function findCountryAtCoordinate(
  world:
    WorldGeoJSON,
  longitude:
    number,
  latitude:
    number,
): HoverCountry | null {

  for (
    const feature of
      world.features
  ) {

    const geometry =
      feature.geometry;

    if (!geometry) {
      continue;
    }

    let contains =
      false;

    if (
      geometry.type ===
      'Polygon'
    ) {

      contains =
        pointInPolygon(
          longitude,
          latitude,
          geometry.coordinates,
        );

    } else {

      contains =
        geometry.coordinates.some(
          (
            polygon,
          ) =>
            pointInPolygon(
              longitude,
              latitude,
              polygon,
            ),
        );
    }

    if (!contains) {
      continue;
    }

    return {
      name:
        getCountryName(
          feature.properties as
            Record<
              string,
              unknown
            >,
        ),

      geometry,
    };
  }

  return null;
}


export function createCountryHighlightLayer(
  geometry:
    CountryGeometry,
  radius:
    number =
      1.0035,
): THREE.LineSegments {

  const positions:
    number[] =
    [];

  const rings =
    getGeometryRings(
      geometry,
    );

  for (
    const ring of
      rings
  ) {

    for (
      let index = 1;
      index < ring.length;
      index += 1
    ) {

      const previous =
        ring[
          index - 1
        ];

      const current =
        ring[index];

      if (
        !previous ||
        !current
      ) {
        continue;
      }

      const first =
        geographicToVector3(
          Number(
            previous[0],
          ),
          Number(
            previous[1],
          ),
          radius,
        );

      const second =
        geographicToVector3(
          Number(
            current[0],
          ),
          Number(
            current[1],
          ),
          radius,
        );

      positions.push(
        first.x,
        first.y,
        first.z,

        second.x,
        second.y,
        second.z,
      );
    }
  }

  const highlightGeometry =
    new THREE.BufferGeometry();

  highlightGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3,
    ),
  );

  highlightGeometry.computeBoundingSphere();

  const highlightMaterial =
    new THREE.LineBasicMaterial({
      color:
        new THREE.Color(
          0xf3f7f9,
        ),

      transparent:
        true,

      /*
       * Intentionally stronger than the 0.10
       * passive world boundaries, but still
       * restrained enough to preserve the
       * realistic Earth treatment.
       */
      opacity:
        0.32,

      depthTest:
        true,

      depthWrite:
        false,

      toneMapped:
        false,
    });

  const highlight =
    new THREE.LineSegments(
      highlightGeometry,
      highlightMaterial,
    );

  highlight.name =
    'homepage-country-highlight';

  highlight.renderOrder =
    3;

  return highlight;
}

export function disposeCountryBoundaryLayer(
  boundaries:
    THREE.LineSegments,
): void {

  boundaries.geometry.dispose();

  const material =
    boundaries.material;

  if (
    Array.isArray(
      material,
    )
  ) {

    material.forEach(
      (
        item,
      ) => {
        item.dispose();
      },
    );

    return;
  }

  material.dispose();
}