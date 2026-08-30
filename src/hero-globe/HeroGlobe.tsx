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
  createCountryBoundaryLayer,
  createCountryHighlightLayer,
  disposeCountryBoundaryLayer,
  findCountryAtCoordinate,
} from './countryBoundaries';

import {
  createInteractivePresentationQuaternion,
  createPresentationQuaternion,
} from './earthOrientation';

import {
  getTimezoneCenter,
} from './timezoneCenters';

import {
  calculateSolarPosition,
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
  30_000;

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
  latitude: number;
  longitude: number;
}

export interface ProjectedMoonPosition {
  visible: boolean;
  surfaceX: number;
  surfaceY: number;
  angleDeg: number;
  frontFacing: number;
  latitude: number;
  longitude: number;
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

  timeOffsetMinutes?: number;
}

interface CityDisplayState {
  projected: ProjectedCityAnchor;
  showLabel: boolean;
}

function earthDirectionToCoordinates(
  direction: {
    x: number;
    y: number;
    z: number;
  },
) {
  return {
    latitude:
      THREE.MathUtils.radToDeg(
        Math.asin(
          THREE.MathUtils.clamp(
            direction.y,
            -1,
            1,
          ),
        ),
      ),

    longitude:
      THREE.MathUtils.radToDeg(
        Math.atan2(
          -direction.z,
          direction.x,
        ),
      ),
  };
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
  timeOffsetMinutes = 0,
}: HeroGlobeProps) {
  const mountRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const timeOffsetMinutesRef =
    useRef(
      timeOffsetMinutes,
    );

  const refreshCelestialStateRef =
    useRef<
      (() => void) |
      null
    >(
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

  timeOffsetMinutesRef.current =
    timeOffsetMinutes;

  useEffect(() => {
    refreshCelestialStateRef
      .current?.();
  }, [
    timeOffsetMinutes,
  ]);

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

    const getDisplayDate =
      () =>
        new Date(
          Date.now() +
          timeOffsetMinutesRef.current *
            60_000,
        );

    let currentSolarPosition =
      calculateSolarPosition(
        getDisplayDate(),
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
        getDisplayDate(),
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

    /*
     * Passive geographic context.
     *
     * Uses the same authoritative world-country GeoJSON
     * as the Portfolio map.
     *
     * No fills.
     * No labels.
     * No hover.
     * No pointer interception.
     */
    let countryBoundaries:
      THREE.LineSegments |
      null =
      null;

    let countryWorld:
      Parameters<
        typeof createCountryBoundaryLayer
      >[0] |
      null =
      null;

    let countryHighlight:
      THREE.LineSegments |
      null =
      null;

    let hoveredCountryName:
      string |
      null =
      null;

    const countryBoundaryController =
      new AbortController();

    fetch(
      '/data/portfolio/world-countries.geojson',
      {
        signal:
          countryBoundaryController.signal,
      },
    )
      .then(
        (
          response,
        ) => {

          if (
            !response.ok
          ) {

            throw new Error(
              `Homepage country geography failed to load: ${response.status}`,
            );
          }

          return response.json();
        },
      )
      .then(
        (
          world,
        ) => {

          if (
            countryBoundaryController
              .signal
              .aborted
          ) {
            return;
          }

          countryWorld =
            world;

          countryBoundaries =
            createCountryBoundaryLayer(
              world,
            );

          presentationGroup.add(
            countryBoundaries,
          );

          renderScene();
        },
      )
      .catch(
        (
          error:
            unknown,
        ) => {

          if (
            countryBoundaryController
              .signal
              .aborted
          ) {
            return;
          }

          console.error(
            'Homepage country geography failed to load.',
            error,
          );
        },
      );

    const countryRaycaster =
      new THREE.Raycaster();

    const countryPointer =
      new THREE.Vector2();

    const countryTooltip =
      document.createElement(
        'div',
      );

    countryTooltip.setAttribute(
      'aria-hidden',
      'true',
    );

    countryTooltip.style.position =
      'fixed';

    countryTooltip.style.zIndex =
      '9999';

    countryTooltip.style.pointerEvents =
      'none';

    countryTooltip.style.display =
      'none';

    countryTooltip.style.padding =
      '4px 7px';

    countryTooltip.style.borderRadius =
      '4px';

    countryTooltip.style.background =
      'rgba(10, 16, 20, 0.78)';

    countryTooltip.style.border =
      '1px solid rgba(255,255,255,0.10)';

    countryTooltip.style.color =
      'rgba(255,255,255,0.90)';

    countryTooltip.style.fontSize =
      '10px';

    countryTooltip.style.fontWeight =
      '600';

    countryTooltip.style.letterSpacing =
      '0.08em';

    countryTooltip.style.textTransform =
      'uppercase';

    countryTooltip.style.whiteSpace =
      'nowrap';

    countryTooltip.style.boxShadow =
      '0 4px 12px rgba(0,0,0,0.14)';

    countryTooltip.style.backdropFilter =
      'blur(4px)';

    document.body.appendChild(
      countryTooltip,
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

          latitude:
            currentSolarPosition
              .subsolarLatitude,

          longitude:
            currentSolarPosition
              .subsolarLongitude,
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

        latitude:
          currentSolarPosition
            .subsolarLatitude,

        longitude:
          currentSolarPosition
            .subsolarLongitude,
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
      const moonCoordinates =
        earthDirectionToCoordinates(
          moonDirectionEarth,
        );

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

          latitude:
            moonCoordinates.latitude,

          longitude:
            moonCoordinates.longitude,

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

        latitude:
          moonCoordinates.latitude,

        longitude:
          moonCoordinates.longitude,

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
      const displayDate =
        getDisplayDate();

      currentSolarPosition =
        calculateSolarPosition(
          displayDate,
        );

      const solar =
        getSolarDirectionVector(
          displayDate,
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
          displayDate,
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

    function clearCountryHover() {

      hoveredCountryName =
        null;

      countryTooltip.style.display =
        'none';

      if (
        countryHighlight
      ) {

        presentationGroup.remove(
          countryHighlight,
        );

        disposeCountryBoundaryLayer(
          countryHighlight,
        );

        countryHighlight =
          null;

        renderScene();
      }
    }


    function updateCountryHover(
      event:
        PointerEvent,
    ) {

      if (
        !countryWorld ||
        isDragging
      ) {

        clearCountryHover();

        return;
      }

      const bounds =
        renderer.domElement
          .getBoundingClientRect();

      if (
        bounds.width <= 0 ||
        bounds.height <= 0
      ) {

        clearCountryHover();

        return;
      }

      countryPointer.set(
        (
          (
            event.clientX -
            bounds.left
          ) /
          bounds.width
        ) *
          2 -
          1,

        -(
          (
            event.clientY -
            bounds.top
          ) /
          bounds.height
        ) *
          2 +
          1,
      );

      countryRaycaster.setFromCamera(
        countryPointer,
        camera,
      );

      const intersections =
        countryRaycaster.intersectObject(
          earthMesh,
          false,
        );

      const intersection =
        intersections[0];

      if (!intersection) {

        clearCountryHover();

        return;
      }

      const localPoint =
        earthMesh.worldToLocal(
          intersection.point.clone(),
        )
          .normalize();

      const latitude =
        THREE.MathUtils.radToDeg(
          Math.asin(
            THREE.MathUtils.clamp(
              localPoint.y,
              -1,
              1,
            ),
          ),
        );

      const longitude =
        THREE.MathUtils.radToDeg(
          Math.atan2(
            -localPoint.z,
            localPoint.x,
          ),
        );

      const country =
        findCountryAtCoordinate(
          countryWorld,
          longitude,
          latitude,
        );

      if (!country) {

        clearCountryHover();

        return;
      }

      const tooltipLeft =
        Math.min(
          event.clientX +
            14,
          Math.max(
            8,
            window.innerWidth -
              150,
          ),
        );

      const tooltipTop =
        Math.min(
          event.clientY +
            14,
          Math.max(
            8,
            window.innerHeight -
              40,
          ),
        );

      countryTooltip.textContent =
        country.name;

      countryTooltip.style.left =
        `${tooltipLeft}px`;

      countryTooltip.style.top =
        `${tooltipTop}px`;

      countryTooltip.style.display =
        'block';

      if (
        hoveredCountryName ===
        country.name
      ) {
        return;
      }

      if (
        countryHighlight
      ) {

        presentationGroup.remove(
          countryHighlight,
        );

        disposeCountryBoundaryLayer(
          countryHighlight,
        );

        countryHighlight =
          null;
      }

      countryHighlight =
        createCountryHighlightLayer(
          country.geometry,
        );

      presentationGroup.add(
        countryHighlight,
      );

      hoveredCountryName =
        country.name;

      renderScene();
    }


    function handlePointerLeave() {

      clearCountryHover();

      if (!isDragging) {

        renderer.domElement.style.cursor =
          'default';
      }
    }


    const COUNTRY_CLICK_DRAG_THRESHOLD_PX =
      6;

    let pointerDownCountryX =
      0;

    let pointerDownCountryY =
      0;


    function getCountryRepresentativeCoordinate(
      country:
        NonNullable<
          ReturnType<
            typeof findCountryAtCoordinate
          >
        >,
    ): {
      latitude: number;
      longitude: number;
    } {

      const geometry =
        country.geometry;

      /*
       * For MultiPolygons choose the largest outer ring.
       * This avoids tiny offshore islands pulling the focus
       * away from the country's principal landmass.
       */
      let outerRing:
        number[][] |
        null =
        null;

      if (
        geometry.type ===
        'Polygon'
      ) {

        outerRing =
          (
            geometry.coordinates[0] ??
            null
          ) as
            number[][] |
            null;

      } else {

        for (
          const polygon of
            geometry.coordinates
        ) {

          const candidate =
            (
              polygon[0] ??
              null
            ) as
              number[][] |
              null;

          if (
            candidate &&
            (
              !outerRing ||
              candidate.length >
                outerRing.length
            )
          ) {

            outerRing =
              candidate;
          }
        }
      }

      if (
        !outerRing ||
        outerRing.length === 0
      ) {

        return {
          latitude:
            0,

          longitude:
            0,
        };
      }

      /*
       * Spherical mean handles the antimeridian much better
       * than averaging raw longitude values.
       */
      let x =
        0;

      let y =
        0;

      let z =
        0;

      let validCount =
        0;

      for (
        const coordinate of
          outerRing
      ) {

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

        const longitudeRadians =
          THREE.MathUtils.degToRad(
            longitude,
          );

        const latitudeRadians =
          THREE.MathUtils.degToRad(
            latitude,
          );

        const cosineLatitude =
          Math.cos(
            latitudeRadians,
          );

        x +=
          cosineLatitude *
          Math.cos(
            longitudeRadians,
          );

        y +=
          Math.sin(
            latitudeRadians,
          );

        z +=
          cosineLatitude *
          Math.sin(
            longitudeRadians,
          );

        validCount +=
          1;
      }

      if (
        validCount === 0
      ) {

        return {
          latitude:
            0,

          longitude:
            0,
        };
      }

      x /=
        validCount;

      y /=
        validCount;

      z /=
        validCount;

      const horizontal =
        Math.sqrt(
          x * x +
          z * z,
        );

      return {
        latitude:
          THREE.MathUtils.radToDeg(
            Math.atan2(
              y,
              horizontal,
            ),
          ),

        longitude:
          THREE.MathUtils.radToDeg(
            Math.atan2(
              z,
              x,
            ),
          ),
      };
    }


    function focusCountry(
      country:
        NonNullable<
          ReturnType<
            typeof findCountryAtCoordinate
          >
        >,
    ) {

      const representative =
        getCountryRepresentativeCoordinate(
          country,
        );

      /*
       * Country focus is an intentional manual view,
       * so cancel any existing return motion first.
       */
      cancelAutoReturnTimer();
      cancelReturnAnimation();

      const startQuaternion =
        presentationGroup
          .quaternion
          .clone();

      const targetQuaternion =
        createPresentationQuaternion(
          representative.latitude,
          representative.longitude,
        );

      const startTime =
        performance.now();

      const durationMs =
        650;

      function animateCountryFocus(
        now:
          number,
      ) {

        const progress =
          Math.min(
            1,
            (
              now -
              startTime
            ) /
              durationMs,
          );

        /*
         * Smooth cubic ease-out.
         */
        const eased =
          1 -
          Math.pow(
            1 -
              progress,
            3,
          );

        presentationGroup
          .quaternion
          .copy(
            startQuaternion,
          )
          .slerp(
            targetQuaternion,
            eased,
          );

        renderScene();
        emitOrientation();

        if (
          progress <
          1
        ) {

          returnAnimationFrame =
            window.requestAnimationFrame(
              animateCountryFocus,
            );

          return;
        }

        returnAnimationFrame =
          undefined;

        /*
         * Preserve the established 30-second
         * return-to-live/default contract.
         */
        scheduleAutoReturn();
      }

      returnAnimationFrame =
        window.requestAnimationFrame(
          animateCountryFocus,
        );
    }


    function getCountryAtPointer(
      clientX:
        number,
      clientY:
        number,
    ):
      ReturnType<
        typeof findCountryAtCoordinate
      > {

      if (!countryWorld) {
        return null;
      }

      const bounds =
        renderer.domElement
          .getBoundingClientRect();

      if (
        bounds.width <= 0 ||
        bounds.height <= 0
      ) {
        return null;
      }

      countryPointer.set(
        (
          (
            clientX -
            bounds.left
          ) /
            bounds.width
        ) *
          2 -
          1,

        -(
          (
            clientY -
            bounds.top
          ) /
            bounds.height
        ) *
          2 +
          1,
      );

      countryRaycaster.setFromCamera(
        countryPointer,
        camera,
      );

      const intersection =
        countryRaycaster
          .intersectObject(
            earthMesh,
            false,
          )[0];

      if (!intersection) {
        return null;
      }

      const localPoint =
        earthMesh.worldToLocal(
          intersection.point.clone(),
        )
          .normalize();

      const latitude =
        THREE.MathUtils.radToDeg(
          Math.asin(
            THREE.MathUtils.clamp(
              localPoint.y,
              -1,
              1,
            ),
          ),
        );

      const longitude =
        THREE.MathUtils.radToDeg(
          Math.atan2(
            -localPoint.z,
            localPoint.x,
          ),
        );

      return findCountryAtCoordinate(
        countryWorld,
        longitude,
        latitude,
      );
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

      clearCountryHover();

      isDragging =
        true;

      activePointerId =
        event.pointerId;

      previousPointerX =
        event.clientX;

      previousPointerY =
        event.clientY;

      pointerDownCountryX =
        event.clientX;

      pointerDownCountryY =
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
        const insideGlobe =
          isPointInsideCircle(
            mount,
            event.clientX,
            event.clientY,
          );

        renderer.domElement.style.cursor =
          insideGlobe
            ? 'grab'
            : 'default';

        if (insideGlobe) {

          updateCountryHover(
            event,
          );

        } else {

          clearCountryHover();
        }

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

      const pointerTravel =
        Math.hypot(
          event.clientX -
            pointerDownCountryX,
          event.clientY -
            pointerDownCountryY,
        );

      const clickedCountry =
        pointerTravel <=
          COUNTRY_CLICK_DRAG_THRESHOLD_PX
          ? getCountryAtPointer(
              event.clientX,
              event.clientY,
            )
          : null;

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

      if (
        clickedCountry
      ) {

        /*
         * Clear transient pointer hover before rotation.
         * Hover resumes naturally on the next pointer move.
         */
        clearCountryHover();

        focusCountry(
          clickedCountry,
        );

        return;
      }

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

      clearCountryHover();

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

      clearCountryHover();

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
        'pointerleave',
        handlePointerLeave,
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

    refreshCelestialStateRef.current =
      updateCelestialState;

    updateCelestialState();
    emitOrientation();

    const celestialUpdateInterval =
      window.setInterval(
        updateCelestialState,
        CELESTIAL_UPDATE_INTERVAL_MS,
      );

    return () => {
      refreshCelestialStateRef.current =
        null;

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
          'pointerleave',
          handlePointerLeave,
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

      countryBoundaryController.abort();

      if (
        countryHighlight
      ) {

        presentationGroup.remove(
          countryHighlight,
        );

        disposeCountryBoundaryLayer(
          countryHighlight,
        );

        countryHighlight =
          null;
      }

      countryWorld =
        null;

      hoveredCountryName =
        null;

      if (
        countryTooltip.parentElement
      ) {

        countryTooltip.parentElement.removeChild(
          countryTooltip,
        );
      }

      if (
        countryBoundaries
      ) {

        presentationGroup.remove(
          countryBoundaries,
        );

        disposeCountryBoundaryLayer(
          countryBoundaries,
        );

        countryBoundaries =
          null;
      }

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