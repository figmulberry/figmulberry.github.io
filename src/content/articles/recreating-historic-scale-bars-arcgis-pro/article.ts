import thumbnail from './thumbnail.png';
import body from './body.md?raw';

import { mosesThiongo } from
  '@/content/shared/authors';

import type {
  ArticleContent,
} from '@/content/engine/types';

export const recreatingHistoricScaleBarsArticle = {
  schemaVersion: 1,

  id:
    'article-recreating-historic-scale-bars-arcgis-pro',

  contentType: 'article',

  slug:
    'recreating-historic-scale-bars-arcgis-pro',

  aliases: [],

  title:
    'Recreating Historic Scale Bars in ArcGIS Pro',

  subtitle:
    'Recreating historical USGS-style scale bars through typography, hierarchy, and graphic refinement in ArcGIS Pro.',

  description:
    'A practical cartographic walkthrough for recreating historical scale bars in ArcGIS Pro using USGS references, typographic control, line-weight hierarchy, and conversion to graphics.',

  category: 'Cartography',

  status: 'published',

  publishedAt: '2026-08-05',

  updatedAt: undefined,

  authors: [mosesThiongo],

  tags: [
    'ArcGIS Pro',
    'Cartography',
    'Scale Bars',
    'Historical Maps',
    'Map Design',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,
    alt:
      'Historic scale-bar design recreated in ArcGIS Pro.',
    width: 1600,
    height: 900,
  },

  relationships: [
    {
      type: 'uses',
      targetId: 'tool-arcgis-pro',
      label: 'Primary cartographic software',
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
    'historic scale bars',
    'ArcGIS Pro scale bars',
    'USGS cartography',
    'vintage cartography',
    'scale bar design',
    'historical map recreation',
    'cartographic typography',
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
      id: 'introduction',
      title: 'Introduction',
      level: 2,
    },
    {
      id:
        'historical-reference-and-design-context',
      title:
        'Historical Reference and Design Context',
      level: 2,
    },
    {
      id: 'arcgis-pro-workflow-setup',
      title: 'ArcGIS Pro Workflow Setup',
      level: 2,
    },
    {
      id:
        'labeling-and-typographic-control',
      title:
        'Labeling and Typographic Control',
      level: 2,
    },
    {
      id:
        'symbol-design-and-visual-hierarchy',
      title:
        'Symbol Design and Visual Hierarchy',
      level: 2,
    },
    {
      id:
        'converting-scale-bars-to-graphics',
      title:
        'Converting Scale Bars to Graphics',
      level: 2,
    },
    {
      id:
        'external-references-and-validation',
      title:
        'External References and Validation',
      level: 2,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      level: 2,
    },
    {
      id: 'acknowledgements',
      title: 'Acknowledgements',
      level: 2,
    },
  ],

  requirements: [
    'ArcGIS Pro with a map already added to a layout',
    'A historical map reference for visual comparison',
    'Basic familiarity with layout elements and scale bars',
  ],

  learningObjectives: [
    'Analyse a historical scale-bar reference before recreating it.',
    'Configure divisions, subdivisions, labels, and bar styles in ArcGIS Pro.',
    'Use typography and line-weight hierarchy to reproduce a historical appearance.',
    'Convert a scale bar to graphics for precise element-level editing.',
  ],

  figureIds: [
    'historic-scale-bars-figure-01',
    'historic-scale-bars-figure-02',
    'historic-scale-bars-figure-03',
    'historic-scale-bars-figure-04',
  ],

  referenceIds: [
    'usgs-acadia-national-park-1971',
    'usgs-digital-cartographic-standard-1999',
    'nelson-vintage-scalebar-part-1-2020',
    'nelson-vintage-scalebar-part-2-2020',
  ],

  canonicalSource: undefined,
} satisfies ArticleContent;
