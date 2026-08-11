import type {
  CapabilityFamilyId,
  CapabilityNodeType,
} from './types';

export type CanvasBounds = {
  width: number;
  height: number;
};

export type CanvasNode = {
  id: string;
  label: string;

  familyId: CapabilityFamilyId;

  type: CapabilityNodeType;

  prominence: number;

  x: number;
  y: number;

  width: number;
  height: number;

  fontSize: number;
  fontWeight: number;
};

export type MeasuredCanvasNode =
  Omit<
    CanvasNode,
    'x' | 'y'
  >;