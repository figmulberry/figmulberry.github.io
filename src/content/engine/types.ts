export const CONTENT_TYPES = [
  'article',
  'blog',
  'project',
  'media',
  'tool',
  'topic',
  'series',
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = [
  'draft',
  'scheduled',
  'published',
  'archived',
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const RELATIONSHIP_TYPES = [
  'relates-to',
  'extends',
  'requires',
  'precedes',
  'follows',
  'references',
  'uses',
  'demonstrates',
  'implements',
  'produces',
  'documents',
  'supports',
] as const;

export type RelationshipType =
  (typeof RELATIONSHIP_TYPES)[number];

export type Author = {
  id: string;
  name: string;
  affiliation?: string;

  orcid?: string;

  profileUrl?: string;
};

export type ContentImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  credit?: string;
  decorative?: boolean;
};

export type ContentRelationship = {
  type: RelationshipType;
  targetId: string;
  label?: string;
  note?: string;
  order?: number;
};

export type ContentBase = {
  schemaVersion: 1;
  id: string;
  contentType: ContentType;
  slug: string;
  aliases: string[];
  title: string;
  description: string;
  status: ContentStatus;
  publishedAt: string;
  updatedAt?: string;
  authors: Author[];
  tags: string[];
  topicIds: string[];
  featured: boolean;
  thumbnail?: ContentImage;
  banner?: ContentImage;
  relationships: ContentRelationship[];
  publication?: PublicationMetadata;
  searchKeywords: string[];
};

export type PublicationMetadata = {
  licenseUrl?: string;

  openAccessUrl?: string;

  repositoryUrl?: string;

  allowEditSuggestions?: boolean;
};

export type TableOfContentsItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type ArticleContent = ContentBase & {
  contentType: 'article';
  subtitle?: string;
  category: string;
  seriesId?: string;
  seriesPart?: number;
  readingMinutes: number;
  body: string;
  tableOfContents: TableOfContentsItem[];
  requirements: string[];
  learningObjectives: string[];
  figureIds: string[];
  referenceIds: string[];
  canonicalSource?: string;
};

export type BlogContent = ContentBase & {
  contentType: 'blog';
  category: string;
  readingMinutes: number;
  body: string;
};

export type ProjectOutcome = {
  title: string;
  description: string;
};

export type ProjectContent = ContentBase & {
  contentType: 'project';
  category: string;
  role?: string;
  client?: string;
  dateStarted?: string;
  dateCompleted?: string;
  challenge: string;
  approach: string;
  outcomes: ProjectOutcome[];
  gallery: ContentImage[];
  downloads: string[];
  repositoryUrl?: string;
  liveUrl?: string;
};

export type MediaType =
  | 'video'
  | 'tutorial'
  | 'presentation'
  | 'poetry'
  | 'lightning-talk'
  | 'keynote'
  | 'interview'
  | 'discussion'
  | 'demo'
  | 'podcast'
  | 'gallery'
  | 'download';

export type MediaContent = ContentBase & {
  contentType: 'media';
  mediaType: MediaType;
    cardDescription?: string;
duration?: string;
  platform?: string;
  externalUrl?: string;
  embedUrl?: string;
  transcript?: string;
};

export type ToolContent = ContentBase & {
  contentType: 'tool';
  shortName: string;
  officialUrl?: string;
};

export type TopicContent = ContentBase & {
  contentType: 'topic';
};

export type SeriesContent = ContentBase & {
  contentType: 'series';
  partIds: string[];
  complete: boolean;
};

export type ContentRecord =
  | ArticleContent
  | BlogContent
  | ProjectContent
  | MediaContent
  | ToolContent
  | TopicContent
  | SeriesContent;