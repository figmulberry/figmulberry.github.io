export interface ToolDialogMetadata {
  type: string;
  websiteLabel: string;
  websiteHref: string;
  valueTags: string[];
  projectDescriptions: string[];
}

export const toolDialogData: Record<
  string,
  ToolDialogMetadata
> = {
  'arcgis-pro': {
    type: 'Desktop GIS Platform',
    websiteLabel: 'esri.com/arcgis-pro',
    websiteHref:
      'https://www.esri.com/en-us/arcgis/products/arcgis-pro/overview',
    valueTags: [
      'Enterprise GIS',
      'Spatial Analysis',
      'Geoprocessing',
      'Cartography',
    ],
    projectDescriptions: [
      'Enterprise GIS delivery and technical user support',
      'Population modelling and spatial interpolation',
      'Interactive mapping and decision-support dashboards',
    ],
  },

  qgis: {
    type: 'Open-Source GIS Platform',
    websiteLabel: 'qgis.org',
    websiteHref: 'https://qgis.org/',
    valueTags: [
      'Spatial Analysis',
      'Cartography',
      'Remote Sensing',
      'Automation',
    ],
    projectDescriptions: [
      'Flood-risk modelling and exposure analysis',
      'Network accessibility and emergency-response analysis',
      'Satellite-based land-cover change assessment',
    ],
  },

  'postgresql-postgis': {
    type: 'Spatial Database Platform',
    websiteLabel: 'postgis.net',
    websiteHref: 'https://postgis.net/',
    valueTags: [
      'Spatial SQL',
      'Data Infrastructure',
      'Database Modelling',
      'GIS Integration',
    ],
    projectDescriptions: [
      'Environmental monitoring data infrastructure',
      'Structured spatial database design',
      'Reusable geospatial data-management workflows',
    ],
  },

  'machine-learning': {
    type: 'AI and Modelling Toolkit',
    websiteLabel: 'scikit-learn.org',
    websiteHref: 'https://scikit-learn.org/',
    valueTags: [
      'Classification',
      'Computer Vision',
      'Model Evaluation',
      'GeoAI',
    ],
    projectDescriptions: [
      'Evaluation and quality assurance for AI models',
      'Satellite-image classification and interpretation',
      'Automated object and building-footprint detection',
    ],
  },

  python: {
    type: 'Programming Language',
    websiteLabel: 'python.org',
    websiteHref: 'https://www.python.org/',
    valueTags: [
      'Automation',
      'Geospatial Processing',
      'Data Analysis',
      'AI Workflows',
    ],
    projectDescriptions: [
      'Evaluation of geospatial and AI model outputs',
      'Reusable automation for GIS processes',
      'Structured and reproducible data transformation',
    ],
  },

  jupyter: {
    type: 'Interactive Notebook Environment',
    websiteLabel: 'jupyter.org',
    websiteHref: 'https://jupyter.org/',
    valueTags: [
      'Reproducible Research',
      'Geospatial Notebooks',
      'Data Exploration',
      'Prototyping',
    ],
    projectDescriptions: [
      'GeoAI model experimentation and validation',
      'Reproducible Python-based spatial analysis',
      'Documented technical workflow development',
    ],
  },

  'power-bi': {
    type: 'Business Intelligence Platform',
    websiteLabel: 'powerbi.microsoft.com',
    websiteHref:
      'https://www.microsoft.com/en-us/power-platform/products/power-bi',
    valueTags: [
      'Dashboards',
      'Data Modelling',
      'Business Intelligence',
      'Data Storytelling',
    ],
    projectDescriptions: [
      'Interactive operational and executive dashboards',
      'Structured analytical and management reporting',
      'Evaluation and training for advanced AI workflows',
    ],
  },

  'microsoft-365': {
    type: 'Productivity and Analytics Suite',
    websiteLabel: 'microsoft.com/microsoft-365',
    websiteHref:
      'https://www.microsoft.com/microsoft-365',
    valueTags: [
      'Excel Analytics',
      'Documentation',
      'Presentations',
      'Business Workflows',
    ],
    projectDescriptions: [
      'Advanced Excel analysis and decision support',
      'Professional executive reports and presentations',
      'Structured model-training and evaluation workflows',
    ],
  },

  librepcb: {
    type: 'Electronic Design Automation Platform',
    websiteLabel: 'librepcb.org',
    websiteHref: 'https://librepcb.org/',
    valueTags: [
      'PCB Libraries',
      'Schematic Design',
      'Footprints',
      'Component Validation',
    ],
    projectDescriptions: [
      'Reusable QFN-16 component-library development',
      'Accurate electronic schematic-symbol creation',
      'Technical PCB workflow and validation design',
    ],
  },

  github: {
    type: 'Version-Control and Collaboration Platform',
    websiteLabel: 'github.com',
    websiteHref: 'https://github.com/',
    valueTags: [
      'Version Control',
      'Collaboration',
      'Deployment',
      'Documentation',
    ],
    projectDescriptions: [
      'Version-controlled personal website development',
      'Structured repositories for geospatial work',
      'Documented and maintainable technical projects',
    ],
  },

  'vs-code': {
    type: 'Integrated Development Environment',
    websiteLabel: 'code.visualstudio.com',
    websiteHref: 'https://code.visualstudio.com/',
    valueTags: [
      'React and TypeScript',
      'Python Development',
      'Source Control',
      'Documentation',
    ],
    projectDescriptions: [
      'React and TypeScript website development',
      'Python-based GIS workflow implementation',
      'Structured technical documentation systems',
    ],
  },
};