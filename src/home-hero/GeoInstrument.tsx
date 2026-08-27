import React, {
  useCallback,
  useState,
} from 'react';

import HeroGlobe, {
  type ProjectedMoonPosition,
  type ProjectedSunPosition,
} from '@/hero-globe/HeroGlobe';

import MoonSphere from './MoonSphere';
import SunDisk from './SunDisk';

const TICK_COUNT = 72;

const EARTH_INSET_PERCENT =
  8.6;

const EARTH_DIAMETER_PERCENT =
  100 -
  EARTH_INSET_PERCENT * 2;

const CELESTIAL_RING_RADIUS_PERCENT =
  47.2;

interface SunDisplayPosition {
  leftPercent: number;
  topPercent: number;
  opacity: number;
  latitude: number;
  longitude: number;
}

interface MoonDisplayPosition {
  leftPercent: number;
  topPercent: number;
  opacity: number;
  latitude: number;
  longitude: number;
  illuminatedFraction: number;
  phaseAngleDeg: number;
  phaseName: string;
  waxing: boolean;
  brightLimbAngleDeg: number;
}

function smoothstep(
  edge0: number,
  edge1: number,
  value: number,
): number {
  const normalized =
    Math.min(
      1,
      Math.max(
        0,
        (
          value -
          edge0
        ) /
          (
            edge1 -
            edge0
          ),
      ),
    );

  return (
    normalized *
    normalized *
    (
      3 -
      2 *
      normalized
    )
  );
}

function InstrumentRing() {
  const ticks =
    Array.from({
      length: TICK_COUNT,
    });

  return (
    <svg
      aria-hidden="true"
      className={[
        'pointer-events-none',
        'absolute',
        'inset-0',
        'h-full',
        'w-full',
        'overflow-visible',
      ].join(' ')}
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="46.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.12"
        className="text-foreground/[0.07]"
      />

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.28"
        className="text-foreground/[0.20]"
      />

      <circle
        cx="50"
        cy="50"
        r="42.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.12"
        className="text-foreground/[0.08]"
      />

      <g className="text-foreground/[0.26]">
        {ticks.map(
          (
            _,
            index,
          ) => {
            const angle =
              index *
              (
                360 /
                TICK_COUNT
              );

            const isCardinal =
              index %
                18 ===
              0;

            const isMajor =
              index %
                6 ===
              0;

            const isMedium =
              index %
                3 ===
              0;

            const outerRadius =
              isCardinal
                ? 46.1
                : 45;

            const innerRadius =
              isCardinal
                ? 41.9
                : isMajor
                  ? 42.45
                  : isMedium
                    ? 43.15
                    : 43.75;

            const angleRad =
              (
                angle -
                90
              ) *
              (
                Math.PI /
                180
              );

            const x1 =
              50 +
              Math.cos(
                angleRad,
              ) *
                innerRadius;

            const y1 =
              50 +
              Math.sin(
                angleRad,
              ) *
                innerRadius;

            const x2 =
              50 +
              Math.cos(
                angleRad,
              ) *
                outerRadius;

            const y2 =
              50 +
              Math.sin(
                angleRad,
              ) *
                outerRadius;

            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={
                  isCardinal
                    ? 0.52
                    : isMajor
                      ? 0.34
                      : isMedium
                        ? 0.24
                        : 0.16
                }
                opacity={
                  isCardinal
                    ? 0.95
                    : isMajor
                      ? 0.78
                      : isMedium
                        ? 0.55
                        : 0.34
                }
              />
            );
          },
        )}
      </g>

      <g
        fill="currentColor"
        className="text-foreground/[0.16]"
      >
        <circle
          cx="50"
          cy="3.9"
          r="0.34"
        />

        <circle
          cx="96.1"
          cy="50"
          r="0.34"
        />

        <circle
          cx="50"
          cy="96.1"
          r="0.34"
        />

        <circle
          cx="3.9"
          cy="50"
          r="0.34"
        />
      </g>
    </svg>
  );
}

function formatLatitude(
  value: number,
): string {
  return `${Math.abs(value).toFixed(2)}\u00B0 ${
    value >= 0 ? 'N' : 'S'
  }`;
}


function formatLongitude(
  value: number,
): string {
  return `${Math.abs(value).toFixed(2)}\u00B0 ${
    value >= 0 ? 'E' : 'W'
  }`;
}


function CelestialDetails({
  title,
  rows,
}: {
  title: string;
  rows: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div
      className={[
        'pointer-events-none',
        'absolute',
        'left-1/2',
        'top-full',
        'z-50',
        'mt-2',
        'min-w-[180px]',
        '-translate-x-1/2',
        'rounded-md',
        'border',
        'border-white/15',
        'bg-black/80',
        'px-3',
        'py-2.5',
        'text-white',
        'shadow-xl',
        'backdrop-blur-md',
      ].join(' ')}
    >
      <div
        className="mb-2 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-white/70"
      >
        {title}
      </div>

      <dl className="space-y-1.5">
        {rows.map(
          row => (
            <div
              key={row.label}
              className="grid grid-cols-[auto_1fr] gap-x-3 text-[0.68rem] leading-4"
            >
              <dt className="text-white/50">
                {row.label}
              </dt>

              <dd className="text-right font-medium text-white/90">
                {row.value}
              </dd>
            </div>
          ),
        )}
      </dl>
    </div>
  );
}

function SunMarker({
  position,
}: {
  position:
    SunDisplayPosition | null;
}) {
  const [
    detailsVisible,
    setDetailsVisible,
  ] =
    useState(false);

  if (!position) {
    return null;
  }

  return (
    <div
      className={[
        'pointer-events-auto',
        'absolute',
        'z-40',
        '-translate-x-1/2',
        '-translate-y-1/2',
      ].join(' ')}
      style={{
        left:
          `${position.leftPercent}%`,

        top:
          `${position.topPercent}%`,

        opacity:
          position.opacity,
      }}
    >
      <button
        type="button"
        className="relative block cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={
          `Sun. Latitude ${formatLatitude(
            position.latitude,
          )}. Longitude ${formatLongitude(
            position.longitude,
          )}.`
        }
        aria-expanded={
          detailsVisible
        }
        onMouseEnter={() =>
          setDetailsVisible(true)
        }
        onMouseLeave={() =>
          setDetailsVisible(false)
        }
        onFocus={() =>
          setDetailsVisible(true)
        }
        onBlur={() =>
          setDetailsVisible(false)
        }
        onClick={() =>
          setDetailsVisible(
            current =>
              !current,
          )
        }
      >
        <SunDisk
          size={72}
        />

        {detailsVisible ? (
          <CelestialDetails
            title="Sun"
            rows={[
              {
                label:
                  'Latitude',
                value:
                  formatLatitude(
                    position.latitude,
                  ),
              },
              {
                label:
                  'Longitude',
                value:
                  formatLongitude(
                    position.longitude,
                  ),
              },
            ]}
          />
        ) : null}
      </button>
    </div>
  );
}

function MoonMarker({
  position,
}: {
  position:
    MoonDisplayPosition | null;
}) {
  const [
    detailsVisible,
    setDetailsVisible,
  ] =
    useState(false);

  if (!position) {
    return null;
  }

  const illuminationPercent =
    Math.round(
      position.illuminatedFraction *
      100,
    );

  return (
    <div
      className={[
        'pointer-events-auto',
        'absolute',
        'z-40',
        '-translate-x-1/2',
        '-translate-y-1/2',
      ].join(' ')}
      style={{
        left:
          `${position.leftPercent}%`,

        top:
          `${position.topPercent}%`,

        opacity:
          position.opacity,
      }}
    >
      <button
        type="button"
        className="relative block cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={
          `${position.phaseName}. ${illuminationPercent}% illuminated.`
        }
        aria-expanded={
          detailsVisible
        }
        onMouseEnter={() =>
          setDetailsVisible(true)
        }
        onMouseLeave={() =>
          setDetailsVisible(false)
        }
        onFocus={() =>
          setDetailsVisible(true)
        }
        onBlur={() =>
          setDetailsVisible(false)
        }
        onClick={() =>
          setDetailsVisible(
            current =>
              !current,
          )
        }
      >
        <div className="moon-marker">
          <MoonSphere
            phaseAngleDeg={
              position.phaseAngleDeg
            }
            brightLimbAngleDeg={
              position.brightLimbAngleDeg
            }
            size={52}
          />
        </div>

        {detailsVisible ? (
          <CelestialDetails
            title="Moon"
            rows={[
              {
                label:
                  'Phase',
                value:
                  position.phaseName,
              },
              {
                label:
                  'Illuminated',
                value:
                  `${illuminationPercent}%`,
              },
              {
                label:
                  'Cycle',
                value:
                  position.waxing
                    ? 'Waxing'
                    : 'Waning',
              },
              {
                label:
                  'Latitude',
                value:
                  formatLatitude(
                    position.latitude,
                  ),
              },
              {
                label:
                  'Longitude',
                value:
                  formatLongitude(
                    position.longitude,
                  ),
              },
            ]}
          />
        ) : null}
      </button>
    </div>
  );
}

function getCelestialDisplayPosition(
  surfaceX: number,
  surfaceY: number,
  angleDeg: number,
  frontFacing: number,
): {
  leftPercent: number;
  topPercent: number;
  opacity: number;
} {
  const surfaceLeft =
    EARTH_INSET_PERCENT +
    surfaceX *
      EARTH_DIAMETER_PERCENT;

  const surfaceTop =
    EARTH_INSET_PERCENT +
    surfaceY *
      EARTH_DIAMETER_PERCENT;

  const angleRad =
    angleDeg *
    Math.PI /
    180;

  const ringLeft =
    50 +
    Math.cos(
      angleRad,
    ) *
      CELESTIAL_RING_RADIUS_PERCENT;

  const ringTop =
    50 -
    Math.sin(
      angleRad,
    ) *
      CELESTIAL_RING_RADIUS_PERCENT;

  const ringBlend =
    1 -
    smoothstep(
      0.18,
      0.52,
      frontFacing,
    );

  const leftPercent =
    surfaceLeft *
      (
        1 -
        ringBlend
      ) +
    ringLeft *
      ringBlend;

  const topPercent =
    surfaceTop *
      (
        1 -
        ringBlend
      ) +
    ringTop *
      ringBlend;

  const opacity =
    smoothstep(
      0.015,
      0.075,
      frontFacing,
    );

  return {
    leftPercent,
    topPercent,
    opacity,
  };
}

export default function GeoInstrument() {
  const [
    sunPosition,
    setSunPosition,
  ] =
    useState<SunDisplayPosition | null>(
      null,
    );

  const [
    moonPosition,
    setMoonPosition,
  ] =
    useState<MoonDisplayPosition | null>(
      null,
    );

  const handleSunPositionChange =
    useCallback(
      (
        sun:
          ProjectedSunPosition,
      ) => {
        if (
          !sun.visible ||
          sun.frontFacing <=
            0
        ) {
          setSunPosition(
            null,
          );

          return;
        }

        const display =
          getCelestialDisplayPosition(
            sun.surfaceX,
            sun.surfaceY,
            sun.angleDeg,
            sun.frontFacing,
          );

        setSunPosition({
          ...display,

          latitude:
            sun.latitude,

          longitude:
            sun.longitude,
        });
      },
      [],
    );

  const handleMoonPositionChange =
    useCallback(
      (
        moon:
          ProjectedMoonPosition,
      ) => {
        if (
          !moon.visible ||
          moon.frontFacing <=
            0
        ) {
          setMoonPosition(
            null,
          );

          return;
        }

        const display =
          getCelestialDisplayPosition(
            moon.surfaceX,
            moon.surfaceY,
            moon.angleDeg,
            moon.frontFacing,
          );

        setMoonPosition({
          ...display,

          latitude:
            moon.latitude,

          longitude:
            moon.longitude,

          illuminatedFraction:
            moon.illuminatedFraction,

          phaseAngleDeg:
            moon.phaseAngleDeg,

          phaseName:
            moon.phaseName,

          waxing:
            moon.waxing,

          brightLimbAngleDeg:
            moon.brightLimbAngleDeg,
        });
      },
      [],
    );

  return (
    <div
      className={[
        'relative',
        'mx-auto',
        'aspect-square',
        'w-full',
        'max-w-[620px]',
        'overflow-visible',
      ].join(' ')}
    >
      <InstrumentRing />

      <div
        className={[
          'absolute',
          'inset-[8.6%]',
          'overflow-hidden',
          'rounded-full',
          'bg-[#06090d]',
          'shadow-[0_18px_55px_rgba(0,0,0,0.16)]',
          'dark:shadow-[0_18px_65px_rgba(0,0,0,0.48)]',
        ].join(' ')}
      >
        <HeroGlobe
          onSunPositionChange={
            handleSunPositionChange
          }
          onMoonPositionChange={
            handleMoonPositionChange
          }
        />
      </div>

      <SunMarker
        position={
          sunPosition
        }
      />

      <MoonMarker
        position={
          moonPosition
        }
      />

      <style>
        {`
          .moon-marker {
            position: relative;

            width: 52px;
            height: 52px;

            filter:
              drop-shadow(
                0 0 4px
                rgba(220, 224, 228, 0.18)
              );
          }
        `}
      </style>
    </div>
  );
}