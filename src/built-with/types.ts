import type { CSSProperties, ComponentType } from 'react';

export type ToolCategory =
  | 'GIS'
  | 'Programming'
  | 'Analytics'
  | 'AI'
  | 'Development'
  | 'Electronics';

export type ToolLevel =
  | 'Daily'
  | 'Frequent'
  | 'Project-based';

export type ToolIcon = ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  category: ToolCategory;
  featured: boolean;
  level: ToolLevel;
  since: number;
  accentColor: string;
  icon: ToolIcon;
  summary: string;
  whereUsed: string[];
  projects: string[];
  recentlyUsed: string[];
  experience: string;
  articles: string[];
  portfolio: string[];
  relatedHref: string;
}