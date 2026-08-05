import React, {
  useState,
} from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRightCircle,
  ChevronDown,
  CircleHelp,
  Info,
  Lightbulb,
  Zap,
} from 'lucide-react';

export type ArticleCalloutType =
  | 'important'
  | 'tip'
  | 'note'
  | 'warning'
  | 'caution'
  | 'see-also'
  | 'publication-info'
  | 'machine-readable';

type ArticleCalloutProps = {
  type: ArticleCalloutType;
  title: string;
  collapsible?: boolean;
  children: React.ReactNode;
};

const calloutStyles: Record<
  ArticleCalloutType,
  {
    icon: React.ComponentType<{
      className?: string;
      'aria-hidden'?: boolean;
    }>;
    border: string;
    header: string;
    iconColor: string;
    body: string;
  }
> = {
  important: {
    icon: Zap,
    border: 'border-blue-500',
    header:
      'bg-blue-500/14 text-blue-700 dark:bg-blue-500/16 dark:text-blue-300',
    iconColor:
      'text-blue-600 dark:text-blue-400',
    body: 'bg-blue-500/[0.045] dark:bg-blue-500/[0.055]',
  },

  tip: {
    icon: Lightbulb,
    border: 'border-emerald-500',
    header:
      'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    iconColor:
      'text-emerald-600 dark:text-emerald-400',
    body: 'bg-emerald-500/[0.035]',
  },

  note: {
    icon: Info,
    border: 'border-sky-500',
    header:
      'bg-sky-500/12 text-sky-700 dark:text-sky-300',
    iconColor:
      'text-sky-600 dark:text-sky-400',
    body: 'bg-sky-500/[0.035]',
  },

  warning: {
    icon: AlertTriangle,
    border: 'border-amber-500',
    header:
      'bg-amber-500/14 text-amber-800 dark:text-amber-300',
    iconColor:
      'text-amber-600 dark:text-amber-400',
    body: 'bg-amber-500/[0.04]',
  },

  caution: {
    icon: AlertOctagon,
    border: 'border-red-500',
    header:
      'bg-red-500/12 text-red-700 dark:text-red-300',
    iconColor:
      'text-red-600 dark:text-red-400',
    body: 'bg-red-500/[0.035]',
  },

  'see-also': {
    icon: ArrowRightCircle,
    border: 'border-emerald-500',
    header:
      'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    iconColor:
      'text-emerald-600 dark:text-emerald-400',
    body: 'bg-emerald-500/[0.035]',
  },

  'publication-info': {
    icon: Zap,
    border: 'border-blue-500',
    header:
      'bg-blue-500/12 text-blue-700 dark:text-blue-300',
    iconColor:
      'text-blue-600 dark:text-blue-400',
    body: 'bg-blue-500/[0.035]',
  },

  'machine-readable': {
    icon: CircleHelp,
    border: 'border-blue-500',
    header:
      'bg-blue-500/12 text-blue-700 dark:text-blue-300',
    iconColor:
      'text-blue-600 dark:text-blue-400',
    body: 'bg-blue-500/[0.035]',
  },
};

export function ArticleCallout({
  type,
  title,
  collapsible = false,
  children,
}: ArticleCalloutProps) {
  const [expanded, setExpanded] =
    useState(!collapsible);

  const style = calloutStyles[type];
  const Icon = style.icon;

  const headerContent = (
    <>
      <span className="inline-flex items-center gap-3">
        <Icon
          className={[
            'h-5 w-5 shrink-0',
            style.iconColor,
          ].join(' ')}
          aria-hidden={true}
        />

        <span className="font-semibold">
          {title}
        </span>
      </span>

      {collapsible && (
        <ChevronDown
          className={[
            'h-5 w-5',
            'transition-transform duration-200',
            expanded
              ? 'rotate-180'
              : 'rotate-0',
          ].join(' ')}
          aria-hidden={true}
        />
      )}
    </>
  );

  return (
    <aside
      className={[
        'not-prose my-8',
        'article-callout',
        'overflow-hidden',
        'border-l-4',
        style.border,
      ].join(' ')}
    >
      {collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() =>
            setExpanded((current) => !current)
          }
          className={[
            'flex w-full items-center',
            'justify-between gap-4',
            'px-4 py-3',
            'text-left',
            style.header,
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-inset',
            'focus-visible:ring-accent',
          ].join(' ')}
        >
          {headerContent}
        </button>
      ) : (
        <div
          className={[
            'flex items-center',
            'px-4 py-3',
            style.header,
          ].join(' ')}
        >
          {headerContent}
        </div>
      )}

      {expanded && (
        <div
          className={[
            'px-5 py-4',
            'leading-7 text-foreground/88',
            style.body,
          ].join(' ')}
        >
          {children}
        </div>
      )}
    </aside>
  );
}