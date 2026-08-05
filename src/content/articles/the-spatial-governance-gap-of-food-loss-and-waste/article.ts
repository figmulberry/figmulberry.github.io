import thumbnail from './thumbnail.jpg';
import body from './body.md?raw';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ArticleContent,
} from '@/content/engine/types';

export const foodLossGovernanceArticle = {
  schemaVersion: 1,

  id:
    'article-the-spatial-governance-gap-of-food-loss-and-waste',

  contentType: 'article',

  slug:
    'the-spatial-governance-gap-of-food-loss-and-waste',

  aliases: [],

  title:
    'The Spatial Governance Gap of Food Loss and Waste',

  subtitle:
    'Why aggregate statistics are not enough, and how geospatial analysis, machine learning, and AI can make food loss spatially visible.',

  description:
    'An examination of food loss and waste as a spatial governance problem, and how geospatial analysis, remote sensing, machine learning, and AI can support targeted intervention.',

  category:
    'Food Systems',

  status: 'published',

  publishedAt:
    '2026-03-30',

  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Food Loss and Waste',
    'Food Systems',
    'Geospatial Analysis',
    'Remote Sensing',
    'Machine Learning',
    'Artificial Intelligence',
    'Spatial Governance',
    'SDG 12.3',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,
    alt:
      'Decaying apples representing food loss and waste.',
    width: 4897,
    height: 2755,
  },

  relationships: [],

  publication: {
    licenseUrl:
      'https://creativecommons.org/licenses/by/4.0/',

    openAccessUrl:
      'https://en.wikipedia.org/wiki/Open_access',

    repositoryUrl:
      'https://github.com/figmulberry',

    allowEditSuggestions: true,
  },

  searchKeywords: [
    'food loss and waste',
    'spatial governance',
    'food systems',
    'SDG 12.3',
    'food waste mapping',
    'GIS food supply chains',
    'remote sensing food loss',
    'machine learning food waste',
    'Food Systems Loss Cascade Index',
  ],

  readingMinutes: 6,

  body,

  tableOfContents: [
    {
      id: 'quick-summary',
      title: 'Quick Summary',
      level: 2,
    },
    {
      id:
        'the-scale-of-a-crisis-we-are-not-yet-governing-well',
      title:
        'The Scale of a Crisis We Are Not Yet Governing Well',
      level: 2,
    },
    {
      id:
        'what-the-data-does-not-yet-tell-us-the-spatial-blindspot',
      title:
        'What the Data Does Not Yet Tell Us: The Spatial Blindspot',
      level: 2,
    },
    {
      id:
        'how-geospatial-analysis-machine-learning-and-ai-can-help',
      title:
        'How Geospatial Analysis, Machine Learning, and AI Can Help',
      level: 2,
    },
    {
      id:
        'call-to-action-making-flw-spatially-visible',
      title:
        'Call to Action: Making FLW Spatially Visible',
      level: 2,
    },
  ],

  requirements: [],

  learningObjectives: [
    'Explain why aggregate food-loss statistics create a spatial governance blindspot.',
    'Identify where geospatial analysis can strengthen food-loss monitoring and intervention.',
    'Describe how remote sensing, GIS, machine learning, and AI can support supply-chain analysis.',
    'Understand the proposed role of a Food Systems Loss Cascade Index.',
  ],

  figureIds: [
    'food-loss-governance-figure-01',
    'food-loss-governance-figure-02',
    'food-loss-governance-figure-03',
    'food-loss-governance-figure-04',
  ],

  referenceIds: [
    'fao-food-loss-waste-2024',
    'world-bank-what-a-waste-2026',
    'unep-zero-waste-day',
    'unep-food-waste-index-2024',
    'wri-global-food-waste',
  ],

  canonicalSource: undefined,
} satisfies ArticleContent;
