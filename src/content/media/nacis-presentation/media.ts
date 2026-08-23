import { mosesThiongo } from '@/content/shared/authors';

import type {
  MediaContent,
} from '@/content/engine/types';

export const nacisPresentationMedia = {
  schemaVersion: 1,

  id: 'media-nacis-presentation',
  contentType: 'media',

  slug: 'nacis-presentation',
  aliases: [],

  title: 'NACIS Presentation',

  description:
    'A presentation by Moses Thiong’o on using Esri ArcGIS Pro to accurately cartographically deliver the three Florida State Plane Coordinate Systems on one page, including standard parallels, false origins, false-origin axes, plotting, and labelling.',


  cardDescription:
    'A cartographic exploration of Florida’s three State Plane Coordinate Systems, designed and delivered in ArcGIS Pro.',
  status: 'published',

  publishedAt: '2020-10-21',
  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'NACIS',
    'Cartography',
    'ArcGIS Pro',
    'Florida State Plane Coordinate Systems',
    'Coordinate Systems',
    'Map Design',
  ],

  topicIds: [],

  featured: true,

  relationships: [],

  searchKeywords: [
    'NACIS',
    'Moses Thiongo',
    'ArcGIS Pro',
    'Florida State Plane Coordinate Systems',
    'state plane coordinates',
    'standard parallels',
    'false origins',
    'false origin axes',
    'cartography',
    'map design',
  ],

  mediaType: 'presentation',

  platform: 'YouTube',

  externalUrl:
    'https://youtu.be/nyGB18iEqcY',

  embedUrl:
    'https://www.youtube-nocookie.com/embed/nyGB18iEqcY',
} satisfies MediaContent;