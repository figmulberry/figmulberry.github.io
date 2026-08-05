import { mosesThiongo } from '@/content/shared/authors';

import type { SeriesContent } from '@/content/engine/types';

export const historicTopographicMapRecreationSeries = {
  schemaVersion: 1,

  id: 'series-historic-topographic-map-recreation',
  contentType: 'series',

  slug: 'historic-topographic-map-recreation',
  aliases: [],

  title: 'Historic Topographic Map Recreation',

  description:
    'A practical cartographic series exploring how historical topographic-map elements can be recreated using modern GIS software while preserving their visual discipline and craft.',

  status: 'draft',

  publishedAt: '2025-08-07',
  updatedAt: undefined,

  authors: [mosesThiongo],

  tags: [
    'ArcGIS Pro',
    'Cartography',
    'Historical Topographic Maps',
    'Map Design',
  ],

  topicIds: [],

  featured: true,

  relationships: [
    {
      type: 'uses',
      targetId: 'tool-arcgis-pro',
      label: 'Primary cartographic software',
    },
  ],

  searchKeywords: [
    'historic topographic maps',
    'topographic cartography',
    'ArcGIS Pro map design',
    'historical map recreation',
    'grids and graticules',
    'scale bars',
  ],

  partIds: [
    'article-topo-grids-part-1',
    'article-topo-grids-part-2'
  ],

  complete: false,
} satisfies SeriesContent;