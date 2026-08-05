import type { ComponentType } from 'react';

export type CapabilityIcon = ComponentType<{
  className?: string;
}>;

export interface Capability {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: CapabilityIcon;
  relatedTools: string[];
  relatedProjects: string[];
  relatedArticles: string[];
  relatedHref: string;
}