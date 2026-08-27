import React from 'react';

import {
  Link,
} from 'wouter';

import GeoInstrument from
  './GeoInstrument';

export default function GeoHero() {
  return (
    <section
      className={[
        'relative',
        'w-full',
        'overflow-hidden',
        'bg-background',
        'text-foreground',
        'transition-colors',
        'duration-300',
        'pt-10',
        'pb-6',
        'sm:pt-12',
        'lg:pt-14',
        'lg:pb-8',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none',
          'absolute',
          'inset-0',
          'opacity-0',
          'dark:opacity-100',
        ].join(' ')}
        style={{
          background:
            'radial-gradient(circle at 74% 42%, rgba(30,42,58,0.14), transparent 44%)',
        }}
      />

      <div
        className={[
          'container',
          'relative',
          'z-10',
          'mx-auto',
          'max-w-7xl',
          'px-4',
          'sm:px-6',
          'lg:px-8',
        ].join(' ')}
      >
        <div
          className={[
            'grid',
            'grid-cols-1',
            'gap-8',
            'lg:grid-cols-[0.84fr_1.16fr]',
            'lg:items-center',
            'lg:gap-2',
          ].join(' ')}
        >
          <div
            className={[
              'relative',
              'z-20',
              'max-w-[600px]',
            ].join(' ')}
          >
            <h1
              className={[
                'max-w-[590px]',
                'text-[clamp(2.7rem,4.15vw,4.65rem)]',
                'font-semibold',
                'leading-[1.01]',
                'tracking-[-0.045em]',
                'text-foreground',
              ].join(' ')}
            >
              Solving complex geospatial problems with{' '}
              <span className="text-accent">
                clear
              </span>
              , reproducible data solutions.
            </h1>

            <div
              className={[
                'mt-5',
                'flex',
                'flex-wrap',
                'items-center',
                'gap-x-2.5',
                'gap-y-1.5',
                'text-[0.78rem]',
                'font-normal',
                'tracking-[0.015em]',
                'text-muted-foreground/70',
                'sm:text-[0.82rem]',
              ].join(' ')}
            >
              <span>
                Spatial Thinking
              </span>

              <span
                aria-hidden="true"
                className="text-accent"
              >
                |
              </span>

              <span>
                Analytical Rigor
              </span>

              <span
                aria-hidden="true"
                className="text-accent"
              >
                |
              </span>

              <span>
                Reproducible Solutions
              </span>
            </div>

            <div
              className={[
                'mt-7',
                'flex',
                'flex-wrap',
                'items-center',
                'gap-4',
              ].join(' ')}
            >
              <Link
                href="/portfolio"
                className={[
                  'inline-flex',
                  'min-h-12',
                  'items-center',
                  'gap-3',
                  'rounded-md',
                  'bg-primary',
                  'px-7',
                  'font-medium',
                  'text-primary-foreground',
                  'shadow-sm',
                  'transition-[transform,box-shadow,background-color]',
                  'duration-200',
                  'hover:-translate-y-0.5',
                  'hover:bg-primary/90',
                  'hover:shadow-md',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                ].join(' ')}
              >
                View Portfolio

                <span
                  aria-hidden="true"
                >
                  {'\u2192'}
                </span>
              </Link>

              <Link
                href="/articles"
                className={[
                  'inline-flex',
                  'min-h-12',
                  'items-center',
                  'rounded-md',
                  'border',
                  'border-border',
                  'bg-background/50',
                  'px-7',
                  'font-medium',
                  'text-foreground/85',
                  'transition-[transform,border-color,color,background-color]',
                  'duration-200',
                  'hover:-translate-y-0.5',
                  'hover:border-accent/45',
                  'hover:bg-muted/40',
                  'hover:text-foreground',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                  'dark:bg-background/25',
                ].join(' ')}
              >
                Read Articles
              </Link>
            </div>
          </div>

          <div
            className={[
              'relative',
              'min-h-[500px]',
              'lg:min-h-[520px]',
            ].join(' ')}
          >
            <div
              className={[
                'relative',
                'z-10',
                'ml-auto',
                'w-full',
                'max-w-[560px]',
              ].join(' ')}
            >
              <GeoInstrument />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}