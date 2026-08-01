import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, X } from 'lucide-react';

import type { Capability } from './types';

interface CapabilityDialogProps {
  capability: Capability | null;
  open: boolean;
  onClose: () => void;
}

export default function CapabilityDialog({
  capability,
  open,
  onClose,
}: CapabilityDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !capability) {
    return null;
  }

  const Icon = capability.icon;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="capability-dialog-title"
        aria-describedby="capability-dialog-description"
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-lg
          border
          border-border
          bg-background
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-border p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Icon className="mb-4 h-9 w-9 text-accent" />

              <h2
                id="capability-dialog-title"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {capability.title}
              </h2>

              <p
                id="capability-dialog-description"
                className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {capability.description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                shrink-0
                rounded-md
                p-2
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
              "
              aria-label="Close capability details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Built with
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {capability.relatedTools.map((tool) => (
                <span
                  key={tool}
                  className="
                    rounded-md
                    border
                    border-border
                    bg-muted/40
                    px-2.5
                    py-1.5
                    text-xs
                    font-medium
                  "
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Selected projects
            </h3>

            <ul className="mt-4 space-y-3">
              {capability.relatedProjects.map((project) => (
                <li
                  key={project}
                  className="flex gap-3 text-sm leading-relaxed"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="border-t border-border px-6 py-5 sm:px-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Related articles
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {capability.relatedArticles.map((article) => (
              <span
                key={article}
                className="
                  rounded-md
                  border
                  border-border
                  px-2.5
                  py-1.5
                  text-xs
                  text-muted-foreground
                "
              >
                {article}
              </span>
            ))}
          </div>
        </section>

        <footer className="border-t border-border p-6 sm:px-8">
          <Link
            href={capability.relatedHref}
            onClick={onClose}
            className="
              inline-flex
              items-center
              gap-2
              rounded-md
              bg-primary
              px-4
              py-2.5
              text-sm
              font-semibold
              text-primary-foreground
              transition-opacity
              hover:opacity-90
            "
          >
            View related work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </div>
  );
}