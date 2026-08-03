import body from './body.md?raw';
import bannerUrl from './banner.png';

import { mosesThiongo } from '@/content/shared/authors';

import type { ArticleContent } from '@/content/engine/types';

export const topoGridsPart1Article = {
  schemaVersion: 1,

  id: 'article-topo-grids-part-1',
  contentType: 'article',

  slug: 'topo-grids-part-1',
  aliases: [],

  title:
    'Reimagining Topographic Grids & Graticules in ArcGIS Pro',
  subtitle:
    'Part I: Crafting Graticules & Corner Coordinates',

  description:
    'Learn how to recreate historical corner coordinates and graticules from classic topographic maps using ArcGIS Pro.',

  status: 'draft',

  publishedAt: '2025-08-07',
  updatedAt: undefined,

  authors: [mosesThiongo],

  category: 'Cartography',

  tags: [
    'ArcGIS Pro',
    'Cartography',
    'Graticules',
    'Coordinate Grids',
    'Historical Topographic Maps',
  ],

  topicIds: [],

  featured: true,

  difficulty: 'Intermediate',

  readingMinutes: 7,

  banner: {
    src: bannerUrl,
    alt:
      'Historical topographic map detail showing coordinate and grid styling.',
  },

  thumbnail: {
    src: bannerUrl,
    alt:
      'Historical topographic map detail representing the Topo Grids article.',
  },

  seriesId:
    'series-historic-topographic-map-recreation',
  seriesPart: 1,

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
      id: 'before-you-begin',
      title: 'Before You Begin',
      level: 2,
    },
    {
      id: 'what-you-will-build',
      title: 'What You Will Build',
      level: 2,
    },
    {
      id: 'introduction',
      title: 'Introduction',
      level: 2,
    },
    {
      id: 'why-coordinates-grids-and-graticules-matter',
      title:
        'Why Coordinates, Grids, and Graticules Matter',
      level: 2,
    },
    {
      id: 'the-legacy-simplicity-of-old-topographic-maps',
      title:
        'The Legacy Simplicity of Old Topographic Maps',
      level: 2,
    },
    {
      id: 'measured-grid-label-styles',
      title: 'Measured-grid label styles',
      level: 3,
    },
    {
      id: 'corner-coordinates',
      title: 'Corner Coordinates',
      level: 2,
    },
    {
      id: 'the-arcgis-pro-default',
      title: 'The ArcGIS Pro default',
      level: 3,
    },
    {
      id: 'splitting-the-x-and-y-coordinates',
      title: 'Splitting the X and Y Coordinates',
      level: 2,
    },
    {
      id: 'before-editing',
      title: 'Before editing',
      level: 3,
    },
    {
      id: 'separate-x-coordinate',
      title: 'Separate X coordinate',
      level: 3,
    },
    {
      id: 'separate-y-coordinate',
      title: 'Separate Y coordinate',
      level: 3,
    },
    {
      id: 'removing-directional-clutter',
      title: 'Removing Directional Clutter',
      level: 2,
    },
    {
      id: 'minute-padding',
      title: 'Minute Padding',
      level: 2,
    },
    {
      id: 'choosing-ddm-instead-of-dms',
      title: 'Choosing DDM Instead of DMS',
      level: 2,
    },
    {
      id: 'mind-your-placement',
      title: 'Mind Your Placement',
      level: 2,
    },
    {
      id: 'graticules-filling-the-gaps-between-degrees',
      title:
        'Graticules: Filling the Gaps Between Degrees',
      level: 2,
    },
    {
      id: 'building-the-minute-marker-tag',
      title: 'Building the Minute-Marker Tag',
      level: 2,
    },
    {
      id: 'common-mistakes',
      title: 'Common Mistakes',
      level: 2,
    },
    {
      id: 'practical-cartographic-notes',
      title: 'Practical Cartographic Notes',
      level: 2,
    },
    {
      id: 'key-takeaways',
      title: 'Key Takeaways',
      level: 2,
    },
    {
      id: 'continue-the-series',
      title: 'Continue the Series',
      level: 2,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      level: 2,
    },
  ],

  requirements: [
    'ArcGIS Pro',
    'An existing map and layout',
    'A map frame already added to the layout',
    'An appropriate coordinate system',
    'Basic familiarity with Graphics and Text',
    'Basic familiarity with Dynamic Text',
  ],

  learningObjectives: [
    'Recognize the role of grids and graticules in historical topographic maps.',
    'Add corner coordinates to an ArcGIS Pro layout.',
    'Separate combined X and Y coordinate labels.',
    'Remove directional letters and negative signs where appropriate.',
    'Switch coordinate formatting from DMS to DDM.',
    'Pad single-digit minutes with a leading zero.',
    'Position X and Y coordinates on the correct map-frame edges.',
    'Add intermediate minute markers between whole degrees.',
  ],

  figureIds: [
    'topo-grids-part-1-figure-01',
    'topo-grids-part-1-figure-02',
    'topo-grids-part-1-figure-03',
    'topo-grids-part-1-figure-04',
    'topo-grids-part-1-figure-05',
    'topo-grids-part-1-figure-06',
    'topo-grids-part-1-figure-07',
    'topo-grids-part-1-figure-08',
    'topo-grids-part-1-figure-09',
    'topo-grids-part-1-figure-10',
  ],

  referenceIds: [],

  relationships: [
    {
      type: 'uses',
      targetId: 'tool-arcgis-pro',
      label: 'Primary GIS software',
    },
  ],

  searchKeywords: [
    'ArcGIS Pro graticules',
    'ArcGIS Pro coordinate grids',
    'corner coordinates',
    'dynamic text',
    'historical topographic maps',
    'DDM coordinates',
    'minute markers',
    'map layout',
  ],

  canonicalSource:
    'https://www.linkedin.com/pulse/reimagining-topo-grids-graticules-arcgis-pro-musa-%CA%88hiong-o-tkm--hwqae/',
} satisfies ArticleContent;