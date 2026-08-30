import { mosesThiongo } from '@/content/shared/authors';

import type {
  MediaContent,
} from '@/content/engine/types';

export const featureOutlineMasksMedia = {
  schemaVersion: 1,

  id: 'media-feature-outline-masks',
  contentType: 'media',

  slug: 'feature-outline-masks',
  aliases: [],

  title:
    'Applying Type Knockouts',

  description:
    'A practical cartography tutorial on applying feature outline masks and type knockouts to improve label legibility where text crosses lines and other map features.',

  cardDescription:
    'A practical cartography tutorial on using type knockouts to keep map labels clear and legible.',

  status: 'published',

  publishedAt: '2022-03-07',
  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'GIS',
    'Cartography',
    'Tutorial',
    'Type Knockouts',
    'Feature Outline Masks',
    'Labeling',
    'Map Design',
    'The Kalabash Mosaics',
  ],

  topicIds: [],

  featured: true,

  relationships: [],

  searchKeywords: [
    'Applying Type Knockouts',
    'feature outline masks',
    'type knockouts',
    'GIS',
    'cartography',
    'map labels',
    'label legibility',
    'map design',
    'tutorial',
    'Moses Thiongo',
    'The Kalabash Mosaics',
  ],

  mediaType: 'tutorial',

  platform: 'YouTube',

  externalUrl:
    'https://youtu.be/__0gk_-TCmw',

  embedUrl:
    'https://www.youtube-nocookie.com/embed/__0gk_-TCmw',
} satisfies MediaContent;