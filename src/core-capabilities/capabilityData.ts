import type {
  CapabilityFamily,
} from './types';

export const capabilityFamilies:
  readonly CapabilityFamily[] = [
  {
    id: 'spatial-analysis',

    label: 'Spatial Analysis',

    description:
      'End-to-end spatial analysis, GIS workflows, cartography, spatial-data quality assurance, and reproducible geospatial delivery.',

    accent: 'cyan',

    nodes: [
      {
        id: 'spatial-analysis',
        label: 'Spatial Analysis',
        familyId: 'spatial-analysis',
        type: 'primary',
        prominence: 1,
        relatedIds: [],
      },
      {
        id: 'qgis',
        label: 'QGIS',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.82,
        relatedIds: [
          'spatial-data-qa',
          'gis-workflows',
          'cartography',
        ],
      },
      {
        id: 'arcgis-pro',
        label: 'ArcGIS Pro',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.76,
        relatedIds: [
          'cartography',
          'spatial-data-qa',
        ],
      },
      {
        id: 'pyqgis',
        label: 'PyQGIS',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.58,
        relatedIds: [
          'qgis',
          'automation',
          'python',
        ],
      },
      {
        id: 'geopandas',
        label: 'GeoPandas',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.62,
        relatedIds: [
          'python',
          'spatial-sql',
        ],
      },
      {
        id: 'cartography',
        label: 'Cartography',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.68,
        relatedIds: [
          'qgis',
          'arcgis-pro',
        ],
      },
      {
        id: 'spatial-sql',
        label: 'Spatial SQL',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.55,
        relatedIds: [
          'postgis',
          'sql',
        ],
      },
      {
        id: 'spatial-data-qa',
        label: 'Spatial Data QA',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.66,
        relatedIds: [
          'qgis',
          'data-review',
          'quality-assurance',
        ],
      },
      {
        id: 'gis-workflows',
        label: 'GIS Workflows',
        familyId: 'spatial-analysis',
        type: 'skill',
        prominence: 0.7,
        relatedIds: [
          'qgis',
          'workflow-documentation',
          'reproducibility',
        ],
      },
    ],

    relatedTags: [
      'QGIS',
      'ArcGIS Pro',
      'Spatial Analysis',
      'Cartography',
      'GIS',
    ],

    relatedTopicIds: [],

    projects: [],
  },

  {
    id: 'geoai-automation',

    label: 'GeoAI & Automation',

    description:
      'Geospatial automation, raster analysis, machine-learning workflows, AI-assisted technical systems, and repeatable analytical pipelines.',

    accent: 'violet',

    nodes: [
      {
        id: 'geoai-automation',
        label: 'GeoAI & Automation',
        familyId: 'geoai-automation',
        type: 'primary',
        prominence: 0.96,
        relatedIds: [],
      },
      {
        id: 'tensorflow',
        label: 'TensorFlow',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.48,
        relatedIds: [
          'computer-vision',
          'semantic-segmentation',
        ],
      },
      {
        id: 'pytorch',
        label: 'PyTorch',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.45,
        relatedIds: [
          'computer-vision',
          'semantic-segmentation',
        ],
      },
      {
        id: 'rasterio',
        label: 'Rasterio',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.62,
        relatedIds: [
          'remote-sensing',
          'sentinel-2',
          'landsat-8-9',
        ],
      },
      {
        id: 'gdal-ogr',
        label: 'GDAL/OGR',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.65,
        relatedIds: [
          'spatial-analysis',
          'rasterio',
        ],
      },
      {
        id: 'ndvi-modelling',
        label: 'NDVI Modelling',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.65,
        relatedIds: [
          'remote-sensing',
          'sentinel-2',
          'landsat-8-9',
        ],
      },
      {
        id: 'sentinel-2',
        label: 'Sentinel-2',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.67,
        relatedIds: [
          'remote-sensing',
          'google-earth-engine',
          'land-cover-classification',
          'landsat-8-9',
        ],
      },
      {
        id: 'landsat-8-9',
        label: 'Landsat 8/9',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.58,
        relatedIds: [
          'remote-sensing',
          'sentinel-2',
        ],
      },
      {
        id: 'computer-vision',
        label: 'Computer Vision',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.55,
        relatedIds: [
          'semantic-segmentation',
        ],
      },
      {
        id: 'automation',
        label: 'Automation',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.76,
        relatedIds: [
          'python',
          'pyqgis',
        ],
      },
      {
        id: 'ai-evaluation',
        label: 'AI Evaluation',
        familyId: 'geoai-automation',
        type: 'skill',
        prominence: 0.68,
        relatedIds: [
          'quality-assurance',
          'data-review',
          'guideline-adherence',
        ],
      },
    ],

    relatedTags: [
      'GeoAI',
      'Automation',
      'Machine Learning',
      'Computer Vision',
      'Python',
      'Semantic Segmentation',
    ],

    relatedTopicIds: [],

    projects: [],
  },

  {
    id: 'data-analytics',

    label: 'Data Analytics',

    description:
      'Analytical modelling, advanced spreadsheet systems, business intelligence, dashboards, data review, and decision-ready reporting.',

    accent: 'blue',

    nodes: [
      {
        id: 'data-analytics',
        label: 'Data Analytics',
        familyId: 'data-analytics',
        type: 'primary',
        prominence: 0.95,
        relatedIds: [],
      },
      {
        id: 'power-bi',
        label: 'Power BI',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.72,
        relatedIds: [
          'dax',
          'dashboards',
          'data-modelling',
        ],
      },
      {
        id: 'dax',
        label: 'DAX',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.53,
        relatedIds: [
          'power-bi',
          'data-modelling',
        ],
      },
      {
        id: 'python',
        label: 'Python',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.82,
        relatedIds: [
          'pandas',
          'numpy',
          'automation',
        ],
      },
      {
        id: 'pandas',
        label: 'Pandas',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.64,
        relatedIds: [
          'python',
          'numpy',
        ],
      },
      {
        id: 'numpy',
        label: 'NumPy',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.54,
        relatedIds: [
          'python',
          'pandas',
        ],
      },
      {
        id: 'data-modelling',
        label: 'Data Modelling',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.66,
        relatedIds: [
          'power-bi',
          'dax',
        ],
      },
      {
        id: 'dashboards',
        label: 'Dashboards',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.7,
        relatedIds: [
          'power-bi',
          'operational-analytics',
        ],
      },
      {
        id: 'advanced-excel',
        label: 'Advanced Excel',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.86,
        relatedIds: [
          'operational-analytics',
          'data-review',
        ],
      },
      {
        id: 'operational-analytics',
        label: 'Operational Analytics',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.67,
        relatedIds: [
          'advanced-excel',
          'dashboards',
        ],
      },
      {
        id: 'data-review',
        label: 'Data Review',
        familyId: 'data-analytics',
        type: 'skill',
        prominence: 0.6,
        relatedIds: [
          'quality-assurance',
          'attention-to-detail',
        ],
      },
    ],

    relatedTags: [
      'Data Analytics',
      'Power BI',
      'Excel',
      'Python',
      'Dashboards',
      'Data Modelling',
    ],

    relatedTopicIds: [],

    projects: [],
  },

  {
    id: 'remote-sensing',

    label: 'Remote Sensing',

    description:
      'Earth-observation analysis, image classification, vegetation monitoring, land-cover interpretation, and satellite-data workflows.',

    accent: 'emerald',

    nodes: [
      {
        id: 'remote-sensing',
        label: 'Remote Sensing',
        familyId: 'remote-sensing',
        type: 'primary',
        prominence: 0.92,
        relatedIds: [
          'sentinel-2',
          'landsat-8-9',
        ],
      },
      {
        id: 'google-earth-engine',
        label: 'Google Earth Engine',
        familyId: 'remote-sensing',
        type: 'skill',
        prominence: 0.62,
        relatedIds: [
          'sentinel-2',
          'land-cover-classification',
        ],
      },
      {
        id: 'land-cover-classification',
        label: 'Land Cover Classification',
        familyId: 'remote-sensing',
        type: 'skill',
        prominence: 0.68,
        relatedIds: [
          'sentinel-2',
          'semantic-segmentation',
        ],
      },
      {
        id: 'semantic-segmentation',
        label: 'Semantic Segmentation',
        familyId: 'remote-sensing',
        type: 'skill',
        prominence: 0.52,
        relatedIds: [
          'computer-vision',
          'land-cover-classification',
        ],
      },
    ],

    relatedTags: [
      'Remote Sensing',
      'Sentinel-2',
      'Landsat',
      'Land Cover',
      'Earth Observation',
    ],

    relatedTopicIds: [],

    projects: [],
  },

  {
    id: 'documentation',

    label: 'Documentation',

    description:
      'Technical documentation, reproducible workflow design, instructional writing, knowledge transfer, and stakeholder-facing communication.',

    accent: 'amber',

    nodes: [
      {
        id: 'documentation',
        label: 'Documentation',
        familyId: 'documentation',
        type: 'primary',
        prominence: 0.9,
        relatedIds: [],
      },
      {
        id: 'technical-writing',
        label: 'Technical Writing',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.77,
        relatedIds: [
          'workflow-documentation',
          'instructional-writing',
        ],
      },
      {
        id: 'markdown',
        label: 'Markdown',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.55,
        relatedIds: [
          'technical-writing',
          'reproducibility',
        ],
      },
      {
        id: 'reproducibility',
        label: 'Reproducibility',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.69,
        relatedIds: [
          'workflow-documentation',
          'gis-workflows',
        ],
      },
      {
        id: 'data-dictionaries',
        label: 'Data Dictionaries',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.48,
        relatedIds: [
          'data-review',
        ],
      },
      {
        id: 'training-material',
        label: 'Training Material',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.68,
        relatedIds: [
          'instructional-writing',
        ],
      },
      {
        id: 'workflow-documentation',
        label: 'Workflow Documentation',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.8,
        relatedIds: [
          'technical-writing',
          'reproducibility',
          'gis-workflows',
        ],
      },
      {
        id: 'instructional-writing',
        label: 'Instructional Writing',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.71,
        relatedIds: [
          'technical-writing',
          'training-material',
        ],
      },
      {
        id: 'technical-communication',
        label: 'Technical Communication',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.73,
        relatedIds: [
          'stakeholder-communication',
        ],
      },
      {
        id: 'stakeholder-communication',
        label: 'Stakeholder Communication',
        familyId: 'documentation',
        type: 'skill',
        prominence: 0.63,
        relatedIds: [
          'technical-communication',
        ],
      },
    ],

    relatedTags: [
      'Technical Writing',
      'Documentation',
      'Reproducibility',
      'Training',
      'Workflows',
    ],

    relatedTopicIds: [],

    projects: [],
  },

  {
    id: 'development',

    label: 'Development',

    description:
      'Technical implementation, data services, databases, version-controlled workflows, and supporting application infrastructure.',

    accent: 'fuchsia',

    nodes: [
      {
        id: 'development',
        label: 'Development',
        familyId: 'development',
        type: 'primary',
        prominence: 0.76,
        relatedIds: [],
      },
      {
        id: 'postgis',
        label: 'PostGIS',
        familyId: 'development',
        type: 'skill',
        prominence: 0.58,
        relatedIds: [
          'spatial-sql',
          'sql',
        ],
      },
      {
        id: 'fastapi',
        label: 'FastAPI',
        familyId: 'development',
        type: 'skill',
        prominence: 0.44,
        relatedIds: [
          'python',
        ],
      },
      {
        id: 'docker',
        label: 'Docker',
        familyId: 'development',
        type: 'skill',
        prominence: 0.46,
        relatedIds: [],
      },
      {
        id: 'sql',
        label: 'SQL',
        familyId: 'development',
        type: 'skill',
        prominence: 0.62,
        relatedIds: [
          'postgis',
          'spatial-sql',
        ],
      },
      {
        id: 'version-control',
        label: 'Version Control',
        familyId: 'development',
        type: 'skill',
        prominence: 0.66,
        relatedIds: [
          'document-control',
        ],
      },
      {
        id: 'document-control',
        label: 'Document Control',
        familyId: 'development',
        type: 'skill',
        prominence: 0.56,
        relatedIds: [
          'version-control',
        ],
      },
    ],

    relatedTags: [
      'Development',
      'PostGIS',
      'SQL',
      'Python',
      'Version Control',
    ],

    relatedTopicIds: [],

    projects: [],
  },
] as const;