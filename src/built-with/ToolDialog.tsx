import type { Tool } from './types';

interface ToolDialogProps {
  tool: Tool | null;
  open: boolean;
  onClose: () => void;
}

export default function ToolDialog({
  tool,
  open,
  onClose,
}: ToolDialogProps) {
  if (!open || !tool) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                {tool.name}
              </h2>

              <p className="mt-2 text-muted-foreground">
                {tool.tagline}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-2">
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Where I Use It
            </h3>

            <ul className="space-y-3">
              {tool.whereUsed.map((item) => (
                <li key={item}>
                  • {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Featured Work
            </h3>

            <ul className="space-y-3">
              {tool.projects.map((item) => (
                <li key={item}>
                  • {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-border p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Experience
          </h3>

          <p className="text-muted-foreground">
            {tool.experience}
          </p>
        </div>

        <div className="flex justify-end border-t border-border p-6">
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}