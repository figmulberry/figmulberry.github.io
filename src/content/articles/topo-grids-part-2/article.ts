import thumbnail from './thumbnail.png';
import body from './body.md?raw';

import { mosesThiongo } from '@/content/shared/authors';

import type { ArticleContent } from '@/content/engine/types';

export const topoGridsPart2Article = {
  schemaVersion: 1,

  id: 'article-topo-grids-part-2',
  contentType: 'article',

  slug: 'topo-grids-part-2',
  aliases: [],

  title:
    'Crafting Measured Grids',

  subtitle:
    'Part II: Measured-grid labels, styling, and tick-mark alignment in ArcGIS Pro',

  description:
    'Learn how to style measured-grid labels and position tick marks to recreate the deliberate look of historical topographic maps in ArcGIS Pro.',

  status: 'published',

  publishedAt: '2025-08-15',
  updatedAt: undefined,

  authors: [mosesThiongo],

  category: 'Cartography',

  tags: [
    'ArcGIS Pro',
    'Cartography',
    'Measured Grids',
    'Grid Labels',
    'Historical Topographic Maps',
  ],

  topicIds: [],

  featured: true,

  readingMinutes: 5,

  thumbnail: {
    src: thumbnail,
    alt:
      'Historic topographic map showing contrasting contour, grid, wetland, and water styling.',
    width: 4019,
    height: 2261,
  },

  seriesId:
    'series-historic-topographic-map-recreation',

  seriesPart: 2,

  body,

  tableOfContents: [
    {
      id: 'quick-summary',
      title: 'Quick Summary',
      level: 2,
    },
    {
      id: 'what-you-will-learn',
      title: 'What You Will Learn',
      level: 2,
    },
    {
      id: 'introduction',
      title: 'Introduction',
      level: 2,
    },
    {
      id: 'complex-grid-labels',
      title: 'Complex Grid Labels',
      level: 2,
    },
    {
      id: 'customising-the-grid-labels',
      title: 'Customising the Grid Labels',
      level: 2,
    },
    {
      id: 'tick-marks-big-impact',
      title: "Tick Marks' Big Impact",
      level: 2,
    },
    {
      id: 'final-thoughts',
      title: 'Final Thoughts',
      level: 2,
    },
  ],

  requirements: [
    'ArcGIS Pro',
    'An existing map and layout',
    'A measured grid already added to the map frame',
    'Basic familiarity with Dynamic Text',
    'Basic familiarity with grid properties',
  ],

  learningObjectives: [
    'Build complex measured-grid labels using multi-value formatting.',
    'Style key digits and trailing zeros separately.',
    'Use colour differentiation without making the labels too heavy.',
    'Adjust tick length and offset against the map frame.',
  ],

  figureIds: [
    'topo-grids-part-2-figure-01',
    'topo-grids-part-2-figure-02',
    'topo-grids-part-2-figure-03',
    'topo-grids-part-2-figure-04',
  ],

  referenceIds: [],

  relationships: [
    {
      type: 'uses',
      targetId: 'tool-arcgis-pro',
      label: 'Primary GIS software',
    },
    {
      type: 'follows',
      targetId: 'article-topo-grids-part-1',
      label: 'Previous article in the series',
    },
  ],

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
    'ArcGIS Pro measured grids',
    'measured-grid labels',
    'dynamic text grid labels',
    'historical topographic maps',
    'grid label formatting',
    'tick-mark offset',
    'map frame ticks',
    'cartographic grid styling',
  ],
} satisfies ArticleContent;