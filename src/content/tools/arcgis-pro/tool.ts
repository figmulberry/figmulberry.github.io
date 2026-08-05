import { mosesThiongo } from '@/content/shared/authors';

import type { ToolContent } from '@/content/engine/types';

export const arcgisProTool = {
  schemaVersion: 1,

  id: 'tool-arcgis-pro',
  contentType: 'tool',

  slug: 'arcgis-pro',
  aliases: [],

  title: 'ArcGIS Pro',

  description:
    'Esri desktop GIS software used for mapping, spatial analysis, data management, automation, and professional cartographic production.',

  status: 'published',

  publishedAt: '2025-08-01',
  updatedAt: undefined,

  authors: [mosesThiongo],

  tags: [
    'GIS',
    'Cartography',
    'Spatial Analysis',
    'Geoprocessing',
    'Esri',
  ],

  topicIds: [],

  featured: false,

  relationships: [],

  searchKeywords: [
    'ArcGIS Pro',
    'Esri',
    'desktop GIS',
    'spatial analysis',
    'cartography',
    'geoprocessing',
  ],

  shortName: 'ArcGIS Pro',

  officialUrl:
    'https://www.esri.com/en-us/arcgis/products/arcgis-pro/overview',
} satisfies ToolContent;