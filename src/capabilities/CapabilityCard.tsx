import type { Capability } from './types';

interface CapabilityCardProps {
  capability: Capability;
  onClick: (capability: Capability) => void;
}

export default function CapabilityCard({
  capability,
  onClick,
}: CapabilityCardProps) {
  const Icon = capability.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(capability)}
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
      aria-label={`Explore ${capability.title}`}
    >
      <Icon
        className="
          mb-4
          h-8
          w-8
          text-accent
          transition-transform
          duration-200
          group-hover:scale-105
        "
      />

      <h3
        className="
          mb-2
          text-xl
          font-semibold
          transition-colors
          group-hover:text-accent
        "
      >
        {capability.title}
      </h3>

      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {capability.summary}
      </p>

      <span
        className="
          mt-auto
          text-sm
          font-medium
          text-accent
          transition-transform
          duration-200
          group-hover:translate-x-1
        "
      >
        Explore →
      </span>
    </button>
  );
}