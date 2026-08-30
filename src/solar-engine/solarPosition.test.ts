import {
  calculateSolarElevation,
  calculateSolarPosition,
  classifySolarElevation,
  getLocalSolarState,
  getSolarDirectionVector,
} from './solarPosition';

function assertFinite(
  value: number,
  label: string,
) {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    throw new Error(
      `${label} must be finite`,
    );
  }
}

export function runSolarEngineChecks() {
  const now =
    new Date();

  const solar =
    calculateSolarPosition(
      now,
    );

  assertFinite(
    solar.declinationDeg,
    'declinationDeg',
  );

  assertFinite(
    solar.subsolarLatitude,
    'subsolarLatitude',
  );

  assertFinite(
    solar.subsolarLongitude,
    'subsolarLongitude',
  );

  const nairobi =
    getLocalSolarState(
      -1.286389,
      36.817223,
      now,
    );

  assertFinite(
    nairobi.elevationDeg,
    'Nairobi elevation',
  );

  const elevation =
    calculateSolarElevation(
      0,
      0,
      now,
    );

  assertFinite(
    elevation,
    'equatorial elevation',
  );

  const direction =
    getSolarDirectionVector(
      now,
    );

  assertFinite(
    direction.x,
    'solar direction x',
  );

  assertFinite(
    direction.y,
    'solar direction y',
  );

  assertFinite(
    direction.z,
    'solar direction z',
  );

  const daylight =
    classifySolarElevation(
      10,
    );

  const civil =
    classifySolarElevation(
      -3,
    );

  const nautical =
    classifySolarElevation(
      -9,
    );

  const astronomical =
    classifySolarElevation(
      -15,
    );

  const night =
    classifySolarElevation(
      -25,
    );

  if (
    daylight !==
    'daylight'
  ) {
    throw new Error(
      'Daylight classification failed',
    );
  }

  if (
    civil !==
    'civil-twilight'
  ) {
    throw new Error(
      'Civil twilight classification failed',
    );
  }

  if (
    nautical !==
    'nautical-twilight'
  ) {
    throw new Error(
      'Nautical twilight classification failed',
    );
  }

  if (
    astronomical !==
    'astronomical-twilight'
  ) {
    throw new Error(
      'Astronomical twilight classification failed',
    );
  }

  if (
    night !==
    'night'
  ) {
    throw new Error(
      'Night classification failed',
    );
  }

  return {
    now:
      now.toISOString(),

    solar,

    nairobi,

    direction,
  };
}