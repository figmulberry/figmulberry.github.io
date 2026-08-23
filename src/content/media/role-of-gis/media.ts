import { mosesThiongo } from '@/content/shared/authors';

import type {
  MediaContent,
} from '@/content/engine/types';

export const roleOfGisMedia = {
  schemaVersion: 1,

  id: 'media-role-of-gis',
  contentType: 'media',

  slug: 'role-of-gis',
  aliases: [],

  title:
    'The Role of GIS',

  description:
    'A lightning talk from Esri UC 2018 on the importance of understanding the current state of GIS when governments in developing countries plan geospatial infrastructure.',

  cardDescription:
    'A lightning talk on why understanding the current state of GIS matters when planning geospatial infrastructure.',

  status: 'published',

  publishedAt: '2019-04-09',
  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Esri UC',
    'Lightning Talk',
    'GIS',
    'Geospatial Infrastructure',
    'Developing Countries',
    'Spatial Planning',
    'The Kalabash Mosaics',
  ],

  topicIds: [],

  featured: true,

  relationships: [],

  searchKeywords: [
    'The Role of GIS',
    'Esri UC 2018',
    'Esri UC',
    'lightning talk',
    'GIS',
    'geospatial infrastructure',
    'developing countries',
    'spatial planning',
    'Moses Thiongo',
    'The Kalabash Mosaics',
  ],

  mediaType: 'lightning-talk',

  platform: 'YouTube',

  externalUrl:
    'https://youtu.be/XaIwaGwHnDE',

  embedUrl:
    'https://www.youtube-nocookie.com/embed/XaIwaGwHnDE',
} satisfies MediaContent;