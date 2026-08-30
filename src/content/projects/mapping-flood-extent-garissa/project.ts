import thumbnail from
  './thumbnail.jpg';

import heroImage from
  './hero.jpg';

import figure01 from
  './assets/figure-01-garissa-flood-analysis.jpg';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const mappingFloodExtentGarissaProject = {
  schemaVersion: 1,

  id:
    'project-mapping-flood-extent-garissa',

  contentType:
    'project',

  slug:
    'mapping-flood-extent-garissa',

  aliases: [],

  title:
    'Mapping Flood Extent in Garissa with Sentinel-2 and Python',

  description:
    'A remote-sensing and GIS automation workflow for identifying newly inundated areas from pre- and post-event Sentinel-2 imagery using Python, ArcPy, spectral indices, automated thresholding, and ArcGIS Pro.',

  status:
    'published',

  publishedAt:
    '2024-07-01',

  updatedAt:
    undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Remote Sensing',
    'Flood Mapping',
    'GIS Automation',
    'Python',
    'Sentinel-2',
  ],

  topicIds: [],

  featured:
    true,

  searchKeywords: [
    'Garissa flooding',
    'Sentinel-2 flood mapping',
    'Python flood analysis',
    'ArcPy',
    'ArcGIS Pro',
    'remote sensing',
    'water detection',
    'change detection',
  ],

  thumbnail: {
    src:
      thumbnail,

    alt:
      'Flood-analysis map showing newly inundated areas near Garissa, Kenya.',

    width:
      1600,

    height:
      900,
  },

  banner:
    undefined,

  relationships: [
    {
      type:
        'uses',

      targetId:
        'tool-arcgis-pro',

      label:
        'Primary GIS software',
    },
  ],

  publication:
    undefined,

  category:
    'Geospatial',

  projectType:
    'Remote Sensing & GIS Automation',

  role:
    'GIS Analyst & Python Developer',

  client:
    undefined,

  dateStarted:
    '2024-07',

  dateCompleted:
    '2024-07',

  introMode:
    'overlay',

  collaborators: [],

  tools: [
    {
      name:
        'ArcGIS Pro',
    },

    {
      name:
        'Python',
    },

    {
      name:
        'ArcPy',
    },

    {
      name:
        'Sentinel-2',
    },
  ],

  hero: {
    src:
      heroImage,

    alt:
      'Garissa flood-analysis map derived from satellite imagery and GIS change detection.',

    width:
      1920,

    height:
      1080,
  },

  caseStudy: {
    introduction:
      'This project developed an automated ArcGIS Pro and Python workflow for identifying newly flooded areas from before-and-after Sentinel-2 imagery, then packaged that workflow into a reusable script tool for analysts who do not need to work directly in Python.',

    readingMinutes:
      8,

    sections: [
      {
        id:
          'project-overview',

        type:
          'article',

        title:
          'Project Overview',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'Flood mapping often requires analysts to compare satellite imagery from different dates, identify water consistently, and separate normal water bodies from newly inundated land. This project developed a repeatable workflow that automates those steps using Sentinel-2 multispectral imagery, Python and ArcGIS Pro.',
          },

          {
            type:
              'paragraph',

            body:
              'The analytical workflow was first developed and tested in an ArcGIS Pro notebook and then adapted into a script tool. The final approach accepts folders containing pre-flood and post-flood Sentinel-2 bands, performs the analysis, and writes the resulting flood extent to an output folder.',
          },
        ],
      },

      {
        id:
          'context-and-challenge',

        type:
          'article',

        title:
          'Context and Challenge',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'Rapid flood assessment depends on being able to distinguish water from other land-cover classes and then determine where water has expanded after an event. A single visual interpretation can be slow and subjective, especially when the workflow needs to be repeated across multiple scenes.',
          },

          {
            type:
              'paragraph',

            body:
              'The project therefore focused on creating a reproducible method that could combine multiple spectral indicators of water, automatically determine classification thresholds, compare conditions before and after flooding, and produce GIS-ready outputs for further analysis and response planning.',
          },

          {
            type:
              'pull',

            body:
              'The central design goal was not only to detect water, but to isolate newly inundated areas through a repeatable before-and-after change-analysis workflow.',
          },
        ],
      },

      {
        id:
          'methodology',

        type:
          'article',

        title:
          'Methodology',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'The workflow begins by identifying the required Sentinel-2 image bands stored as separate JPEG 2000 files. Python functions locate and reference the Blue, Green, Red, Red Edge 1, Near Infrared and SWIR2 bands needed for visual inspection and spectral analysis.',
          },

          {
            type:
              'paragraph',

            body:
              'A false-color composite is generated to make water and vegetation easier to interpret. Water classification is then performed using two spectral indices: the Sentinel-2 Water Index and the Normalized Difference Water Index. Using both indices provides a more robust basis for detecting water than relying on a single index.',
          },

          {
            type:
              'paragraph',

            body:
              'The resulting index rasters are converted into binary water classifications using automated histogram thresholding. ArcPy Spatial Analyst applies an Otsu-based threshold so the workflow does not depend on an analyst manually selecting a cutoff value for every image.',
          },

          {
            type:
              'paragraph',

            body:
              'The thresholded SWI and NDWI rasters are then combined into a confidence raster. Pixels classified as water by both indices represent the highest-confidence water detections. The same processing functions are applied to both the post-flood and pre-flood imagery.',
          },

          {
            type:
              'workflow',

            items: [
              {
                title:
                  'Load Sentinel-2 bands',

                description:
                  'Locate the required multispectral band files from the pre-flood and post-flood image folders.',
              },

              {
                title:
                  'Build false-color composites',

                description:
                  'Combine selected bands to support visual inspection of water, vegetation and surrounding land cover.',
              },

              {
                title:
                  'Calculate SWI and NDWI',

                description:
                  'Generate two independent spectral water indices for each image date.',
              },

              {
                title:
                  'Apply automated thresholds',

                description:
                  'Use Otsu-based thresholding to classify water and non-water pixels without manual cutoff selection.',
              },

              {
                title:
                  'Build confidence rasters',

                description:
                  'Combine the thresholded indices so agreement between both methods represents higher-confidence water detection.',
              },

              {
                title:
                  'Compare before and after',

                description:
                  'Compare high-confidence pre-event and post-event water masks to isolate newly inundated areas.',
              },

              {
                title:
                  'Export flood extent',

                description:
                  'Save the final flood result as both raster and polygon GIS datasets.',
              },
            ],
          },
        ],
      },

      {
        id:
          'building-the-arcgis-tool',

        type:
          'article',

        title:
          'Building the ArcGIS Tool',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'After the notebook workflow was functioning, the Python code was modified so that its input and output paths could be supplied through ArcGIS Pro rather than hard-coded variables. The before-image folder, after-image folder and final-output folder were exposed as script parameters using ArcPy.',
          },

          {
            type:
              'paragraph',

            body:
              'The workflow was then exported to a Python file and connected to a custom ArcGIS Pro script tool. The tool was configured with three folder parameters, documentation and metadata so that another analyst could run the flood classification workflow through the standard geoprocessing interface without needing to edit the Python code or work directly in a notebook.',
          },

          {
            type:
              'pull',

            body:
              'Turning the notebook into a script tool changed the workflow from an analyst-specific script into a reusable geoprocessing process that could be executed through the ArcGIS Pro interface.',
          },
        ],
      },

      {
        id:
          'results',

        type:
          'article',

        title:
          'Results',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'The completed analysis produces a final flooded-area raster and converts the same result into a polygon feature dataset. These outputs can be used for mapping, spatial measurement and downstream GIS analysis.',
          },

          {
            type:
              'figure',

            image: {
              src:
                figure01,

              alt:
                'Garissa flood-analysis map showing areas identified through satellite-image comparison and water classification.',

              width:
                1800,

              height:
                1350,

              caption:
                'Flood analysis for the Garissa area in Kenya. The project applied Sentinel-2 imagery, spectral water indices, automated thresholding and pre/post-event change detection to identify newly inundated areas.',
            },

            width:
              'normal',
          },

          {
            type:
              'paragraph',

            body:
              'The Garissa application demonstrates the workflow on a flood-affected landscape near the Garissa-Dadaab Road crossing of the Tana River. Pre- and post-event satellite imagery was classified and compared to identify areas that became inundated after the flooding event.',
          },
        ],
      },

      {
        id:
          'closing-notes',

        type:
          'article',

        title:
          'Closing Notes',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'This project combines remote sensing, raster analysis and GIS automation into a repeatable flood-mapping workflow. Its value lies not only in producing a flood extent, but in reducing manual interpretation and packaging the analytical method into a form that can be reused by other ArcGIS Pro users.',
          },

          {
            type:
              'paragraph',

            body:
              'The repository preserves the notebook-based development process, the exported Python implementation and the ArcGIS Pro tooling used to turn the analysis into a reusable workflow.',
          },
        ],
      },
    ],
  },

  homepageFeatured:
    true,

  homepageFeaturedOrder:
    1,

  portfolioFeatured:
    true,

  portfolioOrder:
    undefined,

  locations: [
    {
      id:
        'garissa-kenya',

      label:
        'Garissa, Kenya',

      latitude:
        -0.4532,

      longitude:
        39.6461,
    },
  ],

  mapPlacements: [
    {
      locationId:
        'place:garissa',

      scope:
        'place-wide',
    },
  ],

  challenge:
    'Identify newly flooded areas from multispectral satellite imagery in a repeatable way while reducing dependence on manual image interpretation.',

  approach:
    'Use Sentinel-2 water indices, automated thresholding, confidence-based classification and pre/post-event change analysis in Python and ArcGIS Pro, then package the workflow as a reusable script tool.',

  outcomes: [
    {
      title:
        'Automated flood classification',

      description:
        'A repeatable workflow for classifying pre- and post-event Sentinel-2 imagery and isolating newly inundated areas.',
    },

    {
      title:
        'Raster flood extent',

      description:
        'A final flooded-area raster suitable for mapping, spatial measurement and additional raster analysis.',
    },

    {
      title:
        'Vector flood extent',

      description:
        'A polygon representation of the classified flood extent for use in downstream GIS workflows.',
    },

    {
      title:
        'Reusable ArcGIS Pro tool',

      description:
        'The Python workflow was packaged as an ArcGIS Pro script tool so analysts can run it through the geoprocessing interface.',
    },
  ],

  gallery: [],

  downloads: [],

  repositoryUrl:
    'https://github.com/figmulberry/classifying-flood-imagery',

  liveUrl:
    undefined,
} satisfies ProjectContent;