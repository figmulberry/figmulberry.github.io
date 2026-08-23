export const portfolioProjects = [
  // GIS & Geospatial Analysis
  {
    id: 1,
    title:
      'Urban Land Use Change Detection using Sentinel-2 Imagery',
    category:
      'GIS & Geospatial Analysis',
    description:
      'Multi-temporal analysis of urban expansion patterns using satellite imagery and machine learning classification techniques.',
    tools: [
      'QGIS',
      'Python',
      'Rasterio',
      'GDAL',
    ],
    date: '2026-05',
    slug:
      'urban-land-use-detection',
    thumbnail:
      '/project-thumbnails/placeholder.webp',

    homepageFeatured: true,
    homepageFeaturedOrder: 1,
  },

  {
    id: 2,
    title:
      'Regional Water Quality Monitoring Dashboard',
    category:
      'GIS & Geospatial Analysis',
    description:
      'Interactive GIS dashboard for tracking water quality indicators across river basins with real-time data integration.',
    tools: [
      'ArcGIS Pro',
      'Python',
      'PostgreSQL/PostGIS',
    ],
    date: '2026-03',
    slug:
      'water-quality-monitoring',
    thumbnail:
      '/project-thumbnails/placeholder.webp',
  },

  {
    id: 3,
    title:
      'Agricultural Suitability Mapping for Climate Adaptation',
    category:
      'GIS & Geospatial Analysis',
    description:
      'Multi-criteria spatial analysis to identify optimal crop zones under projected climate scenarios.',
    tools: [
      'QGIS',
      'Python',
      'Scikit-learn',
    ],
    date: '2026-01',
    slug:
      'agricultural-suitability',
    thumbnail:
      '/project-thumbnails/placeholder.webp',
  },

  // GeoAI & Automation
  {
    id: 4,
    title:
      'Automated GeoAI Pipeline for Road Network Extraction',
    category:
      'GeoAI & Automation',
    description:
      'Deep learning pipeline for automatic extraction and classification of road networks from high-resolution satellite imagery.',
    tools: [
      'PyQGIS',
      'Python',
      'TensorFlow',
      'Keras',
    ],
    date: '2026-04',
    slug:
      'road-network-extraction',

    homepageFeatured: true,
    homepageFeaturedOrder: 2,
  },

  {
    id: 5,
    title:
      'Building Footprint Detection with U-Net Architecture',
    category:
      'GeoAI & Automation',
    description:
      'Semantic segmentation model for automated building detection and footprint delineation from aerial imagery.',
    tools: [
      'Python',
      'PyTorch',
      'GDAL',
      'Jupyter',
    ],
    date: '2025-12',
    slug:
      'building-footprint-detection',
  },

  {
    id: 6,
    title:
      'PyQGIS Workflow Automation Toolkit',
    category:
      'GeoAI & Automation',
    description:
      'Custom QGIS plugin for batch processing of spatial analysis tasks with reproducible Python scripting.',
    tools: [
      'PyQGIS',
      'Python',
      'Qt',
    ],
    date: '2025-11',
    slug:
      'pyqgis-automation-toolkit',
  },

  // Data Analytics & Microsoft 365
  {
    id: 7,
    title:
      'Regional Agricultural Dashboard with Power BI',
    category:
      'Data Analytics & Microsoft 365',
    description:
      'Comprehensive Power BI dashboard integrating agricultural production data, weather patterns, and market trends.',
    tools: [
      'Power BI',
      'Excel',
      'Python',
      'Power Query',
    ],
    date: '2026-02',
    slug:
      'agricultural-dashboard',

    homepageFeatured: true,
    homepageFeaturedOrder: 3,
  },

  {
    id: 8,
    title:
      'Project Performance Analytics Suite',
    category:
      'Data Analytics & Microsoft 365',
    description:
      'Automated reporting system for project KPIs using Power BI, Excel, and SharePoint integration.',
    tools: [
      'Power BI',
      'Excel',
      'SharePoint',
      'Power Automate',
    ],
    date: '2025-10',
    slug:
      'project-performance-analytics',
  },

  // AI Training & Workflow Design
  {
    id: 9,
    title:
      'Geospatial AI Training Curriculum Development',
    category:
      'AI Training & Workflow Design',
    description:
      'Structured training program for teaching GeoAI fundamentals to GIS practitioners and data scientists.',
    tools: [
      'Jupyter',
      'Python',
      'QGIS',
      'Documentation',
    ],
    date: '2025-09',
    slug:
      'geoai-training-curriculum',
  },

  {
    id: 10,
    title:
      'Reproducible Geospatial Analysis Workflow Templates',
    category:
      'AI Training & Workflow Design',
    description:
      'Standardized workflow templates for common geospatial analysis tasks with version control and documentation.',
    tools: [
      'Git',
      'Python',
      'Jupyter',
      'Markdown',
    ],
    date: '2025-08',
    slug:
      'reproducible-workflow-templates',
  },
];

export const articles = [
  {
    id: 1,
    title:
      'Getting Started with GeoAI: Object Detection on Satellite Imagery',
    date: '2026-07-15',
    category: 'GeoAI',
    excerpt:
      'A practical guide to implementing your first object detection model for analyzing satellite imagery, from data preparation to model deployment.',
    readingTime: '12 min',
    slug:
      'geoai-object-detection-intro',
  },

  {
    id: 2,
    title:
      'Automating GIS Workflows with PyQGIS: A Practical Guide',
    date: '2026-06-28',
    category: 'Python/GIS',
    excerpt:
      'Learn how to leverage PyQGIS for batch processing, custom analysis tools, and reproducible geospatial workflows that save hours of manual work.',
    readingTime: '15 min',
    slug:
      'pyqgis-automation-guide',
  },

  {
    id: 3,
    title:
      'Building Reproducible Geospatial Pipelines',
    date: '2026-06-10',
    category:
      'Workflow Design',
    excerpt:
      'Best practices for structuring geospatial analysis projects with version control, environment management, and automated testing.',
    readingTime: '10 min',
    slug:
      'reproducible-geospatial-pipelines',
  },

  {
    id: 4,
    title:
      'Remote Sensing Classification: From Pixels to Insights',
    date: '2026-05-22',
    category:
      'Remote Sensing',
    excerpt:
      'Understanding supervised and unsupervised classification techniques for land cover mapping and change detection analysis.',
    readingTime: '14 min',
    slug:
      'remote-sensing-classification',
  },

  {
    id: 5,
    title:
      'Power BI for Geospatial Data: Integration Strategies',
    date: '2026-05-05',
    category:
      'Data Analytics',
    excerpt:
      'Connecting Power BI with spatial databases, ArcGIS services, and Python scripts to build location-intelligent dashboards.',
    readingTime: '11 min',
    slug:
      'power-bi-geospatial-integration',
  },
];





export const skills = {
  'GIS & Spatial Analysis': [
    'QGIS',
    'ArcGIS Pro',
    'PostGIS',
    'GDAL/OGR',
    'Spatial SQL',
    'Cartography',
  ],

  'Programming & Data Science': [
    'Python',
    'PyQGIS',
    'GeoPandas',
    'Rasterio',
    'NumPy',
    'Pandas',
    'Scikit-learn',
  ],

  'GeoAI & Machine Learning': [
    'TensorFlow',
    'PyTorch',
    'Keras',
    'Computer Vision',
    'Semantic Segmentation',
    'Object Detection',
  ],

  'Remote Sensing': [
    'Satellite Imagery Analysis',
    'Sentinel-2',
    'Landsat',
    'Change Detection',
    'Image Classification',
  ],

  'Data Analytics & BI': [
    'Power BI',
    'Excel',
    'Power Query',
    'DAX',
    'Data Visualization',
    'Dashboard Development',
  ],

  'Development & Automation': [
    'Git',
    'Jupyter',
    'VS Code',
    'API Integration',
    'Workflow Automation',
    'CI/CD',
  ],
};

export const tools = [
  {
    name: 'QGIS',
    icon: 'SiQgis',
  },
  {
    name: 'ArcGIS Pro',
    icon: 'SiEsri',
  },
  {
    name: 'Python',
    icon: 'SiPython',
  },
  {
    name: 'Jupyter',
    icon: 'SiJupyter',
  },
  {
    name: 'Power BI',
    icon: 'SiPowerbi',
  },
  {
    name: 'Microsoft 365',
    icon: 'SiMicrosoft',
  },
  {
    name: 'VS Code',
    icon: 'SiVisualstudiocode',
  },
  {
    name: 'Git',
    icon: 'SiGit',
  },
];