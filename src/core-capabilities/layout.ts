import {
  capabilityFamilies,
} from './capabilityData';

import {
  getNodeFontSize,
  getNodeFontWeight,
} from './fontScale';

import type {
  CanvasBounds,
  CanvasNode,
  MeasuredCanvasNode,
} from './canvasTypes';

import type {
  CapabilityNode,
} from './types';

/*
 * HARD LAYOUT RULES
 *
 * 1. No word may be dropped.
 * 2. No word may overlap another word.
 * 3. No word may touch the canvas edge.
 * 4. Font scale may reduce slightly when the
 *    detail panel makes the canvas narrower.
 * 5. The cloud must remain compact.
 */

const EDGE_PADDING = 20;

const SKILL_GAP = 7;

const PRIMARY_GAP = 11;

/*
 * We deliberately allow the cloud to reduce
 * gradually when the right-side panel opens.
 *
 * This is preferable to silently deleting words.
 */
const SCALE_ATTEMPTS = [
  1,
  0.96,
  0.92,
  0.88,
  0.84,
  0.80,
  0.76,
  0.72,
  0.68,
  0.64,
  0.60,
];

type Point = {
  x: number;
  y: number;
};

function flattenNodes():
  CapabilityNode[] {
  return capabilityFamilies.flatMap(
    (family) => family.nodes,
  );
}

function hashString(
  value: string,
): number {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^=
      value.charCodeAt(index);

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

function measureNode(
  context:
    CanvasRenderingContext2D,
  node: CapabilityNode,
  scale: number,
): MeasuredCanvasNode {
  const fontSize =
    getNodeFontSize(
      node,
      scale,
    );

  const fontWeight =
    getNodeFontWeight(
      node,
    );

  context.font =
    `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;

  const metrics =
    context.measureText(
      node.label,
    );

  return {
    id: node.id,
    label: node.label,
    familyId: node.familyId,
    type: node.type,
    prominence:
      node.prominence,

    width:
      Math.ceil(
        metrics.width,
      ),

    height:
      Math.ceil(
        fontSize * 1.18,
      ),

    fontSize,
    fontWeight,
  };
}

function getGap(
  left: CanvasNode,
  right: CanvasNode,
): number {
  if (
    left.type === 'primary' ||
    right.type === 'primary'
  ) {
    return PRIMARY_GAP;
  }

  return SKILL_GAP;
}

function overlaps(
  left: CanvasNode,
  right: CanvasNode,
): boolean {
  const gap =
    getGap(
      left,
      right,
    );

  const leftMinX =
    left.x -
    left.width / 2;

  const leftMaxX =
    left.x +
    left.width / 2;

  const leftMinY =
    left.y -
    left.height / 2;

  const leftMaxY =
    left.y +
    left.height / 2;

  const rightMinX =
    right.x -
    right.width / 2;

  const rightMaxX =
    right.x +
    right.width / 2;

  const rightMinY =
    right.y -
    right.height / 2;

  const rightMaxY =
    right.y +
    right.height / 2;

  return !(
    leftMaxX + gap <
      rightMinX ||
    leftMinX - gap >
      rightMaxX ||
    leftMaxY + gap <
      rightMinY ||
    leftMinY - gap >
      rightMaxY
  );
}

function isInsideBounds(
  node: CanvasNode,
  bounds: CanvasBounds,
): boolean {
  return (
    node.x -
      node.width / 2 >=
      EDGE_PADDING &&
    node.x +
      node.width / 2 <=
      bounds.width -
        EDGE_PADDING &&
    node.y -
      node.height / 2 >=
      EDGE_PADDING &&
    node.y +
      node.height / 2 <=
      bounds.height -
        EDGE_PADDING
  );
}

/*
 * The six large capability words are distributed
 * across the cloud instead of being stacked in
 * one central block.
 */
function getPrimaryAnchors(
  bounds: CanvasBounds,
): Point[] {
  return [
    {
      x:
        bounds.width *
        0.48,

      y:
        bounds.height *
        0.43,
    },

    {
      x:
        bounds.width *
        0.25,

      y:
        bounds.height *
        0.27,
    },

    {
      x:
        bounds.width *
        0.73,

      y:
        bounds.height *
        0.28,
    },

    {
      x:
        bounds.width *
        0.27,

      y:
        bounds.height *
        0.68,
    },

    {
      x:
        bounds.width *
        0.71,

      y:
        bounds.height *
        0.68,
    },

    {
      x:
        bounds.width *
        0.50,

      y:
        bounds.height *
        0.78,
    },
  ];
}

/*
 * Supporting terms are seeded throughout the
 * available region so they fill negative space.
 */
function getSkillAnchors(
  bounds: CanvasBounds,
): Point[] {
  return [
    {
      x:
        bounds.width *
        0.50,

      y:
        bounds.height *
        0.50,
    },

    {
      x:
        bounds.width *
        0.18,

      y:
        bounds.height *
        0.18,
    },

    {
      x:
        bounds.width *
        0.38,

      y:
        bounds.height *
        0.17,
    },

    {
      x:
        bounds.width *
        0.62,

      y:
        bounds.height *
        0.17,
    },

    {
      x:
        bounds.width *
        0.82,

      y:
        bounds.height *
        0.20,
    },

    {
      x:
        bounds.width *
        0.15,

      y:
        bounds.height *
        0.42,
    },

    {
      x:
        bounds.width *
        0.84,

      y:
        bounds.height *
        0.43,
    },

    {
      x:
        bounds.width *
        0.16,

      y:
        bounds.height *
        0.70,
    },

    {
      x:
        bounds.width *
        0.37,

      y:
        bounds.height *
        0.82,
    },

    {
      x:
        bounds.width *
        0.63,

      y:
        bounds.height *
        0.82,
    },

    {
      x:
        bounds.width *
        0.83,

      y:
        bounds.height *
        0.70,
    },

    {
      x:
        bounds.width *
        0.50,

      y:
        bounds.height *
        0.63,
    },
  ];
}

function createSpiralCandidates(
  anchor: Point,
  bounds: CanvasBounds,
  seed: number,
): Point[] {
  const candidates:
    Point[] = [
      anchor,
    ];

  const phase =
    ((seed % 360) *
      Math.PI) /
    180;

  const maximumRadius =
    Math.max(
      bounds.width,
      bounds.height,
    ) *
    0.62;

  const radiusStep = 7;

  for (
    let radius =
      radiusStep;
    radius <=
      maximumRadius;
    radius +=
      radiusStep
  ) {
    const circumference =
      Math.max(
        16,
        Math.floor(
          radius /
          3.2,
        ),
      );

    for (
      let index = 0;
      index <
        circumference;
      index += 1
    ) {
      const angle =
        phase +
        (index /
          circumference) *
          Math.PI *
          2;

      candidates.push({
        x:
          anchor.x +
          Math.cos(
            angle,
          ) *
            radius *
            0.95,

        y:
          anchor.y +
          Math.sin(
            angle,
          ) *
            radius *
            0.72,
      });
    }
  }

  return candidates;
}

/*
 * Exhaustive fallback.
 *
 * If the organic spiral cannot find a legal
 * location, we search the complete usable canvas.
 *
 * This is what prevents nodes from simply
 * disappearing.
 */
function createGridCandidates(
  bounds: CanvasBounds,
  seed: number,
): Point[] {
  const candidates:
    Point[] = [];

  const step = 6;

  const usableWidth =
    bounds.width -
    EDGE_PADDING * 2;

  const usableHeight =
    bounds.height -
    EDGE_PADDING * 2;

  const columns =
    Math.max(
      1,
      Math.floor(
        usableWidth /
        step,
      ),
    );

  const rows =
    Math.max(
      1,
      Math.floor(
        usableHeight /
        step,
      ),
    );

  /*
   * The deterministic offset prevents every
   * fallback label from searching from the same
   * upper-left starting point.
   */
  const columnOffset =
    seed %
    columns;

  const rowOffset =
    Math.floor(
      seed /
      Math.max(
        1,
        columns,
      ),
    ) %
    rows;

  for (
    let rowIndex = 0;
    rowIndex <
      rows;
    rowIndex += 1
  ) {
    const row =
      (rowIndex +
        rowOffset) %
      rows;

    for (
      let columnIndex = 0;
      columnIndex <
        columns;
      columnIndex += 1
    ) {
      const column =
        (columnIndex +
          columnOffset) %
        columns;

      candidates.push({
        x:
          EDGE_PADDING +
          column *
            step,

        y:
          EDGE_PADDING +
          row *
            step,
      });
    }
  }

  return candidates;
}

function sortMeasuredNodes(
  nodes:
    MeasuredCanvasNode[],
): MeasuredCanvasNode[] {
  const primaries =
    nodes
      .filter(
        (node) =>
          node.type ===
          'primary',
      )
      .sort(
        (left, right) =>
          right.prominence -
          left.prominence,
      );

  const skills =
    nodes
      .filter(
        (node) =>
          node.type ===
          'skill',
      )
      .sort(
        (left, right) => {
          const prominenceDifference =
            right.prominence -
            left.prominence;

          if (
            prominenceDifference !==
            0
          ) {
            return (
              prominenceDifference
            );
          }

          return (
            hashString(
              left.id,
            ) -
            hashString(
              right.id,
            )
          );
        },
      );

  const ordered:
    MeasuredCanvasNode[] =
      [];

  let primaryIndex = 0;
  let skillIndex = 0;

  /*
   * Interweaving keeps the resulting silhouette
   * closer to a true editorial word cloud.
   */
  while (
    primaryIndex <
      primaries.length ||
    skillIndex <
      skills.length
  ) {
    if (
      primaryIndex <
      primaries.length
    ) {
      ordered.push(
        primaries[
          primaryIndex
        ],
      );

      primaryIndex += 1;
    }

    const batchSize =
      primaryIndex <= 2
        ? 5
        : 7;

    for (
      let index = 0;
      index <
        batchSize &&
      skillIndex <
        skills.length;
      index += 1
    ) {
      ordered.push(
        skills[
          skillIndex
        ],
      );

      skillIndex += 1;
    }
  }

  return ordered;
}

function getPreferredAnchor(
  node: MeasuredCanvasNode,
  primaryIndex: number,
  bounds: CanvasBounds,
): Point {
  if (
    node.type ===
    'primary'
  ) {
    const anchors =
      getPrimaryAnchors(
        bounds,
      );

    return anchors[
      primaryIndex %
        anchors.length
    ];
  }

  const anchors =
    getSkillAnchors(
      bounds,
    );

  return anchors[
    hashString(
      node.id,
    ) %
      anchors.length
  ];
}

function canPlace(
  candidate: CanvasNode,
  placed: CanvasNode[],
  bounds: CanvasBounds,
): boolean {
  if (
    !isInsideBounds(
      candidate,
      bounds,
    )
  ) {
    return false;
  }

  return !placed.some(
    (existing) =>
      overlaps(
        candidate,
        existing,
      ),
  );
}

function findPlacement(
  node:
    MeasuredCanvasNode,
  anchor: Point,
  placed: CanvasNode[],
  bounds: CanvasBounds,
): CanvasNode | null {
  const seed =
    hashString(
      node.id,
    );

  /*
   * Pass 1:
   * organic cloud search.
   */
  const spiralCandidates =
    createSpiralCandidates(
      anchor,
      bounds,
      seed,
    );

  for (
    const position
    of spiralCandidates
  ) {
    const candidate:
      CanvasNode = {
      ...node,

      x:
        position.x,

      y:
        position.y,
    };

    if (
      canPlace(
        candidate,
        placed,
        bounds,
      )
    ) {
      return candidate;
    }
  }

  /*
   * Pass 2:
   * complete-space search.
   *
   * No silent dropping.
   */
  const gridCandidates =
    createGridCandidates(
      bounds,
      seed,
    );

  for (
    const position
    of gridCandidates
  ) {
    const candidate:
      CanvasNode = {
      ...node,

      x:
        position.x,

      y:
        position.y,
    };

    if (
      canPlace(
        candidate,
        placed,
        bounds,
      )
    ) {
      return candidate;
    }
  }

  return null;
}

function buildLayout(
  context:
    CanvasRenderingContext2D,
  bounds: CanvasBounds,
  scale: number,
): CanvasNode[] | null {
  const measured =
    sortMeasuredNodes(
      flattenNodes().map(
        (node) =>
          measureNode(
            context,
            node,
            scale,
          ),
      ),
    );

  const placed:
    CanvasNode[] = [];

  let primaryIndex = 0;

  for (
    const node
    of measured
  ) {
    const anchor =
      getPreferredAnchor(
        node,
        primaryIndex,
        bounds,
      );

    if (
      node.type ===
      'primary'
    ) {
      primaryIndex += 1;
    }

    const placement =
      findPlacement(
        node,
        anchor,
        placed,
        bounds,
      );

    /*
     * CRITICAL:
     *
     * One failed node invalidates this entire
     * scale attempt.
     *
     * We reduce scale and rebuild everything.
     */
    if (!placement) {
      return null;
    }

    placed.push(
      placement,
    );
  }

  return placed;
}

export function createCanvasLayout(
  context:
    CanvasRenderingContext2D,
  bounds: CanvasBounds,
): CanvasNode[] {
  const expectedCount =
    flattenNodes().length;

  for (
    const scale
    of SCALE_ATTEMPTS
  ) {
    const layout =
      buildLayout(
        context,
        bounds,
        scale,
      );

    if (
      layout &&
      layout.length ===
        expectedCount
    ) {
      return layout;
    }
  }

  /*
   * This should be practically unreachable at
   * normal desktop dimensions.
   *
   * We deliberately fail loudly rather than
   * return a partial cloud and silently make
   * expertise disappear.
   */
  throw new Error(
    `Core Capabilities layout failed: unable to place all ${expectedCount} nodes inside ${bounds.width}×${bounds.height}.`,
  );
}