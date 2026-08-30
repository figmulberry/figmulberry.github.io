export type SolarCoordinates = {
  latitude: number;
  longitude: number;
};

export type SolarPosition = {
  declinationDeg: number;
  equationOfTimeMinutes: number;

  subsolarLatitude: number;
  subsolarLongitude: number;
};

export type LocalSolarState = {
  latitude: number;
  longitude: number;

  elevationDeg: number;

  classification:
    | 'daylight'
    | 'civil-twilight'
    | 'nautical-twilight'
    | 'astronomical-twilight'
    | 'night';
};

const DEG_TO_RAD =
  Math.PI / 180;

const RAD_TO_DEG =
  180 / Math.PI;

function normalizeLongitude(
  longitude: number,
): number {
  let value =
    ((longitude + 180) % 360 + 360) %
      360 -
    180;

  if (value === -180) {
    value = 180;
  }

  return value;
}

function dayOfYear(
  date: Date,
): number {
  const year =
    date.getUTCFullYear();

  const start =
    Date.UTC(
      year,
      0,
      0,
      0,
      0,
      0,
      0,
    );

  const current =
    Date.UTC(
      year,
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    );

  const millisecondsPerDay =
    86_400_000;

  return Math.floor(
    (current - start) /
      millisecondsPerDay,
  );
}

function fractionalUtcHour(
  date: Date,
): number {
  return (
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() /
      3_600_000
  );
}

/*
 * Lightweight real-time solar model.
 *
 * This uses the standard fractional-year
 * approximation commonly used for visual
 * solar-position applications.
 *
 * It is suitable for rendering the global
 * day/night field and real-time website
 * visualization.
 *
 * The NREL SPA remains our precision
 * benchmark if we later require
 * research-grade positional accuracy.
 */
export function calculateSolarPosition(
  date: Date,
): SolarPosition {
  const days =
    dayOfYear(
      date,
    );

  const utcHour =
    fractionalUtcHour(
      date,
    );

  const gamma =
    (2 * Math.PI / 365) *
    (
      days -
      1 +
      (utcHour - 12) / 24
    );

  const equationOfTimeMinutes =
    229.18 *
    (
      0.000075 +
      0.001868 *
        Math.cos(
          gamma,
        ) -
      0.032077 *
        Math.sin(
          gamma,
        ) -
      0.014615 *
        Math.cos(
          2 * gamma,
        ) -
      0.040849 *
        Math.sin(
          2 * gamma,
        )
    );

  const declinationRad =
    0.006918 -
    0.399912 *
      Math.cos(
        gamma,
      ) +
    0.070257 *
      Math.sin(
        gamma,
      ) -
    0.006758 *
      Math.cos(
        2 * gamma,
      ) +
    0.000907 *
      Math.sin(
        2 * gamma,
      ) -
    0.002697 *
      Math.cos(
        3 * gamma,
      ) +
    0.00148 *
      Math.sin(
        3 * gamma,
      );

  const declinationDeg =
    declinationRad *
    RAD_TO_DEG;

  /*
   * Solar noon longitude is derived from
   * apparent solar time.
   *
   * At the subsolar longitude, true solar
   * time is approximately 12:00.
   */
  const utcMinutes =
    utcHour * 60;

  const subsolarLongitude =
    normalizeLongitude(
      (
        720 -
        utcMinutes -
        equationOfTimeMinutes
      ) / 4,
    );

  return {
    declinationDeg,
    equationOfTimeMinutes,

    subsolarLatitude:
      declinationDeg,

    subsolarLongitude,
  };
}

export function calculateSolarElevation(
  latitude: number,
  longitude: number,
  date: Date,
): number {
  const solar =
    calculateSolarPosition(
      date,
    );

  const latitudeRad =
    latitude *
    DEG_TO_RAD;

  const declinationRad =
    solar.declinationDeg *
    DEG_TO_RAD;

  const longitudeDifference =
    normalizeLongitude(
      longitude -
      solar.subsolarLongitude,
    );

  const hourAngleRad =
    longitudeDifference *
    DEG_TO_RAD;

  const sinElevation =
    Math.sin(
      latitudeRad,
    ) *
      Math.sin(
        declinationRad,
      ) +
    Math.cos(
      latitudeRad,
    ) *
      Math.cos(
        declinationRad,
      ) *
      Math.cos(
        hourAngleRad,
      );

  const clamped =
    Math.max(
      -1,
      Math.min(
        1,
        sinElevation,
      ),
    );

  return (
    Math.asin(
      clamped,
    ) *
    RAD_TO_DEG
  );
}

export function classifySolarElevation(
  elevationDeg: number,
): LocalSolarState['classification'] {
  if (
    elevationDeg >= 0
  ) {
    return 'daylight';
  }

  if (
    elevationDeg >= -6
  ) {
    return 'civil-twilight';
  }

  if (
    elevationDeg >= -12
  ) {
    return 'nautical-twilight';
  }

  if (
    elevationDeg >= -18
  ) {
    return 'astronomical-twilight';
  }

  return 'night';
}

export function getLocalSolarState(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
): LocalSolarState {
  const elevationDeg =
    calculateSolarElevation(
      latitude,
      longitude,
      date,
    );

  return {
    latitude,
    longitude,

    elevationDeg,

    classification:
      classifySolarElevation(
        elevationDeg,
      ),
  };
}

export function getSolarDirectionVector(
  date: Date,
): {
  x: number;
  y: number;
  z: number;
} {
  const solar =
    calculateSolarPosition(
      date,
    );

  const latitudeRad =
    solar.subsolarLatitude *
    DEG_TO_RAD;

  const longitudeRad =
    solar.subsolarLongitude *
    DEG_TO_RAD;

  /*
   * Cartesian unit vector pointing from
   * Earth center toward the Sun-facing
   * subsolar point.
   */
  const x =
    Math.cos(
      latitudeRad,
    ) *
    Math.cos(
      longitudeRad,
    );

  const y =
    Math.sin(
      latitudeRad,
    );

  const z =
    -Math.cos(
      latitudeRad,
    ) *
    Math.sin(
      longitudeRad,
    );

  return {
    x,
    y,
    z,
  };
}