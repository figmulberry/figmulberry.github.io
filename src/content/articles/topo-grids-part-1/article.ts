import body from './body.md?raw';
import thumbnail from './thumbnail.jpg';

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

  status: 'published',

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

  readingMinutes: 7,


  thumbnail: {
    src: thumbnail,
    alt:
      'Historical topographic map showing measured grid lines, coordinates, contours, and terrain detail.',
    width: 1800,
    height: 1013,
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
      id: 'introduction',
      title: 'Introduction',
      level: 2,
    },
    {
      id: 'why-coordinates-grids-and-graticules-matter',
      title:
        'Why Coordinates, Grids and Graticules Matter',
      level: 2,
    },
    {
      id: 'the-legacy-simplicity-of-old-topo-maps',
      title:
        'The Legacy Simplicity of Old Topo Maps',
      level: 2,
    },
    {
      id: 'corner-coordinates',
      title: 'Corner Coordinates',
      level: 2,
    },
    {
      id: 'splitting-x-and-y-coordinates',
      title: 'Splitting X and Y Coordinates',
      level: 2,
    },
    {
      id: 'fixing-directional-clutter-and-padding-minutes',
      title:
        'Fixing Directional Clutter and Padding Minutes',
      level: 2,
    },
    {
      id: 'minute-padding-a-small-detail-that-matters',
      title:
        'Minute Padding (A Small Detail That Matters)',
      level: 2,
    },
    {
      id: 'units-tag-the-ddm-and-dms-switcheroo',
      title:
        'Units Tag (The DDM and DMS Switcheroo)',
      level: 2,
    },
    {
      id: 'mind-your-placement-x-is-not-ys-cousin',
      title:
        "Mind Your Placement (X is Not Y's Cousin)",
      level: 2,
    },
    {
      id: 'graticules-filling-the-gaps-between-degrees',
      title:
        'Graticules (Filling the Gaps Between Degrees)',
      level: 2,
    },
    {
      id: 'wrapping-up-part-i',
      title: 'Wrapping Up Part I',
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
    'ArcGIS Pro graticules',
    'ArcGIS Pro coordinate grids',
    'corner coordinates',
    'dynamic text',
    'historical topographic maps',
    'DDM coordinates',
    'minute markers',
    'map layout',
  ],

} satisfies ArticleContent;