import thumbnail from './thumbnail.png';
import mapImage from './assets/map.png';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const orphanedOilGasWellsProject = {
  schemaVersion: 1,

  id:
    'project-orphaned-oil-gas-wells-density',

  contentType: 'project',

  slug:
    'orphaned-oil-gas-wells-density',

  aliases: [],

  title:
    'Orphaned Oil & Gas Wells Density in the United States',

  description:
    'A thematic map examining the density of orphaned oil and gas wells per 1,000 square kilometres across the United States.',

  status: 'published',

  publishedAt:
    '2026-08-25',

  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Oil and Gas',
    'Orphaned Wells',
    'United States',
    'Thematic Mapping',
    'Environmental Mapping',
    'Cartography',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,

    alt:
      'Map showing orphaned oil and gas well density across the United States.',

    width: 1200,

    height: 743,
  },

  banner: undefined,

  relationships: [],

  publication: undefined,

  searchKeywords: [
    'orphaned oil wells',
    'abandoned gas wells',
    'United States wells',
    'well density map',
    'environmental cartography',
    'thematic mapping',
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

  portfolioOrder: 3,

  locations: [
    {
      id:
        'united-states-national',

      label:
        'United States',

      latitude:
        39.8283,

      longitude:
        -98.5795,
    },
  ],

  mapPlacements: [
    {
      locationId:
        'country:usa',

      scope:
        'country-wide',
    },
  ],

  challenge:
    'Communicate the geographic concentration of orphaned oil and gas wells across the United States in a normalized form that supports comparison between areas.',

  approach:
    'The map represents orphaned well density per 1,000 square kilometres across the United States. The resulting pattern makes differences in well concentration visible, with Ohio appearing particularly prominent in the mapped distribution.',

  outcomes: [],

  gallery: [
    {
      src: mapImage,

      alt:
        'Full map of orphaned oil and gas well density per 1,000 square kilometres in the United States.',

      width: 1200,

      height: 743,

      caption:
        'Density of orphaned oil and gas wells per 1,000 square kilometres.',
    },
  ],

  downloads: [],

  repositoryUrl: undefined,

  liveUrl: undefined,
} satisfies ProjectContent;
