import type { CSSProperties } from 'react';

import type { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
  active: boolean;
  onActivate: (tool: Tool) => void;
  onClick: (tool: Tool) => void;
}

export default function ToolCard({
  tool,
  active,
  onActivate,
  onClick,
}: ToolCardProps) {
  const Icon = tool.icon;

  const accentStyle = {
    '--tool-accent': tool.accentColor,
    width: active ? '240px' : '160px',
  } as CSSProperties;

  return (
    <button
      type="button"
      onMouseEnter={() => onActivate(tool)}
      onFocus={() => onActivate(tool)}
      onClick={() => onClick(tool)}
      style={accentStyle}
      className={`
        group
        grid
        shrink-0
        cursor-pointer
        grid-rows-[56px_48px_60px_1px_60px_20px]
        content-center
        gap-2
        overflow-hidden
        border
        bg-card
        px-5
        py-5
        text-center
        transition-[width,height,border-color,box-shadow]
        duration-300
        ease-out
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        data-[dialog-focus-return=true]:focus-visible:ring-0
        data-[dialog-focus-return=true]:focus-visible:ring-offset-0
        ${
          active
            ? `
              h-[374px]
              border-[var(--tool-accent)]
              shadow-lg
            `
            : `
              h-[350px]
              border-border
            `
        }
      `}
      aria-label={`View more about ${tool.name}`}
      aria-pressed={active}
    >
      {/* Row 1: Icon */}
      <div className="flex h-14 items-center justify-center">
        <Icon
          className={`
            transition-[width,height,color,filter]
            duration-300
            ease-out
            ${
              active
                ? `
                  h-12
                  w-12
                  text-[var(--tool-accent)]
                  grayscale-0
                `
                : `
                  h-10
                  w-10
                  text-muted-foreground
                  grayscale
                `
            }
          `}
        />
      </div>

      {/* Row 2: Tool name */}
      <h3
        className={`
          flex
          h-12
          items-center
          justify-center
          overflow-hidden
          font-semibold
          leading-6
          transition-[color,font-size]
          duration-300
          ease-out
          [display:-webkit-box]
          [-webkit-box-orient:vertical]
          [-webkit-line-clamp:2]
          ${
            active
              ? `
                text-xl
                text-[var(--tool-accent)]
              `
              : `
                text-base
                text-foreground
              `
          }
        `}
      >
        {tool.name}
      </h3>

      {/* Row 3: Tagline */}
      <div className="flex h-[60px] items-center justify-center overflow-hidden">
        <p
          className={`
            overflow-hidden
            leading-5
            transition-[color,font-size]
            duration-300
            ease-out
            [display:-webkit-box]
            [-webkit-box-orient:vertical]
            [-webkit-line-clamp:3]
            ${
              active
                ? `
                  text-[0.8rem]
                  text-[var(--tool-accent)]
                `
                : `
                  text-xs
                  text-muted-foreground
                `
            }
          `}
        >
          {tool.tagline}
        </p>
      </div>

      {/* Row 4: Divider */}
      <div
        className={`
          mx-auto
          h-px
          transition-[width,background-color]
          duration-300
          ease-out
          ${
            active
              ? `
                w-14
                bg-[var(--tool-accent)]
              `
              : `
                w-10
                bg-border
              `
          }
        `}
      />

      {/* Row 5: Homepage summary */}
      <div
        aria-hidden={!active}
        className={`
          h-[60px]
          overflow-hidden
          transition-[opacity,transform]
          duration-300
          ease-out
          ${
            active
              ? `
                translate-y-0
                opacity-100
                delay-[180ms]
              `
              : `
                pointer-events-none
                translate-y-2
                opacity-0
                delay-0
              `
          }
        `}
      >
        <p
          className="
            overflow-hidden
            text-[0.8rem]
            leading-5
            text-muted-foreground
            [display:-webkit-box]
            [-webkit-box-orient:vertical]
            [-webkit-line-clamp:3]
          "
        >
          {tool.homepageSummary}
        </p>
      </div>

      {/* Row 6: CTA */}
      <span
        aria-hidden={!active}
        className={`
          flex
          h-5
          items-center
          justify-center
          whitespace-nowrap
          text-xs
          font-medium
          transition-[color,opacity,transform]
          duration-300
          ease-out
          ${
            active
              ? `
                translate-y-0
                text-[var(--tool-accent)]
                opacity-60
                delay-[260ms]
              `
              : `
                pointer-events-none
                translate-y-2
                text-muted-foreground
                opacity-0
                delay-0
              `
          }
        `}
      >
        View More →
      </span>
    </button>
  );
}