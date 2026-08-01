import type { Tool } from './types';

export const toolData: Tool[] = [
  {
    id: 'arcgis-pro',

    name: 'ArcGIS Pro',

    tagline: 'Enterprise GIS • Spatial Analysis • Geoprocessing',

    category: 'GIS',

    featured: true,

    level: 'Daily',

    since: 2020,

    accentColor: '#007AC2',

    icon: 'arcgis-pro',

    summary:
      'Enterprise desktop GIS used for spatial analysis, enterprise mapping, geoprocessing, and spatial data quality.',

    whereUsed: [
      'Enterprise GIS',
      'Infrastructure mapping',
      'Geoprocessing',
      'Spatial data QA',
    ],

    projects: [
      'enterprise-gis-support',
      'california-residential-population-intensity',
      'arcgis-dashboard-development',
    ],

    recentlyUsed: [
      'utility-mapping',
      'spatial-data-quality',
      'workflow-engineering',
    ],

    experience:
      'Three years supporting global ArcGIS Pro and ArcGIS Enterprise users at Esri.',

    articles: [
      'enterprise-gis-quality-assurance',
      'coordinate-systems',
      'spatial-reference-troubleshooting',
    ],

    portfolio: [
      'enterprise-gis-support',
      'california-residential-population-intensity',
      'arcgis-dashboard-development',
    ],

    relatedHref: '/portfolio',
  },
];