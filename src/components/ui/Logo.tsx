import React from 'react';
import { Link } from 'wouter';

type LogoProps = {
  className?: string;
  linkTo?: string;
};

export function Logo({ className = '', linkTo = '/' }: LogoProps) {
  const content = (
    <span className={`font-semibold text-lg tracking-tight ${className}`}>
      <span className="text-accent">{'{'}</span>
      <span className="dark:text-white text-foreground"> Moses </span>
      <span className="text-accent">{'}'}</span>
    </span>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="flex items-center">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center">{content}</div>;
}
