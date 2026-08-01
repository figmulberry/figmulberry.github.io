import {
  BarChart3,
  CircuitBoard,
  Code2,
  PanelsTopLeft,
} from 'lucide-react';

import {
  SiArcgis,
  SiGithub,
  SiJupyter,
  SiPython,
  SiQgis,
} from 'react-icons/si';

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
    icon: SiArcgis,
    summary:
      'Enterprise desktop GIS for spatial analysis, mapping, geoprocessing, and spatial data quality.',
    whereUsed: [
      'Enterprise GIS',
      'Infrastructure mapping',
      'Geoprocessing',
      'Spatial data QA',
    ],
    projects: [
      'Enterprise GIS Support',
      'California Residential Population Intensity',
      'ArcGIS Dashboard Development',
    ],
    recentlyUsed: [
      'Utility mapping',
      'Spatial data quality',
      'Workflow engineering',
    ],
    experience:
      'Three years supporting global ArcGIS Pro and ArcGIS Enterprise users at Esri.',
    articles: [
      'Enterprise GIS Quality Assurance',
      'Coordinate Systems',
      'Spatial Reference Troubleshooting',
    ],
    portfolio: [
      'Enterprise GIS Support',
      'California Residential Population Intensity',
      'ArcGIS Dashboard Development',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'qgis',
    name: 'QGIS',
    tagline: 'Spatial Analysis • Cartography • Automation',
    category: 'GIS',
    featured: true,
    level: 'Daily',
    since: 2017,
    accentColor: '#589632',
    icon: SiQgis,
    summary:
      'Open-source desktop GIS for spatial analysis, cartography, automation, and reproducible workflows.',
    whereUsed: [
      'Spatial analysis',
      'Remote sensing',
      'Cartography',
      'Workflow automation',
    ],
    projects: [
      'Nigeria Flood Exposure',
      'Vienna Emergency Access',
      'Mato Grosso Deforestation',
    ],
    recentlyUsed: [
      'GIS execution workflows',
      'GeoAI analysis',
      'Quality assurance',
    ],
    experience:
      'Primary desktop GIS environment across professional delivery, technical documentation, and AI training.',
    articles: [
      'QGIS Automation',
      'Cartographic Layout Design',
      'Reproducible GIS Workflows',
    ],
    portfolio: [
      'Nigeria Flood Exposure',
      'Vienna Emergency Access',
      'Mato Grosso Deforestation',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'python',
    name: 'Python',
    tagline: 'Automation • Spatial Analysis • AI Workflows',
    category: 'Programming',
    featured: true,
    level: 'Daily',
    since: 2018,
    accentColor: '#3776AB',
    icon: SiPython,
    summary:
      'Python for GIS automation, data processing, geospatial analysis, and AI-enabled technical workflows.',
    whereUsed: [
      'GeoPandas',
      'Rasterio',
      'Automation',
      'Spatial analysis',
    ],
    projects: [
      'GeoAI Evaluation',
      'PyQGIS Automation',
      'Reproducible Data Processing',
    ],
    recentlyUsed: [
      'Python automation',
      'AI model evaluation',
      'Workflow engineering',
    ],
    experience:
      'Professional use across geospatial automation, analytics, and AI workflow development.',
    articles: [
      'Python for GIS Automation',
      'Reusable PyQGIS Patterns',
      'GeoAI Evaluation',
    ],
    portfolio: [
      'GeoAI Evaluation',
      'PyQGIS Automation',
      'Reproducible Data Processing',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'jupyter',
    name: 'Jupyter',
    tagline: 'Reproducible Analysis • Notebooks • Prototyping',
    category: 'Programming',
    featured: true,
    level: 'Frequent',
    since: 2019,
    accentColor: '#F37626',
    icon: SiJupyter,
    summary:
      'Notebook-based environment for reproducible geospatial analysis, experimentation, and documentation.',
    whereUsed: [
      'Python notebooks',
      'Model experimentation',
      'Data exploration',
      'Technical demonstrations',
    ],
    projects: [
      'GeoAI Model Testing',
      'Python Analysis Notebooks',
      'Workflow Documentation',
    ],
    recentlyUsed: [
      'GeoAI testing',
      'Workflow development',
      'Python analysis',
    ],
    experience:
      'Used for reproducible GIS workflows, experimentation, and AI model evaluation.',
    articles: [
      'Reproducible Notebook Workflows',
      'Python for GIS',
      'GeoAI Prototyping',
    ],
    portfolio: [
      'GeoAI Model Testing',
      'Python Analysis Notebooks',
      'Workflow Documentation',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'power-bi',
    name: 'Power BI',
    tagline: 'Analytics • Dashboards • Frontier AI Training',
    category: 'Analytics',
    featured: true,
    level: 'Frequent',
    since: 2024,
    accentColor: '#F2C811',
    icon: BarChart3,
    summary:
      'Business intelligence platform for dashboards, reporting, analytics, and Frontier AI training.',
    whereUsed: [
      'Dashboard development',
      'Business analytics',
      'Reporting',
      'Frontier AI evaluation',
    ],
    projects: [
      'Business Intelligence Dashboards',
      'Analytical Reporting',
      'Frontier AI Training',
    ],
    recentlyUsed: [
      'Dashboard development',
      'AI training',
      'Data reporting',
    ],
    experience:
      'Professional dashboard development together with Frontier AI model training and evaluation.',
    articles: [
      'Dashboard Design',
      'Data Storytelling',
      'Business Intelligence Workflows',
    ],
    portfolio: [
      'Business Intelligence Dashboards',
      'Analytical Reporting',
      'Frontier AI Training',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    tagline: 'Excel • Word • PowerPoint • Frontier AI Training',
    category: 'Analytics',
    featured: true,
    level: 'Daily',
    since: 2016,
    accentColor: '#0078D4',
    icon: PanelsTopLeft,
    summary:
      'Advanced Microsoft 365 workflows for analytics, reporting, documentation, and Frontier AI task design.',
    whereUsed: [
      'Excel analytics',
      'PowerPoint reporting',
      'Word documentation',
      'Access workflows',
    ],
    projects: [
      'Advanced Excel Analysis',
      'Executive Reporting',
      'Frontier AI Training',
    ],
    recentlyUsed: [
      'Excel workflows',
      'QA documentation',
      'Report development',
    ],
    experience:
      'Extensive professional use across analytics, reporting, workflow engineering, and AI training.',
    articles: [
      'Excel Automation',
      'Power Query Workflows',
      'Professional Report Design',
    ],
    portfolio: [
      'Advanced Excel Analysis',
      'Executive Reporting',
      'Frontier AI Training',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'librepcb',
    name: 'LibrePCB',
    tagline: 'PCB Libraries • Schematic Design • Frontier AI Training',
    category: 'Electronics',
    featured: true,
    level: 'Project-based',
    since: 2026,
    accentColor: '#2F9E44',
    icon: CircuitBoard,
    summary:
      'PCB design environment used for component libraries, schematics, footprints, and Frontier AI training.',
    whereUsed: [
      'PCB library creation',
      'Schematic symbols',
      'Packages and footprints',
      'AI execution workflows',
    ],
    projects: [
      'QFN-16 Component Library',
      'PCB Symbol Development',
      'LibrePCB Training Workflows',
    ],
    recentlyUsed: [
      'QFN-16 library design',
      'Package validation',
      'AI training workflows',
    ],
    experience:
      'Current project-based PCB design and Frontier AI workflow-development experience.',
    articles: [
      'PCB Library Development',
      'LibrePCB Workflow Design',
      'Component Validation',
    ],
    portfolio: [
      'QFN-16 Component Library',
      'PCB Symbol Development',
      'LibrePCB Training Workflows',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'github',
    name: 'GitHub',
    tagline: 'Version Control • Collaboration • Deployment',
    category: 'Development',
    featured: true,
    level: 'Daily',
    since: 2020,
    accentColor: '#6E5494',
    icon: SiGithub,
    summary:
      'Version-control and collaboration platform for source management, deployment, and documented development.',
    whereUsed: [
      'Version control',
      'Structured branching',
      'GitHub Pages',
      'GitHub Actions',
    ],
    projects: [
      'Personal Website',
      'Geospatial Repositories',
      'Technical Workflow Projects',
    ],
    recentlyUsed: [
      'Website deployment',
      'Interface refinements',
      'Source control',
    ],
    experience:
      'Active development workflow for version control, collaboration, and deployment.',
    articles: [
      'Git-Based Development',
      'GitHub Pages Deployment',
      'Documented Release Workflows',
    ],
    portfolio: [
      'Personal Website',
      'Geospatial Repositories',
      'Technical Workflow Projects',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'vs-code',
    name: 'VS Code',
    tagline: 'Development • Documentation • Technical Workflows',
    category: 'Development',
    featured: true,
    level: 'Daily',
    since: 2020,
    accentColor: '#007ACC',
    icon: Code2,
    summary:
      'Primary development environment for web development, Python, GIS workflows, and technical documentation.',
    whereUsed: [
      'React and TypeScript',
      'Python development',
      'Technical documentation',
      'Source control',
    ],
    projects: [
      'Personal Website',
      'Python GIS Workflows',
      'Technical Documentation Systems',
    ],
    recentlyUsed: [
      'React development',
      'Git workflows',
      'Technical documentation',
    ],
    experience:
      'Daily environment for development, documentation, and workflow implementation.',
    articles: [
      'Development Workflows',
      'Technical Documentation',
      'Source-Control Practices',
    ],
    portfolio: [
      'Personal Website',
      'Python GIS Workflows',
      'Technical Documentation Systems',
    ],
    relatedHref: '/portfolio',
  },
];