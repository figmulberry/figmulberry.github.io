import React, {
  useId,
} from 'react';

interface SunDiskProps {
  size?: number;
}

export default function SunDisk({
  size = 72,
}: SunDiskProps) {
  const rawId =
    useId();

  const safeId =
    rawId.replace(
      /:/g,
      '',
    );

  const outerFilterId =
    `sun-corona-outer-${safeId}`;

  const middleFilterId =
    `sun-corona-middle-${safeId}`;

  const innerFilterId =
    `sun-corona-inner-${safeId}`;

  return (
    <div
      className="sun-disk"
      style={{
        width:
          `${size}px`,
        height:
          `${size}px`,
      }}
      aria-hidden="true"
    >
      <svg
        className="sun-corona"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={outerFilterId}
            x="-120%"
            y="-120%"
            width="340%"
            height="340%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.042"
              numOctaves="3"
              seed="23"
              result="noise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />

            <feGaussianBlur
              in="distorted"
              stdDeviation="5.2"
            />
          </filter>

          <filter
            id={middleFilterId}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="2"
              seed="41"
              result="noise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />

            <feGaussianBlur
              in="distorted"
              stdDeviation="3.1"
            />
          </filter>

          <filter
            id={innerFilterId}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur
              stdDeviation="1.8"
            />
          </filter>
        </defs>

        <g
          className="sun-corona-outer"
          filter={`url(#${outerFilterId})`}
        >
          <circle
            cx="50"
            cy="50"
            r="29"
            fill="#ff9800"
            opacity="0.44"
          />
        </g>

        <g
          className="sun-corona-middle"
          filter={`url(#${middleFilterId})`}
        >
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="#ffb300"
            opacity="0.62"
          />
        </g>

        <g
          className="sun-corona-inner"
          filter={`url(#${innerFilterId})`}
        >
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="#ffd54a"
            opacity="0.42"
          />
        </g>
      </svg>

      <div className="sun-photo-shell">
        <img
          src="/hero-sun/sun-hmi-1024.jpg"
          alt=""
          className="sun-photo"
          draggable={false}
        />

        <span className="sun-photo-warmth" />
        <span className="sun-photo-highlight" />
      </div>

      <style>
        {`
          .sun-disk {
            position: relative;
            display: block;
            overflow: visible;
          }

          .sun-corona {
            position: absolute;
            inset: 0;

            width: 100%;
            height: 100%;

            overflow: visible;

            pointer-events: none;
          }

          .sun-corona-outer,
          .sun-corona-middle,
          .sun-corona-inner {
            transform-box: fill-box;
            transform-origin: center;
            will-change:
              transform,
              opacity,
              filter;
          }

          .sun-corona-outer {
            animation:
              sun-corona-outer-breathe
              3.8s
              cubic-bezier(
                0.45,
                0,
                0.55,
                1
              )
              infinite;
          }

          .sun-corona-middle {
            animation:
              sun-corona-middle-breathe
              3.8s
              cubic-bezier(
                0.45,
                0,
                0.55,
                1
              )
              infinite;
          }

          .sun-corona-inner {
            animation:
              sun-corona-inner-breathe
              3.8s
              cubic-bezier(
                0.45,
                0,
                0.55,
                1
              )
              infinite;
          }

          .sun-photo-shell {
            position: absolute;

            left: 50%;
            top: 50%;

            width: 38%;
            height: 38%;

            transform:
              translate(-50%, -50%);

            overflow: hidden;

            border-radius: 50%;

            background:
              #ff9f00;

            box-shadow:
              0 0 4px
                rgba(
                  255,
                  230,
                  132,
                  0.95
                ),
              0 0 8px
                rgba(
                  255,
                  179,
                  0,
                  0.78
                ),
              0 0 14px
                rgba(
                  255,
                  142,
                  0,
                  0.30
                );

            z-index: 4;
          }

          .sun-photo {
            position: absolute;

            left: 50%;
            top: 50%;

            width: 112%;
            height: 112%;

            max-width: none;

            transform:
              translate(-50%, -50%);

            object-fit: cover;
            object-position: center;

            user-select: none;
            pointer-events: none;

            filter:
              contrast(1.12)
              brightness(1.08)
              saturate(1.04);
          }

          .sun-photo-warmth {
            position: absolute;
            inset: 0;

            border-radius: inherit;

            background:
              radial-gradient(
                circle at 42% 38%,
                rgba(
                  255,
                  246,
                  184,
                  0.17
                ) 0%,
                rgba(
                  255,
                  190,
                  40,
                  0.07
                ) 45%,
                rgba(
                  255,
                  122,
                  0,
                  0.08
                ) 78%,
                rgba(
                  105,
                  35,
                  0,
                  0.22
                ) 100%
              );

            pointer-events: none;
          }

          .sun-photo-highlight {
            position: absolute;
            inset: 0;

            border-radius: inherit;

            box-shadow:
              inset 0 0 5px
                rgba(
                  255,
                  246,
                  207,
                  0.38
                ),
              inset 0 0 9px
                rgba(
                  255,
                  149,
                  0,
                  0.24
                );

            pointer-events: none;
          }

          @keyframes
          sun-corona-inner-breathe {
            0%,
            100% {
              transform:
                scale(0.96);

              opacity:
                0.88;

              filter:
                blur(1px);
            }

            50% {
              transform:
                scale(1.12);

              opacity:
                0.48;

              filter:
                blur(2.5px);
            }
          }

          @keyframes
          sun-corona-middle-breathe {
            0%,
            100% {
              transform:
                scale(0.88);

              opacity:
                0.82;

              filter:
                blur(1.5px);
            }

            50% {
              transform:
                scale(1.34);

              opacity:
                0.28;

              filter:
                blur(4.2px);
            }
          }

          @keyframes
          sun-corona-outer-breathe {
            0%,
            100% {
              transform:
                scale(0.78);

              opacity:
                0.72;

              filter:
                blur(2px);
            }

            50% {
              transform:
                scale(1.72);

              opacity:
                0.04;

              filter:
                blur(8px);
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .sun-corona-outer,
            .sun-corona-middle,
            .sun-corona-inner {
              animation:
                none;
            }
          }
        `}
      </style>
    </div>
  );
}