import * as THREE from 'three';

const Y_AXIS =
  new THREE.Vector3(
    0,
    1,
    0,
  );

const X_AXIS =
  new THREE.Vector3(
    1,
    0,
    0,
  );

export function geographicVector(
  latitude: number,
  longitude: number,
): THREE.Vector3 {
  const latitudeRad =
    THREE.MathUtils.degToRad(
      latitude,
    );

  const longitudeRad =
    THREE.MathUtils.degToRad(
      longitude,
    );

  const cosLatitude =
    Math.cos(
      latitudeRad,
    );

  return new THREE.Vector3(
    cosLatitude *
      Math.cos(
        longitudeRad,
      ),

    Math.sin(
      latitudeRad,
    ),

    -cosLatitude *
      Math.sin(
        longitudeRad,
      ),
  ).normalize();
}

export function createPresentationQuaternion(
  latitude: number,
  longitude: number,
): THREE.Quaternion {
  const yaw =
    new THREE.Quaternion()
      .setFromAxisAngle(
        Y_AXIS,
        THREE.MathUtils.degToRad(
          -90 -
            longitude,
        ),
      );

  const pitch =
    new THREE.Quaternion()
      .setFromAxisAngle(
        X_AXIS,
        THREE.MathUtils.degToRad(
          latitude,
        ),
      );

  return pitch
    .multiply(
      yaw,
    )
    .normalize();
}

export function createInteractivePresentationQuaternion(
  defaultOrientation:
    THREE.Quaternion,
  yawOffsetRad: number,
  pitchOffsetRad: number,
): THREE.Quaternion {
  const yaw =
    new THREE.Quaternion()
      .setFromAxisAngle(
        Y_AXIS,
        yawOffsetRad,
      );

  const pitch =
    new THREE.Quaternion()
      .setFromAxisAngle(
        X_AXIS,
        pitchOffsetRad,
      );

  return pitch
    .multiply(
      yaw,
    )
    .multiply(
      defaultOrientation,
    )
    .normalize();
}

export function getPresentedRegionDirection(
  latitude: number,
  longitude: number,
): THREE.Vector3 {
  const direction =
    geographicVector(
      latitude,
      longitude,
    );

  const presentation =
    createPresentationQuaternion(
      latitude,
      longitude,
    );

  return direction
    .applyQuaternion(
      presentation,
    )
    .normalize();
}