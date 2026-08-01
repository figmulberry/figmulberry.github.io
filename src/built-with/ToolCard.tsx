import type { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export default function ToolCard({
  tool,
  onClick,
}: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(tool)}
      className="
        group
        flex
        h-[220px]
        w-full
        flex-col
        justify-between
        rounded-xl
        border
        border-border
        bg-card
        p-6
        text-left
        transition-all
        duration-200
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between">
        <div
          className="h-10 w-10 rounded-lg bg-muted"
        />

        <span
          className="
            text-xs
            text-muted-foreground
            group-hover:text-foreground
          "
        >
          Explore →
        </span>
      </div>

      <div>
        <h3 className="text-xl font-semibold">
          {tool.name}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {tool.tagline}
        </p>
      </div>
    </button>
  );
}