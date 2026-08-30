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

export type ProjectTool = {
  id?: string;

  name: string;

  url?: string;
};


export type ProjectCollaborator = {
  name: string;

  role?: string;

  url?: string;
};


export type ProjectCaseStudyProseSection = {
  id: string;

  type: 'prose';

  title: string;

  body: string;
};


export type ProjectCaseStudyImageStorySection = {
  id: string;

  type: 'image-story';

  title: string;

  body?: string;

  image: ContentImage;

  imagePosition?:
    | 'before'
    | 'after';
};


export type ProjectCaseStudyGallerySection = {
  id: string;

  type: 'gallery';

  title: string;

  introduction?: string;

  images:
    ContentImage[];
};


export type ProjectCaseStudyStep = {
  title: string;

  description: string;

  image?: ContentImage;
};


export type ProjectCaseStudyStepsSection = {
  id: string;

  type: 'steps';

  title: string;

  introduction?: string;

  items:
    ProjectCaseStudyStep[];
};


export type ProjectCaseStudyKeyPointsSection = {
  id: string;

  type: 'key-points';

  title: string;

  introduction?: string;

  items:
    string[];
};


export type ProjectCaseStudyOutcomeItem = {
  title: string;

  description: string;

  metric?: string;
};


export type ProjectCaseStudyOutcomesSection = {
  id: string;

  type: 'outcomes';

  title: string;

  introduction?: string;

  items:
    ProjectCaseStudyOutcomeItem[];
};


export type ProjectCaseStudyComparisonSection = {
  id: string;

  type: 'comparison';

  title: string;

  body?: string;

  before:
    ContentImage;

  after:
    ContentImage;
};


export type ProjectCaseStudyEmbedProvider =
  | 'arcgis-storymaps'
  | 'arcgis'
  | 'youtube'
  | 'vimeo'
  | 'other';


export type ProjectCaseStudyEmbedSection = {
  id: string;

  type: 'embed';

  title: string;

  description?: string;

  provider:
    ProjectCaseStudyEmbedProvider;

  url: string;

  embedUrl?: string;

  aspectRatio?:
    | '16:9'
    | '4:3'
    | '1:1';
};


export type ProjectCaseStudyQuoteSection = {
  id: string;

  type: 'quote';

  quote: string;

  attribution?: string;

  role?: string;
};


export type ProjectCaseStudyCalloutSection = {
  id: string;

  type: 'callout';

  title?: string;

  body: string;

  tone?:
    | 'note'
    | 'insight'
    | 'warning'
    | 'success';
};


export type ProjectCaseStudyArticleParagraphBlock = {
  type: 'paragraph';
  body: string;
};

export type ProjectCaseStudyArticleFigureBlock = {
  type: 'figure';
  image: ContentImage;
  width?: 'normal' | 'wide' | 'full';
  ratio?: string;
};

export type ProjectCaseStudyArticlePullBlock = {
  type: 'pull';
  body: string;
};

export type ProjectCaseStudyArticleBeforeAfterBlock = {
  type: 'before-after';
  before: ContentImage;
  after: ContentImage;
};

export type ProjectCaseStudyArticleWorkflowBlock = {
  type: 'workflow';
  items: ProjectCaseStudyStep[];
};

export type ProjectCaseStudyArticleBlock =
  | ProjectCaseStudyArticleParagraphBlock
  | ProjectCaseStudyArticleFigureBlock
  | ProjectCaseStudyArticlePullBlock
  | ProjectCaseStudyArticleBeforeAfterBlock
  | ProjectCaseStudyArticleWorkflowBlock;

export type ProjectCaseStudyArticleSection = {
  id: string;
  type: 'article';
  title: string;
  blocks: ProjectCaseStudyArticleBlock[];
};


export type ProjectCaseStudySection =
  | ProjectCaseStudyProseSection
  | ProjectCaseStudyImageStorySection
  | ProjectCaseStudyGallerySection
  | ProjectCaseStudyStepsSection
  | ProjectCaseStudyKeyPointsSection
  | ProjectCaseStudyOutcomesSection
  | ProjectCaseStudyComparisonSection
  | ProjectCaseStudyEmbedSection
  | ProjectCaseStudyQuoteSection
  | ProjectCaseStudyCalloutSection
  | ProjectCaseStudyArticleSection;


export type ProjectCaseStudy = {
  introduction?: string;

  readingMinutes?: number;

  sections:
    ProjectCaseStudySection[];
};

export type ProjectOutcome = {
  title: string;
  description: string;
};

export type ProjectMapScope =
  | 'global'
  | 'country-wide'
  | 'regional'
  | 'place-wide'
  | 'site-specific'
  | 'multi-location';


export type ProjectMapPlacement = {
  locationId: string;

  scope:
    ProjectMapScope;
};

export type ProjectLocation = {
  id: string;

  label: string;

  latitude: number;

  longitude: number;
};


export type ProjectIntroMode =
  | 'image-left'
  | 'image-right'
  | 'overlay'
  | 'wide';


export type ProjectContent = ContentBase & {
  contentType: 'project';
  category: string;
  role?: string;
  client?: string;
  dateStarted?: string;
  dateCompleted?: string;

  projectType?: string;

  introMode?:
    ProjectIntroMode;

  collaborators?:
    ProjectCollaborator[];

  tools?:
    ProjectTool[];

  hero?:
    ContentImage;

  caseStudy?:
    ProjectCaseStudy;

  homepageFeatured?: boolean;
  homepageFeaturedOrder?: number;

  portfolioFeatured?: boolean;
  portfolioOrder?: number;

  locations: ProjectLocation[];

  mapPlacements?:
    ProjectMapPlacement[];

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


