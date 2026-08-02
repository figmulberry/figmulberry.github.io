import {
  BarChart3,
  BrainCircuit,
  CircuitBoard,
  Code2,
  Database,
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
    homepageSummary:
      'Enterprise GIS for advanced spatial analysis, mapping, geoprocessing, and spatial data quality.',
    summary:
      'Enterprise desktop GIS for spatial analysis, mapping, geoprocessing, cartography, enterprise support, and spatial data quality.',
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
    homepageSummary:
      'Open-source GIS for spatial analysis, cartography, automation, and reproducible mapping workflows.',
    summary:
      'Open-source desktop GIS for spatial analysis, cartography, automation, remote sensing, and reproducible professional workflows.',
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
    id: 'postgresql-postgis',
    name: 'PostgreSQL / PostGIS',
    tagline: 'Spatial Database • SQL • Geospatial Infrastructure',
    category: 'GIS',
    featured: true,
    level: 'Frequent',
    since: 2018,
    accentColor: '#336791',
    icon: Database,
    homepageSummary:
      'Spatial databases, SQL analysis, and reliable geospatial data infrastructure for production workflows.',
    summary:
      'Relational and spatial database environment for structured data management, spatial SQL, geospatial integration, and production data infrastructure.',
    whereUsed: [
      'Spatial databases',
      'PostGIS analysis',
      'SQL queries',
      'Data infrastructure',
    ],
    projects: [
      'Regional Water Quality Monitoring',
      'Spatial Data Infrastructure',
      'Geospatial Database Workflows',
    ],
    recentlyUsed: [
      'Spatial SQL',
      'Database modelling',
      'GIS data management',
    ],
    experience:
      'Used for structured geospatial data management, spatial querying, and integration with GIS and analytics workflows.',
    articles: [
      'PostGIS Spatial Queries',
      'Geospatial Database Design',
      'Spatial Data Infrastructure',
    ],
    portfolio: [
      'Regional Water Quality Monitoring',
      'Spatial Data Infrastructure',
      'Geospatial Database Workflows',
    ],
    relatedHref: '/portfolio',
  },

  {
    id: 'machine-learning',
    name: 'Machine Learning',
    tagline: 'Scikit-learn • TensorFlow • PyTorch • GeoAI',
    category: 'AI',
    featured: true,
    level: 'Project-based',
    since: 2019,
    accentColor: '#FF6F00',
    icon: BrainCircuit,
    homepageSummary:
      'Machine-learning tools for classification, computer vision, model evaluation, and GeoAI workflows.',
    summary:
      'Machine-learning packages and workflows for classification, computer vision, model evaluation, satellite analysis, and geospatial AI.',
    whereUsed: [
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Model evaluation',
    ],
    projects: [
      'GeoAI Model Evaluation',
      'Satellite Image Classification',
      'Building Footprint Detection',
    ],
    recentlyUsed: [
      'Model evaluation',
      'Computer vision workflows',
      'AI training',
    ],
    experience:
      'Applied across geospatial classification, model evaluation, AI training, and reproducible analytical workflows.',
    articles: [
      'GeoAI Model Evaluation',
      'Satellite Classification',
      'Machine Learning Workflows',
    ],
    portfolio: [
      'GeoAI Model Evaluation',
      'Satellite Image Classification',
      'Building Footprint Detection',
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
    homepageSummary:
      'Automation, geospatial processing, analytics, and AI-enabled technical workflow development.',
    summary:
      'Python for GIS automation, data processing, geospatial analysis, analytical modelling, and AI-enabled technical workflows.',
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
    homepageSummary:
      'Reproducible notebooks for GeoAI, GIS analysis, experimentation, and technical demonstrations.',
    summary:
      'Notebook-based environment for reproducible geospatial analysis, experimentation, prototyping, documentation, and AI model evaluation.',
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
    homepageSummary:
      'Interactive dashboards, analytical reporting, data storytelling, and business intelligence.',
    summary:
      'Business intelligence platform for dashboard development, analytical reporting, data modelling, data storytelling, and Frontier AI training.',
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
    homepageSummary:
      'Advanced analytics, reporting, documentation, presentations, and structured business workflows.',
    summary:
      'Advanced Microsoft 365 workflows for data analysis, reporting, presentations, documentation, database work, and Frontier AI task design.',
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
    homepageSummary:
      'PCB libraries, schematic symbols, component packages, footprints, and technical workflow design.',
    summary:
      'PCB design environment used for component libraries, schematic symbols, packages, footprints, board-design workflows, and Frontier AI training.',
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
    homepageSummary:
      'Version control, structured collaboration, deployment, and maintainable technical project delivery.',
    summary:
      'Version-control and collaboration platform for source management, structured branching, deployment, documentation, and maintainable development.',
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
    homepageSummary:
      'Focused development for React, TypeScript, Python, GIS, and technical documentation.',
    summary:
      'Primary development environment for React, TypeScript, Python, GIS workflows, source control, and professional technical documentation.',
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