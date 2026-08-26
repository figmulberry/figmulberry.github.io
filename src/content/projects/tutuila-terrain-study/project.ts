import thumbnail from './thumbnail.png';
import mapImage from './assets/map.png';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const tutuilaTerrainStudyProject = {
  schemaVersion: 1,

  id:
    'project-tutuila-terrain-study',

  contentType: 'project',

  slug:
    'tutuila-terrain-study',

  aliases: [],

  title:
    'Tutuila Terrain Study',

  description:
    'A personal cartographic study of Tutuila, American Samoa, created to explore terrain representation and visual refinement using ArcGIS Pro and Adobe Illustrator.',

  status: 'published',

  publishedAt:
    '2026-08-25',

  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'ArcGIS Pro',
    'Adobe Illustrator',
    'Terrain',
    'Cartography',
    'American Samoa',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,
    alt:
      'Terrain map of Tutuila in American Samoa.',
    width: 1200,
    height: 700,
  },

  banner: undefined,

  relationships: [
    {
      type: 'uses',
      targetId: 'tool-arcgis-pro',
      label: 'Primary GIS software',
    },
  ],

  publication: undefined,

  searchKeywords: [
    'Tutuila terrain',
    'American Samoa map',
    'terrain cartography',
    'ArcGIS Pro terrain',
    'Adobe Illustrator cartography',
  ],

  category:
    'Geospatial',

  role: undefined,

  client: undefined,

  dateStarted: undefined,

  dateCompleted: undefined,

  homepageFeatured: false,

  homepageFeaturedOrder:
    undefined,

  portfolioFeatured: true,

  portfolioOrder: 1,

  locations: [
    {
      id:
        'tutuila-american-samoa',

      label:
        'Tutuila, American Samoa',

      latitude:
        -14.2958,

      longitude:
        -170.7009,
    },
  ],

  mapPlacements: [
    {
      locationId:
        'place:tutuila',

      scope:
        'place-wide',
    },
  ],

  challenge:
    'Explore how the terrain of Tutuila could be represented and refined cartographically while developing a stronger practical understanding of terrain workflows.',

  approach:
    'The project used ArcGIS Pro to work with the island terrain and Adobe Illustrator for further visual refinement. The process involved repeated experimentation with the terrain treatment and cartographic appearance.',

  outcomes: [],

  gallery: [
    {
      src: mapImage,

      alt:
        'Full terrain map of Tutuila in American Samoa.',

      width: 1200,

      height: 700,

      caption:
        'Tutuila terrain study.',
    },
  ],

  downloads: [],

  repositoryUrl: undefined,

  liveUrl: undefined,
} satisfies ProjectContent;
