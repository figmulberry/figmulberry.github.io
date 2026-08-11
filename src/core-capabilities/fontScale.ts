import type {
  CapabilityNode,
} from './types';

const PRIMARY_MIN = 25;
const PRIMARY_MAX = 39;

const SKILL_MIN = 13;
const SKILL_MAX = 23;

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function interpolate(
  minimum: number,
  maximum: number,
  value: number,
): number {
  return (
    minimum +
    (maximum - minimum) * value
  );
}

export function getNodeFontSize(
  node: CapabilityNode,
  scale = 1,
): number {
  const prominence = clamp(
    node.prominence,
    0,
    1,
  );

  const baseSize =
    node.type === 'primary'
      ? interpolate(
          PRIMARY_MIN,
          PRIMARY_MAX,
          prominence,
        )
      : interpolate(
          SKILL_MIN,
          SKILL_MAX,
          prominence,
        );

  return Math.round(
    baseSize * scale,
  );
}

export function getNodeFontWeight(
  node: CapabilityNode,
): number {
  if (node.type === 'primary') {
    return 700;
  }

  if (node.prominence >= 0.78) {
    return 650;
  }

  if (node.prominence >= 0.62) {
    return 550;
  }

  return 450;
}