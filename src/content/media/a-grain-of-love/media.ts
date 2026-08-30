import { mosesThiongo } from '@/content/shared/authors';

import type {
  MediaContent,
} from '@/content/engine/types';

export const aGrainOfLoveMedia = {
  schemaVersion: 1,

  id: 'media-a-grain-of-love',
  contentType: 'media',

  slug: 'a-grain-of-love',
  aliases: [],

  title: 'A Grain of Love',

  description:
    'An original poem set in the Aberdare ranges in the mid-June of 1996, tracing an unexpected encounter through hardship, companionship, resilience, and an enduring love that finds its worth beyond material wealth.',


  cardDescription:
    'An original poem of encounter, hardship, companionship, and enduring love, set against the Aberdare ranges in 1996.',
  status: 'published',

  publishedAt: '2021-10-25',
  updatedAt: undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Poetry',
    'Creative Writing',
    'Spoken Word',
    'Love',
    'Aberdare Ranges',
    'The Kalabash Mosaics',
  ],

  topicIds: [],

  featured: true,

  relationships: [],

  searchKeywords: [
    'A Grain of Love',
    'poem',
    'poetry',
    'spoken word',
    'creative writing',
    'love poem',
    'Aberdare',
    'Moses Thiongo',
    'The Kalabash Mosaics',
  ],

  mediaType: 'poetry',

  platform: 'YouTube',

  externalUrl:
    'https://youtu.be/hJVsau1Xibo',

  embedUrl:
    'https://www.youtube-nocookie.com/embed/hJVsau1Xibo',
} satisfies MediaContent;