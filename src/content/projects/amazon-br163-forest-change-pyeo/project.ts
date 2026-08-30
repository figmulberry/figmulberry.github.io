import thumbnail from
  './thumbnail.png';

import heroImage from
  './hero.png';

import figure01 from
  './assets/figure-01-baseline-sentinel2-composite.png';

import figure02 from
  './assets/figure-02-amazon-model-validation.png';

import figure03 from
  './assets/figure-03-forest-clearing-classification.png';

import figure04 from
  './assets/figure-04-final-forest-change-detection.png';

import {
  mosesThiongo,
} from '@/content/shared/authors';

import type {
  ProjectContent,
} from '@/content/engine/types';


export const amazonBr163ForestChangePyeoProject = {
  schemaVersion: 1,

  id:
    'project-amazon-br163-forest-change-pyeo',

  contentType:
    'project',

  slug:
    'amazon-br163-forest-change-pyeo',

  aliases: [],

  title:
    'Monitoring Forest Change along Amazon BR-163 with PyEO',

  description:
    'A Sentinel-2 forest-change monitoring workflow for the Brazilian Amazon, combining a Windows-adapted PyEO pipeline, ExtraTrees classification, raster change detection, vectorisation, administrative enrichment and structured quality assurance.',

  status:
    'published',

  publishedAt:
    '2026-07-30',

  updatedAt:
    undefined,

  authors: [
    mosesThiongo,
  ],

  tags: [
    'Remote Sensing',
    'Forest Change',
    'Python',
    'Sentinel-2',
    'Machine Learning',
    'PyEO',
  ],

  topicIds: [],

  featured:
    true,

  searchKeywords: [
    'Amazon BR-163',
    'Brazilian Amazon',
    'forest change detection',
    'forest clearing',
    'PyEO',
    'Sentinel-2',
    'ExtraTrees',
    'Copernicus Data Space',
    'remote sensing',
    'Python',
    'change detection',
    'forest monitoring',
  ],

  thumbnail: {
    src:
      thumbnail,

    alt:
      'Sentinel-2 landscape from the Amazon BR-163 pilot with detected forest-change signals highlighted.',

    width:
      1620,

    height:
      1620,
  },

  banner:
    undefined,

  relationships: [],

  publication:
    undefined,

  category:
    'Geospatial',

  projectType:
    'Remote Sensing & Forest Change',

  role:
    'GIS Analyst & Python Developer',

  client:
    undefined,

  dateStarted:
    '2026-07',

  dateCompleted:
    '2026-07',

  introMode:
    'image-right',

  collaborators: [],

  tools: [
    {
      name:
        'PyEO',
    },

    {
      name:
        'Python',
    },

    {
      name:
        'Sentinel-2',
    },

    {
      name:
        'GDAL',
    },

    {
      name:
        'GeoPandas',
    },

    {
      name:
        'QGIS',
    },
  ],

  hero: {
    src:
      heroImage,

    alt:
      'Amazon BR-163 Sentinel-2 landscape with accumulated forest-change detections highlighted across the pilot tile.',

    width:
      1620,

    height:
      1620,
  },

  caseStudy: {
    introduction:
      'This project adapted and validated a PyEO forest-change monitoring workflow for Windows, using Sentinel-2 imagery and a binary Forest/Clearing classifier to detect change across a pilot area along the BR-163 corridor in the Brazilian Amazon.',

    readingMinutes:
      10,

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
              'Forest monitoring at satellite scale involves more than classifying a single image. A repeatable operational workflow has to acquire imagery consistently, establish a reliable baseline, classify monitoring dates with the same model, identify meaningful land-cover transitions, convert raster detections into GIS features and preserve enough quality-control evidence to make the results traceable.',
          },

          {
            type:
              'paragraph',

            body:
              'The Amazon BR-163 pilot was developed around Sentinel-2 tile 21MYM. The configured baseline composite covers July through September 2024, while the monitoring period covers July through September 2025. Processing is performed at 10 metre resolution in EPSG:32721, with the change logic configured specifically for transitions from Forest class 1 to Clearing class 2.',
          },

          {
            type:
              'figure',

            image: {
              src:
                figure01,

              alt:
                'Baseline Sentinel-2 composite for the Amazon BR-163 pilot tile 21MYM.',

              width:
                1600,

              height:
                1600,

              caption:
                'Baseline Sentinel-2 composite for tile 21MYM. The 2024 reference period establishes the landscape condition used for subsequent classification and forest-change monitoring.',
            },

            width:
              'normal',
          },
        ],
      },

      {
        id:
          'adapting-pyeo-for-windows',

        type:
          'article',

        title:
          'Adapting PyEO for a Windows Workflow',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'PyEO provides a broader forest-change processing framework, but this implementation required a controlled Windows workflow with reproducible paths, configuration, credentials and processing stages. The project therefore separated source code, project configuration, working data, generated outputs, documentation and runtime logs rather than relying on machine-specific notebook state.',
          },

          {
            type:
              'paragraph',

            body:
              'Configuration-driven stage flags were used to make processing deliberate. The working configuration can remain in a validation-safe state with processing stages disabled, allowing imports, paths, existing outputs and quality checks to be inspected without automatically downloading imagery, rebuilding rasters or rewriting vector products.',
          },

          {
            type:
              'pull',

            body:
              'The goal was not simply to make PyEO run on Windows, but to make the pilot repeatable, inspectable and safe to resume without depending on hidden notebook state.',
          },
        ],
      },

      {
        id:
          'training-the-classifier',

        type:
          'article',

        title:
          'Training and Validating the Forest/Clearing Classifier',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'The pilot uses an ExtraTrees model trained as a binary land-cover classifier: Forest and Clearing. Training data link interpreted land-cover classes with Sentinel-2 surface-reflectance values, providing the spectral samples used to distinguish the two classes before post-classification change detection.',
          },

          {
            type:
              'paragraph',

            body:
              'Independent validation within the sampled pilot landscape produced an overall accuracy of 0.999979. The confusion matrix contained 1,523,650 correctly predicted Forest samples and 21,141 correctly predicted Clearing samples, with 32 misclassifications in total. These results demonstrate very strong separation within the sampled pilot data, but they are not treated as evidence of equivalent accuracy across the wider Amazon.',
          },

          {
            type:
              'figure',

            image: {
              src:
                figure02,

              alt:
                'Confusion matrix for independent validation of the Amazon Forest and Clearing ExtraTrees classifier.',

              width:
                613,

              height:
                590,

              caption:
                'Independent validation of the binary ExtraTrees model. The very high scores apply to the sampled BR-163 pilot landscape and are not presented as Amazon-wide model performance.',
            },

            width:
              'normal',
          },
        ],
      },

      {
        id:
          'baseline-and-monitoring',

        type:
          'article',

        title:
          'From Baseline Composite to Multi-Date Monitoring',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'The operational workflow builds a cloud-reduced Sentinel-2 baseline composite and then processes monitoring imagery from the following year using the same spatial reference, output resolution and classification model. Copernicus Data Space Ecosystem provides the imagery-access route used by the configured monitoring workflow.',
          },

          {
            type:
              'paragraph',

            body:
              'For the validated run, the saved Amazon model was applied to one baseline composite and 19 corrected, cloud-masked monitoring images. This produced 20 categorical classification GeoTIFFs, all retaining the expected classes of NoData, Forest and Clearing and the native Sentinel-2 tile dimensions of 10,980 by 10,980 pixels.',
          },

          {
            type:
              'figure',

            image: {
              src:
                figure03,

              alt:
                'Amazon BR-163 Forest and Clearing classification generated from Sentinel-2 imagery.',

              width:
                989,

              height:
                867,

              caption:
                'Forest/Clearing classification from the Amazon BR-163 pilot. Forest is represented as class 1 and Clearing as class 2, with masked or unavailable pixels retained as NoData.',
            },

            width:
              'normal',
          },
        ],
      },

      {
        id:
          'change-detection-workflow',

        type:
          'article',

        title:
          'Detecting Forest-to-Clearing Change',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'Change detection compares the classified monitoring imagery against the classified baseline rather than treating every non-forest pixel as new disturbance. The configured transition logic is explicit: detect pixels moving from Forest class 1 to Clearing class 2.',
          },
          {
            type:
              'paragraph',

            body:
              'The monitoring workflow begins by querying Sentinel-2 acquisitions for tile 21MYM through Copernicus Data Space Ecosystem. A cloud-reduced 2024 composite provides the reference forest condition, while the 2025 monitoring scenes are prepared on the same spatial grid at 10 metre output resolution.',
          },

          {
            type:
              'paragraph',

            body:
              'The validated ExtraTrees model is then applied consistently to the baseline and monitoring rasters. Change detection compares those categorical outputs and retains the configured transition from Forest class 1 to Clearing class 2, allowing new clearing signals to be distinguished from areas that were already non-forest in the baseline.',
          },

          {
            type:
              'paragraph',

            body:
              'Detected transitions are accumulated into raster report products before being converted to polygon GIS features. Administrative enrichment and structured raster, classification, change and vector quality checks complete the workflow and prepare the results for spatial review and downstream analysis.',
          },

          {
            type:
              'figure',

            image: {
              src:
                figure04,

              alt:
                'Final Amazon BR-163 forest-change map showing detected change signals over the Sentinel-2 baseline landscape.',

              width:
                2166,

              height:
                2315,

              caption:
                'Accumulated 2025 forest-change detections over the 2024 Sentinel-2 baseline for tile 21MYM. Highlighted areas represent the configured Forest-to-Clearing change signal.',
            },

            width:
              'normal',
          },
        ],
      },

      {
        id:
          'operational-gis-output',

        type:
          'article',

        title:
          'Turning Change Detection into Operational GIS Data',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'The workflow continues beyond raster detection. Change results are vectorised into polygons and enriched with administrative information so that individual detections can be queried, filtered and used in downstream GIS review rather than remaining only as raster pixels.',
          },

          {
            type:
              'paragraph',

            body:
              'The validated pilot produced an enriched vector dataset containing 729,869 polygons and 32 attributes, with 100 percent administrative-area assignment reported by the project QA. This provides an operational GIS layer connecting the remote-sensing change signal to spatially attributable features.',
          },

          {
            type:
              'pull',

            body:
              'The meaningful endpoint was not a classification image; it was a traceable set of spatial change features that could move into GIS analysis and review.',
          },
        ],
      },

      {
        id:
          'quality-assurance',

        type:
          'article',

        title:
          'Quality Assurance and Reproducibility',

        blocks: [
          {
            type:
              'paragraph',

            body:
              'Quality assurance is integrated throughout the pilot rather than added only after processing. The repository documents checks for configuration, input imagery, raster integrity, class values, change-transition compatibility, vector outputs and administrative enrichment. Validation-safe execution modes also allow existing products to be inspected read-only before another processing stage is enabled.',
          },

          {
            type:
              'paragraph',

            body:
              'The implementation is deliberately described as a validated pilot for tile 21MYM. Additional Sentinel-2 tiles have not undergone the same level of validation, and the project documentation does not claim equivalent model performance across different Amazon landscapes or full cross-platform operational support.',
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
              'This project brought together Sentinel-2 earth observation, machine-learning classification, raster change detection, vector GIS processing and structured QA in a reproducible Windows-based PyEO implementation for the Amazon BR-163 pilot.',
          },

          {
            type:
              'paragraph',

            body:
              'The repository preserves the configuration templates, operational notebooks, validation utilities, documentation and workflow history used to make the pilot reproducible and auditable.',
          },
        ],
      },
    ],
  },

  homepageFeatured:
    true,

  homepageFeaturedOrder:
    undefined,

  portfolioFeatured:
    true,

  portfolioOrder:
    undefined,

  locations: [],

  mapPlacements: [
    {
      locationId:
        'country:brazil',

      scope:
        'country-wide',
    },
  ],

  challenge:
    'Build a repeatable forest-change monitoring workflow that can distinguish Forest from Clearing across multi-date Sentinel-2 imagery and convert detected transitions into validated GIS outputs.',

  approach:
    'Adapt PyEO for a controlled Windows workflow, train and validate a binary ExtraTrees classifier, build a Sentinel-2 baseline, classify monitoring imagery, detect Forest-to-Clearing transitions, vectorise the results and apply structured QA.',

  outcomes: [
    {
      title:
        'Validated pilot classifier',

      description:
        'A binary ExtraTrees Forest/Clearing model validated within the sampled BR-163 pilot landscape.',
    },

    {
      title:
        'Multi-date classification',

      description:
        'One baseline composite and 19 monitoring images were classified into a consistent categorical output set for change analysis.',
    },

    {
      title:
        'Forest-change detection',

      description:
        'Configured post-classification comparison identifies Forest-to-Clearing transitions across the 2025 monitoring period.',
    },

    {
      title:
        'Operational vector output',

      description:
        'The validated enriched output contains 729,869 change polygons, 32 attributes and complete administrative-area assignment.',
    },

    {
      title:
        'Reproducible Windows workflow',

      description:
        'Configuration, validation utilities, notebooks and documentation preserve a repeatable PyEO pilot implementation on Windows.',
    },
  ],

  gallery: [],

  downloads: [],

  repositoryUrl:
    'https://github.com/figmulberry/Amazon_BR163_PyEO',

  liveUrl:
    undefined,
} satisfies ProjectContent;