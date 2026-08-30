import type {
  CapabilityAccent,
} from './types';

export type CapabilityAccentStyle = {
  solid: string;

  soft: string;

  glow: string;

  glowStrong: string;

  lightShadow: string;

  lightBorder: string;
};

export const capabilityAccentStyles:
  Record<
    CapabilityAccent,
    CapabilityAccentStyle
  > = {
  cyan: {
    solid: '#22d3ee',
    soft: 'rgba(34, 211, 238, 0.18)',
    glow: 'rgba(34, 211, 238, 0.30)',
    glowStrong:
      'rgba(34, 211, 238, 0.52)',
    lightShadow:
      'rgba(34, 211, 238, 0.24)',
    lightBorder: '#0891b2',
  },

  violet: {
    solid: '#a855f7',
    soft: 'rgba(168, 85, 247, 0.18)',
    glow: 'rgba(168, 85, 247, 0.30)',
    glowStrong:
      'rgba(168, 85, 247, 0.52)',
    lightShadow:
      'rgba(168, 85, 247, 0.24)',
    lightBorder: '#7e22ce',
  },

  blue: {
    solid: '#3b82f6',
    soft: 'rgba(59, 130, 246, 0.18)',
    glow: 'rgba(59, 130, 246, 0.30)',
    glowStrong:
      'rgba(59, 130, 246, 0.52)',
    lightShadow:
      'rgba(59, 130, 246, 0.24)',
    lightBorder: '#1d4ed8',
  },

  emerald: {
    solid: '#4ade80',
    soft: 'rgba(74, 222, 128, 0.18)',
    glow: 'rgba(74, 222, 128, 0.30)',
    glowStrong:
      'rgba(74, 222, 128, 0.52)',
    lightShadow:
      'rgba(74, 222, 128, 0.24)',
    lightBorder: '#15803d',
  },

  amber: {
    solid: '#f59e0b',
    soft: 'rgba(245, 158, 11, 0.18)',
    glow: 'rgba(245, 158, 11, 0.30)',
    glowStrong:
      'rgba(245, 158, 11, 0.52)',
    lightShadow:
      'rgba(245, 158, 11, 0.24)',
    lightBorder: '#b45309',
  },

  fuchsia: {
    solid: '#ec4899',
    soft: 'rgba(236, 72, 153, 0.18)',
    glow: 'rgba(236, 72, 153, 0.30)',
    glowStrong:
      'rgba(236, 72, 153, 0.52)',
    lightShadow:
      'rgba(236, 72, 153, 0.24)',
    lightBorder: '#be185d',
  },
};