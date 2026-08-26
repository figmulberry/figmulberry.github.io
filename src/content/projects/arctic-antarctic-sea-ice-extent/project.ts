import thumbnail from './thumbnail.png';
import mapImage from './assets/map.png';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const arcticAntarcticSeaIceProject = {
  schemaVersion: 1,

  id:
    'project-arctic-antarctic-sea-ice-extent',

  contentType: 'project',

  slug:
    'arctic-antarctic-sea-ice-extent',

  aliases: [],

  title:
    'Understanding Climate: Arctic & Antarctic Sea Ice Extent',

  description:
    'A climate-focused cartographic visualization exploring Arctic and Antarctic sea ice extent through a deliberately tested polar visual language.',

  status: 'published',

  publishedAt:
    '2026-08-25',

  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Climate',
    'Sea Ice',
    'Arctic',
    'Antarctic',
    'Cartography',
    'Data Visualization',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,

    alt:
      'Cartographic visualization of Arctic and Antarctic sea ice extent.',

    width: 7140,

    height: 4620,
  },

  banner: undefined,

  relationships: [],

  publication: undefined,

  searchKeywords: [
    'Arctic sea ice',
    'Antarctic sea ice',
    'sea ice extent',
    'climate cartography',
    'polar maps',
    'climate visualization',
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

  portfolioFeatured: false,

  portfolioOrder: 2,

  locations: [
    {
      id:
        'arctic',

      label:
        'Arctic',

      latitude:
        82,

      longitude:
        0,
    },

    {
      id:
        'antarctic',

      label:
        'Antarctic',

      latitude:
        -82,

      longitude:
        0,
    },
  ],

  mapPlacements: [
    {
      locationId:
        'zone:arctic',

      scope:
        'regional',
    },

    {
      locationId:
        'zone:antarctic',

      scope:
        'regional',
    },
  ],

  challenge:
    'Communicate a topical climate-change subject across both polar regions while developing a visual treatment capable of supporting the Arctic and Antarctic sea-ice story.',

  approach:
    'The project involved extensive experimentation with color swatches and polar cartographic styling. Particular attention was given to a light blue visual treatment and to maintaining a coherent appearance across the Arctic and Antarctic views.',

  outcomes: [],

  gallery: [
    {
      src: mapImage,

      alt:
        'Full Arctic and Antarctic sea ice extent cartographic composition.',

      width: 7140,

      height: 4620,

      caption:
        'Understanding Climate: Arctic & Antarctic Sea Ice Extent.',
    },
  ],

  downloads: [],

  repositoryUrl: undefined,

  liveUrl: undefined,
} satisfies ProjectContent;
