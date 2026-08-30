import * as THREE from 'three';

import {
  type GlobeCity,
} from './cityLocations';

import {
  geographicVector,
} from './earthOrientation';

export interface CityAnchor {
  city: GlobeCity;
  object: THREE.Object3D;
}

export interface ProjectedCityAnchor {
  city: GlobeCity;
  x: number;
  y: number;
  facing: number;
}

export function createCityAnchors(
  cities: readonly GlobeCity[],
  earthMesh: THREE.Object3D,
  earthRadius: number,
): CityAnchor[] {
  return cities.map(
    (city) => {
      const object =
        new THREE.Object3D();

      object.position.copy(
        geographicVector(
          city.latitude,
          city.longitude,
        ).multiplyScalar(
          earthRadius,
        ),
      );

      object.name =
        `city:${city.timeZone}`;

      earthMesh.add(
        object,
      );

      return {
        city,
        object,
      };
    },
  );
}

export function projectCityAnchor(
  anchor: CityAnchor,
  earthMesh: THREE.Object3D,
  camera: THREE.Camera,
  width: number,
  height: number,
  minFacing = 0.12,
): ProjectedCityAnchor | null {
  const worldPoint =
    anchor.object.getWorldPosition(
      new THREE.Vector3(),
    );

  const earthCenter =
    earthMesh.getWorldPosition(
      new THREE.Vector3(),
    );

  const surfaceNormal =
    worldPoint
      .clone()
      .sub(
        earthCenter,
      )
      .normalize();

  const towardCamera =
    camera.position
      .clone()
      .sub(
        worldPoint,
      )
      .normalize();

  const facing =
    surfaceNormal.dot(
      towardCamera,
    );

  if (
    facing <=
    minFacing
  ) {
    return null;
  }

  const projected =
    worldPoint
      .clone()
      .project(
        camera,
      );

  if (
    projected.z < -1 ||
    projected.z > 1
  ) {
    return null;
  }

  return {
    city:
      anchor.city,

    x:
      (
        projected.x +
        1
      ) *
      0.5 *
      width,

    y:
      (
        1 -
        projected.y
      ) *
      0.5 *
      height,

    facing,
  };
}