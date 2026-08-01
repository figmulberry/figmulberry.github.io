export type ToolCategory =
  | 'GIS'
  | 'Programming'
  | 'Analytics'
  | 'AI'
  | 'Development'
  | 'Electronics';

export interface Tool {
  id: string;

  name: string;

  tagline: string;

  category: ToolCategory;

  accentColor: string;

  icon: string;

  overview: string;

  whereUsed: string[];

  featuredWork: string[];

  recentlyUsed: string[];

  experience: string;

  relatedArticles: string[];

  relatedProjects: string[];

  relatedHref: string;
}