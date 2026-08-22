export const earthVertexShader = `
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

export const earthFragmentShader = `
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
      return 0.82;
    }

    if (elevation >= -6.0) {
      return mix(
        0.30,
        0.72,
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
      0.82,
      1.0,
      smoothstep(
        0.0,
        35.0,
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

    vec3 surfaceColour =
      restrainedDay *
      brightness;

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

export const atmosphereVertexShader = `
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

export const atmosphereFragmentShader = `
  precision highp float;

  varying vec3 vViewNormal;
  varying vec3 vViewDirection;

  void main() {
    float facing =
      clamp(
        dot(
          normalize(
            vViewNormal
          ),
          normalize(
            vViewDirection
          )
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