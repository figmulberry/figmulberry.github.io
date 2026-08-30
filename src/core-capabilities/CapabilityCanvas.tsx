import React, {
  useEffect,
  useRef,
} from 'react';

import {
  capabilityFamilies,
} from './capabilityData';

import {
  capabilityAccentStyles,
} from './accentStyles';

import {
  createCanvasLayout,
} from './layout';

import type {
  CanvasNode,
} from './canvasTypes';

import type {
  CapabilityFamilyId,
} from './types';

type CapabilityCanvasProps = {
  selectedNodeId:
    string | null;

  activeFamilyId:
    CapabilityFamilyId;

  onNodeClick: (
    nodeId: string,
    familyId: CapabilityFamilyId,
  ) => void;

  onNodeHover: (
    nodeId: string | null,
    familyId: CapabilityFamilyId | null,
  ) => void;
};

type DisplayNode =
  CanvasNode & {
    displayX: number;
    displayY: number;
    collisionWidth: number;
    collisionHeight: number;
    renderScale: number;
  };

const SAFE_PADDING = 28;

/*
 * Approved subtle convergence.
 */
const FAMILY_CONVERGENCE =
  0.075;

const FOCUS_SHIFT =
  0.055;

const COLLISION_GAP = 10;

const MAX_COLLISION_PASSES =
  80;

const POSITION_TRANSITION_MS =
  500;

const REDUCED_MOTION_QUERY =
  '(prefers-reduced-motion: reduce)';

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
          -2 * value + 2,
          3,
        ) /
          2;
}

function haveSameGeometry(
  first: DisplayNode[],
  second: DisplayNode[],
): boolean {
  if (
    first.length !==
    second.length
  ) {
    return false;
  }

  const firstById =
    new Map(
      first.map(
        (node) => [
          node.id,
          node,
        ],
      ),
    );

  return second.every(
    (node) => {
      const previous =
        firstById.get(
          node.id,
        );

      if (!previous) {
        return false;
      }

      return (
        Math.abs(
          previous.displayX -
            node.displayX,
        ) <
          0.01 &&
        Math.abs(
          previous.displayY -
            node.displayY,
        ) <
          0.01 &&
        Math.abs(
          previous.renderScale -
            node.renderScale,
        ) <
          0.001
      );
    },
  );
}

function interpolateDisplayNodes(
  fromNodes: DisplayNode[],
  toNodes: DisplayNode[],
  progress: number,
): DisplayNode[] {
  const fromById =
    new Map(
      fromNodes.map(
        (node) => [
          node.id,
          node,
        ],
      ),
    );

  return toNodes.map(
    (target) => {
      const start =
        fromById.get(
          target.id,
        );

      if (!start) {
        return target;
      }

      return {
        ...target,

        displayX:
          start.displayX +
          (
            target.displayX -
            start.displayX
          ) *
            progress,

        displayY:
          start.displayY +
          (
            target.displayY -
            start.displayY
          ) *
            progress,

        renderScale:
          start.renderScale +
          (
            target.renderScale -
            start.renderScale
          ) *
            progress,

        collisionWidth:
          start.collisionWidth +
          (
            target.collisionWidth -
            start.collisionWidth
          ) *
            progress,

        collisionHeight:
          start.collisionHeight +
          (
            target.collisionHeight -
            start.collisionHeight
          ) *
            progress,
      };
    },
  );
}

const familyAccentMap =
  new Map(
    capabilityFamilies.map(
      (family) => [
        family.id,
        family.accent,
      ],
    ),
  );

const familyNodeIds =
  new Map<
    CapabilityFamilyId,
    Set<string>
  >(
    capabilityFamilies.map(
      (family) => [
        family.id,

        new Set(
          family.nodes.map(
            (node) =>
              node.id,
          ),
        ),
      ],
    ),
  );

function isDarkTheme():
  boolean {
  return document.documentElement
    .classList.contains(
      'dark',
    );
}

function getNeutralColor(
  darkMode: boolean,
  primary: boolean,
): string {
  if (darkMode) {
    return primary
      ? '#e5e7eb'
      : '#9ca3af';
  }

  return primary
    ? '#1f2937'
    : '#64748b';
}

function getFamilyColor(
  familyId:
    CapabilityFamilyId,
  darkMode: boolean,
): string {
  const accent =
    familyAccentMap.get(
      familyId,
    );

  if (!accent) {
    return getNeutralColor(
      darkMode,
      false,
    );
  }

  const palette =
    capabilityAccentStyles[
      accent
    ];

  return darkMode
    ? palette.solid
    : palette.lightBorder;
}

function getRenderScale(
  node: CanvasNode,
  selectedNodeId:
    string | null,
): number {
  if (
    node.id !==
    selectedNodeId
  ) {
    return 1;
  }

  return node.type ===
    'primary'
    ? 1.025
    : 1.04;
}

function toDisplayNode(
  node: CanvasNode,
  selectedNodeId:
    string | null,
): DisplayNode {
  const renderScale =
    getRenderScale(
      node,
      selectedNodeId,
    );

  return {
    ...node,

    displayX:
      node.x,

    displayY:
      node.y,

    renderScale,

    collisionWidth:
      node.width *
      renderScale,

    collisionHeight:
      node.height *
      renderScale,
  };
}

function getNodeBounds(
  node: DisplayNode,
) {
  return {
    left:
      node.displayX -
      node.collisionWidth / 2,

    right:
      node.displayX +
      node.collisionWidth / 2,

    top:
      node.displayY -
      node.collisionHeight / 2,

    bottom:
      node.displayY +
      node.collisionHeight / 2,
  };
}

function clampNode(
  node: DisplayNode,
  width: number,
  height: number,
): DisplayNode {
  const halfWidth =
    node.collisionWidth / 2;

  const halfHeight =
    node.collisionHeight / 2;

  const minimumX =
    SAFE_PADDING +
    halfWidth;

  const maximumX =
    width -
    SAFE_PADDING -
    halfWidth;

  const minimumY =
    SAFE_PADDING +
    halfHeight;

  const maximumY =
    height -
    SAFE_PADDING -
    halfHeight;

  return {
    ...node,

    displayX:
      Math.max(
        minimumX,
        Math.min(
          maximumX,
          node.displayX,
        ),
      ),

    displayY:
      Math.max(
        minimumY,
        Math.min(
          maximumY,
          node.displayY,
        ),
      ),
  };
}

function getCollision(
  left: DisplayNode,
  right: DisplayNode,
) {
  const leftBounds =
    getNodeBounds(
      left,
    );

  const rightBounds =
    getNodeBounds(
      right,
    );

  const overlapX =
    Math.min(
      leftBounds.right,
      rightBounds.right,
    ) -
    Math.max(
      leftBounds.left,
      rightBounds.left,
    ) +
    COLLISION_GAP;

  const overlapY =
    Math.min(
      leftBounds.bottom,
      rightBounds.bottom,
    ) -
    Math.max(
      leftBounds.top,
      rightBounds.top,
    ) +
    COLLISION_GAP;

  if (
    overlapX <= 0 ||
    overlapY <= 0
  ) {
    return null;
  }

  return {
    overlapX,
    overlapY,
  };
}

function resolveDisplayCollisions(
  inputNodes:
    DisplayNode[],
  width: number,
  height: number,
  selectedNodeId:
    string | null,
): DisplayNode[] {
  const nodes =
    inputNodes.map(
      (node) =>
        clampNode(
          {
            ...node,
          },
          width,
          height,
        ),
    );

  for (
    let pass = 0;
    pass <
      MAX_COLLISION_PASSES;
    pass += 1
  ) {
    let collisionFound =
      false;

    for (
      let leftIndex = 0;
      leftIndex <
        nodes.length;
      leftIndex += 1
    ) {
      for (
        let rightIndex =
          leftIndex + 1;
        rightIndex <
          nodes.length;
        rightIndex += 1
      ) {
        const left =
          nodes[
            leftIndex
          ];

        const right =
          nodes[
            rightIndex
          ];

        const collision =
          getCollision(
            left,
            right,
          );

        if (!collision) {
          continue;
        }

        collisionFound =
          true;

        const leftIsSelected =
          left.id ===
          selectedNodeId;

        const rightIsSelected =
          right.id ===
          selectedNodeId;

        if (
          collision.overlapX <=
          collision.overlapY
        ) {
          const direction =
            right.displayX >=
            left.displayX
              ? 1
              : -1;

          const separation =
            collision.overlapX +
            0.5;

          if (
            leftIsSelected &&
            !rightIsSelected
          ) {
            right.displayX +=
              separation *
              direction;
          } else if (
            rightIsSelected &&
            !leftIsSelected
          ) {
            left.displayX -=
              separation *
              direction;
          } else {
            left.displayX -=
              (separation / 2) *
              direction;

            right.displayX +=
              (separation / 2) *
              direction;
          }
        } else {
          const direction =
            right.displayY >=
            left.displayY
              ? 1
              : -1;

          const separation =
            collision.overlapY +
            0.5;

          if (
            leftIsSelected &&
            !rightIsSelected
          ) {
            right.displayY +=
              separation *
              direction;
          } else if (
            rightIsSelected &&
            !leftIsSelected
          ) {
            left.displayY -=
              separation *
              direction;
          } else {
            left.displayY -=
              (separation / 2) *
              direction;

            right.displayY +=
              (separation / 2) *
              direction;
          }
        }

        nodes[
          leftIndex
        ] =
          clampNode(
            left,
            width,
            height,
          );

        nodes[
          rightIndex
        ] =
          clampNode(
            right,
            width,
            height,
          );
      }
    }

    if (!collisionFound) {
      break;
    }
  }

  return nodes.map(
    (node) =>
      clampNode(
        node,
        width,
        height,
      ),
  );
}

function createDisplayNodes(
  baseNodes:
    CanvasNode[],
  selectedNodeId:
    string | null,
  activeFamilyId:
    CapabilityFamilyId,
  width: number,
  height: number,
): DisplayNode[] {
  let nodes =
    baseNodes.map(
      (node) =>
        toDisplayNode(
          node,
          selectedNodeId,
        ),
    );

  /*
   * If there has not been a specific click,
   * use the active family's primary word as
   * a gentle convergence focus.
   */
  const focalNode =
    nodes.find(
      (node) =>
        node.id ===
        selectedNodeId,
    ) ??
    nodes.find(
      (node) =>
        node.id ===
        activeFamilyId,
    );

  if (!focalNode) {
    return nodes;
  }

  const focusShiftX =
    (width / 2 -
      focalNode.displayX) *
    FOCUS_SHIFT;

  const focusShiftY =
    (height / 2 -
      focalNode.displayY) *
    FOCUS_SHIFT;

  nodes =
    nodes.map(
      (node) => {
        const sameFamily =
          node.familyId ===
          activeFamilyId;

        const attraction =
          sameFamily &&
          node.id !==
            focalNode.id
            ? FAMILY_CONVERGENCE
            : 0;

        return {
          ...node,

          displayX:
            node.displayX +
            focusShiftX +
            (focalNode.displayX -
              node.displayX) *
              attraction,

          displayY:
            node.displayY +
            focusShiftY +
            (focalNode.displayY -
              node.displayY) *
              attraction,
        };
      },
    );

  return resolveDisplayCollisions(
    nodes,
    width,
    height,
    selectedNodeId,
  );
}

function pointInsideNode(
  x: number,
  y: number,
  node: DisplayNode,
): boolean {
  const bounds =
    getNodeBounds(
      node,
    );

  const horizontalPadding =
    10;

  const verticalPadding =
    8;

  return (
    x >=
      bounds.left -
        horizontalPadding &&
    x <=
      bounds.right +
        horizontalPadding &&
    y >=
      bounds.top -
        verticalPadding &&
    y <=
      bounds.bottom +
        verticalPadding
  );
}

export default function CapabilityCanvas({
  selectedNodeId,
  activeFamilyId,
  onNodeClick,
  onNodeHover,
}: CapabilityCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(
      null,
    );

  const displayNodesRef =
    useRef<
      DisplayNode[]
    >([]);

  const hoveredNodeIdRef =
    useRef<string | null>(
      null,
    );

  const redrawRef =
    useRef<() => void>(
      () => {},
    );

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const container =
      canvas.parentElement;

    if (!container) {
      return;
    }

    const reducedMotionMedia =
      window.matchMedia(
        REDUCED_MOTION_QUERY,
      );

    let frameId = 0;
    let resizeFrameId = 0;

    function getCanvasState() {
      const rectangle =
        container!.getBoundingClientRect();

      const width =
        Math.max(
          1,
          Math.floor(
            rectangle.width,
          ),
        );

      const height =
        Math.max(
          360,
          Math.floor(
            rectangle.height,
          ),
        );

      const ratio =
        window.devicePixelRatio ||
        1;

      const pixelWidth =
        Math.floor(
          width * ratio,
        );

      const pixelHeight =
        Math.floor(
          height * ratio,
        );

      if (
        canvas!.width !==
        pixelWidth
      ) {
        canvas!.width =
          pixelWidth;
      }

      if (
        canvas!.height !==
        pixelHeight
      ) {
        canvas!.height =
          pixelHeight;
      }

      if (
        canvas!.style.width !==
        `${width}px`
      ) {
        canvas!.style.width =
          `${width}px`;
      }

      if (
        canvas!.style.height !==
        `${height}px`
      ) {
        canvas!.style.height =
          `${height}px`;
      }

      const context =
        canvas!.getContext(
          '2d',
        );

      if (!context) {
        return null;
      }

      context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0,
      );

      return {
        context,
        width,
        height,
      };
    }

    function createTargetNodes(
      context:
        CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      const baseNodes =
        createCanvasLayout(
          context,
          {
            width,
            height,
          },
        );

      return createDisplayNodes(
        baseNodes,
        selectedNodeId,
        activeFamilyId,
        width,
        height,
      );
    }

    function drawNodes(
      context:
        CanvasRenderingContext2D,
      width: number,
      height: number,
      displayNodes:
        DisplayNode[],
    ) {
      context.clearRect(
        0,
        0,
        width,
        height,
      );

      displayNodesRef.current =
        displayNodes;

      const darkMode =
        isDarkTheme();

      const activeFamilyNodeIds =
        familyNodeIds.get(
          activeFamilyId,
        );

      context.textAlign =
        'center';

      context.textBaseline =
        'middle';

      for (
        const node
        of displayNodes
      ) {
        const isHovered =
          node.id ===
          hoveredNodeIdRef.current;

        const isSelected =
          node.id ===
          selectedNodeId;

        const isFamilyMember =
          Boolean(
            activeFamilyNodeIds?.has(
              node.id,
            ),
          );

        const directTarget =
          isHovered ||
          isSelected;

        const renderedFontSize =
          node.fontSize *
          node.renderScale;

        context.font =
          `${node.fontWeight} ${renderedFontSize}px Inter, system-ui, sans-serif`;

        context.shadowBlur =
          0;

        context.shadowColor =
          'transparent';

        if (
          directTarget &&
          isFamilyMember
        ) {
          const color =
            getFamilyColor(
              activeFamilyId,
              darkMode,
            );

          context.fillStyle =
            color;

          context.globalAlpha =
            1;

          if (darkMode) {
            context.shadowColor =
              color;

            context.shadowBlur =
              node.type ===
              'primary'
                ? 14
                : 8;
          }
        } else if (
          isFamilyMember
        ) {
          const color =
            getFamilyColor(
              activeFamilyId,
              darkMode,
            );

          context.fillStyle =
            color;

          context.globalAlpha =
            darkMode
              ? 0.82
              : 0.92;

          if (darkMode) {
            context.shadowColor =
              color;

            context.shadowBlur =
              3;
          }
        } else {
          context.fillStyle =
            getNeutralColor(
              darkMode,
              node.type ===
                'primary',
            );

          context.globalAlpha =
            darkMode
              ? 0.18
              : 0.20;
        }

        context.fillText(
          node.label,
          node.displayX,
          node.displayY,
        );
      }

      context.globalAlpha =
        1;
    }

    function renderImmediate() {
      cancelAnimationFrame(
        frameId,
      );

      const state =
        getCanvasState();

      if (!state) {
        return;
      }

      const targetNodes =
        createTargetNodes(
          state.context,
          state.width,
          state.height,
        );

      drawNodes(
        state.context,
        state.width,
        state.height,
        targetNodes,
      );
    }

    redrawRef.current =
      () => {
        const state =
          getCanvasState();

        if (
          !state ||
          displayNodesRef.current.length ===
            0
        ) {
          return;
        }

        drawNodes(
          state.context,
          state.width,
          state.height,
          displayNodesRef.current,
        );
      };

    function animateToTarget() {
      cancelAnimationFrame(
        frameId,
      );

      const state =
        getCanvasState();

      if (!state) {
        return;
      }

      const targetNodes =
        createTargetNodes(
          state.context,
          state.width,
          state.height,
        );

      const startNodes =
        displayNodesRef.current;

      if (
        reducedMotionMedia.matches ||
        startNodes.length ===
          0 ||
        !haveSameGeometry(
          startNodes,
          targetNodes,
        ) &&
          startNodes.length !==
            targetNodes.length
      ) {
        drawNodes(
          state.context,
          state.width,
          state.height,
          targetNodes,
        );

        return;
      }

      if (
        haveSameGeometry(
          startNodes,
          targetNodes,
        )
      ) {
        drawNodes(
          state.context,
          state.width,
          state.height,
          targetNodes,
        );

        return;
      }

      const startTime =
        performance.now();

      const step =
        (
          currentTime:
            number,
        ) => {
          const elapsed =
            currentTime -
            startTime;

          const rawProgress =
            Math.min(
              elapsed /
                POSITION_TRANSITION_MS,
              1,
            );

          const easedProgress =
            easeInOutCubic(
              rawProgress,
            );

          const interpolatedNodes =
            interpolateDisplayNodes(
              startNodes,
              targetNodes,
              easedProgress,
            );

          const currentState =
            getCanvasState();

          if (!currentState) {
            return;
          }

          drawNodes(
            currentState.context,
            currentState.width,
            currentState.height,
            interpolatedNodes,
          );

          if (
            rawProgress <
            1
          ) {
            frameId =
              requestAnimationFrame(
                step,
              );

            return;
          }

          drawNodes(
            currentState.context,
            currentState.width,
            currentState.height,
            targetNodes,
          );
        };

      frameId =
        requestAnimationFrame(
          step,
        );
    }

    function scheduleResizeRender() {
      cancelAnimationFrame(
        resizeFrameId,
      );

      resizeFrameId =
        requestAnimationFrame(
          renderImmediate,
        );
    }

    function handleReducedMotionChange() {
      if (
        reducedMotionMedia.matches
      ) {
        renderImmediate();
      } else {
        animateToTarget();
      }
    }

    animateToTarget();

    const resizeObserver =
      new ResizeObserver(
        scheduleResizeRender,
      );

    resizeObserver.observe(
      container,
    );

    const themeObserver =
      new MutationObserver(
        renderImmediate,
      );

    themeObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: [
          'class',
        ],
      },
    );

    reducedMotionMedia
      .addEventListener(
        'change',
        handleReducedMotionChange,
      );

    return () => {
      cancelAnimationFrame(
        frameId,
      );

      cancelAnimationFrame(
        resizeFrameId,
      );

      resizeObserver.disconnect();

      themeObserver.disconnect();

      reducedMotionMedia
        .removeEventListener(
          'change',
          handleReducedMotionChange,
        );

      redrawRef.current =
        () => {};
    };
  }, [
    selectedNodeId,
    activeFamilyId,
  ]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    function findNode(
      event:
        PointerEvent |
        MouseEvent,
    ) {
      const bounds =
        canvas!.getBoundingClientRect();

      const x =
        event.clientX -
        bounds.left;

      const y =
        event.clientY -
        bounds.top;

      return [
        ...displayNodesRef.current,
      ]
        .reverse()
        .find(
          (node) =>
            pointInsideNode(
              x,
              y,
              node,
            ),
        );
    }

    function handlePointerMove(
      event: PointerEvent,
    ) {
      const hovered =
        findNode(
          event,
        );

      const nextNodeId =
        hovered?.id ??
        null;

      const nextFamilyId =
        hovered?.familyId ??
        null;

      if (
        hoveredNodeIdRef.current !==
        nextNodeId
      ) {
        hoveredNodeIdRef.current =
          nextNodeId;

        redrawRef.current();
      }

      onNodeHover(
        nextNodeId,
        nextFamilyId,
      );

      canvas!.style.cursor =
        hovered
          ? 'pointer'
          : 'default';
    }

    function handlePointerLeave() {
      if (
        hoveredNodeIdRef.current !==
        null
      ) {
        hoveredNodeIdRef.current =
          null;

        redrawRef.current();
      }

      onNodeHover(
        null,
        null,
      );

      canvas!.style.cursor =
        'default';
    }

    function handleClick(
      event: MouseEvent,
    ) {
      const clicked =
        findNode(
          event,
        );

      if (!clicked) {
        return;
      }

      onNodeClick(
        clicked.id,
        clicked.familyId,
      );
    }

    canvas.addEventListener(
      'pointermove',
      handlePointerMove,
    );

    canvas.addEventListener(
      'pointerleave',
      handlePointerLeave,
    );

    canvas.addEventListener(
      'click',
      handleClick,
    );

    return () => {
      canvas.removeEventListener(
        'pointermove',
        handlePointerMove,
      );

      canvas.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      );

      canvas.removeEventListener(
        'click',
        handleClick,
      );
    };
  }, [
    onNodeClick,
    onNodeHover,
  ]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      className="block h-full w-full touch-pan-y"
      aria-label="Visual Core Capabilities word cloud. Use the capability family selectors above to explore by keyboard."
    />
  );
}


