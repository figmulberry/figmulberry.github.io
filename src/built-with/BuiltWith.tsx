import { useState } from 'react';

import ToolCard from './ToolCard';
import ToolDialog from './ToolDialog';
import { toolData } from './toolData';
import type { Tool } from './types';

export default function BuiltWith() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          <h2 className="text-4xl font-bold tracking-tight">
            Built With
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            The platforms, languages, and technologies I rely on to build
            geospatial, analytics, and AI-enabled solutions.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

          {toolData
            .filter((tool) => tool.featured)
            .map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={setSelectedTool}
              />
            ))}

        </div>

        <ToolDialog
          tool={selectedTool}
          open={selectedTool !== null}
          onClose={() => setSelectedTool(null)}
        />

      </div>
    </section>
  );
}