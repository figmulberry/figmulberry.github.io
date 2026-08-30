import React from 'react';

import {
  Link,
} from 'wouter';

type LogoProps = {
  className?: string;
  linkTo?: string;
};

function LogoMark({
  className = '',
}: {
  className?: string;
}) {
  return (
    <span
      className={[
        'relative',
        'block',
        'h-9',
        'w-[4.35rem]',
        className,
      ].join(' ')}
    >
      <img
        src="/brand/tkm-mark-black.png"
        alt=""
        aria-hidden="true"
        className={[
          'absolute',
          'inset-0',
          'h-full',
          'w-full',
          'object-contain',
          'object-left',
          'dark:hidden',
        ].join(' ')}
      />

      <img
        src="/brand/tkm-mark-white.png"
        alt=""
        aria-hidden="true"
        className={[
          'absolute',
          'inset-0',
          'hidden',
          'h-full',
          'w-full',
          'object-contain',
          'object-left',
          'dark:block',
        ].join(' ')}
      />
    </span>
  );
}

export function Logo({
  className = '',
  linkTo = '/',
}: LogoProps) {
  const content = (
    <LogoMark
      className={className}
    />
  );

  if (!linkTo) {
    return content;
  }

  return (
    <Link
      href={linkTo}
      aria-label="The Kalabash Mosaics home"
      className={[
        'inline-flex',
        'items-center',
        'rounded-sm',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
      ].join(' ')}
    >
      {content}
    </Link>
  );
}