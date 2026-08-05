import { useState } from 'react';

import CapabilityCard from './CapabilityCard';
import CapabilityDialog from './CapabilityDialog';
import { capabilityData } from './data';
import type { Capability } from './types';

export default function Capabilities() {
  const [selectedCapability, setSelectedCapability] =
    useState<Capability | null>(null);

  return (
    <section className="w-full bg-muted/30 py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Capabilities
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The technical capabilities I apply across geospatial,
            analytics, AI, and documentation work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {capabilityData.map((capability) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              onClick={setSelectedCapability}
            />
          ))}
        </div>

        <CapabilityDialog
          capability={selectedCapability}
          open={selectedCapability !== null}
          onClose={() => setSelectedCapability(null)}
        />
      </div>
    </section>
  );
}