import type {
  CVData,
} from './types';

export const cvData: CVData = {
  lastUpdated: '2026-08-23',

  profile: {
    name:
      "Moses Thiong'o",

    headline:
      'Geospatial Intelligence | GIS & Spatial Data | Data Analytics | GeoAI | AI Training & Evaluation',

    location:
      'Nairobi, Kenya',

    summary:
      'Geospatial professional with over nine years of experience spanning GIS analysis, spatial data management, enterprise GIS, cartography, remote sensing, data quality, technical documentation, research, training, and geospatial workflow delivery. Experienced in supporting global ArcGIS users, designing and validating spatial data infrastructure, producing decision-support outputs, conducting applied geospatial research, training field and technical teams, and delivering complex work independently across distributed environments.',

    researchInterests: [
      'Urbanization and spatial planning',
      'Remote sensing for climate resilience',
      'Food security and sustainable livelihoods',
      'GIS and machine learning for environmental monitoring',
      'Land-use and land-cover change',
      'Biodiversity conservation',
      'Spatial methods for disaster risk',
      'Spatial approaches to atrocity prevention',
    ],

    links: {
      website: {
        label:
          'Website',

        url:
          'https://figmulberry.github.io/',
      },

      linkedin: {
        label:
          'LinkedIn',

        url:
          'https://www.linkedin.com/in/mkthiongo/',
      },

      github: {
        label:
          'GitHub',

        url:
          'https://github.com/figmulberry',
      },

      youtube: {
        label:
          'YouTube',

        url:
          'https://www.youtube.com/@thekalabashmosaics',
      },

      instagram: {
        label:
          'Instagram',

        url:
          'https://www.instagram.com/musathiongo',
      },

      orcid: {
        label:
          'ORCID',

        url:
          'https://orcid.org/0009-0005-4301-9507',
      },
    },
  },

  experience: [
    {
      id:
        'micro1-qgis-expert-ai-trainer',

      title:
        'QGIS Expert and AI Trainer',

      organization:
        'Micro1 Inc.',

      location:
        'Remote',

      startDate:
        '2026-04',

      endDate:
        '2026-07',

      highlights: [
        'Led end-to-end GIS projects covering spatial data acquisition, cleaning, validation, coordinate systems, geoprocessing, symbology, cartographic layout production, and final-output quality.',
        'Reviewed source datasets and geospatial outputs against technical requirements, identifying attribute, geometry, CRS, classification, completeness, and consistency issues.',
        'Validated maps and datasets through source-to-output reconciliation, feature and extent checks, coordinate-system verification, output inspection, and reproducible quality-assurance procedures.',
        'Created workflow guides, QA checklists, reviewer notes, and troubleshooting records that made technical decisions traceable and repeatable.',
        'Managed multiple technical deliverables independently while collaborating with distributed project teams.',
      ],
    },

    {
      id:
        'world-vision-thrive-2030',

      title:
        'GIS Specialist, THRIVE 2030 Kenya Project',

      organization:
        'World Vision International',

      location:
        'Nairobi, Kenya',

      startDate:
        '2024-06',

      endDate:
        '2026-01',

      highlights: [
        'Worked closely with the Design, Monitoring, Evaluation, Accountability and Learning team on programme monitoring, donor reporting, national planning, integrated data infrastructure, and evidence-based decision support.',
        'Designed and managed GIS infrastructure combining household, environmental, land-use, and spatial datasets for more than 300,000 households.',
        'Applied completeness, consistency, geolocation, metadata, version-control, and change-tracking checks across programme datasets.',
        'Validated GPS and field records, investigated location and attribute inconsistencies, and produced corrected datasets, maps, dashboards, and analytical outputs.',
        'Trained more than 70 field staff and developed step-by-step guidance to improve field data collection, validation, documentation, and geolocation accuracy.',
        'Designed and deployed an ArcGIS Experience Builder application with embedded dashboards to support near-real-time visualization and programme decision-making.',
        'Produced thematic maps, analytical reports, visualizations, and spatial evidence for donor reporting and stakeholder engagement.',
      ],
    },

    {
      id:
        'un-habitat-urban-planner-gis',

      title:
        'Urban Planner and GIS Analyst',

      organization:
        'United Nations Human Settlements Programme (UN-Habitat)',

      location:
        'Nairobi, Kenya',

      startDate:
        '2023-05',

      endDate:
        '2023-11',

      highlights: [
        'Reviewed, integrated, and validated multi-source topographic, land-cover, socioeconomic, road, boundary, and coastal-planning datasets.',
        'Applied metadata, classification, and data-quality standards across planning datasets.',
        'Produced thematic maps supporting Local Physical and Land Use Development Plans and evidence-based urban planning.',
        'Developed and maintained a Spatial Data Hub and ArcGIS Dashboard for stakeholder engagement, data sharing, programme reporting, and evidence-based planning.',
        'Designed GIS database structures and organized spatial datasets for efficient retrieval, reporting, and stakeholder delivery.',
        'Produced maps, spatial outputs, workflow documentation, and technical briefs for cross-functional urban, coastal, and infrastructure-planning teams.',
      ],
    },

    {
      id:
        'regid-carbon-spatial-data-analyst',

      title:
        'Spatial Data Analyst',

      organization:
        'REGID Carbon Limited',

      location:
        'Nairobi, Kenya',

      startDate:
        '2023-03',

      endDate:
        '2023-05',

      highlights: [
        'Analyzed, classified, and validated georeferenced data and satellite-derived outputs for ecosystem-restoration and carbon-accounting projects.',
        'Applied Earth Observation and change-detection techniques to assess deforestation, land-use transitions, and environmental change.',
        'Supported work across Kenya, Zimbabwe, and Senegal while maintaining accuracy, traceability, and documentation standards.',
      ],
    },

    {
      id:
        'esri-gis-analyst',

      title:
        'GIS Analyst',

      organization:
        'Environmental Systems Research Institute (Esri)',

      location:
        'Redlands, California, USA',

      startDate:
        '2020-02',

      endDate:
        '2023-02',

      highlights: [
        'Supported global users of ArcGIS Pro, ArcGIS Enterprise, ArcMap, and ArcGIS Online across infrastructure, land-management, environmental-monitoring, and related sectors.',
        'Reviewed technical cases, user-provided datasets, geodatabases, diagnostic information, and workflow descriptions to reproduce issues and isolate root causes.',
        'Diagnosed and resolved spatial-reference conflicts, attribute inconsistencies, schema problems, data-integrity errors, and enterprise-geodatabase workflow issues.',
        'Resolved a substantial share of weekly GIS support cases while contributing to standardized troubleshooting and technical-support workflows.',
        'Documented defects, reproduction steps, severity, corrective actions, and validation evidence for product and engineering teams.',
        'Led and contributed to cartographic quality-assurance efforts supporting consistent, high-quality map outputs.',
        'Authored technical guides and knowledge-base articles while delivering work independently across distributed time zones.',
      ],
    },
  ],

  education: [
    {
      id:
        'university-redlands-msc-gis',

      qualification:
        'MSc, Geographic Information Science (GIS) and Cartography',

      institution:
        'University of Redlands',

      location:
        'Redlands, California, USA',

      completedAt:
        '2019-12',

      thesisOrProject:
        "Spatial Representation of NOAA's Remotely Operated Vehicles (ROVs) Dive Tracks",

      advisors: [
        'Mark Kumler, Ph.D.',
        'Douglas Flewelling, Ph.D.',
      ],

      award:
        'Jack Dangermond GIS Scholarship',
    },

    {
      id:
        'kenyatta-university-environmental-planning',

      qualification:
        'Bachelor of Environmental Planning and Management',

      institution:
        'Kenyatta University',

      location:
        'Nairobi, Kenya',

      completedAt:
        '2018-12',

      thesisOrProject:
        'Mapping the 2017 spreading pattern of Fall Armyworm (Spodoptera frugiperda) and its implications on maize in Molo, Nakuru County',

      advisors: [
        "Prof. Simon Mang'erere Onywere, Ph.D.",
      ],

      award:
        'Esri 2018 GIS Young Scholar Award',
    },
  ],

  researchProjects: [
    {
      id:
        'hhi-spatial-strategies-peace',

      title:
        'Research on Spatial Strategies for Peace',

      organization:
        'Harvard Humanitarian Initiative',

      location:
        'Virtual',

      startDate:
        '2024-08',

      endDate:
        '2024-09',

      description:
        'Applied spatial analysis to armed-group activity, cross-border movement, and displacement patterns in urban and peri-urban areas of Eastern Democratic Republic of the Congo, including Goma, to examine overlooked population flows and spatial dimensions of conflict.',
    },

    {
      id:
        'flood-imagery-python',

      title:
        'Classify Flooding in Imagery with Python',

      organization:
        'Independent Research Project',

      location:
        'Nairobi, Kenya',

      startDate:
        '2024-07',

      endDate:
        '2024-07',

      description:
        'Developed an ArcGIS Pro and Python workflow for classifying flooded areas from satellite imagery, combining remote sensing and geospatial analysis for flood-pattern identification and climate-risk applications.',

      url:
        'https://github.com/figmulberry/classifying-flood-imagery',
    },

    {
      id:
        'regid-land-use-change',

      title:
        'Land Use Change Monitoring',

      organization:
        'REGID Carbon Limited',

      location:
        'Kenya and regional projects',

      startDate:
        '2023-03',

      endDate:
        '2023-05',

      description:
        'Applied Earth Observation and change-detection techniques to assess deforestation, land-use transitions, and environmental change for nature-based climate and environmental projects.',
    },

    {
      id:
        'noaa-rov-dive-tracks',

      title:
        "Spatial Representation of NOAA's ROV Dive Tracks",

      organization:
        'University of Redlands',

      location:
        'Redlands, California, USA',

      description:
        'Organized, processed, and modeled NOAA remotely operated vehicle dive-track data, including development of custom geoprocessing approaches for converting and representing spatial coverage.',
    },

    {
      id:
        'fall-armyworm-spread',

      title:
        'Fall Armyworm Spread Mapping',

      organization:
        'Kenyatta University',

      location:
        'Nairobi, Kenya',

      startDate:
        '2017-06',

      endDate:
        '2017-11',

      description:
        'Modeled Fall Armyworm spread and its implications for maize production using spatial analysis, supporting applied agricultural planning and geospatial research.',
    },
  ],

  publications: [
    {
      id:
        'publication-rov-thesis',

      citation:
        "Thiong'o, M.K. (2020). Spatial Representation of NOAA's Remotely Operated Vehicles (ROVs) Dive Tracks. Master's thesis, University of Redlands.",

      year:
        '2020',

      type:
        'thesis',

      url:
        'https://doi.org/10.26716/redlands/master/2020.7',
    },

    {
      id:
        'publication-flood-imagery-software',

      citation:
        "Thiong'o, M.K. (2024). Classify Flooding in Imagery with Python [Computer software]. GitHub.",

      year:
        '2024',

      type:
        'software',

      url:
        'https://github.com/figmulberry/classifying-flood-imagery',
    },
  ],

  presentations: [
    {
      id:
        'hhi-spatial-strategies-peace-presentation',

      title:
        'Spatial Strategies for Peace',

      organization:
        'Harvard Humanitarian Initiative',

      event:
        'Spatial Strategies for Peace Conference',

      location:
        'Virtual',

      date:
        '2024-09',

      type:
        'conference-presentation',

      description:
        'Presented research findings on urban and peri-urban displacement in Eastern Democratic Republic of the Congo, highlighting spatial analysis, research communication, and interdisciplinary knowledge translation.',
    },

    {
      id:
        'la-geospatial-summit',

      title:
        "Spatial Representation of NOAA's ROV Dive Tracks",

      organization:
        'USC Dornsife Spatial Sciences Institute',

      event:
        'Los Angeles Geospatial Summit',

      location:
        'Los Angeles, California, USA',

      date:
        '2020-01',

      type:
        'poster',

      description:
        'Presented thesis research on NOAA ROV dive tracks, including custom geoprocessing, data structuring, and geospatial visualization.',
    },

    {
      id:
        'esri-map-gallery-2019',

      title:
        "Spatial Representation of NOAA's ROV Dive Tracks",

      organization:
        'Esri',

      event:
        'Esri User Conference Map Gallery',

      location:
        'San Diego, California, USA',

      date:
        '2019-07',

      type:
        'poster',

      description:
        'Featured graduate research on NOAA ROV dive tracks, demonstrating applied spatial analysis and custom geoprocessing approaches.',
    },

    {
      id:
        'esri-young-scholar-2018',

      title:
        'Fall Armyworm Spatial Spread',

      organization:
        'Esri',

      event:
        'Esri User Conference Young Scholars Map Gallery',

      location:
        'San Diego, California, USA',

      date:
        '2018-07',

      type:
        'poster',

      description:
        'Presented research on Fall Armyworm spatial spread as part of the Esri Young Scholar Award recognition.',
    },
  ],

  teaching: [
    {
      id:
        'kenyatta-gis-trainer',

      role:
        'Occasional GIS Trainer',

      organization:
        'Kenyatta University',

      location:
        'Nairobi, Kenya',

      startDate:
        '2024-01',

      current:
        true,

      description:
        'Delivered occasional GIS training sessions to undergraduate students covering spatial analysis, mapping techniques, and geoprocessing workflows through practical exercises and technical mentorship.',
    },
  ],

  leadership: [
    {
      id:
        'kenyatta-gis-capacity-building',

      role:
        'GIS Trainer',

      organization:
        'Kenyatta University, Department of Environmental Planning and Management',

      period:
        '2022 – Present',

      description:
        'Contributed to student GIS capacity-building workshops and practical geospatial learning.',
    },

    {
      id:
        'world-vision-mentorship',

      role:
        'Mentor',

      organization:
        'World Vision Kenya, DMEAL – THRIVE 2030 Kenya Project',

      period:
        '2024 – 2026',

      description:
        'Supported mentorship of attachés and capacity development within GIS and DMEAL-related work.',
    },
  ],

  credentials: [
    {
      id:
        'arcgis-pro-associate-2101',

      issuer:
        'Esri',

      title:
        'ArcGIS Pro Associate 2101',

      completedAt:
        '2022-06',

      url:
        'https://www.credly.com/badges/9c49ad3f-a230-4e66-9fe5-17792f023940?source=linked_in_profile',

      featured:
        true,
    },

    {
      id:
        'claude-code-101',

      issuer:
        'Anthropic',

      title:
        'Claude Code 101',

      completedAt:
        '2026-08',

      url:
        'https://verify.skilljar.com/c/kxnfcww9ygr7',

      featured:
        true,
    },

    {
      id:
        'foundations-surveycto',

      issuer:
        'SurveyCTO Academy',

      title:
        'Foundations of SurveyCTO',

      completedAt:
        '2026-04',

      url:
        'https://mycourse.app/v1V4tiESwCoxPX3mp',

      featured:
        true,
    },

    {
      id:
        'global-forest-resources-assessment-2025',

      issuer:
        'FAO',

      title:
        'Global Forest Resources Assessment 2025',

      completedAt:
        '2026-03',

      url:
        'https://elearning.fao.org/admin/tool/certificate/index.php?code=9261867005MT',

      featured:
        true,
    },

    {
      id:
        'mckinsey-forward',

      issuer:
        'McKinsey & Company',

      title:
        'McKinsey.org Forward Program',

      completedAt:
        '2025-12',

      url:
        'https://www.credly.com/badges/6e9453e8-5125-4f8a-a6ac-071dc0e359a3/linked_in_profile',

      featured:
        true,
    },

    {
      id:
        'documenting-development-data',

      issuer:
        'The World Bank Group',

      title:
        'Documenting Development Data Using Metadata Standards',

      completedAt:
        '2025-12',

      url:
        'https://mycourse.app/fyYRWRbCCilGgYYwn',

      featured:
        true,
    },

    {
      id:
        'introduction-modern-ai',

      issuer:
        'Cisco',

      title:
        'Introduction to Modern AI',

      completedAt:
        '2025-08',

      url:
        'https://www.credly.com/badges/cf35c4e9-47ab-499b-8c8f-e74e0b015d8b/linked_in_profile',

      featured:
        true,
    },

    {
      id:
        'foundations-project-management',

      issuer:
        'Google',

      title:
        'Foundations of Project Management',

      completedAt:
        '2022-12',

      url:
        'https://www.coursera.org/account/accomplishments/records/VCXS3JJT4QSS',

      featured:
        true,
    },

    {
      id:
        'exploratory-data-analysis-python-pandas',

      issuer:
        'Coursera',

      title:
        'Exploratory Data Analysis With Python and Pandas',

      completedAt:
        '2026-04',

      url:
        'https://www.coursera.org/account/accomplishments/records/CYS7EC7OPXI1',

      featured:
        false,
    },

    {
      id:
        'sustainable-food-systems',

      issuer:
        'FAO',

      title:
        'Sustainable Food Systems: An Introduction',

      completedAt:
        '2026-03',

      url:
        'https://elearning.fao.org/admin/tool/certificate/index.php?code=7033537511MT',

      featured:
        false,
    },

    {
      id:
        'creating-compelling-reports',

      issuer:
        'Cisco',

      title:
        'Creating Compelling Reports',

      completedAt:
        '2025-08',

      url:
        'https://www.credly.com/badges/36b3a83f-5522-4fbe-9f7a-233a586d9f21/linked_in_profile',

      featured:
        false,
    },

    {
      id:
        'engaging-stakeholders-success',

      issuer:
        'Cisco',

      title:
        'Engaging Stakeholders for Success',

      completedAt:
        '2025-08',

      url:
        'https://www.credly.com/badges/8f2805de-5550-47ab-9543-6da57c0bfe69/linked_in_profile',

      featured:
        false,
    },

    {
      id:
        'arcgis-desktop-associate-19001',

      issuer:
        'Esri',

      title:
        'ArcGIS Desktop Associate 19-001',

      completedAt:
        '2021-11',

      url:
        'https://www.credly.com/badges/ab535bc4-5560-4296-bab4-db26a903ca2e?source=linked_in_profile',

      featured:
        false,
    },
  ],

  skillGroups: [
    {
      id:
        'gis-platforms',

      title:
        'GIS Platforms',

      skills: [
        'ArcGIS Pro',
        'ArcGIS Enterprise',
        'ArcGIS Online',
        'ArcMap',
        'QGIS',
        'Survey123',
        'ArcGIS Experience Builder',
        'ArcGIS Dashboards',
      ],
    },

    {
      id:
        'spatial-data-quality',

      title:
        'Spatial Data Quality',

      skills: [
        'Attribute validation',
        'Geometry validation',
        'Coordinate systems',
        'Projections',
        'Spatial reference troubleshooting',
        'Completeness review',
        'Consistency review',
        'Duplicate detection',
        'Anomaly detection',
        'Data correction',
      ],
    },

    {
      id:
        'geodatabases-data-management',

      title:
        'Geodatabases & Data Management',

      skills: [
        'ArcGIS geodatabases',
        'Enterprise geodatabases',
        'PostgreSQL',
        'PostGIS',
        'SQL',
        'Data loading',
        'Data interoperability',
        'Metadata standards',
        'Version control',
      ],
    },

    {
      id:
        'mapping-analysis',

      title:
        'Mapping & Spatial Analysis',

      skills: [
        'Vector analysis',
        'Raster analysis',
        'Geoprocessing',
        'Remote sensing',
        'Land-use analysis',
        'Land-cover analysis',
        'GPS field mapping',
        'Map editing',
        'Thematic cartography',
        'Cartographic layouts',
        'Dashboards',
      ],
    },

    {
      id:
        'programming-automation',

      title:
        'Programming & Automation',

      skills: [
        'Python',
        'ArcPy',
        'GeoPandas',
        'Rasterio',
        'R',
        'SQL',
        'Batch scripting',
        'Reproducible GIS workflows',
      ],
    },

    {
      id:
        'data-analytics',

      title:
        'Data Analytics & Visualization',

      skills: [
        'Power BI',
        'Tableau',
        'ArcGIS Dashboards',
        'Data visualization',
        'Analytical reporting',
        'Decision-support outputs',
      ],
    },

    {
      id:
        'earth-observation',

      title:
        'Earth Observation & Environmental Analysis',

      skills: [
        'Google Earth Engine',
        'Sentinel-2',
        'Copernicus',
        'OpenEO',
        'WEkEO',
        'ClimateSERV',
        'Change detection',
        'Environmental monitoring',
      ],
    },

    {
      id:
        'technical-delivery',

      title:
        'Technical Delivery',

      skills: [
        'Quality assurance',
        'Technical documentation',
        'Workflow design',
        'Knowledge-base writing',
        'Training',
        'Stakeholder communication',
        'Remote collaboration',
        'Cross-functional delivery',
      ],
    },
  ],

  languages: [
    {
      name:
        'English',

      proficiency:
        'Fluent',
    },

    {
      name:
        'Swahili',

      proficiency:
        'Fluent',
    },

    {
      name:
        'Gikuyu',

      proficiency:
        'Native',
    },
  ],
};