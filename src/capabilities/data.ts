import {
  BarChart3,
  Bot,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
} from 'lucide-react';

import type { Capability } from './types';

export const capabilityData: Capability[] = [
  {
    id: 'geospatial-analysis',
    title: 'Geospatial Analysis',
    summary:
      'Spatial analysis, cartography, and production-ready GIS workflows.',
    description:
      'Advanced spatial analysis, cartography, and GIS workflows using QGIS, ArcGIS Pro, Python, and spatial databases.',
    icon: Map,
    relatedTools: [
      'QGIS',
      'ArcGIS Pro',
      'Python',
      'PostGIS',
    ],
    relatedProjects: [
      'Nigeria Flood Exposure',
      'Vienna Emergency Access',
      'California Residential Population Intensity',
    ],
    relatedArticles: [
      'Spatial Analysis Workflows',
      'Cartographic Design',
      'GIS Quality Assurance',
    ],
    relatedHref: '/portfolio',
  },
  {
    id: 'geoai-automation',
    title: 'GeoAI & Automation',
    summary:
      'Machine learning, satellite analysis, and automated geospatial workflows.',
    description:
      'GeoAI workflows covering model evaluation, satellite imagery, spatial automation, Python processing, and reproducible geospatial analysis.',
    icon: Bot,
    relatedTools: [
      'Python',
      'QGIS',
      'Jupyter',
      'GeoPandas',
    ],
    relatedProjects: [
      'GeoAI Model Evaluation',
      'PyQGIS Automation',
      'Satellite Analysis Workflows',
    ],
    relatedArticles: [
      'GeoAI Evaluation',
      'Python GIS Automation',
      'Reproducible Geospatial Workflows',
    ],
    relatedHref: '/portfolio',
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    summary:
      'Dashboards, visual analytics, and decision-ready reporting.',
    description:
      'Interactive analytics, business intelligence, dashboard development, data modelling, and evidence-based reporting using Power BI, Excel, and related tools.',
    icon: BarChart3,
    relatedTools: [
      'Power BI',
      'Microsoft 365',
      'Excel',
      'SQL',
    ],
    relatedProjects: [
      'Business Intelligence Dashboards',
      'Advanced Excel Analysis',
      'Executive Reporting',
    ],
    relatedArticles: [
      'Dashboard Design',
      'Data Storytelling',
      'Power Query Workflows',
    ],
    relatedHref: '/portfolio',
  },
  {
    id: 'ai-training-workflows',
    title: 'AI Training Workflows',
    summary:
      'Task design, model evaluation, QA, and technical workflow development.',
    description:
      'Design and execution of realistic technical tasks, model-output evaluation, rubric-based QA, error analysis, and reproducible workflows for Frontier AI systems.',
    icon: GraduationCap,
    relatedTools: [
      'Power BI',
      'Microsoft 365',
      'LibrePCB',
      'QGIS',
    ],
    relatedProjects: [
      'Frontier AI Training',
      'Microsoft 365 Execution Workflows',
      'LibrePCB Training Workflows',
    ],
    relatedArticles: [
      'AI Evaluation Workflows',
      'Rubric-Based Quality Assurance',
      'Technical Task Design',
    ],
    relatedHref: '/portfolio',
  },
  {
    id: 'technical-documentation',
    title: 'Technical Documentation',
    summary:
      'Clear, reproducible guidance for complex technical processes.',
    description:
      'Step-by-step workflows, QA records, troubleshooting notes, reviewer guidance, and instructional documentation designed for clarity and repeatability.',
    icon: FileText,
    relatedTools: [
      'Microsoft 365',
      'VS Code',
      'GitHub',
      'Jupyter',
    ],
    relatedProjects: [
      'GIS Workflow Documentation',
      'Microsoft 365 Execution Guides',
      'LibrePCB Beginner Workflows',
    ],
    relatedArticles: [
      'Workflow Documentation Standards',
      'Reviewer-Safe QA Notes',
      'Technical Instruction Design',
    ],
    relatedHref: '/portfolio',
  },
  {
    id: 'dashboard-development',
    title: 'Dashboard Development',
    summary:
      'End-to-end dashboard design, modelling, and deployment.',
    description:
      'Dashboard development from source-data preparation and modelling through visual design, interaction, QA, reporting, and deployment.',
    icon: LayoutDashboard,
    relatedTools: [
      'Power BI',
      'ArcGIS Dashboards',
      'Microsoft Excel',
      'SQL',
    ],
    relatedProjects: [
      'ArcGIS Dashboard Development',
      'Business Intelligence Dashboards',
      'Programme Monitoring Dashboards',
    ],
    relatedArticles: [
      'Dashboard Design',
      'Visual Analytics',
      'Decision-Ready Reporting',
    ],
    relatedHref: '/portfolio',
  },
];