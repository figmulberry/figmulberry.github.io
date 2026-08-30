import {
  Body,
  GeoVector,
  Illumination,
  MoonPhase,
  Observer,
  RotateVector,
  Rotation_EQJ_HOR,
} from 'astronomy-engine';

export interface EarthFixedDirection {
  x: number;
  y: number;
  z: number;
}

export interface MoonState {
  direction: EarthFixedDirection;
  illuminatedFraction: number;
  phaseAngleDeg: number;
  phaseName: string;
  waxing: boolean;
}

const GREENWICH_OBSERVER =
  new Observer(
    0,
    0,
    0,
  );

function normalizeDegrees(
  value: number,
): number {
  return (
    (
      value %
      360
    ) +
    360
  ) %
  360;
}

function normalizeDirection(
  direction: EarthFixedDirection,
): EarthFixedDirection {
  const length =
    Math.hypot(
      direction.x,
      direction.y,
      direction.z,
    );

  if (
    length ===
    0
  ) {
    return {
      x: 1,
      y: 0,
      z: 0,
    };
  }

  return {
    x:
      direction.x /
      length,

    y:
      direction.y /
      length,

    z:
      direction.z /
      length,
  };
}

function getMoonPhaseName(
  phaseAngleDeg: number,
): string {
  const phase =
    normalizeDegrees(
      phaseAngleDeg,
    );

  if (
    phase <
      22.5 ||
    phase >=
      337.5
  ) {
    return 'New Moon';
  }

  if (
    phase <
    67.5
  ) {
    return 'Waxing Crescent';
  }

  if (
    phase <
    112.5
  ) {
    return 'First Quarter';
  }

  if (
    phase <
    157.5
  ) {
    return 'Waxing Gibbous';
  }

  if (
    phase <
    202.5
  ) {
    return 'Full Moon';
  }

  if (
    phase <
    247.5
  ) {
    return 'Waning Gibbous';
  }

  if (
    phase <
    292.5
  ) {
    return 'Third Quarter';
  }

  return 'Waning Crescent';
}

function getMoonEarthFixedDirection(
  date: Date,
): EarthFixedDirection {
  const moonEqj =
    GeoVector(
      Body.Moon,
      date,
      true,
    );

  const eqjToGreenwichHorizon =
    Rotation_EQJ_HOR(
      date,
      GREENWICH_OBSERVER,
    );

  const horizonVector =
    RotateVector(
      eqjToGreenwichHorizon,
      moonEqj,
    );

  /*
   * Astronomy Engine's HOR frame is:
   *
   * x = north
   * y = west
   * z = zenith
   *
   * At latitude 0 and longitude 0:
   *
   * zenith corresponds to Earth-fixed +X
   * north corresponds to Earth-fixed +Y
   * west corresponds to Earth-fixed +Z
   *
   * The globe uses:
   *
   * +X = latitude 0, longitude 0
   * +Y = geographic north
   * -Z = east longitude
   *
   * Therefore:
   *
   * Earth X = HOR z
   * Earth Y = HOR x
   * Earth Z = HOR y
   */

  return normalizeDirection({
    x:
      horizonVector.z,

    y:
      horizonVector.x,

    z:
      horizonVector.y,
  });
}

export function getMoonState(
  date: Date,
): MoonState {
  const phaseAngleDeg =
    normalizeDegrees(
      MoonPhase(
        date,
      ),
    );

  const illumination =
    Illumination(
      Body.Moon,
      date,
    );

  return {
    direction:
      getMoonEarthFixedDirection(
        date,
      ),

    illuminatedFraction:
      Math.max(
        0,
        Math.min(
          1,
          illumination.phase_fraction,
        ),
      ),

    phaseAngleDeg,

    phaseName:
      getMoonPhaseName(
        phaseAngleDeg,
      ),

    waxing:
      phaseAngleDeg <
      180,
  };
}