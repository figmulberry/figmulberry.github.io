import { z } from 'zod';

import {
  CONTENT_STATUSES,
  CONTENT_TYPES,
  RELATIONSHIP_TYPES,
} from './types';

const nonEmptyString = z.string().trim().min(1);

const slugString = nonEmptyString.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Slugs must use lowercase kebab-case.',
);

const isoDateString = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  'Expected a valid ISO-compatible date string.',
);

export const authorSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  affiliation: nonEmptyString.optional(),

  orcid: z.string().url().optional(),

  profileUrl: z.string().url().optional(),
});

export const contentImageSchema = z
  .object({
    src: nonEmptyString,
    alt: z.string(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    caption: nonEmptyString.optional(),
    credit: nonEmptyString.optional(),
    decorative: z.boolean().optional(),
  })
  .superRefine((image, context) => {
    if (!image.decorative && image.alt.trim().length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['alt'],
        message:
          'A non-decorative image requires meaningful alternative text.',
      });
    }
  });

export const contentRelationshipSchema = z.object({
  type: z.enum(RELATIONSHIP_TYPES),
  targetId: nonEmptyString,
  label: nonEmptyString.optional(),
  note: nonEmptyString.optional(),
  order: z.number().int().nonnegative().optional(),
});

const publicationMetadataSchema =
  z.object({
    licenseUrl:
      z.string().url().optional(),

    openAccessUrl:
      z.string().url().optional(),

    repositoryUrl:
      z.string().url().optional(),

    allowEditSuggestions:
      z.boolean().optional(),
  });

export const contentBaseSchema = z.object({
  schemaVersion: z.literal(1),
  id: nonEmptyString,
  contentType: z.enum(CONTENT_TYPES),
  slug: slugString,
  aliases: z.array(slugString).default([]),
  title: nonEmptyString,
  description: nonEmptyString,
  status: z.enum(CONTENT_STATUSES),
  publishedAt: isoDateString,
  updatedAt: isoDateString.optional(),
  authors: z.array(authorSchema).min(1),
  tags: z.array(nonEmptyString).default([]),
  topicIds: z.array(nonEmptyString).default([]),
  featured: z.boolean().default(false),
  thumbnail: contentImageSchema.optional(),
  banner: contentImageSchema.optional(),
  relationships: z
    .array(contentRelationshipSchema)
    .default([]),

  publication:
    publicationMetadataSchema.optional(),

  searchKeywords:
    z.array(nonEmptyString).default([]),
});

const tableOfContentsItemSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  level: z.union([
    z.literal(2),
    z.literal(3),
  ]),
});

export const articleSchema = contentBaseSchema
  .extend({
    contentType: z.literal('article'),
    subtitle: nonEmptyString.optional(),
    category: nonEmptyString,
    seriesId: nonEmptyString.optional(),
    seriesPart: z.number().int().positive().optional(),
    readingMinutes: z.number().int().positive(),
    body: nonEmptyString,
    tableOfContents: z
      .array(tableOfContentsItemSchema)
      .default([]),
    requirements: z.array(nonEmptyString).default([]),
    learningObjectives: z.array(nonEmptyString).default([]),
    figureIds: z.array(nonEmptyString).default([]),
    referenceIds: z.array(nonEmptyString).default([]),
    canonicalSource: z.string().url().optional(),
  })
  .superRefine((article, context) => {
    const hasSeriesId = article.seriesId !== undefined;
    const hasSeriesPart = article.seriesPart !== undefined;

    if (hasSeriesId !== hasSeriesPart) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['seriesId'],
        message:
          'seriesId and seriesPart must be supplied together.',
      });
    }
  });

export const blogSchema = contentBaseSchema.extend({
  contentType: z.literal('blog'),
  category: nonEmptyString,
  readingMinutes: z.number().int().positive(),
  body: nonEmptyString,
});

const projectOutcomeSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
});

export const projectSchema = contentBaseSchema.extend({
  contentType: z.literal('project'),
  category: nonEmptyString,
  role: nonEmptyString.optional(),
  client: nonEmptyString.optional(),
  dateStarted: isoDateString.optional(),
  dateCompleted: isoDateString.optional(),
  challenge: nonEmptyString,
  approach: nonEmptyString,
  outcomes: z.array(projectOutcomeSchema).default([]),
  gallery: z.array(contentImageSchema).default([]),
  downloads: z.array(nonEmptyString).default([]),
  repositoryUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
});

export const mediaSchema = contentBaseSchema.extend({
  contentType: z.literal('media'),
  mediaType: z.enum([
    'video',
    'presentation',
    'podcast',
    'gallery',
    'download',
  ]),
  duration: nonEmptyString.optional(),
  platform: nonEmptyString.optional(),
  externalUrl: z.string().url().optional(),
  embedUrl: z.string().url().optional(),
  transcript: nonEmptyString.optional(),
});

export const toolSchema = contentBaseSchema.extend({
  contentType: z.literal('tool'),
  shortName: nonEmptyString,
  officialUrl: z.string().url().optional(),
});

export const topicSchema = contentBaseSchema.extend({
  contentType: z.literal('topic'),
});

export const seriesSchema = contentBaseSchema.extend({
  contentType: z.literal('series'),
  partIds: z.array(nonEmptyString),
  complete: z.boolean(),
});

export const contentRecordSchema = z.union([
  articleSchema,
  blogSchema,
  projectSchema,
  mediaSchema,
  toolSchema,
  topicSchema,
  seriesSchema,
]);