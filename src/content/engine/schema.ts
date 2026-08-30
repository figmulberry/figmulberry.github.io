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

const projectToolSchema =
  z.object({
    id:
      nonEmptyString.optional(),

    name:
      nonEmptyString,

    url:
      z.string().url().optional(),
  });


const projectCollaboratorSchema =
  z.object({
    name:
      nonEmptyString,

    role:
      nonEmptyString.optional(),

    url:
      z.string().url().optional(),
  });


const projectCaseStudyProseSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal('prose'),

    title:
      nonEmptyString,

    body:
      nonEmptyString,
  });


const projectCaseStudyImageStorySectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'image-story',
      ),

    title:
      nonEmptyString,

    body:
      nonEmptyString.optional(),

    image:
      contentImageSchema,

    imagePosition:
      z
        .enum([
          'before',
          'after',
        ])
        .optional(),
  });


const projectCaseStudyGallerySectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'gallery',
      ),

    title:
      nonEmptyString,

    introduction:
      nonEmptyString.optional(),

    images:
      z
        .array(
          contentImageSchema,
        )
        .min(1),
  });


const projectCaseStudyStepSchema =
  z.object({
    title:
      nonEmptyString,

    description:
      nonEmptyString,

    image:
      contentImageSchema.optional(),
  });


const projectCaseStudyStepsSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'steps',
      ),

    title:
      nonEmptyString,

    introduction:
      nonEmptyString.optional(),

    items:
      z
        .array(
          projectCaseStudyStepSchema,
        )
        .min(1),
  });


const projectCaseStudyKeyPointsSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'key-points',
      ),

    title:
      nonEmptyString,

    introduction:
      nonEmptyString.optional(),

    items:
      z
        .array(
          nonEmptyString,
        )
        .min(1),
  });


const projectCaseStudyOutcomeItemSchema =
  z.object({
    title:
      nonEmptyString,

    description:
      nonEmptyString,

    metric:
      nonEmptyString.optional(),
  });


const projectCaseStudyOutcomesSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'outcomes',
      ),

    title:
      nonEmptyString,

    introduction:
      nonEmptyString.optional(),

    items:
      z
        .array(
          projectCaseStudyOutcomeItemSchema,
        )
        .min(1),
  });


const projectCaseStudyComparisonSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'comparison',
      ),

    title:
      nonEmptyString,

    body:
      nonEmptyString.optional(),

    before:
      contentImageSchema,

    after:
      contentImageSchema,
  });


const projectCaseStudyEmbedSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'embed',
      ),

    title:
      nonEmptyString,

    description:
      nonEmptyString.optional(),

    provider:
      z.enum([
        'arcgis-storymaps',
        'arcgis',
        'youtube',
        'vimeo',
        'other',
      ]),

    url:
      z.string().url(),

    embedUrl:
      z.string().url().optional(),

    aspectRatio:
      z
        .enum([
          '16:9',
          '4:3',
          '1:1',
        ])
        .optional(),
  });


const projectCaseStudyQuoteSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'quote',
      ),

    quote:
      nonEmptyString,

    attribution:
      nonEmptyString.optional(),

    role:
      nonEmptyString.optional(),
  });


const projectCaseStudyCalloutSectionSchema =
  z.object({
    id:
      slugString,

    type:
      z.literal(
        'callout',
      ),

    title:
      nonEmptyString.optional(),

    body:
      nonEmptyString,

    tone:
      z
        .enum([
          'note',
          'insight',
          'warning',
          'success',
        ])
        .optional(),
  });


const projectCaseStudyArticleParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  body: nonEmptyString,
});

const projectCaseStudyArticleFigureBlockSchema = z.object({
  type: z.literal('figure'),
  image: contentImageSchema,
  width: z.enum(['normal', 'wide', 'full']).optional(),
  ratio: nonEmptyString.optional(),
});

const projectCaseStudyArticlePullBlockSchema = z.object({
  type: z.literal('pull'),
  body: nonEmptyString,
});

const projectCaseStudyArticleBeforeAfterBlockSchema = z.object({
  type: z.literal('before-after'),
  before: contentImageSchema,
  after: contentImageSchema,
});

const projectCaseStudyArticleWorkflowBlockSchema = z.object({
  type: z.literal('workflow'),
  items: z.array(projectCaseStudyStepSchema),
});

const projectCaseStudyArticleBlockSchema = z.discriminatedUnion('type', [
  projectCaseStudyArticleParagraphBlockSchema,
  projectCaseStudyArticleFigureBlockSchema,
  projectCaseStudyArticlePullBlockSchema,
  projectCaseStudyArticleBeforeAfterBlockSchema,
  projectCaseStudyArticleWorkflowBlockSchema,
]);

const projectCaseStudyArticleSectionSchema = z.object({
  id: slugString,
  type: z.literal('article'),
  title: nonEmptyString,
  blocks: z.array(projectCaseStudyArticleBlockSchema),
});


const projectCaseStudySectionSchema =
  z.discriminatedUnion(
    'type',
    [
      projectCaseStudyProseSectionSchema,
      projectCaseStudyImageStorySectionSchema,
      projectCaseStudyGallerySectionSchema,
      projectCaseStudyStepsSectionSchema,
      projectCaseStudyKeyPointsSectionSchema,
      projectCaseStudyOutcomesSectionSchema,
      projectCaseStudyComparisonSectionSchema,
      projectCaseStudyEmbedSectionSchema,
      projectCaseStudyQuoteSectionSchema,
      projectCaseStudyCalloutSectionSchema,
      projectCaseStudyArticleSectionSchema,
    ],
  );


const projectCaseStudySchema =
  z
    .object({
      introduction:
        nonEmptyString.optional(),

      readingMinutes:
        z
          .number()
          .int()
          .positive()
          .optional(),

      sections:
        z.array(
          projectCaseStudySectionSchema,
        ),
    })
    .superRefine(
      (
        caseStudy,
        context,
      ) => {
        const seenIds =
          new Set<
            string
          >();


        caseStudy.sections.forEach(
          (
            section,
            index,
          ) => {
            if (
              seenIds.has(
                section.id,
              )
            ) {
              context.addIssue({
                code:
                  z.ZodIssueCode.custom,

                path: [
                  'sections',
                  index,
                  'id',
                ],

                message:
                  `Duplicate case-study section id "${section.id}".`,
              });
            }


            seenIds.add(
              section.id,
            );
          },
        );
      },
    );

const projectOutcomeSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
});

const projectMapScopeSchema =
  z.enum([
    'global',
    'country-wide',
    'regional',
    'place-wide',
    'site-specific',
    'multi-location',
  ]);


const projectMapPlacementSchema =
  z.object({
    locationId:
      nonEmptyString,

    scope:
      projectMapScopeSchema,
  });

const projectLocationSchema = z.object({
  id: nonEmptyString,

  label: nonEmptyString,

  latitude: z
    .number()
    .min(-90)
    .max(90),

  longitude: z
    .number()
    .min(-180)
    .max(180),
});

const projectIntroModeSchema =
  z.enum([
    'image-left',
    'image-right',
    'overlay',
    'wide',
  ]);


export const projectSchema = contentBaseSchema.extend({
  contentType: z.literal('project'),
  category: nonEmptyString,
  role: nonEmptyString.optional(),
  client: nonEmptyString.optional(),
  dateStarted: isoDateString.optional(),
  dateCompleted: isoDateString.optional(),

  projectType:
    nonEmptyString.optional(),

  introMode:
    projectIntroModeSchema
      .default(
        'image-left',
      ),

  collaborators:
    z
      .array(
        projectCollaboratorSchema,
      )
      .default([]),

  tools:
    z
      .array(
        projectToolSchema,
      )
      .default([]),

  hero:
    contentImageSchema.optional(),

  caseStudy:
    projectCaseStudySchema.optional(),

  homepageFeatured: z
    .boolean()
    .optional(),

  homepageFeaturedOrder: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  portfolioFeatured: z
    .boolean()
    .optional(),

  portfolioOrder: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  locations: z
    .array(
      projectLocationSchema,
    )
    .default([]),

  mapPlacements: z
    .array(
      projectMapPlacementSchema,
    )
    .default([]),

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
    'tutorial',
    'presentation',
    'poetry',
    'lightning-talk',
    'keynote',
    'interview',
    'discussion',
    'demo',
    'podcast',
    'gallery',
    'download',
  ]),
    cardDescription: nonEmptyString.optional(),
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

