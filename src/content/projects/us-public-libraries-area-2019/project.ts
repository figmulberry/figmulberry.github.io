import thumbnail from './thumbnail.png';
import mapImage from './assets/map.png';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const usPublicLibrariesAreaProject = {
  schemaVersion: 1,

  id:
    'project-us-public-libraries-area-2019',

  contentType: 'project',

  slug:
    'us-public-libraries-area-2019',

  aliases: [],

  title:
    'US Public Libraries Area (Sq Ft), 2019',

  description:
    'A county-level visualization of public-library area in the United States using 2019 data, created with Microsoft Excel PivotTables and Adobe Photoshop.',

  status: 'published',

  publishedAt:
    '2026-08-25',

  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Public Libraries',
    'United States',
    'Microsoft Excel',
    'PivotTables',
    'Adobe Photoshop',
    'Data Visualization',
    'Cartography',
  ],

  topicIds: [],

  featured: false,

  thumbnail: {
    src: thumbnail,

    alt:
      'Map visualizing public-library area by county in the United States in 2019.',

    width: 1600,

    height: 900,
  },

  banner: undefined,

  relationships: [],

  publication: undefined,

  searchKeywords: [
    'US public libraries',
    'library area 2019',
    'county data visualization',
    'Excel PivotTables map',
    'public library square footage',
    'United States cartography',
  ],

  category:
    'Data',

  role: undefined,

  client: undefined,

  dateStarted: undefined,

  dateCompleted: undefined,

  homepageFeatured: false,

  homepageFeaturedOrder:
    undefined,

  portfolioFeatured: false,

  portfolioOrder: 4,

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
    'Represent differences in public-library area across United States counties using 2019 data while retaining a clear national visual overview.',

  approach:
    'The visualization was developed using Microsoft Excel PivotTables and Adobe Photoshop. County-level values were translated into the final map composition, with counties lacking data left visually unrepresented rather than assigned invented values.',

  outcomes: [],

  gallery: [
    {
      src: mapImage,

      alt:
        'Full map showing public-library area by county in the United States in 2019.',

      width: 1600,

      height: 900,

      caption:
        'US Public Libraries Area (Sq Ft), 2019.',
    },
  ],

  downloads: [],

  repositoryUrl: undefined,

  liveUrl: undefined,
} satisfies ProjectContent;
