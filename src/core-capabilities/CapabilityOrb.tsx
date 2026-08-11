import React from 'react';

import {
  capabilityAccentStyles,
} from './accentStyles';

import type {
  CapabilityAccent,
} from './types';

type CapabilityOrbProps = {
  accent: CapabilityAccent;
  size?: number;
};

export default function CapabilityOrb({
  accent,
  size = 34,
}: CapabilityOrbProps) {
  const colors =
    capabilityAccentStyles[
      accent
    ];

  const castWidth =
    size * 1.42;

  const castHeight =
    size * 0.74;

  const contactWidth =
    size * 0.92;

  const contactHeight =
    size * 0.34;

  return (
    <span
      aria-hidden="true"
      className="relative inline-block shrink-0 overflow-visible"
      style={{
        width: size,
        height: size,
      }}
    >
      {/*
        LARGE CAST LIGHT

        This is deliberately offset down-right,
        matching the reference marbles rather than
        creating a symmetric halo.
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
          'blur-[10px]',
        ].join(' ')}
        style={{
          width:
            castWidth,

          height:
            castHeight,

          left:
            size * 0.18,

          top:
            size * 0.70,

          background: [
            'radial-gradient(',
            'ellipse at 32% 40%,',
            `${colors.glowStrong} 0%,`,
            `${colors.glow} 38%,`,
            `${colors.soft} 68%,`,
            'transparent 100%',
            ')',
          ].join(' '),

          opacity:
            0.72,

          transform:
            'rotate(-13deg)',
        }}
      />

      {/*
        CONTACT LIGHT

        Smaller, more saturated pool immediately
        underneath the sphere.
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
          'blur-[4px]',
        ].join(' ')}
        style={{
          width:
            contactWidth,

          height:
            contactHeight,

          left:
            size * 0.18,

          top:
            size * 0.77,

          background: [
            'radial-gradient(',
            'ellipse at center,',
            `${colors.glowStrong} 0%,`,
            `${colors.glow} 44%,`,
            'transparent 100%',
            ')',
          ].join(' '),

          opacity:
            0.86,

          transform:
            'rotate(-10deg)',
        }}
      />

      {/*
        DARK MODE AMBIENT BLOOM

        This is intentionally subtle.
        The cast shadow remains the dominant effect.
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          '-inset-[20%]',
          'hidden',
          'rounded-full',
          'blur-[9px]',
          'dark:block',
        ].join(' ')}
        style={{
          background:
            colors.glow,

          opacity:
            0.36,
        }}
      />

      {/*
        GLASS SPHERE BODY
      */}
      <span
        className={[
          'absolute',
          'inset-0',
          'rounded-full',
        ].join(' ')}
        style={{
          background: [
            'radial-gradient(',
            'circle at 29% 22%,',
            'rgba(255,255,255,0.98) 0%,',
            'rgba(255,255,255,0.92) 7%,',
            'rgba(255,255,255,0.46) 13%,',
            `${colors.solid} 34%,`,
            `${colors.lightBorder} 68%,`,
            'rgba(10,15,25,0.74) 100%',
            ')',
          ].join(' '),

          border:
            `1px solid ${colors.solid}`,

          boxShadow: [
            'inset 5px 5px 8px rgba(255,255,255,0.26)',
            'inset -5px -7px 10px rgba(0,0,0,0.24)',
            `0 1px 2px ${colors.lightShadow}`,
          ].join(', '),
        }}
      />

      {/*
        MAIN SPECULAR HIGHLIGHT
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
          'bg-white',
        ].join(' ')}
        style={{
          width:
            size * 0.22,

          height:
            size * 0.22,

          left:
            size * 0.20,

          top:
            size * 0.14,

          opacity:
            0.96,

          boxShadow:
            '0 0 6px rgba(255,255,255,0.96)',
        }}
      />

      {/*
        SECONDARY SOFT REFLECTION
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
          'bg-white',
          'blur-[0.5px]',
        ].join(' ')}
        style={{
          width:
            size * 0.12,

          height:
            size * 0.12,

          left:
            size * 0.10,

          top:
            size * 0.31,

          opacity:
            0.58,
        }}
      />

      {/*
        SMALL LOWER-RIGHT SPECULAR DOT
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
          'bg-white',
        ].join(' ')}
        style={{
          width:
            size * 0.085,

          height:
            size * 0.085,

          right:
            size * 0.14,

          bottom:
            size * 0.18,

          opacity:
            0.82,

          boxShadow:
            '0 0 3px rgba(255,255,255,0.72)',
        }}
      />

      {/*
        LOWER GLASS SHEEN

        Adds the translucent lower-body reflection
        visible in the reference marbles.
      */}
      <span
        className={[
          'pointer-events-none',
          'absolute',
          'rounded-full',
        ].join(' ')}
        style={{
          width:
            size * 0.58,

          height:
            size * 0.23,

          left:
            size * 0.20,

          bottom:
            size * 0.08,

          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',

          opacity:
            0.56,

          filter:
            'blur(1px)',
        }}
      />
    </span>
  );
}