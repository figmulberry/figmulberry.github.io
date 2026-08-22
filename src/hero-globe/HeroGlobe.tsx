import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import * as THREE from 'three';

import {
  CALIBRATION_CITIES,
} from './cityLocations';

import {
  createCityAnchors,
  projectCityAnchor,
  type ProjectedCityAnchor,
} from './cityAnchors';

import {
  createInteractivePresentationQuaternion,
  createPresentationQuaternion,
} from './earthOrientation';

import {
  getTimezoneCenter,
} from './timezoneCenters';

import {
  getSolarDirectionVector,
} from '../solar-engine/solarPosition';

import {
  getMoonState,
  type MoonState,
} from '../solar-engine/celestialState';

const EARTH_RADIUS = 1;
const ATMOSPHERE_RADIUS = 1.022;
const MAX_PIXEL_RATIO = 1.5;

const CELESTIAL_UPDATE_INTERVAL_MS =
  30_000;

const AUTO_RETURN_DELAY_MS =
  15_000;

const AUTO_RETURN_DURATION_MS =
  1_250;

const DRAG_ROTATION_SCALE =
  0.005;

const WHEEL_ROTATION_SCALE =
  0.0014;

const MAX_PITCH_OFFSET =
  THREE.MathUtils.degToRad(
    72,
  );

const MAX_CITY_LABELS = 2;
const MIN_LABEL_DISTANCE_PX = 88;
const MIN_CITY_FACING = 0.12;

export interface GlobeOrientation {
  x: number;
  y: number;
  z: number;
  w: number;
  isManual: boolean;
}

export interface ProjectedSunPosition {
  visible: boolean;
  surfaceX: number;
  surfaceY: number;
  angleDeg: number;
  frontFacing: number;
}

export interface ProjectedMoonPosition {
  visible: boolean;
  surfaceX: number;
  surfaceY: number;
  angleDeg: number;
  frontFacing: number;
  illuminatedFraction: number;
  phaseAngleDeg: number;
  phaseName: string;
  waxing: boolean;
  brightLimbAngleDeg: number;
}

interface HeroGlobeProps {
  onOrientationChange?: (
    orientation: GlobeOrientation,
  ) => void;

  onSunPositionChange?: (
    sun: ProjectedSunPosition,
  ) => void;

  onMoonPositionChange?: (
    moon: ProjectedMoonPosition,
  ) => void;
}

interface CityDisplayState {
  projected: ProjectedCityAnchor;
  showLabel: boolean;
}

function getViewerTimeZone():
  string | undefined {
  try {
    return Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;
  } catch {
    return undefined;
  }
}

function clampPitch(
  value: number,
): number {
  return THREE.MathUtils.clamp(
    value,
    -MAX_PITCH_OFFSET,
    MAX_PITCH_OFFSET,
  );
}

function easeInOutCubic(
  value: number,
): number {
  return value < 0.5
    ? 4 *
        value *
        value *
        value
    : 1 -
        Math.pow(
          -2 *
            value +
            2,
          3,
        ) /
          2;
}

function isPointInsideCircle(
  element: HTMLElement,
  clientX: number,
  clientY: number,
): boolean {
  const bounds =
    element.getBoundingClientRect();

  const centerX =
    bounds.left +
    bounds.width / 2;

  const centerY =
    bounds.top +
    bounds.height / 2;

  const radius =
    Math.min(
      bounds.width,
      bounds.height,
    ) / 2;

  const deltaX =
    clientX -
    centerX;

  const deltaY =
    clientY -
    centerY;

  return (
    deltaX * deltaX +
      deltaY * deltaY <=
    radius * radius
  );
}

function areLabelsSeparated(
  first: ProjectedCityAnchor,
  second: ProjectedCityAnchor,
): boolean {
  const deltaX =
    first.x -
    second.x;

  const deltaY =
    first.y -
    second.y;

  return (
    Math.sqrt(
      deltaX * deltaX +
        deltaY * deltaY,
    ) >=
    MIN_LABEL_DISTANCE_PX
  );
}

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vEarthNormal;

  void main() {
    vUv = uv;
    vEarthNormal = normalize(position);

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  precision highp float;

  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform vec3 uSunDirectionEarth;

  varying vec2 vUv;
  varying vec3 vEarthNormal;

  const float RAD_TO_DEG =
    57.29577951308232;

  float twilightBrightness(
    float elevation
  ) {
    if (elevation >= 0.0) {
      return 0.88;
    }

    if (elevation >= -6.0) {
      return mix(
        0.30,
        0.76,
        smoothstep(
          -6.0,
          0.0,
          elevation
        )
      );
    }

    if (elevation >= -12.0) {
      return mix(
        0.105,
        0.30,
        smoothstep(
          -12.0,
          -6.0,
          elevation
        )
      );
    }

    if (elevation >= -18.0) {
      return mix(
        0.032,
        0.105,
        smoothstep(
          -18.0,
          -12.0,
          elevation
        )
      );
    }

    return 0.016;
  }

  float daylightBrightness(
    float elevation
  ) {
    return mix(
      0.88,
      1.18,
      smoothstep(
        0.0,
        55.0,
        elevation
      )
    );
  }

  float surfaceBrightness(
    float elevation
  ) {
    float twilight =
      twilightBrightness(
        elevation
      );

    float daylight =
      daylightBrightness(
        max(
          elevation,
          0.0
        )
      );

    float terminator =
      smoothstep(
        -0.9,
        0.9,
        elevation
      );

    return mix(
      twilight,
      daylight,
      terminator
    );
  }

  float cityLightVisibility(
    float elevation
  ) {
    return 1.0 -
      smoothstep(
        -18.0,
        -5.0,
        elevation
      );
  }

  void main() {
    vec3 surfaceNormal =
      normalize(
        vEarthNormal
      );

    vec3 sunDirection =
      normalize(
        uSunDirectionEarth
      );

    float solarDot =
      clamp(
        dot(
          surfaceNormal,
          sunDirection
        ),
        -1.0,
        1.0
      );

    float solarElevation =
      asin(
        solarDot
      ) *
      RAD_TO_DEG;

    vec3 dayTexture =
      texture2D(
        uDayMap,
        vUv
      ).rgb;

    vec3 nightTexture =
      texture2D(
        uNightMap,
        vUv
      ).rgb;

    float dayLuma =
      dot(
        dayTexture,
        vec3(
          0.2126,
          0.7152,
          0.0722
        )
      );

    vec3 restrainedDay =
      mix(
        dayTexture,
        vec3(
          dayLuma
        ),
        0.045
      );

    float brightness =
      surfaceBrightness(
        solarElevation
      );

    float sunFacing =
      max(
        solarDot,
        0.0
      );

    float directLight =
      1.0 +
      0.22 *
      pow(
        sunFacing,
        1.35
      );

    vec3 surfaceColour =
      restrainedDay *
      brightness *
      directLight;

    float nightLuma =
      dot(
        nightTexture,
        vec3(
          0.2126,
          0.7152,
          0.0722
        )
      );

    float cityMask =
      smoothstep(
        0.035,
        0.34,
        nightLuma
      );

    float cityVisibility =
      cityLightVisibility(
        solarElevation
      );

    vec3 cityColour =
      vec3(
        1.0,
        0.38,
        0.075
      );

    vec3 cityLights =
      cityColour *
      cityMask *
      cityVisibility *
      0.72;

    float deepNight =
      1.0 -
      smoothstep(
        -18.0,
        -12.0,
        solarElevation
      );

    vec3 nightSurface =
      restrainedDay *
      vec3(
        0.008,
        0.010,
        0.016
      ) *
      deepNight;

    vec3 finalColour =
      surfaceColour +
      nightSurface +
      cityLights;

    gl_FragColor =
      vec4(
        finalColour,
        1.0
      );
  }
`;

const atmosphereVertexShader = `
  varying vec3 vViewNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 viewPosition =
      modelViewMatrix *
      vec4(
        position,
        1.0
      );

    vViewNormal =
      normalize(
        normalMatrix *
        normal
      );

    vViewDirection =
      normalize(
        -viewPosition.xyz
      );

    gl_Position =
      projectionMatrix *
      viewPosition;
  }
`;

const atmosphereFragmentShader = `
  precision highp float;

  varying vec3 vViewNormal;
  varying vec3 vViewDirection;

  void main() {
    float facing =
      clamp(
        dot(
          normalize(vViewNormal),
          normalize(vViewDirection)
        ),
        0.0,
        1.0
      );

    float rim =
      pow(
        1.0 -
        facing,
        4.6
      );

    vec3 atmosphereColour =
      vec3(
        0.15,
        0.56,
        0.76
      );

    gl_FragColor =
      vec4(
        atmosphereColour *
        rim,
        rim *
        0.045
      );
  }
`;

export default function HeroGlobe({
  onOrientationChange,
  onSunPositionChange,
  onMoonPositionChange,
}: HeroGlobeProps) {
  const mountRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const orientationCallbackRef =
    useRef(
      onOrientationChange,
    );

  const sunCallbackRef =
    useRef(
      onSunPositionChange,
    );

  const moonCallbackRef =
    useRef(
      onMoonPositionChange,
    );

  const [
    cityDisplay,
    setCityDisplay,
  ] =
    useState<CityDisplayState[]>(
      [],
    );

  orientationCallbackRef.current =
    onOrientationChange;

  sunCallbackRef.current =
    onSunPositionChange;

  moonCallbackRef.current =
    onMoonPositionChange;

  useEffect(() => {
    const mountCandidate =
      mountRef.current;

    if (!mountCandidate) {
      return;
    }

    const mount =
      mountCandidate;

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.PerspectiveCamera(
        36,
        1,
        0.1,
        100,
      );

    camera.position.set(
      0,
      0.08,
      3.18,
    );

    camera.lookAt(
      0,
      0,
      0,
    );

    camera.updateMatrixWorld(
      true,
    );

    const renderer =
      new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference:
          'high-performance',
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,
        MAX_PIXEL_RATIO,
      ),
    );

    renderer.setClearColor(
      0x000000,
      0,
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.NoToneMapping;

    renderer.domElement.style.width =
      '100%';

    renderer.domElement.style.height =
      '100%';

    renderer.domElement.style.display =
      'block';

    renderer.domElement.style.pointerEvents =
      'auto';

    renderer.domElement.style.touchAction =
      'none';

    renderer.domElement.setAttribute(
      'aria-label',
      'Interactive live Earth',
    );

    mount.appendChild(
      renderer.domElement,
    );

    let isVisible =
      true;

    const presentationGroup =
      new THREE.Group();

    scene.add(
      presentationGroup,
    );

    const timeZone =
      getViewerTimeZone();

    const region =
      getTimezoneCenter(
        timeZone,
      );

    const defaultOrientation =
      createPresentationQuaternion(
        region.latitude,
        region.longitude,
      );

    presentationGroup.quaternion.copy(
      defaultOrientation,
    );

    let yawOffset = 0;
    let pitchOffset = 0;

    let isManual = false;
    let isDragging = false;

    let activePointerId:
      number |
      null =
      null;

    let previousPointerX = 0;
    let previousPointerY = 0;

    let autoReturnTimeout:
      number |
      undefined;

    let returnAnimationFrame:
      number |
      undefined;

    const textureLoader =
      new THREE.TextureLoader();

    const dayTexture =
      textureLoader.load(
        '/hero-earth/earth-day.jpg',
      );

    dayTexture.colorSpace =
      THREE.SRGBColorSpace;

    dayTexture.wrapS =
      THREE.RepeatWrapping;

    dayTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    const nightTexture =
      textureLoader.load(
        '/hero-earth/earth-night.jpg',
      );

    nightTexture.colorSpace =
      THREE.SRGBColorSpace;

    nightTexture.wrapS =
      THREE.RepeatWrapping;

    nightTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    const maxAnisotropy =
      renderer.capabilities
        .getMaxAnisotropy();

    dayTexture.anisotropy =
      Math.min(
        8,
        maxAnisotropy,
      );

    nightTexture.anisotropy =
      Math.min(
        8,
        maxAnisotropy,
      );

    const sunDirectionEarth =
      new THREE.Vector3(
        1,
        0,
        0,
      );

    const moonDirectionEarth =
      new THREE.Vector3(
        1,
        0,
        0,
      );

    let currentMoonState:
      MoonState =
      getMoonState(
        new Date(),
      );

    moonDirectionEarth
      .set(
        currentMoonState.direction.x,
        currentMoonState.direction.y,
        currentMoonState.direction.z,
      )
      .normalize();

    const earthMaterial =
      new THREE.ShaderMaterial({
        uniforms: {
          uDayMap: {
            value:
              dayTexture,
          },

          uNightMap: {
            value:
              nightTexture,
          },

          uSunDirectionEarth: {
            value:
              sunDirectionEarth,
          },
        },

        vertexShader:
          earthVertexShader,

        fragmentShader:
          earthFragmentShader,

        depthWrite: true,
        depthTest: true,
        toneMapped: false,
      });

    const earthGeometry =
      new THREE.SphereGeometry(
        EARTH_RADIUS,
        160,
        160,
      );

    const earthMesh =
      new THREE.Mesh(
        earthGeometry,
        earthMaterial,
      );

    presentationGroup.add(
      earthMesh,
    );

    const cityAnchors =
      createCityAnchors(
        CALIBRATION_CITIES,
        earthMesh,
        EARTH_RADIUS,
      );

    const atmosphereGeometry =
      new THREE.SphereGeometry(
        ATMOSPHERE_RADIUS,
        128,
        128,
      );

    const atmosphereMaterial =
      new THREE.ShaderMaterial({
        vertexShader:
          atmosphereVertexShader,

        fragmentShader:
          atmosphereFragmentShader,

        transparent: true,

        side:
          THREE.BackSide,

        blending:
          THREE.AdditiveBlending,

        depthWrite: false,

        toneMapped: false,
      });

    const atmosphereMesh =
      new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial,
      );

    presentationGroup.add(
      atmosphereMesh,
    );

    const cameraInverseQuaternion =
      new THREE.Quaternion();

    const worldSunDirection =
      new THREE.Vector3();

    const cameraSunDirection =
      new THREE.Vector3();

    const sunSurfaceWorld =
      new THREE.Vector3();

    const sunSurfaceProjected =
      new THREE.Vector3();

    const worldMoonDirection =
      new THREE.Vector3();

    const cameraMoonDirection =
      new THREE.Vector3();

    const moonSurfaceWorld =
      new THREE.Vector3();

    const moonSurfaceProjected =
      new THREE.Vector3();

    const moonToSunTangent =
      new THREE.Vector3();

    let previousBrightLimbAngleDeg =
      0;

    function emitOrientation() {
      const quaternion =
        presentationGroup.quaternion;

      orientationCallbackRef.current?.({
        x:
          quaternion.x,

        y:
          quaternion.y,

        z:
          quaternion.z,

        w:
          quaternion.w,

        isManual,
      });
    }

    function updateCameraSunDirection() {
      camera.updateMatrixWorld(
        true,
      );

      worldSunDirection
        .copy(
          sunDirectionEarth,
        )
        .applyQuaternion(
          presentationGroup.quaternion,
        )
        .normalize();

      cameraInverseQuaternion
        .copy(
          camera.quaternion,
        )
        .invert();

      cameraSunDirection
        .copy(
          worldSunDirection,
        )
        .applyQuaternion(
          cameraInverseQuaternion,
        )
        .normalize();
    }

    function updateProjectedSun() {
      updateCameraSunDirection();

      const frontFacing =
        cameraSunDirection.z;

      const angleDeg =
        THREE.MathUtils.radToDeg(
          Math.atan2(
            cameraSunDirection.y,
            cameraSunDirection.x,
          ),
        );

      if (
        frontFacing <=
        0
      ) {
        sunCallbackRef.current?.({
          visible: false,
          surfaceX: 0.5,
          surfaceY: 0.5,
          angleDeg,
          frontFacing,
        });

        return;
      }

      sunSurfaceWorld
        .copy(
          worldSunDirection,
        )
        .multiplyScalar(
          EARTH_RADIUS,
        );

      sunSurfaceProjected
        .copy(
          sunSurfaceWorld,
        )
        .project(
          camera,
        );

      const surfaceX =
        (
          sunSurfaceProjected.x +
          1
        ) /
        2;

      const surfaceY =
        (
          1 -
          sunSurfaceProjected.y
        ) /
        2;

      sunCallbackRef.current?.({
        visible: true,

        surfaceX:
          THREE.MathUtils.clamp(
            surfaceX,
            0,
            1,
          ),

        surfaceY:
          THREE.MathUtils.clamp(
            surfaceY,
            0,
            1,
          ),

        angleDeg,

        frontFacing:
          THREE.MathUtils.clamp(
            frontFacing,
            0,
            1,
          ),
      });
    }

    function calculateBrightLimbAngle():
      number {
      const sunDotMoon =
        cameraSunDirection.dot(
          cameraMoonDirection,
        );

      moonToSunTangent
        .copy(
          cameraSunDirection,
        )
        .addScaledVector(
          cameraMoonDirection,
          -sunDotMoon,
        );

      const tangentMagnitude =
        Math.hypot(
          moonToSunTangent.x,
          moonToSunTangent.y,
        );

      if (
        tangentMagnitude >
        0.000001
      ) {
        previousBrightLimbAngleDeg =
          -THREE.MathUtils.radToDeg(
            Math.atan2(
              moonToSunTangent.y,
              moonToSunTangent.x,
            ),
          );
      }

      return previousBrightLimbAngleDeg;
    }

    function updateProjectedMoon() {
      camera.updateMatrixWorld(
        true,
      );

      worldMoonDirection
        .copy(
          moonDirectionEarth,
        )
        .applyQuaternion(
          presentationGroup.quaternion,
        )
        .normalize();

      cameraInverseQuaternion
        .copy(
          camera.quaternion,
        )
        .invert();

      cameraMoonDirection
        .copy(
          worldMoonDirection,
        )
        .applyQuaternion(
          cameraInverseQuaternion,
        )
        .normalize();

      updateCameraSunDirection();

      const frontFacing =
        cameraMoonDirection.z;

      const angleDeg =
        THREE.MathUtils.radToDeg(
          Math.atan2(
            cameraMoonDirection.y,
            cameraMoonDirection.x,
          ),
        );

      const brightLimbAngleDeg =
        calculateBrightLimbAngle();

      if (
        frontFacing <=
        0
      ) {
        moonCallbackRef.current?.({
          visible: false,
          surfaceX: 0.5,
          surfaceY: 0.5,
          angleDeg,
          frontFacing,

          illuminatedFraction:
            currentMoonState
              .illuminatedFraction,

          phaseAngleDeg:
            currentMoonState
              .phaseAngleDeg,

          phaseName:
            currentMoonState
              .phaseName,

          waxing:
            currentMoonState
              .waxing,

          brightLimbAngleDeg,
        });

        return;
      }

      moonSurfaceWorld
        .copy(
          worldMoonDirection,
        )
        .multiplyScalar(
          EARTH_RADIUS,
        );

      moonSurfaceProjected
        .copy(
          moonSurfaceWorld,
        )
        .project(
          camera,
        );

      const surfaceX =
        (
          moonSurfaceProjected.x +
          1
        ) /
        2;

      const surfaceY =
        (
          1 -
          moonSurfaceProjected.y
        ) /
        2;

      moonCallbackRef.current?.({
        visible: true,

        surfaceX:
          THREE.MathUtils.clamp(
            surfaceX,
            0,
            1,
          ),

        surfaceY:
          THREE.MathUtils.clamp(
            surfaceY,
            0,
            1,
          ),

        angleDeg,

        frontFacing:
          THREE.MathUtils.clamp(
            frontFacing,
            0,
            1,
          ),

        illuminatedFraction:
          currentMoonState
            .illuminatedFraction,

        phaseAngleDeg:
          currentMoonState
            .phaseAngleDeg,

        phaseName:
          currentMoonState
            .phaseName,

        waxing:
          currentMoonState
            .waxing,

        brightLimbAngleDeg,
      });
    }

    function updateCityDisplay() {
      const bounds =
        mount.getBoundingClientRect();

      if (
        bounds.width <= 0 ||
        bounds.height <= 0
      ) {
        return;
      }

      scene.updateMatrixWorld(
        true,
      );

      camera.updateMatrixWorld(
        true,
      );

      const visible =
        cityAnchors
          .map(
            (
              anchor,
            ) =>
              projectCityAnchor(
                anchor,
                earthMesh,
                camera,
                bounds.width,
                bounds.height,
                MIN_CITY_FACING,
              ),
          )
          .filter(
            (
              projected,
            ): projected is ProjectedCityAnchor =>
              projected !==
              null,
          );

      const ranked =
        [...visible].sort(
          (
            first,
            second,
          ) =>
            second.city.priority -
              first.city.priority ||
            second.facing -
              first.facing,
        );

      const labeled:
        ProjectedCityAnchor[] =
        [];

      for (
        const candidate of
          ranked
      ) {
        const separated =
          labeled.every(
            (
              existing,
            ) =>
              areLabelsSeparated(
                candidate,
                existing,
              ),
          );

        if (!separated) {
          continue;
        }

        labeled.push(
          candidate,
        );

        if (
          labeled.length >=
          MAX_CITY_LABELS
        ) {
          break;
        }
      }

      const labeledZones =
        new Set(
          labeled.map(
            (
              item,
            ) =>
              item.city.timeZone,
          ),
        );

      setCityDisplay(
        visible.map(
          (
            projected,
          ) => ({
            projected,

            showLabel:
              labeledZones.has(
                projected.city.timeZone,
              ),
          }),
        ),
      );
    }

    function renderScene() {
      if (!isVisible) {
        return;
      }

      renderer.render(
        scene,
        camera,
      );

      updateCityDisplay();
      updateProjectedSun();
      updateProjectedMoon();
    }

    function applyManualOrientation() {
      presentationGroup.quaternion.copy(
        createInteractivePresentationQuaternion(
          defaultOrientation,
          yawOffset,
          pitchOffset,
        ),
      );

      emitOrientation();
      renderScene();
    }

    function cancelReturnAnimation() {
      if (
        returnAnimationFrame !==
        undefined
      ) {
        window.cancelAnimationFrame(
          returnAnimationFrame,
        );

        returnAnimationFrame =
          undefined;
      }
    }

    function cancelAutoReturnTimer() {
      if (
        autoReturnTimeout !==
        undefined
      ) {
        window.clearTimeout(
          autoReturnTimeout,
        );

        autoReturnTimeout =
          undefined;
      }
    }

    function returnToDefault() {
      cancelAutoReturnTimer();
      cancelReturnAnimation();

      const startOrientation =
        presentationGroup
          .quaternion
          .clone();

      const startTime =
        performance.now();

      function animate(
        currentTime: number,
      ) {
        const elapsed =
          currentTime -
          startTime;

        const progress =
          Math.min(
            elapsed /
              AUTO_RETURN_DURATION_MS,
            1,
          );

        const easedProgress =
          easeInOutCubic(
            progress,
          );

        presentationGroup
          .quaternion
          .slerpQuaternions(
            startOrientation,
            defaultOrientation,
            easedProgress,
          );

        emitOrientation();
        renderScene();

        if (
          progress <
          1
        ) {
          returnAnimationFrame =
            window.requestAnimationFrame(
              animate,
            );

          return;
        }

        yawOffset = 0;
        pitchOffset = 0;
        isManual = false;

        presentationGroup
          .quaternion
          .copy(
            defaultOrientation,
          );

        returnAnimationFrame =
          undefined;

        emitOrientation();
        renderScene();
      }

      returnAnimationFrame =
        window.requestAnimationFrame(
          animate,
        );
    }

    function scheduleAutoReturn() {
      cancelAutoReturnTimer();

      autoReturnTimeout =
        window.setTimeout(
          returnToDefault,
          AUTO_RETURN_DELAY_MS,
        );
    }

    function beginManualInteraction() {
      cancelReturnAnimation();
      cancelAutoReturnTimer();

      isManual =
        true;
    }

    function updateCelestialState() {
      const now =
        new Date();

      const solar =
        getSolarDirectionVector(
          now,
        );

      sunDirectionEarth
        .set(
          solar.x,
          solar.y,
          solar.z,
        )
        .normalize();

      currentMoonState =
        getMoonState(
          now,
        );

      moonDirectionEarth
        .set(
          currentMoonState
            .direction.x,

          currentMoonState
            .direction.y,

          currentMoonState
            .direction.z,
        )
        .normalize();

      renderScene();
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        !isPointInsideCircle(
          mount,
          event.clientX,
          event.clientY,
        )
      ) {
        return;
      }

      beginManualInteraction();

      isDragging =
        true;

      activePointerId =
        event.pointerId;

      previousPointerX =
        event.clientX;

      previousPointerY =
        event.clientY;

      renderer.domElement
        .setPointerCapture(
          event.pointerId,
        );

      renderer.domElement.style.cursor =
        'grabbing';
    }

    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (
        !isDragging ||
        event.pointerId !==
          activePointerId
      ) {
        renderer.domElement.style.cursor =
          isPointInsideCircle(
            mount,
            event.clientX,
            event.clientY,
          )
            ? 'grab'
            : 'default';

        return;
      }

      const deltaX =
        event.clientX -
        previousPointerX;

      const deltaY =
        event.clientY -
        previousPointerY;

      previousPointerX =
        event.clientX;

      previousPointerY =
        event.clientY;

      yawOffset +=
        deltaX *
        DRAG_ROTATION_SCALE;

      pitchOffset =
        clampPitch(
          pitchOffset +
            deltaY *
              DRAG_ROTATION_SCALE,
        );

      applyManualOrientation();
    }

    function finishPointerInteraction(
      event: PointerEvent,
    ) {
      if (
        event.pointerId !==
        activePointerId
      ) {
        return;
      }

      if (
        renderer.domElement
          .hasPointerCapture(
            event.pointerId,
          )
      ) {
        renderer.domElement
          .releasePointerCapture(
            event.pointerId,
          );
      }

      isDragging =
        false;

      activePointerId =
        null;

      renderer.domElement.style.cursor =
        'grab';

      scheduleAutoReturn();
    }

    function handleWheel(
      event: WheelEvent,
    ) {
      if (
        !isPointInsideCircle(
          mount,
          event.clientX,
          event.clientY,
        )
      ) {
        return;
      }

      event.preventDefault();

      beginManualInteraction();

      yawOffset -=
        event.deltaY *
        WHEEL_ROTATION_SCALE;

      applyManualOrientation();
      scheduleAutoReturn();
    }

    function handleDoubleClick(
      event: MouseEvent,
    ) {
      if (
        !isPointInsideCircle(
          mount,
          event.clientX,
          event.clientY,
        )
      ) {
        return;
      }

      returnToDefault();
    }

    renderer.domElement
      .addEventListener(
        'pointerdown',
        handlePointerDown,
      );

    renderer.domElement
      .addEventListener(
        'pointermove',
        handlePointerMove,
      );

    renderer.domElement
      .addEventListener(
        'pointerup',
        finishPointerInteraction,
      );

    renderer.domElement
      .addEventListener(
        'pointercancel',
        finishPointerInteraction,
      );

    renderer.domElement
      .addEventListener(
        'wheel',
        handleWheel,
        {
          passive: false,
        },
      );

    renderer.domElement
      .addEventListener(
        'dblclick',
        handleDoubleClick,
      );

    function resize() {
      const bounds =
        mount.getBoundingClientRect();

      const width =
        Math.floor(
          bounds.width,
        );

      const height =
        Math.floor(
          bounds.height,
        );

      if (
        width <= 0 ||
        height <= 0
      ) {
        return;
      }

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio ||
            1,
          MAX_PIXEL_RATIO,
        ),
      );

      renderer.setSize(
        width,
        height,
        false,
      );

      camera.aspect =
        width /
        height;

      camera.updateProjectionMatrix();

      renderScene();
    }

    const resizeObserver =
      new ResizeObserver(
        resize,
      );

    resizeObserver.observe(
      mount,
    );

    const intersectionObserver =
      new IntersectionObserver(
        (
          entries,
        ) => {
          const entry =
            entries[0];

          if (!entry) {
            return;
          }

          isVisible =
            entry.isIntersecting;

          if (isVisible) {
            updateCelestialState();
          }
        },
        {
          root: null,

          rootMargin:
            '200px 0px',

          threshold: 0,
        },
      );

    intersectionObserver.observe(
      mount,
    );

    resize();

    updateCelestialState();
    emitOrientation();

    const celestialUpdateInterval =
      window.setInterval(
        updateCelestialState,
        CELESTIAL_UPDATE_INTERVAL_MS,
      );

    return () => {
      cancelAutoReturnTimer();
      cancelReturnAnimation();

      window.clearInterval(
        celestialUpdateInterval,
      );

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      renderer.domElement
        .removeEventListener(
          'pointerdown',
          handlePointerDown,
        );

      renderer.domElement
        .removeEventListener(
          'pointermove',
          handlePointerMove,
        );

      renderer.domElement
        .removeEventListener(
          'pointerup',
          finishPointerInteraction,
        );

      renderer.domElement
        .removeEventListener(
          'pointercancel',
          finishPointerInteraction,
        );

      renderer.domElement
        .removeEventListener(
          'wheel',
          handleWheel,
        );

      renderer.domElement
        .removeEventListener(
          'dblclick',
          handleDoubleClick,
        );

      cityAnchors.forEach(
        (
          anchor,
        ) => {
          earthMesh.remove(
            anchor.object,
          );
        },
      );

      earthGeometry.dispose();
      atmosphereGeometry.dispose();

      earthMaterial.dispose();
      atmosphereMaterial.dispose();

      dayTexture.dispose();
      nightTexture.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (
        renderer.domElement
          .parentElement ===
        mount
      ) {
        mount.removeChild(
          renderer.domElement,
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={[
        'absolute',
        'inset-0',
        'select-none',
      ].join(' ')}
      style={{
        userSelect:
          'none',
      }}
    >
      {cityDisplay.map(
        (
          item,
        ) => {
          const {
            projected,
            showLabel,
          } =
            item;

          return (
            <div
              key={
                projected.city
                  .timeZone
              }
              className={[
                'pointer-events-none',
                'absolute',
                'z-20',
              ].join(' ')}
              style={{
                left:
                  `${projected.x}px`,

                top:
                  `${projected.y}px`,

                opacity:
                  THREE.MathUtils.clamp(
                    0.42 +
                      projected.facing *
                        0.58,
                    0,
                    1,
                  ),
              }}
            >
              <span
                className={[
                  'absolute',
                  'left-0',
                  'top-0',
                  'h-2',
                  'w-2',
                  '-translate-x-1/2',
                  '-translate-y-1/2',
                  'rounded-full',
                  'bg-accent',
                  'shadow-[0_0_7px_hsl(var(--accent)/0.55)]',
                ].join(' ')}
              />

              {showLabel && (
                <span
                  className={[
                    'absolute',
                    'left-2.5',
                    'top-0',
                    '-translate-y-1/2',
                    'whitespace-nowrap',
                    'rounded-sm',
                    'bg-black/45',
                    'px-1.5',
                    'py-0.5',
                    'text-[0.62rem]',
                    'font-medium',
                    'text-white/82',
                    'backdrop-blur-sm',
                  ].join(' ')}
                >
                  {
                    projected.city
                      .name
                  }
                </span>
              )}
            </div>
          );
        },
      )}
    </div>
  );
}