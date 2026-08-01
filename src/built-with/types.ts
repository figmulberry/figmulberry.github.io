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

export interface Tool {
  id: string;

  name: string;

  tagline: string;

  category: ToolCategory;

  featured: boolean;

  level: ToolLevel;

  since: number;

  accentColor: string;

  icon: string;

  summary: string;

  whereUsed: string[];

  projects: string[];

  recentlyUsed: string[];

  experience: string;

  articles: string[];

  portfolio: string[];

  relatedHref: string;
}