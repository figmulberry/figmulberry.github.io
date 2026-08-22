import React, {
  useEffect,
  useRef,
} from 'react';

import * as THREE from 'three';

interface MoonSphereProps {
  phaseAngleDeg: number;
  brightLimbAngleDeg: number;
  size?: number;
}

const MAX_PIXEL_RATIO = 1.5;

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormalView;

  void main() {
    vUv = uv;

    vNormalView =
      normalize(
        normalMatrix *
        normal
      );

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(
        position,
        1.0
      );
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D uMoonMap;
  uniform vec3 uLightDirectionView;

  varying vec2 vUv;
  varying vec3 vNormalView;

  void main() {
    vec3 normal =
      normalize(
        vNormalView
      );

    vec3 lightDirection =
      normalize(
        uLightDirectionView
      );

    float diffuse =
      dot(
        normal,
        lightDirection
      );

    float illumination =
      smoothstep(
        -0.025,
        0.035,
        diffuse
      );

    vec3 surface =
      texture2D(
        uMoonMap,
        vUv
      ).rgb;

    float luminance =
      dot(
        surface,
        vec3(
          0.2126,
          0.7152,
          0.0722
        )
      );

    vec3 lunarColour =
      mix(
        vec3(
          luminance
        ),
        surface,
        0.18
      );

    vec3 earthshine =
      lunarColour *
      0.012;

    float directLight =
      pow(
        max(
          diffuse,
          0.0
        ),
        0.72
      );

    vec3 litSurface =
      lunarColour *
      (
        0.46 +
        directLight *
        0.88
      );

    vec3 finalColour =
      mix(
        earthshine,
        litSurface,
        illumination
      );

    float facing =
      clamp(
        normal.z,
        0.0,
        1.0
      );

    float limb =
      mix(
        0.72,
        1.0,
        pow(
          facing,
          0.32
        )
      );

    finalColour *=
      limb;

    gl_FragColor =
      vec4(
        finalColour,
        1.0
      );
  }
`;

function getLightDirection(
  phaseAngleDeg: number,
  brightLimbAngleDeg: number,
): THREE.Vector3 {
  const phaseRad =
    THREE.MathUtils.degToRad(
      phaseAngleDeg,
    );

  const limbRad =
    THREE.MathUtils.degToRad(
      brightLimbAngleDeg,
    );

  const planarMagnitude =
    Math.sin(
      phaseRad,
    );

  const z =
    -Math.cos(
      phaseRad,
    );

  const x =
    Math.cos(
      limbRad,
    ) *
    planarMagnitude;

  const y =
    -Math.sin(
      limbRad,
    ) *
    planarMagnitude;

  return new THREE.Vector3(
    x,
    y,
    z,
  ).normalize();
}

export default function MoonSphere({
  phaseAngleDeg,
  brightLimbAngleDeg,
  size = 48,
}: MoonSphereProps) {
  const mountRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const rendererRef =
    useRef<THREE.WebGLRenderer | null>(
      null,
    );

  const sceneRef =
    useRef<THREE.Scene | null>(
      null,
    );

  const cameraRef =
    useRef<THREE.OrthographicCamera | null>(
      null,
    );

  const lightDirectionRef =
    useRef<THREE.Vector3 | null>(
      null,
    );

  useEffect(() => {
    const mount =
      mountRef.current;

    if (!mount) {
      return;
    }

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.OrthographicCamera(
        -1.12,
        1.12,
        1.12,
        -1.12,
        0.1,
        10,
      );

    camera.position.set(
      0,
      0,
      3,
    );

    camera.lookAt(
      0,
      0,
      0,
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

    renderer.setSize(
      size,
      size,
      false,
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
      'none';

    mount.appendChild(
      renderer.domElement,
    );

    const textureLoader =
      new THREE.TextureLoader();

    const moonTexture =
      textureLoader.load(
        '/hero-moon/moon-lro-color-2k.jpg',
        () => {
          renderer.render(
            scene,
            camera,
          );
        },
      );

    moonTexture.colorSpace =
      THREE.SRGBColorSpace;

    moonTexture.wrapS =
      THREE.RepeatWrapping;

    moonTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    moonTexture.anisotropy =
      Math.min(
        8,
        renderer.capabilities
          .getMaxAnisotropy(),
      );

    const lightDirection =
      getLightDirection(
        phaseAngleDeg,
        brightLimbAngleDeg,
      );

    const material =
      new THREE.ShaderMaterial({
        uniforms: {
          uMoonMap: {
            value:
              moonTexture,
          },

          uLightDirectionView: {
            value:
              lightDirection,
          },
        },

        vertexShader:
          VERTEX_SHADER,

        fragmentShader:
          FRAGMENT_SHADER,

        depthWrite: true,
        depthTest: true,
        toneMapped: false,
      });

    const geometry =
      new THREE.SphereGeometry(
        1,
        96,
        96,
      );

    const moon =
      new THREE.Mesh(
        geometry,
        material,
      );

    moon.rotation.y =
      -Math.PI /
      2;

    scene.add(
      moon,
    );

    rendererRef.current =
      renderer;

    sceneRef.current =
      scene;

    cameraRef.current =
      camera;

    lightDirectionRef.current =
      lightDirection;

    renderer.render(
      scene,
      camera,
    );

    return () => {
      rendererRef.current =
        null;

      sceneRef.current =
        null;

      cameraRef.current =
        null;

      lightDirectionRef.current =
        null;

      geometry.dispose();

      material.dispose();

      moonTexture.dispose();

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
  }, [
    size,
  ]);

  useEffect(() => {
    const renderer =
      rendererRef.current;

    const scene =
      sceneRef.current;

    const camera =
      cameraRef.current;

    const lightDirection =
      lightDirectionRef.current;

    if (
      !renderer ||
      !scene ||
      !camera ||
      !lightDirection
    ) {
      return;
    }

    lightDirection.copy(
      getLightDirection(
        phaseAngleDeg,
        brightLimbAngleDeg,
      ),
    );

    renderer.render(
      scene,
      camera,
    );
  }, [
    phaseAngleDeg,
    brightLimbAngleDeg,
  ]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        width:
          `${size}px`,

        height:
          `${size}px`,
      }}
    />
  );
}