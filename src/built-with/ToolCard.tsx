import type { CSSProperties } from 'react';
import type { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export default function ToolCard({
  tool,
  onClick,
}: ToolCardProps) {
  const Icon = tool.icon;

  const accentStyle = {
    '--tool-accent': tool.accentColor,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={() => onClick(tool)}
      style={accentStyle}
      className="
        group
        flex
        min-h-[200px]
        w-full
        flex-col
        rounded-lg
        border
        border-border
        bg-card
        p-5
        text-left
        transition-all
        hover:border-accent/50
        hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
      "
      aria-label={`Explore ${tool.name}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <Icon
          className="
            h-8
            w-8
            text-muted-foreground
            transition-colors
            duration-200
            group-hover:text-[var(--tool-accent)]
          "
        />

        <span
          className="
            text-[0.7rem]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-muted-foreground
            transition-colors
            duration-200
            group-hover:text-[var(--tool-accent)]
          "
        >
          {tool.category}
        </span>
      </div>

      <h3 className="mb-2 text-xl font-semibold">
        {tool.name}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {tool.tagline}
      </p>

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          <span>{tool.level}</span>
          <span className="mx-2">•</span>
          <span>Since {tool.since}</span>
        </div>

        <span
          className="
            shrink-0
            text-sm
            font-medium
            text-accent
            transition-colors
            duration-200
            group-hover:text-[var(--tool-accent)]
          "
        >
          Explore →
        </span>
      </div>
    </button>
  );
}