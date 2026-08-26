import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  geoDistance,
  geoGraticule10,
  geoNaturalEarth1,
  geoNaturalEarth1Raw,
  geoOrthographic,
  geoOrthographicRaw,
  geoPath,
  geoProjection,
  geoProjectionMutator,
  type GeoProjection,
} from 'd3-geo';

import {
  Link,
} from 'wouter';

import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

import {
  getMappedPortfolioProjects,
} from '@/lib/content/getPortfolioProjects';

import {
  buildDrilldownView,
} from './map/buildDrilldownView';

import {
  buildLocationIndex,
} from './map/locationHierarchy';

import {
  PORTFOLIO_LOCATIONS,
} from './map/portfolioLocations';


import {
  validatePortfolioMapData,
} from './map/validatePortfolioMapData';

import {
  ROOT_LOCATION_ID,
  type SemanticProjectRecord,
} from './map/semanticTypes';


const HERO_BACKGROUND =
  '#111820';

const LAND_COLOR =
  '#28343e';

const LAND_HOVER_COLOR =
  '#34434f';

const BORDER_COLOR =
  '#596672';

const GRID_COLOR =
  '#60707d';

const LABEL_COLOR =
  '#b8c1c8';

const ACCENT_COLOR =
  '#ff5a52';

const TEXT_COLOR =
  '#ffffff';


const DEFAULT_CENTER: [
  number,
  number,
] = [
  10,
  12,
];


const DEFAULT_ZOOM =
  1;


const MIN_ZOOM =
  1;


const MAX_ZOOM =
  10;


/*
 * =========================================================
 * AMCHARTS-STYLE CLUSTER LIFECYCLE
 * =========================================================
 *
 * These values mirror the behavior of amCharts 5
 * ClusteredPointSeries:
 *
 * minDistance: 20
 * scatterDistance: 3
 * scatterRadius: 8
 * stopClusterZoom: 0.95
 *
 * We are reproducing the interaction model in the existing
 * D3 map rather than adding amCharts as a dependency.
 * =========================================================
 */

const CLUSTER_MIN_DISTANCE =
  20;


const SCATTER_DISTANCE =
  3;


const SCATTER_RADIUS =
  8;


const STOP_CLUSTER_ZOOM =
  MAX_ZOOM *
  0.95;


const CLUSTER_REVEAL_DISTANCE =
  CLUSTER_MIN_DISTANCE *
  1.65;




const PROJECT_ACTIVATION_ZOOM =
  4;


const PROJECT_DISCOVERY_ZOOM =
  4.4;


const CAMERA_ANIMATION_DURATION =
  760;


/*
 * Country labels deliberately remain hidden
 * at the resting world view.
 *
 * They begin appearing only after the visitor
 * has deliberately zoomed into the geography.
 */
const LABEL_VISIBILITY_ZOOM =
  2.15;


/*
 * Duration of the geographic morph itself.
 *
 * The map remains visible for the entire
 * transition. Country geometry and the
 * graticule continuously change shape.
 */
const PROJECTION_MORPH_MS =
  1000;


type ProjectionMode =
  | 'map'
  | 'globe';


type CountryProperties = {
  NAME?: string;

  NAME_EN?: string;

  NAME_LONG?: string;

  ISO_A3?: string;

  LABELRANK?: number;

  MIN_ZOOM?: number;

  MIN_LABEL?: number;

  MAX_LABEL?: number;

  LABEL_X?: number;

  LABEL_Y?: number;
};


type CountryGeometry =
  | Polygon
  | MultiPolygon;


type CountryFeature =
  Feature<
    CountryGeometry,
    CountryProperties
  >;


type WorldGeoJSON =
  FeatureCollection<
    CountryGeometry,
    CountryProperties
  >;


type ProjectMarkerProperties = {
  markerId: string;

  projectId: string;

  locationId: string;

  title: string;

  slug: string;

  category: string;

  locationLabel: string;
};


type RenderedMarker = {
  key: string;

  longitude: number;

  latitude: number;

  x: number;

  y: number;

  cluster:
    boolean;

  count?:
    number;

  project?:
    ProjectMarkerProperties;

  projects:
    ProjectMarkerProperties[];
};


type SelectedProject = {
  properties:
    ProjectMarkerProperties;

  longitude:
    number;

  latitude:
    number;
};


type DragState = {
  pointerId:
    number;

  startX:
    number;

  startY:
    number;

  startCenter: [
    number,
    number,
  ];
};


function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}


function easeProjectionMorph(
  progress: number,
): number {
  /*
   * Cubic-out easing.
   *
   * The geography moves decisively at the beginning,
   * then settles progressively and gently into the
   * target projection.
   */
  const clamped =
    clamp(
      progress,
      0,
      1,
    );


  return (
    1 -
    Math.pow(
      1 -
        clamped,
      3,
    )
  );
}


function normalizeLongitude(
  longitude: number,
): number {
  let normalized =
    longitude;


  while (
    normalized >
    180
  ) {
    normalized -=
      360;
  }


  while (
    normalized <
    -180
  ) {
    normalized +=
      360;
  }


  return normalized;
}


function getCountryLabel(
  properties:
    CountryProperties,
): string {
  return (
    properties.NAME_EN ??
    properties.NAME ??
    properties.NAME_LONG ??
    ''
  );
}


function getCountryCode(
  properties:
    CountryProperties,
): string {
  const code =
    properties.ISO_A3;


  if (
    !code ||
    code ===
      '-99'
  ) {
    return '';
  }


  return code;
}


function getLabelMetadataZoom(
  zoom: number,
): number {
  return (
    1.7 +
    (
      zoom -
      1
    ) *
    0.95
  );
}


function getMaximumVisibleLabelRank(
  zoom: number,
): number {
  if (
    zoom <
    LABEL_VISIBILITY_ZOOM
  ) {
    return 0;
  }


  if (
    zoom <
    2.75
  ) {
    return 2;
  }


  if (
    zoom <
    3.45
  ) {
    return 3;
  }


  if (
    zoom <
    4.4
  ) {
    return 4;
  }


  if (
    zoom <
    5.5
  ) {
    return 5;
  }


  return 8;
}


function isCountryLabelVisible(
  feature:
    CountryFeature,

  zoom:
    number,
): boolean {
  /*
   * Absolute rule:
   * no country labels at the resting
   * global extent.
   */
  if (
    zoom <
    LABEL_VISIBILITY_ZOOM
  ) {
    return false;
  }


  const properties =
    feature.properties;


  if (
    !properties
  ) {
    return false;
  }


  const code =
    getCountryCode(
      properties,
    );


  if (
    !code
  ) {
    return false;
  }


  const labelMetadataZoom =
    getLabelMetadataZoom(
      zoom,
    );


  const minimum =
    properties.MIN_LABEL ??
    properties.MIN_ZOOM ??
    0;


  const maximum =
    properties.MAX_LABEL ??
    Number.POSITIVE_INFINITY;


  if (
    labelMetadataZoom <
      minimum ||
    labelMetadataZoom >
      maximum
  ) {
    return false;
  }


  const rank =
    properties.LABELRANK ??
    99;


  const maximumRank =
    getMaximumVisibleLabelRank(
      zoom,
    );


  return (
    rank <=
    maximumRank
  );
}


function isVisibleOnGlobe(
  longitude:
    number,

  latitude:
    number,

  center: [
    number,
    number,
  ],
): boolean {
  const distance =
    geoDistance(
      [
        longitude,
        latitude,
      ],
      center,
    );


  return (
    distance <=
    Math.PI /
      2
  );
}


export default function PortfolioMap() {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  const svgRef =
    useRef<SVGSVGElement | null>(
      null,
    );


  const dragRef =
    useRef<DragState | null>(
      null,
    );


  const cameraFrameRef =
    useRef<
      number |
      null
    >(
      null,
    );


  const morphFrameRef =
    useRef<
      number |
      null
    >(
      null,
    );


  const morphStartRef =
    useRef<
      number |
      null
    >(
      null,
    );


  const morphProjectionRef =
    useRef<
      GeoProjection |
      null
    >(
      null,
    );


  const morphMutateRef =
    useRef<
      ((
        progress:
          number,
      ) =>
        GeoProjection) |
      null
    >(
      null,
    );


  const [
    width,
    setWidth,
  ] =
    useState(
      0,
    );


  const [
    height,
    setHeight,
  ] =
    useState(
      0,
    );


  const [
    world,
    setWorld,
  ] =
    useState<WorldGeoJSON | null>(
      null,
    );


  const [
    projectionMode,
    setProjectionMode,
  ] =
    useState<ProjectionMode>(
      'map',
    );


  const [
    center,
    setCenter,
  ] =
    useState<
      [
        number,
        number,
      ]
    >(
      DEFAULT_CENTER,
    );


  const [
    zoom,
    setZoom,
  ] =
    useState(
      DEFAULT_ZOOM,
    );


  const [
    isProjectionTransitioning,
    setIsProjectionTransitioning,
  ] =
    useState(
      false,
    );


  const [
    projectionRenderTick,
    setProjectionRenderTick,
  ] =
    useState(
      0,
    );


  const [
    hoveredCountry,
    setHoveredCountry,
  ] =
    useState<
      string |
      null
    >(
      null,
    );


  const [
    selectedProject,
    setSelectedProject,
  ] =
    useState<SelectedProject | null>(
      null,
    );


  /*
   * =====================================================
   * EXPANDED PROJECT CLUSTER
   * =====================================================
   *
   * When a cluster survives at maximum geographic zoom,
   * its projects are expanded around the real projected
   * cluster origin so every project remains selectable.
   */
  const [
    expandedClusterKey,
    setExpandedClusterKey,
  ] =
    useState<
      string |
      null
    >(
      null,
    );


  /*
   * Panning, zooming, returning Home, resizing through a
   * camera update, or switching projection closes any
   * screen-space expansion.
   */
  useEffect(
    () => {
      setExpandedClusterKey(
        null,
      );
    },
    [
      center,
      projectionMode,
      zoom,
    ],
  );


  /*
   * =====================================================
   * RESPONSIVE CONTAINER
   * =====================================================
   */


  useEffect(
    () => {
      const element =
        containerRef.current;


      if (
        !element
      ) {
        return;
      }


      const updateSize =
        () => {
          const rect =
            element
              .getBoundingClientRect();


          setWidth(
            Math.max(
              1,
              rect.width,
            ),
          );


          setHeight(
            Math.max(
              1,
              rect.height,
            ),
          );
        };


      updateSize();


      const observer =
        new ResizeObserver(
          updateSize,
        );


      observer.observe(
        element,
      );


      return () => {
        observer.disconnect();
      };
    },
    [],
  );


  /*
   * =====================================================
   * COUNTRY GEOGRAPHY
   * =====================================================
   */


  useEffect(
    () => {
      const controller =
        new AbortController();


      fetch(
        '/data/portfolio/world-countries.geojson',
        {
          signal:
            controller.signal,
        },
      )
        .then(
          (
            response,
          ) => {
            if (
              !response.ok
            ) {
              throw new Error(
                `World geography failed to load: ${response.status}`,
              );
            }


            return response.json();
          },
        )
        .then(
          (
            data:
              WorldGeoJSON,
          ) => {
            setWorld(
              data,
            );
          },
        )
        .catch(
          (
            error:
              unknown,
          ) => {
            if (
              error instanceof
                DOMException &&
              error.name ===
                'AbortError'
            ) {
              return;
            }


            console.error(
              '[PortfolioMap] World geography error:',
              error,
            );
          },
        );


      return () => {
        controller.abort();
      };
    },
    [],
  );


  /*
   * =====================================================
   * PROJECTION MORPH CLEANUP
   * =====================================================
   */


  useEffect(
    () => {
      return () => {
        if (
          cameraFrameRef.current !==
          null
        ) {
          window.cancelAnimationFrame(
            cameraFrameRef.current,
          );

          cameraFrameRef.current =
            null;
        }


        if (
          morphFrameRef.current !==
          null
        ) {
          window.cancelAnimationFrame(
            morphFrameRef.current,
          );
        }


        morphFrameRef.current =
          null;


        morphStartRef.current =
          null;


        morphProjectionRef.current =
          null;


        morphMutateRef.current =
          null;
      };
    },
    [],
  );


  /*
   * =====================================================
   * SEMANTIC PORTFOLIO MAP ADAPTER
   * =====================================================
   *
   * Save 3A establishes the semantic hierarchy beside the
   * existing working marker renderer.
   *
   * Visible map behavior remains unchanged in this phase.
   * =====================================================
   */

  const mappedPortfolioProjects =
    useMemo(
      () => {
        const projects =
          getMappedPortfolioProjects();


        validatePortfolioMapData({
          locations:
            PORTFOLIO_LOCATIONS,

          projects,
        });


        return projects;
      },
      [],
    );


  const semanticLocationIndex =
    useMemo(
      () =>
        buildLocationIndex(
          PORTFOLIO_LOCATIONS,
        ),
      [],
    );


  const semanticProjects =
    useMemo<
      SemanticProjectRecord[]
    >(
      () =>
        mappedPortfolioProjects.map(
          (
            project,
          ) => ({
            projectId:
              project.id,

            title:
              project.title,

            slug:
              project.slug,

            category:
              project.category,

            placements:
              project.mapPlacements ??
              [],
          }),
        ),
      [
        mappedPortfolioProjects,
      ],
    );


  const [
    currentSemanticLocationId,
    setCurrentSemanticLocationId,
  ] =
    useState(
      ROOT_LOCATION_ID,
    );


  const semanticDrilldownView =
    useMemo(
      () =>
        buildDrilldownView({
          index:
            semanticLocationIndex,

          currentLocationId:
            currentSemanticLocationId,

          projects:
            semanticProjects,
        }),
      [
        currentSemanticLocationId,
        semanticLocationIndex,
        semanticProjects,
      ],
    );


  useEffect(
    () => {
      if (
        semanticLocationIndex
          .byId
          .has(
            currentSemanticLocationId,
          )
      ) {
        return;
      }


      setCurrentSemanticLocationId(
        ROOT_LOCATION_ID,
      );
    },
    [
      currentSemanticLocationId,
      semanticLocationIndex,
    ],
  );


  useEffect(
    () => {
      const knownProjectIds =
        new Set(
          semanticProjects.map(
            (
              project,
            ) =>
              project.projectId,
          ),
        );


      semanticDrilldownView
        .visibleProjectIds
        .forEach(
          (
            projectId,
          ) => {
            if (
              knownProjectIds.has(
                projectId,
              )
            ) {
              return;
            }


            throw new Error(
              `Semantic portfolio map exposed unknown project: ${projectId}`,
            );
          },
        );
    },
    [
      semanticDrilldownView,
      semanticProjects,
    ],
  );


  /*
   * =====================================================
   * REAL PROJECT DATA
   * =====================================================
   */


  /*
   * =====================================================
   * PERMANENT SEMANTIC PROJECT POINT DATASET
   * =====================================================
   *
   * Equivalent to amCharts keeping every original dataItem
   * in the ClusteredPointSeries.
   *
   * Camera movement changes projected positions.
   * Clustering changes presentation.
   *
   * Neither operation removes unrelated projects.
   * =====================================================
   */

  const projectFeatures =
    useMemo(
      () => {
        const features:
          Array<
            Feature<
              Point,
              ProjectMarkerProperties
            >
          > =
          [];


        mappedPortfolioProjects.forEach(
          (
            project,
          ) => {
            const placements =
              project.mapPlacements ??
              [];


            /*
             * Preferred path:
             * semantic location registry.
             */
            if (
              placements.length >
              0
            ) {
              placements.forEach(
                (
                  placement,
                ) => {
                  const location =
                    semanticLocationIndex
                      .byId
                      .get(
                        placement.locationId,
                      );


                  if (
                    !location
                  ) {
                    throw new Error(
                      `Unknown semantic portfolio location: ${placement.locationId}`,
                    );
                  }


                  const markerId =
                    `${project.id}:${location.id}`;


                  features.push({
                    type:
                      'Feature',

                    geometry: {
                      type:
                        'Point',

                      coordinates: [
                        location.anchor[0],
                        location.anchor[1],
                      ],
                    },

                    properties: {
                      markerId,

                      projectId:
                        project.id,

                      locationId:
                        location.id,

                      title:
                        project.title,

                      slug:
                        project.slug,

                      category:
                        project.category,

                      locationLabel:
                        location.label,
                    },
                  });
                },
              );


              return;
            }


            /*
             * Migration fallback.
             *
             * A future project that has not yet received
             * mapPlacements still appears through its legacy
             * coordinates rather than silently disappearing.
             */
            project.locations.forEach(
              (
                location,
              ) => {
                const markerId =
                  `${project.id}:${location.id}`;


                features.push({
                  type:
                    'Feature',

                  geometry: {
                    type:
                      'Point',

                    coordinates: [
                      location.longitude,
                      location.latitude,
                    ],
                  },

                  properties: {
                    markerId,

                    projectId:
                      project.id,

                    locationId:
                      location.id,

                    title:
                      project.title,

                    slug:
                      project.slug,

                    category:
                      project.category,

                    locationLabel:
                      location.label,
                  },
                });
              },
            );
          },
        );






        return features;
      },
      [
        mappedPortfolioProjects,
        semanticLocationIndex,
      ],
    );


  /*
   * =====================================================
   * PROJECTION
   * =====================================================
   *
   * Both settled modes and the live morph use the same
   * fitted endpoint scale and translation values.
   *
   * During a transition:
   *
   * - one geoProjectionMutator is created;
   * - one blended GeoProjection is created;
   * - that same projection object survives every frame;
   * - its raw projection, scale, translation and rotation
   *   are updated together;
   * - React is used only to redraw paths and points.
   * =====================================================
   */


  const fittedProjectionStates =
    useMemo(
      () => {
        if (
          !world ||
          width <=
            0 ||
          height <=
            0
        ) {
          return null;
        }


        const extent: [
          [
            number,
            number,
          ],
          [
            number,
            number,
          ],
        ] = [
          [
            18,
            38,
          ],
          [
            width -
              18,
            height -
              32,
          ],
        ];


        const createFittedState =
          (
            rawProjection:
              typeof geoNaturalEarth1Raw,
          ) => {
            const fitted =
              geoProjection(
                rawProjection,
              )
                .precision(
                  0.5,
                )
                .fitExtent(
                  extent,
                  world,
                );


            const translate =
              fitted.translate();


            return {
              scale:
                fitted.scale(),

              translate: [
                translate[0],
                translate[1],
              ] as [
                number,
                number,
              ],
            };
          };


        return {
          map:
            createFittedState(
              geoNaturalEarth1Raw,
            ),

          globe:
            createFittedState(
              geoOrthographicRaw,
            ),
        };
      },
      [
        height,
        width,
        world,
      ],
    );


  const mapProjection =
    useMemo(
      () => {
        if (
          !fittedProjectionStates
        ) {
          return null;
        }


        return geoNaturalEarth1()
          .translate(
            fittedProjectionStates
              .map
              .translate,
          )
          .scale(
            fittedProjectionStates
              .map
              .scale *
              zoom,
          )
          .rotate([
            -center[0],
            -center[1],
            0,
          ])
          .precision(
            0.2,
          );
      },
      [
        center,
        fittedProjectionStates,
        zoom,
      ],
    );


  const globeProjection =
    useMemo(
      () => {
        if (
          !fittedProjectionStates
        ) {
          return null;
        }


        return geoOrthographic()
          .translate(
            fittedProjectionStates
              .globe
              .translate,
          )
          .scale(
            fittedProjectionStates
              .globe
              .scale *
              zoom,
          )
          .rotate([
            -center[0],
            -center[1],
            0,
          ])
          .clipAngle(
            90,
          )
          .precision(
            0.2,
          );
      },
      [
        center,
        fittedProjectionStates,
        zoom,
      ],
    );


  const activeProjection =
    useMemo(
      () => {
        /*
         * Reading the tick is intentional.
         *
         * The mutable morph projection retains object
         * identity, but this changing value asks React
         * to recalculate all path strings and projected
         * point positions after each in-place mutation.
         */
        void projectionRenderTick;


        if (
          isProjectionTransitioning &&
          morphProjectionRef.current
        ) {
          return morphProjectionRef.current;
        }


        return projectionMode ===
          'map'
          ? mapProjection
          : globeProjection;
      },
      [
        globeProjection,
        isProjectionTransitioning,
        mapProjection,
        projectionMode,
        projectionRenderTick,
      ],
    );


  const projectPoint =
    useCallback(
      (
        coordinates: [
          number,
          number,
        ],
      ):
        | [
            number,
            number,
          ]
        | null => {
        /*
         * Include the redraw tick so projected markers and
         * screen-space clusters follow the in-place mutable
         * projection on every animation frame.
         */
        void projectionRenderTick;


        if (
          !activeProjection
        ) {
          return null;
        }


        return activeProjection(
          coordinates,
        );
      },
      [
        activeProjection,
        projectionRenderTick,
      ],
    );


  const pathGenerator =
    useMemo(
      () => {
        /*
         * The D3 path generator references the same
         * persistent projection during the morph.
         */
        void projectionRenderTick;


        if (
          !activeProjection
        ) {
          return null;
        }


        return geoPath(
          activeProjection,
        );
      },
      [
        activeProjection,
        projectionRenderTick,
      ],
    );


  /*
   * =====================================================
   * PROJECT CLUSTERS
   * =====================================================
   *
   * Clustering is performed in projected SCREEN SPACE.
   *
   * A project's geographic coordinates are first passed
   * through the currently active D3 projection. Nearby
   * resulting screen positions are then grouped using a
   * 20-pixel proximity threshold.
   *
   * This makes clustering respond directly to:
   *
   * - current projection,
   * - current zoom,
   * - current pan/rotation,
   * - current viewport geometry.
   *
   * It also means Map and Globe naturally derive their
   * clusters from what the visitor can actually see.
   * =====================================================
   */


  /*
   * =====================================================
   * AMCHARTS-STYLE PROJECT CLUSTERING
   * =====================================================
   *
   * Derived from the observed ClusteredPointSeries lifecycle:
   *
   * 1. keep all source points;
   * 2. re-project on camera change;
   * 3. cluster projected points using a spatial grid + BFS;
   * 4. stop normal clustering near maximum zoom;
   * 5. scatter only extremely close points.
   * =====================================================
   */

  const renderedMarkers =
    useMemo<
      RenderedMarker[]
    >(
      () => {
        if (
          !projectPoint
        ) {
          return [];
        }


        type Candidate = {
          properties:
            ProjectMarkerProperties;

          longitude:
            number;

          latitude:
            number;

          x:
            number;

          y:
            number;
        };


        const candidates:
          Candidate[] =
          [];


        projectFeatures.forEach(
          (
            feature,
          ) => {
            const [
              longitude,
              latitude,
            ] =
              feature
                .geometry
                .coordinates;


            /*
             * Preserve the current globe-side clipping rule.
             */
            if (
              projectionMode ===
                'globe' &&
              !isProjectionTransitioning &&
              !isVisibleOnGlobe(
                longitude,
                latitude,
                center,
              )
            ) {
              return;
            }


            const point =
              projectPoint([
                longitude,
                latitude,
              ]);


            if (
              !point
            ) {
              return;
            }


            const [
              x,
              y,
            ] =
              point;


            if (
              !Number.isFinite(
                x,
              ) ||
              !Number.isFinite(
                y,
              )
            ) {
              return;
            }


            candidates.push({
              properties:
                feature.properties,

              longitude,

              latitude,

              x,

              y,
            });
          },
        );


        /*
         * -----------------------------------------------
         * Shared spatial-grid/BFS component builder.
         * -----------------------------------------------
         */

        const buildComponents =
          (
            distance:
              number,
          ):
            number[][] => {
            if (
              candidates.length ===
              0
            ) {
              return [];
            }


            const distanceSquared =
              distance *
              distance;


            const grid =
              new Map<
                string,
                number[]
              >();


            candidates.forEach(
              (
                candidate,
                candidateIndex,
              ) => {
                const cellX =
                  Math.floor(
                    candidate.x /
                      distance,
                  );

                const cellY =
                  Math.floor(
                    candidate.y /
                      distance,
                  );

                const key =
                  `${cellX}:${cellY}`;

                const existing =
                  grid.get(
                    key,
                  );


                if (
                  existing
                ) {
                  existing.push(
                    candidateIndex,
                  );
                }
                else {
                  grid.set(
                    key,
                    [
                      candidateIndex,
                    ],
                  );
                }
              },
            );


            const visited =
              new Uint8Array(
                candidates.length,
              );


            const components:
              number[][] =
              [];


            for (
              let startIndex =
                0;
              startIndex <
                candidates.length;
              startIndex +=
                1
            ) {
              if (
                visited[
                  startIndex
                ]
              ) {
                continue;
              }


              visited[
                startIndex
              ] =
                1;


              const component:
                number[] =
                [
                  startIndex,
                ];


              const queue:
                number[] =
                [
                  startIndex,
                ];


              let queueIndex =
                0;


              while (
                queueIndex <
                queue.length
              ) {
                const currentIndex =
                  queue[
                    queueIndex
                  ];


                queueIndex +=
                  1;


                const current =
                  candidates[
                    currentIndex
                  ];


                const currentCellX =
                  Math.floor(
                    current.x /
                      distance,
                  );

                const currentCellY =
                  Math.floor(
                    current.y /
                      distance,
                  );


                for (
                  let offsetX =
                    -1;
                  offsetX <=
                    1;
                  offsetX +=
                    1
                ) {
                  for (
                    let offsetY =
                      -1;
                    offsetY <=
                      1;
                    offsetY +=
                      1
                  ) {
                    const neighborCell =
                      grid.get(
                        `${
                          currentCellX +
                          offsetX
                        }:${
                          currentCellY +
                          offsetY
                        }`,
                      );


                    if (
                      !neighborCell
                    ) {
                      continue;
                    }


                    neighborCell.forEach(
                      (
                        neighborIndex,
                      ) => {
                        if (
                          visited[
                            neighborIndex
                          ]
                        ) {
                          return;
                        }


                        const neighbor =
                          candidates[
                            neighborIndex
                          ];


                        const deltaX =
                          neighbor.x -
                          current.x;

                        const deltaY =
                          neighbor.y -
                          current.y;


                        if (
                          deltaX *
                            deltaX +
                            deltaY *
                            deltaY >=
                          distanceSquared
                        ) {
                          return;
                        }


                        visited[
                          neighborIndex
                        ] =
                          1;


                        component.push(
                          neighborIndex,
                        );


                        queue.push(
                          neighborIndex,
                        );
                      },
                    );
                  }
                }
              }


              components.push(
                component,
              );
            }


            return components;
          };


        /*
         * -----------------------------------------------
         * TERMINAL SCATTER MODE
         * -----------------------------------------------
         *
         * amCharts stops clustering near max zoom and then
         * scatters extremely-close projected points.
         *
         * We use the same 3px grouping threshold and an
         * 8px collision radius.
         * -----------------------------------------------
         */

        if (
          zoom >=
          STOP_CLUSTER_ZOOM
        ) {
          const scatterComponents =
            buildComponents(
              SCATTER_DISTANCE,
            );


          const markers:
            RenderedMarker[] =
            [];


          scatterComponents.forEach(
            (
              component,
            ) => {
              if (
                component.length ===
                1
              ) {
                const candidate =
                  candidates[
                    component[0]
                  ];


                markers.push({
                  key:
                    candidate
                      .properties
                      .markerId,

                  longitude:
                    candidate.longitude,

                  latitude:
                    candidate.latitude,

                  x:
                    candidate.x,

                  y:
                    candidate.y,

                  cluster:
                    false,

                  project:
                    candidate.properties,

                  projects: [
                    candidate.properties,
                  ],
                });


                return;
              }


              /*
               * Deterministic spiral placement.
               *
               * This mirrors amCharts' collision-avoiding
               * spiral concept without importing its layout
               * internals.
               */
              const placed:
                Array<{
                  x:
                    number;

                  y:
                    number;
                }> =
                [];


              component.forEach(
                (
                  candidateIndex,
                  memberIndex,
                ) => {
                  const candidate =
                    candidates[
                      candidateIndex
                    ];


                  let attempt =
                    memberIndex;

                  let offsetX =
                    0;

                  let offsetY =
                    0;

                  let accepted =
                    false;


                  while (
                    !accepted &&
                    attempt <
                      500
                  ) {
                    if (
                      attempt ===
                      0
                    ) {
                      offsetX =
                        0;

                      offsetY =
                        0;
                    }
                    else {
                      const angle =
                        attempt *
                        2.399963229728653;

                      const radius =
                        SCATTER_RADIUS *
                        1.35 *
                        Math.sqrt(
                          attempt,
                        );


                      offsetX =
                        Math.cos(
                          angle,
                        ) *
                        radius;

                      offsetY =
                        Math.sin(
                          angle,
                        ) *
                        radius;
                    }


                    accepted =
                      placed.every(
                        (
                          prior,
                        ) => {
                          const dx =
                            offsetX -
                            prior.x;

                          const dy =
                            offsetY -
                            prior.y;


                          return (
                            dx *
                              dx +
                              dy *
                              dy >=
                            (
                              SCATTER_RADIUS *
                              2
                            ) **
                              2
                          );
                        },
                      );


                    if (
                      !accepted
                    ) {
                      attempt +=
                        1;
                    }
                  }


                  placed.push({
                    x:
                      offsetX,

                    y:
                      offsetY,
                  });


                  markers.push({
                    key:
                      `scatter:${candidate.properties.markerId}`,

                    longitude:
                      candidate.longitude,

                    latitude:
                      candidate.latitude,

                    x:
                      candidate.x +
                      offsetX,

                    y:
                      candidate.y +
                      offsetY,

                    cluster:
                      false,

                    project:
                      candidate.properties,

                    projects: [
                      candidate.properties,
                    ],
                  });
                },
              );
            },
          );


          return markers;
        }


        /*
         * -----------------------------------------------
         * NORMAL 20PX CLUSTER MODE
         * -----------------------------------------------
         */

        const components =
          buildComponents(
            CLUSTER_MIN_DISTANCE,
          );


        const markers:
          RenderedMarker[] =
          [];


        components.forEach(
          (
            component,
          ) => {
            if (
              component.length ===
              1
            ) {
              const candidate =
                candidates[
                  component[0]
                ];


              markers.push({
                key:
                  candidate
                    .properties
                    .markerId,

                longitude:
                  candidate.longitude,

                latitude:
                  candidate.latitude,

                x:
                  candidate.x,

                y:
                  candidate.y,

                cluster:
                  false,

                project:
                  candidate.properties,

                projects: [
                  candidate.properties,
                ],
              });


              return;
            }


            let xTotal =
              0;

            let yTotal =
              0;

            let longitudeTotal =
              0;

            let latitudeTotal =
              0;


            const projects:
              ProjectMarkerProperties[] =
              [];


            component.forEach(
              (
                candidateIndex,
              ) => {
                const candidate =
                  candidates[
                    candidateIndex
                  ];


                xTotal +=
                  candidate.x;

                yTotal +=
                  candidate.y;

                longitudeTotal +=
                  candidate.longitude;

                latitudeTotal +=
                  candidate.latitude;


                projects.push(
                  candidate.properties,
                );
              },
            );


            const count =
              component.length;


            const stableIds =
              projects
                .map(
                  (
                    project,
                  ) =>
                    project.markerId,
                )
                .sort()
                .join(
                  '|',
                );


            markers.push({
              key:
                `cluster:${stableIds}`,

              longitude:
                longitudeTotal /
                count,

              latitude:
                latitudeTotal /
                count,

              x:
                xTotal /
                count,

              y:
                yTotal /
                count,

              cluster:
                true,

              count,

              projects,
            });
          },
        );


        return markers;
      },
      [
        center,
        isProjectionTransitioning,
        projectFeatures,
        projectPoint,
        projectionMode,
        zoom,
      ],
    );


  /*
   * =====================================================
   * COUNTRY LABELS
   * =====================================================
   */


  const countryLabels =
    useMemo(
      () => {
        if (
          !world ||
          !projectPoint ||
          isProjectionTransitioning ||
          zoom <
            LABEL_VISIBILITY_ZOOM
        ) {
          return [];
        }


        return world.features
          .filter(
            (
              feature,
            ) =>
              isCountryLabelVisible(
                feature,
                zoom,
              ),
          )
          .flatMap(
            (
              feature,
            ) => {
              const properties =
                feature.properties;


              if (
                !properties
              ) {
                return [];
              }


              const longitude =
                properties.LABEL_X;


              const latitude =
                properties.LABEL_Y;


              if (
                typeof longitude !==
                  'number' ||
                typeof latitude !==
                  'number'
              ) {
                return [];
              }


              if (
                projectionMode ===
                  'globe' &&
                !isVisibleOnGlobe(
                  longitude,
                  latitude,
                  center,
                )
              ) {
                return [];
              }


              const point =
                projectPoint([
                  longitude,
                  latitude,
                ]);


              if (
                !point
              ) {
                return [];
              }


              const code =
                getCountryCode(
                  properties,
                );


              if (
                !code
              ) {
                return [];
              }


              return [
                {
                  key:
                    `${code}-${longitude}-${latitude}`,

                  label:
                    code,

                  x:
                    point[0],

                  y:
                    point[1],

                  rank:
                    properties.LABELRANK ??
                    99,
                },
              ];
            },
          );
      },
      [
        center,
        isProjectionTransitioning,
        projectPoint,
        projectionMode,
        world,
        zoom,
      ],
    );


  /*
   * =====================================================
   * CONTROLS
   * =====================================================
   */


  const goHome =
    useCallback(
      () => {
        setCenter(
          DEFAULT_CENTER,
        );


        setZoom(
          DEFAULT_ZOOM,
        );


        setHoveredCountry(
          null,
        );


        setSelectedProject(
          null,
        );
      },
      [],
    );


  const zoomIn =
    useCallback(
      () => {
        setZoom(
          (
            current,
          ) =>
            clamp(
              current *
                1.38,
              MIN_ZOOM,
              MAX_ZOOM,
            ),
        );
      },
      [],
    );


  const zoomOut =
    useCallback(
      () => {
        setZoom(
          (
            current,
          ) =>
            clamp(
              current /
                1.38,
              MIN_ZOOM,
              MAX_ZOOM,
            ),
        );
      },
      [],
    );


  const changeProjection =
    useCallback(
      (
        next:
          ProjectionMode,
      ) => {
        if (
          next ===
            projectionMode ||
          isProjectionTransitioning ||
          !world ||
          !fittedProjectionStates
        ) {
          return;
        }


        /*
         * Projection changes always begin at the
         * canonical Home camera.
         */
        setCenter(
          DEFAULT_CENTER,
        );


        setZoom(
          DEFAULT_ZOOM,
        );


        setHoveredCountry(
          null,
        );


        setSelectedProject(
          null,
        );


        if (
          morphFrameRef.current !==
          null
        ) {
          window.cancelAnimationFrame(
            morphFrameRef.current,
          );


          morphFrameRef.current =
            null;
        }


        const sourceMode =
          projectionMode;


        const sourceRaw =
          sourceMode ===
            'map'
            ? geoNaturalEarth1Raw
            : geoOrthographicRaw;


        const targetRaw =
          next ===
            'map'
            ? geoNaturalEarth1Raw
            : geoOrthographicRaw;


        const sourceState =
          fittedProjectionStates[
            sourceMode
          ];


        const targetState =
          fittedProjectionStates[
            next
          ];


        /*
         * geoProjectionMutator owns the raw interpolation.
         *
         * The public D3 typings expose a zero-argument
         * return signature, so we narrow it to the actual
         * progress-based mutator produced by this factory.
         */
        const mutate =
          geoProjectionMutator(
            (
              blend:
                number,
            ) => {
              return (
                lambda:
                  number,

                phi:
                  number,
              ): [
                number,
                number,
              ] => {
                const sourcePoint =
                  sourceRaw(
                    lambda,
                    phi,
                  );


                const targetPoint =
                  targetRaw(
                    lambda,
                    phi,
                  );


                return [
                  (
                    1 -
                    blend
                  ) *
                    sourcePoint[0] +
                    blend *
                    targetPoint[0],

                  (
                    1 -
                    blend
                  ) *
                    sourcePoint[1] +
                    blend *
                    targetPoint[1],
                ];
              };
            },
          ) as unknown as (
            progress:
              number,
          ) =>
            GeoProjection;


        /*
         * Initialize exactly once at the source endpoint.
         * Subsequent calls to mutate(progress) update and
         * return this same projection object.
         */
        const blended =
          mutate(
            0,
          );


        blended
          .scale(
            sourceState
              .scale,
          )
          .translate(
            sourceState
              .translate,
          )
          .rotate([
            -DEFAULT_CENTER[0],
            -DEFAULT_CENTER[1],
            0,
          ])
          .precision(
            0.5,
          );


        morphProjectionRef.current =
          blended;


        morphMutateRef.current =
          mutate;


        morphStartRef.current =
          null;


        setIsProjectionTransitioning(
          true,
        );


        /*
         * Show the initialized persistent projection
         * immediately.
         */
        setProjectionRenderTick(
          (
            value,
          ) =>
            value +
            1,
        );


        const animate =
          (
            timestamp:
              number,
          ) => {
            if (
              morphStartRef.current ===
              null
            ) {
              morphStartRef.current =
                timestamp;
            }


            const elapsed =
              timestamp -
              morphStartRef.current;


            const rawProgress =
              clamp(
                elapsed /
                  PROJECTION_MORPH_MS,
                0,
                1,
              );


            /*
             * One eased progress value drives every
             * animated projection property.
             */
            const progress =
              easeProjectionMorph(
                rawProgress,
              );


            const activeMutate =
              morphMutateRef.current;


            if (
              !activeMutate
            ) {
              return;
            }


            const activeMorph =
              activeMutate(
                progress,
              );


            morphProjectionRef.current =
              activeMorph;


            const scale =
              sourceState
                .scale +
              (
                targetState
                  .scale -
                sourceState
                  .scale
              ) *
                progress;


            const translateX =
              sourceState
                .translate[0] +
              (
                targetState
                  .translate[0] -
                sourceState
                  .translate[0]
              ) *
                progress;


            const translateY =
              sourceState
                .translate[1] +
              (
                targetState
                  .translate[1] -
                sourceState
                  .translate[1]
              ) *
                progress;


            activeMorph
              .scale(
                scale,
              )
              .translate([
                translateX,
                translateY,
              ])
              .rotate([
                -DEFAULT_CENTER[0],
                -DEFAULT_CENTER[1],
                0,
              ])
              .precision(
                0.5,
              );


            setProjectionRenderTick(
              (
                value,
              ) =>
                value +
                1,
            );


            if (
              rawProgress <
              1
            ) {
              morphFrameRef.current =
                window
                  .requestAnimationFrame(
                    animate,
                  );


              return;
            }


            /*
             * Hand off to the genuine settled target
             * projection. Orthographic clipping is
             * therefore applied by geoOrthographic()
             * itself, not by an improvised mid-morph
             * clip-angle animation.
             */
            setProjectionMode(
              next,
            );


            setIsProjectionTransitioning(
              false,
            );


            morphStartRef.current =
              null;


            morphFrameRef.current =
              null;


            morphProjectionRef.current =
              null;


            morphMutateRef.current =
              null;


            setProjectionRenderTick(
              (
                value,
              ) =>
                value +
                1,
            );
          };


        morphFrameRef.current =
          window
            .requestAnimationFrame(
              animate,
            );
      },
      [
        fittedProjectionStates,
        isProjectionTransitioning,
        projectionMode,
        world,
      ],
    );


  const enterFullscreen =
    useCallback(
      async () => {
        const element =
          containerRef.current;


        if (
          !element
        ) {
          return;
        }


        if (
          document.fullscreenElement
        ) {
          await document
            .exitFullscreen();


          return;
        }


        await element
          .requestFullscreen();
      },
      [],
    );


  /*
   * =====================================================
   * DRAG
   * =====================================================
   */


  const handlePointerDown =
    useCallback(
      (
        event:
          React.PointerEvent<
            SVGSVGElement
          >,
      ) => {
        if (
          isProjectionTransitioning
        ) {
          return;
        }


        event
          .currentTarget
          .setPointerCapture(
            event.pointerId,
          );


        dragRef.current =
        {
          pointerId:
            event.pointerId,

          startX:
            event.clientX,

          startY:
            event.clientY,

          startCenter: [
            center[0],
            center[1],
          ],
        };
      },
      [
        center,
        isProjectionTransitioning,
      ],
    );


  const handlePointerMove =
    useCallback(
      (
        event:
          React.PointerEvent<
            SVGSVGElement
          >,
      ) => {
        const drag =
          dragRef.current;


        if (
          !drag ||
          drag.pointerId !==
            event.pointerId ||
          isProjectionTransitioning
        ) {
          return;
        }


        const deltaX =
          event.clientX -
          drag.startX;


        const deltaY =
          event.clientY -
          drag.startY;


        const longitudePerPixel =
          165 /
          Math.max(
            width *
              zoom,
            1,
          );


        const latitudePerPixel =
          95 /
          Math.max(
            height *
              zoom,
            1,
          );


        const nextLongitude =
          normalizeLongitude(
            drag
              .startCenter[0] -
            deltaX *
              longitudePerPixel,
          );


        const nextLatitude =
          clamp(
            drag
              .startCenter[1] +
            deltaY *
              latitudePerPixel,
            -80,
            80,
          );


        setCenter([
          nextLongitude,
          nextLatitude,
        ]);
      },
      [
        height,
        isProjectionTransitioning,
        width,
        zoom,
      ],
    );


  const finishDrag =
    useCallback(
      (
        event:
          React.PointerEvent<
            SVGSVGElement
          >,
      ) => {
        if (
          dragRef.current
            ?.pointerId ===
          event.pointerId
        ) {
          dragRef.current =
            null;
        }
      },
      [],
    );


  const handleNativeWheel =
    useCallback(
      (
        event:
          WheelEvent,
      ) => {
        event.preventDefault();


        if (
          isProjectionTransitioning
        ) {
          return;
        }


        const factor =
          event.deltaY <
          0
            ? 1.16
            : 1 /
              1.16;


        setZoom(
          (
            current,
          ) =>
            clamp(
              current *
                factor,
              MIN_ZOOM,
              MAX_ZOOM,
            ),
        );
      },
      [
        isProjectionTransitioning,
      ],
    );


  useEffect(
    () => {
      const svg =
        svgRef.current;


      if (
        !svg
      ) {
        return;
      }


      svg.addEventListener(
        'wheel',
        handleNativeWheel,
        {
          passive: false,
        },
      );


      return () => {
        svg.removeEventListener(
          'wheel',
          handleNativeWheel,
        );
      };
    },
    [
      handleNativeWheel,
    ],
  );




  /*
   * =====================================================
   * GEOGRAPHIC CAMERA
   * =====================================================
   *
   * Portfolio discovery uses one shared animated camera.
   *
   * The camera interpolates:
   *   - longitude
   *   - latitude
   *   - zoom
   *
   * Longitude always follows the shortest route across
   * the international date line.
   */


  const animateCamera =
    useCallback(
      (
        targetCenter:
          [
            number,
            number,
          ],

        targetZoom:
          number,
      ) => {
        if (
          cameraFrameRef.current !==
          null
        ) {
          window.cancelAnimationFrame(
            cameraFrameRef.current,
          );

          cameraFrameRef.current =
            null;
        }


        const sourceLongitude =
          center[0];

        const sourceLatitude =
          center[1];

        const sourceZoom =
          zoom;


        const destinationLongitude =
          targetCenter[0];

        const destinationLatitude =
          clamp(
            targetCenter[1],
            -82,
            82,
          );

        const destinationZoom =
          clamp(
            targetZoom,
            MIN_ZOOM,
            MAX_ZOOM,
          );


        /*
         * Find the shortest longitudinal path.
         *
         * Example:
         *   +175 -> -175
         *
         * must travel 10 degrees across the date line,
         * not 350 degrees around the world.
         */
        let longitudeDelta =
          destinationLongitude -
          sourceLongitude;


        if (
          longitudeDelta >
          180
        ) {
          longitudeDelta -=
            360;
        }
        else if (
          longitudeDelta <
          -180
        ) {
          longitudeDelta +=
            360;
        }


        const latitudeDelta =
          destinationLatitude -
          sourceLatitude;

        const zoomDelta =
          destinationZoom -
          sourceZoom;


        const startedAt =
          performance.now();


        const normalizeLongitude =
          (
            longitude:
              number,
          ) => {
            let normalized =
              longitude;


            while (
              normalized >
              180
            ) {
              normalized -=
                360;
            }


            while (
              normalized <
              -180
            ) {
              normalized +=
                360;
            }


            return normalized;
          };


        const step =
          (
            now:
              number,
          ) => {
            const rawProgress =
              clamp(
                (
                  now -
                  startedAt
                ) /
                  CAMERA_ANIMATION_DURATION,
                0,
                1,
              );


            /*
             * Cubic-out:
             * decisive departure, gentle geographic
             * settling at the destination.
             */
            const inverse =
              1 -
              rawProgress;

            const eased =
              1 -
              inverse *
                inverse *
                inverse;


            const nextLongitude =
              normalizeLongitude(
                sourceLongitude +
                  longitudeDelta *
                    eased,
              );


            const nextLatitude =
              sourceLatitude +
              latitudeDelta *
                eased;


            const nextZoom =
              sourceZoom +
              zoomDelta *
                eased;


            setCenter([
              nextLongitude,
              nextLatitude,
            ]);


            setZoom(
              nextZoom,
            );


            if (
              rawProgress <
              1
            ) {
              cameraFrameRef.current =
                window.requestAnimationFrame(
                  step,
                );

              return;
            }


            /*
             * Install the exact destination so floating
             * point interpolation never leaves the map
             * fractionally short of its intended state.
             */
            setCenter([
              normalizeLongitude(
                destinationLongitude,
              ),
              destinationLatitude,
            ]);


            setZoom(
              destinationZoom,
            );


            cameraFrameRef.current =
              null;
          };


        cameraFrameRef.current =
          window.requestAnimationFrame(
            step,
          );
      },
      [
        center,
        zoom,
      ],
    );


  /*
   * =====================================================
   * PROJECT MARKER INTERACTION
   * =====================================================
   *
   * A project point has two meanings:
   *
   *   Far away  -> geographic discovery target
   *   Close     -> project content target
   *
   * This prevents world-scale points from behaving like
   * ordinary buttons detached from their geography.
   */


  const handleProjectMarkerClick =
    useCallback(
      (
        marker:
          RenderedMarker,

        project:
          ProjectMarkerProperties,
      ) => {
        if (
          zoom <
          PROJECT_ACTIVATION_ZOOM
        ) {
          setSelectedProject(
            null,
          );


          setHoveredCountry(
            null,
          );


          const targetZoom =
            clamp(
              Math.max(
                PROJECT_DISCOVERY_ZOOM,
                zoom *
                  2.2,
              ),
              MIN_ZOOM,
              MAX_ZOOM,
            );


          animateCamera(
            [
              marker.longitude,
              marker.latitude,
            ],
            targetZoom,
          );


          return;
        }


        setSelectedProject({
          properties:
            project,

          longitude:
            marker.longitude,

          latitude:
            marker.latitude,
        });


        setHoveredCountry(
          null,
        );
      },
      [
        animateCamera,
        zoom,
      ],
    );


  /*
   * =====================================================
   * CLUSTER INTERACTION
   * =====================================================
   */


  /*
   * =====================================================
   * AMCHARTS-STYLE CLUSTER DRILL-DOWN
   * =====================================================
   *
   * Equivalent concept:
   *
   *   zoomToCluster(cluster.children)
   *
   * The cluster click changes ONLY the camera.
   *
   * It never removes projects from projectFeatures.
   * =====================================================
   */

  const handleClusterClick =
    useCallback(
      (
        marker:
          RenderedMarker,
      ) => {
        if (
          !marker.cluster ||
          marker.projects.length <
            2
        ) {
          return;
        }


        setSelectedProject(
          null,
        );

        setExpandedClusterKey(
          null,
        );

        setHoveredCountry(
          null,
        );


        const childSources =
          marker.projects
            .map(
              (
                project,
              ) =>
                projectFeatures.find(
                  (
                    feature,
                  ) =>
                    feature
                      .properties
                      .markerId ===
                    project.markerId,
                ) ??
                null,
            )
            .filter(
              (
                feature,
              ): feature is Feature<
                Point,
                ProjectMarkerProperties
              > =>
                feature !==
                null,
            );


        if (
          childSources.length <
          2
        ) {
          return;
        }


        const childCoordinates =
          childSources.map(
            (
              feature,
            ) => {
              const [
                longitude,
                latitude,
              ] =
                feature
                  .geometry
                  .coordinates;


              return {
                longitude,
                latitude,
              };
            },
          );


        /*
         * -----------------------------------------------
         * GEOGRAPHIC CENTER
         * -----------------------------------------------
         */

        let minLongitude =
          Infinity;

        let maxLongitude =
          -Infinity;

        let minLatitude =
          Infinity;

        let maxLatitude =
          -Infinity;


        childCoordinates.forEach(
          (
            location,
          ) => {
            minLongitude =
              Math.min(
                minLongitude,
                location.longitude,
              );

            maxLongitude =
              Math.max(
                maxLongitude,
                location.longitude,
              );

            minLatitude =
              Math.min(
                minLatitude,
                location.latitude,
              );

            maxLatitude =
              Math.max(
                maxLatitude,
                location.latitude,
              );
          },
        );


        let targetLongitude =
          (
            minLongitude +
            maxLongitude
          ) /
          2;


        let longitudeSpan =
          maxLongitude -
          minLongitude;


        /*
         * International-date-line protection.
         */
        if (
          longitudeSpan >
          180
        ) {
          const wrapped =
            childCoordinates.map(
              (
                location,
              ) =>
                location.longitude <
                0
                  ? location.longitude +
                      360
                  : location.longitude,
            );


          const wrappedMin =
            Math.min(
              ...wrapped,
            );

          const wrappedMax =
            Math.max(
              ...wrapped,
            );


          longitudeSpan =
            wrappedMax -
            wrappedMin;


          targetLongitude =
            (
              wrappedMin +
              wrappedMax
            ) /
            2;


          if (
            targetLongitude >
            180
          ) {
            targetLongitude -=
              360;
          }
        }


        const targetLatitude =
          (
            minLatitude +
            maxLatitude
          ) /
          2;


        /*
         * -----------------------------------------------
         * PROJECTED CHILD SEPARATION
         * -----------------------------------------------
         *
         * amCharts fits the camera to the cluster's child
         * data items.
         *
         * In this D3 implementation we derive the one-step
         * camera scale from those children's actual current
         * projected spacing.
         */

        const projectedChildren =
          childCoordinates
            .map(
              (
                location,
              ) => {
                if (
                  !projectPoint
                ) {
                  return null;
                }


                const point =
                  projectPoint([
                    location.longitude,
                    location.latitude,
                  ]);


                if (
                  !point
                ) {
                  return null;
                }


                return {
                  longitude:
                    location.longitude,

                  latitude:
                    location.latitude,

                  x:
                    point[0],

                  y:
                    point[1],
                };
              },
            )
            .filter(
              (
                item,
              ): item is {
                longitude:
                  number;

                latitude:
                  number;

                x:
                  number;

                y:
                  number;
              } =>
                item !==
                null,
            );


        let minimumDistinctDistance =
          Infinity;


        let distinctCoordinatePairs =
          0;


        for (
          let firstIndex =
            0;
          firstIndex <
            projectedChildren.length;
          firstIndex +=
            1
        ) {
          for (
            let secondIndex =
              firstIndex +
              1;
            secondIndex <
              projectedChildren.length;
            secondIndex +=
              1
          ) {
            const first =
              projectedChildren[
                firstIndex
              ];

            const second =
              projectedChildren[
                secondIndex
              ];


            const geographicDelta =
              Math.abs(
                first.longitude -
                second.longitude,
              ) +
              Math.abs(
                first.latitude -
                second.latitude,
              );


            /*
             * Coincident geographic anchors cannot be
             * separated by zoom.
             */
            if (
              geographicDelta <
              0.000001
            ) {
              continue;
            }


            distinctCoordinatePairs +=
              1;


            const deltaX =
              second.x -
              first.x;

            const deltaY =
              second.y -
              first.y;


            const distance =
              Math.sqrt(
                deltaX *
                  deltaX +
                  deltaY *
                  deltaY,
              );


            minimumDistinctDistance =
              Math.min(
                minimumDistinctDistance,
                distance,
              );
          }
        }


        let targetZoom:
          number;


        /*
         * All children occupy the same legitimate geographic
         * anchor.
         *
         * One click goes directly to terminal scatter range.
         */
        if (
          distinctCoordinatePairs ===
          0
        ) {
          targetZoom =
            Math.min(
              MAX_ZOOM,
              STOP_CLUSTER_ZOOM +
                0.05,
            );
        }
        else {
          const safeDistance =
            Math.max(
              minimumDistinctDistance,
              0.5,
            );


          const revealScale =
            CLUSTER_REVEAL_DISTANCE /
            safeDistance;


          /*
           * Never make a cluster click a meaningless nudge.
           */
          const progressiveScale =
            Math.max(
              revealScale,
              1.35,
            );


          targetZoom =
            clamp(
              zoom *
                progressiveScale,
              Math.max(
                zoom +
                  0.35,
                PROJECT_DISCOVERY_ZOOM,
              ),
              STOP_CLUSTER_ZOOM,
            );
        }


        /*
         * -----------------------------------------------
         * CAMERA MOVE
         * -----------------------------------------------
         *
         * There is no dataset filtering here.
         *
         * Arctic, Antarctic, Tutuila and every other project
         * remain in projectFeatures throughout this action.
         */

        animateCamera(
          [
            targetLongitude,

            clamp(
              targetLatitude,
              -82,
              82,
            ),
          ],

          targetZoom,
        );
      },
      [
        animateCamera,
        projectFeatures,
        projectPoint,
        zoom,
      ],
    );


  /*
   * =====================================================
   * SELECTED PROJECT POPUP POSITION
   * =====================================================
   */


  const selectedProjectPosition =
    useMemo(
      () => {
        if (
          !selectedProject ||
          !projectPoint
        ) {
          return null;
        }


        if (
          projectionMode ===
            'globe' &&
          !isVisibleOnGlobe(
            selectedProject
              .longitude,
            selectedProject
              .latitude,
            center,
          )
        ) {
          return null;
        }


        const point =
          projectPoint([
            selectedProject
              .longitude,
            selectedProject
              .latitude,
          ]);


        if (
          !point
        ) {
          return null;
        }


        const popupWidth =
          224;

        const popupHeight =
          164;

        const edgePadding =
          18;

        const markerGap =
          16;


        const horizontal =
          point[0] +
            markerGap +
            popupWidth >
          width -
            edgePadding
            ? 'left'
            : 'right';


        const vertical =
          point[1] +
            markerGap +
            popupHeight >
          height -
            edgePadding
            ? 'above'
            : 'below';


        return {
          x:
            point[0],

          y:
            point[1],

          horizontal,

          vertical,
        } as const;
      },
      [
        center,
        height,
        projectPoint,
        projectionMode,
        selectedProject,
        width,
      ],
    );


  const graticule =
    useMemo(
      () =>
        geoGraticule10(),
      [],
    );


  /*
   * =====================================================
   * RENDER
   * =====================================================
   */


  return (
    <div
      ref={
        containerRef
      }
      className={[
        'absolute',
        'inset-0',
        'overflow-hidden',
      ].join(' ')}
      style={{
        background:
          HERO_BACKGROUND,
      }}
    >
      {/* ================================================
          MAP / GLOBE SWITCH
         ================================================ */}

      <div
        className={[
          'absolute',
          'left-5',
          'top-5',
          'z-30',
          'flex',
          'items-center',
          'gap-2.5',
        ].join(' ')}
      >
        <button
          type="button"
          disabled={
            isProjectionTransitioning
          }
          onClick={() => {
            changeProjection(
              'map',
            );
          }}
          className={[
            'whitespace-nowrap',
            'text-xs',
            'font-medium',
            'transition-colors',
            'duration-200',
            projectionMode ===
            'map'
              ? 'text-white'
              : 'text-white/45 hover:text-white/75',
            isProjectionTransitioning
              ? 'cursor-wait'
              : '',
          ].join(' ')}
        >
          Map
        </button>


        <button
          type="button"
          role="switch"
          aria-checked={
            projectionMode ===
            'globe'
          }
          aria-label="Toggle between map and globe"
          disabled={
            isProjectionTransitioning
          }
          onClick={() => {
            changeProjection(
              projectionMode ===
                'map'
                ? 'globe'
                : 'map',
            );
          }}
          className={[
            'relative',
            'h-6',
            'w-10',
            'shrink-0',
            'rounded-full',
            'border',
            'border-white/10',
            'transition-colors',
            'duration-300',
            projectionMode ===
            'globe'
              ? 'bg-[#ff5a52]'
              : 'bg-white/18',
            isProjectionTransitioning
              ? 'cursor-wait'
              : '',
          ].join(' ')}
        >
          <span
            aria-hidden="true"
            className={[
              'absolute',
              'left-1',
              'top-1',
              'h-4',
              'w-4',
              'rounded-full',
              'bg-white',
              'shadow-sm',
              'transition-transform',
              'duration-300',
              'ease-in-out',
              projectionMode ===
              'globe'
                ? 'translate-x-4'
                : 'translate-x-0',
            ].join(' ')}
          />
        </button>


        <button
          type="button"
          disabled={
            isProjectionTransitioning
          }
          onClick={() => {
            changeProjection(
              'globe',
            );
          }}
          className={[
            'whitespace-nowrap',
            'text-xs',
            'font-medium',
            'transition-colors',
            'duration-200',
            projectionMode ===
            'globe'
              ? 'text-white'
              : 'text-white/45 hover:text-white/75',
            isProjectionTransitioning
              ? 'cursor-wait'
              : '',
          ].join(' ')}
        >
          Globe
        </button>
      </div>


      {/* ================================================
          HOME / + / -
         ================================================ */}

      <div
        className={[
          'absolute',
          'bottom-7',
          'left-4',
          'z-30',
          'flex',
          'flex-col',
          'gap-[3px]',
        ].join(' ')}
      >
        <button
          type="button"
          title="Return to world view"
          aria-label="Return to world view"
          onClick={
            goHome
          }
          className={[
            'flex',
            'h-[35px]',
            'w-[35px]',
            'items-center',
            'justify-center',
            'rounded-lg',
            'bg-[#ff5a52]',
            'text-white',
            'shadow-sm',
            'transition-transform',
            'duration-150',
            'hover:scale-[1.04]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-white/80',
          ].join(' ')}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M4.5 10.5 12 4l7.5 6.5"
            />

            <path
              d="M6.5 9.2V20h11V9.2"
            />

            <path
              d="M10 20v-6h4v6"
            />
          </svg>
        </button>


        <button
          type="button"
          title="Zoom in"
          aria-label="Zoom in"
          disabled={
            isProjectionTransitioning ||
            zoom >=
              MAX_ZOOM
          }
          onClick={
            zoomIn
          }
          className={[
            'flex',
            'h-[35px]',
            'w-[35px]',
            'items-center',
            'justify-center',
            'rounded-lg',
            'text-white',
            'shadow-sm',
            'transition-transform',
            'duration-150',
            isProjectionTransitioning ||
            zoom >=
              MAX_ZOOM
              ? 'cursor-not-allowed bg-white/12 text-white/25'
              : 'bg-[#ff5a52] hover:scale-[1.04]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-white/80',
          ].join(' ')}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path
              d="M5.5 10h9"
            />

            <path
              d="M10 5.5v9"
            />
          </svg>
        </button>


        <button
          type="button"
          title="Zoom out"
          aria-label="Zoom out"
          disabled={
            zoom <=
              MIN_ZOOM ||
            isProjectionTransitioning
          }
          onClick={
            zoomOut
          }
          className={[
            'flex',
            'h-[35px]',
            'w-[35px]',
            'items-center',
            'justify-center',
            'rounded-lg',
            'text-white',
            'shadow-sm',
            'transition-transform',
            'duration-150',
            zoom <=
              MIN_ZOOM ||
            isProjectionTransitioning
              ? 'cursor-not-allowed bg-white/12 text-white/25'
              : 'bg-[#ff5a52] hover:scale-[1.04]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-white/80',
          ].join(' ')}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path
              d="M5.5 10h9"
            />
          </svg>
        </button>
      </div>


      {/* ================================================
          FULLSCREEN
         ================================================ */}

      <button
        type="button"
        title="Toggle fullscreen"
        aria-label="Toggle fullscreen"
        onClick={() => {
          void enterFullscreen();
        }}
        className={[
          'absolute',
          'right-4',
          'top-4',
          'z-30',
          'flex',
          'h-9',
          'w-9',
          'items-center',
          'justify-center',
          'rounded-md',
          'bg-white/10',
          'text-sm',
          'text-white/75',
          'backdrop-blur-sm',
          'transition-colors',
          'hover:bg-white/18',
          'hover:text-white',
        ].join(' ')}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3H3v5" />
          <path d="M16 3h5v5" />
          <path d="M21 16v5h-5" />
          <path d="M3 16v5h5" />
        </svg>
      </button>


      {/* ================================================
          CARTOGRAPHIC STAGE
         ================================================ */}

      <div
        className={[
          'absolute',
          'inset-0',
        ].join(' ')}
      >
        {
          world &&
          pathGenerator &&
          width >
            0 &&
          height >
            0
            ? (
                <svg
                  ref={
                    svgRef
                  }
                  width={
                    width
                  }
                  height={
                    height
                  }
                  viewBox={`0 0 ${width} ${height}`}
                  role="img"
                  aria-label={
                    projectionMode ===
                    'map'
                      ? 'Interactive Natural Earth map of portfolio projects'
                      : 'Interactive orthographic globe of portfolio projects'
                  }
                  className={[
                    'absolute',
                    'inset-0',
                    'h-full',
                    'w-full',
                    'touch-none',
                    'select-none',
                  ].join(' ')}
                  onPointerDown={
                    handlePointerDown
                  }
                  onPointerMove={
                    handlePointerMove
                  }
                  onPointerUp={
                    finishDrag
                  }
                  onPointerCancel={
                    finishDrag
                  }
                  onClick={() => {
                    setSelectedProject(
                      null,
                    );
                  }}
                >
                  <rect
                    x="0"
                    y="0"
                    width={
                      width
                    }
                    height={
                      height
                    }
                    fill={
                      HERO_BACKGROUND
                    }
                  />


                  <path
                    d={
                      pathGenerator(
                        graticule,
                      ) ??
                      undefined
                    }
                    fill="none"
                    stroke={
                      GRID_COLOR
                    }
                    strokeOpacity={
                      isProjectionTransitioning
                        ? 0.12
                        : projectionMode ===
                            'map'
                          ? 0.14
                          : 0.1
                    }
                    strokeWidth="0.5"
                    pointerEvents="none"
                  />


                  {/* Countries */}

                  <g>
                    {
                      world
                        .features
                        .map(
                          (
                            feature,
                            index,
                          ) => {
                            const name =
                              getCountryLabel(
                                feature.properties,
                              );


                            const path =
                              pathGenerator(
                                feature,
                              );


                            if (
                              !path
                            ) {
                              return null;
                            }


                            const hovered =
                              hoveredCountry ===
                              name;


                            return (
                              <path
                                key={
                                  `${
                                    feature
                                      .properties
                                      ?.NAME_EN ??
                                    feature
                                      .properties
                                      ?.NAME ??
                                    'country'
                                  }-${index}`
                                }
                                d={
                                  path
                                }
                                fill={
                                  hovered
                                    ? LAND_HOVER_COLOR
                                    : LAND_COLOR
                                }
                                fillOpacity={
                                  hovered
                                    ? 1
                                    : 0.9
                                }
                                stroke={
                                  BORDER_COLOR
                                }
                                strokeOpacity="0.46"
                                strokeWidth="0.55"
                                vectorEffect="non-scaling-stroke"
                                onPointerEnter={() => {
                                  if (
                                    name
                                  ) {
                                    setHoveredCountry(
                                      name,
                                    );
                                  }
                                }}
                                onPointerLeave={() => {
                                  setHoveredCountry(
                                    null,
                                  );
                                }}
                              />
                            );
                          },
                        )
                    }
                  </g>


                  {/* Progressive country labels */}

                  <g
                    pointerEvents="none"
                  >
                    {
                      countryLabels.map(
                        (
                          label,
                        ) => (
                          <text
                            key={
                              label.key
                            }
                            x={
                              label.x
                            }
                            y={
                              label.y
                            }
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={
                              LABEL_COLOR
                            }
                            fillOpacity={
                              label.rank <=
                              2
                                ? 0.8
                                : 0.6
                            }
                            fontSize={
                              label.rank <=
                              2
                                ? 10
                                : 8.8
                            }
                            fontWeight={
                              label.rank <=
                              2
                                ? 650
                                : 500
                            }
                            letterSpacing="0.025em"
                            style={{
                              paintOrder:
                                'stroke',

                              stroke:
                                HERO_BACKGROUND,

                              strokeWidth:
                                3,

                              strokeLinejoin:
                                'round',
                            }}
                          >
                            {
                              label.label
                            }
                          </text>
                        ),
                      )
                    }
                  </g>


                  </svg>
              )
            : null
        }
        {/* ================================================
            PROJECT MARKER OVERLAY

            HTML bullet-style project markers.

            The geographic map remains D3/SVG.

            renderedMarkers continues to provide:
            - screen-space clustering
            - projected x/y positions
            - cluster membership
            - individual project information

            HTML buttons provide reliable:
            - pointer interaction
            - touch interaction
            - keyboard interaction
            - accessibility
           ================================================ */}

        {
          world &&
          pathGenerator &&
          width >
            0 &&
          height >
            0 &&
          !isProjectionTransitioning
            ? (
                <div
                  className={[
                    'pointer-events-none',
                    'absolute',
                    'inset-0',
                    'z-30',
                  ].join(' ')}
                  aria-label="Portfolio project markers"
                >
                  {
                    renderedMarkers.map(
                      (
                        marker,
                      ) => {
                        /*
                         * ===================================
                         * CLUSTER BULLET
                         *
                         * Equivalent interaction concept to
                         * an amCharts clustered-point bullet:
                         *
                         * click cluster
                         * -> calculate children extent
                         * -> animate camera
                         * -> renderedMarkers recalculates
                         * -> cluster separates
                         * ===================================
                         */

                        if (
                          marker.cluster
                        ) {
                          const clusterCount =
                            marker.count ??
                            marker.projects.length;


                          const isExpanded =
                            expandedClusterKey ===
                            marker.key;


                          /*
                           * =================================
                           * MAX-ZOOM SPIDERFY
                           * =================================
                           */

                          if (
                            isExpanded
                          ) {
                            const spiderRadius =
                              Math.max(
                                38,
                                Math.min(
                                  66,
                                  32 +
                                    clusterCount *
                                      5,
                                ),
                              );


                            return (
                              <div
                                key={
                                  marker.key
                                }
                                className={[
                                  'pointer-events-none',
                                  'absolute',
                                ].join(' ')}
                                style={{
                                  left:
                                    marker.x,

                                  top:
                                    marker.y,

                                  width:
                                    0,

                                  height:
                                    0,
                                }}
                              >
                                {/* True projected cluster origin */}

                                <span
                                  aria-hidden="true"
                                  className={[
                                    'pointer-events-none',
                                    'absolute',
                                    'z-10',
                                    'h-2',
                                    'w-2',
                                    '-translate-x-1/2',
                                    '-translate-y-1/2',
                                    'rounded-full',
                                    'border',
                                    'border-[#ff5a52]/60',
                                    'bg-[#17212a]',
                                  ].join(' ')}
                                />


                                {
                                  marker.projects.map(
                                    (
                                      project,
                                      projectIndex,
                                    ) => {
                                      const angle =
                                        clusterCount ===
                                        2
                                          ? projectIndex ===
                                            0
                                            ? Math.PI
                                            : 0
                                          : -Math.PI /
                                              2 +
                                            (
                                              Math.PI *
                                              2 *
                                              projectIndex
                                            ) /
                                              clusterCount;


                                      const offsetX =
                                        Math.cos(
                                          angle,
                                        ) *
                                        spiderRadius;


                                      const offsetY =
                                        Math.sin(
                                          angle,
                                        ) *
                                        spiderRadius;


                                      const source =
                                        projectFeatures.find(
                                          (
                                            feature,
                                          ) =>
                                            feature
                                              .properties
                                              .markerId ===
                                            project.markerId,
                                        );


                                      if (
                                        !source
                                      ) {
                                        return null;
                                      }


                                      const [
                                        projectLongitude,
                                        projectLatitude,
                                      ] =
                                        source
                                          .geometry
                                          .coordinates;


                                      const spiderMarker:
                                        RenderedMarker =
                                        {
                                          key:
                                            `spider:${marker.key}:${project.markerId}`,

                                          longitude:
                                            projectLongitude,

                                          latitude:
                                            projectLatitude,

                                          x:
                                            marker.x +
                                            offsetX,

                                          y:
                                            marker.y +
                                            offsetY,

                                          cluster:
                                            false,

                                          project,

                                          projects: [
                                            project,
                                          ],
                                        };


                                      return (
                                        <div
                                          key={
                                            project.markerId
                                          }
                                        >
                                          {/* Connector to the true origin */}

                                          <svg
                                            aria-hidden="true"
                                            className={[
                                              'pointer-events-none',
                                              'absolute',
                                              'left-0',
                                              'top-0',
                                              'overflow-visible',
                                            ].join(' ')}
                                            width="1"
                                            height="1"
                                          >
                                            <line
                                              x1="0"
                                              y1="0"
                                              x2={
                                                offsetX
                                              }
                                              y2={
                                                offsetY
                                              }
                                              stroke="rgba(255,255,255,0.28)"
                                              strokeWidth="1"
                                            />
                                          </svg>


                                          {/* Selectable expanded project */}

                                          <button
                                            type="button"
                                            aria-label={`Open ${project.title}`}
                                            title={
                                              project.title
                                            }
                                            className={[
                                              'group',
                                              'pointer-events-auto',
                                              'absolute',
                                              'z-20',
                                              'flex',
                                              'h-10',
                                              'w-10',
                                              'cursor-pointer',
                                              'items-center',
                                              'justify-center',
                                              'rounded-full',
                                              'border-0',
                                              'bg-transparent',
                                              'p-0',
                                              'outline-none',
                                              'focus-visible:ring-2',
                                              'focus-visible:ring-white/90',
                                            ].join(' ')}
                                            style={{
                                              left:
                                                offsetX,

                                              top:
                                                offsetY,

                                              transform:
                                                'translate(-50%, -50%)',
                                            }}
                                            onClick={(
                                              event,
                                            ) => {
                                              event.stopPropagation();

                                              handleProjectMarkerClick(
                                                spiderMarker,
                                                project,
                                              );
                                            }}
                                          >
                                            <span
                                              aria-hidden="true"
                                              className={[
                                                'pointer-events-none',
                                                'absolute',
                                                'h-7',
                                                'w-7',
                                                'rounded-full',
                                                'bg-[#ff5a52]/15',
                                                'opacity-0',
                                                'transition-all',
                                                'duration-150',
                                                'group-hover:opacity-100',
                                                'group-focus-visible:opacity-100',
                                              ].join(' ')}
                                            />


                                            <span
                                              aria-hidden="true"
                                              className={[
                                                'pointer-events-none',
                                                'relative',
                                                'z-10',
                                                'h-3.5',
                                                'w-3.5',
                                                'rounded-full',
                                                'border',
                                                'border-white/70',
                                                'bg-[#ff5a52]',
                                                'shadow-lg',
                                                'transition-transform',
                                                'duration-150',
                                                'group-hover:scale-125',
                                                'group-focus-visible:scale-125',
                                              ].join(' ')}
                                            />
                                          </button>
                                        </div>
                                      );
                                    },
                                  )
                                }


                                {/* Origin / collapse control */}

                                <button
                                  type="button"
                                  aria-label="Collapse expanded project cluster"
                                  title="Collapse project cluster"
                                  className={[
                                    'pointer-events-auto',
                                    'absolute',
                                    'z-30',
                                    'flex',
                                    'h-7',
                                    'w-7',
                                    '-translate-x-1/2',
                                    '-translate-y-1/2',
                                    'items-center',
                                    'justify-center',
                                    'rounded-full',
                                    'border',
                                    'border-white/20',
                                    'bg-[#17212a]',
                                    'font-mono',
                                    'text-[9px]',
                                    'font-semibold',
                                    'text-white/70',
                                    'shadow-lg',
                                    'transition-colors',
                                    'hover:border-white/35',
                                    'hover:text-white',
                                    'focus-visible:outline-none',
                                    'focus-visible:ring-2',
                                    'focus-visible:ring-white/80',
                                  ].join(' ')}
                                  onClick={(
                                    event,
                                  ) => {
                                    event.stopPropagation();

                                    setExpandedClusterKey(
                                      null,
                                    );
                                  }}
                                >
                                  {
                                    clusterCount
                                  }
                                </button>
                              </div>
                            );
                          }


                          /*
                           * =================================
                           * NORMAL CLUSTER BULLET
                           * =================================
                           */

                          return (
                            <button
                              key={
                                marker.key
                              }
                              type="button"
                              aria-label={`${clusterCount} projects in this area`}
                              title={
                                zoom >=
                                MAX_ZOOM -
                                  0.01
                                  ? `${clusterCount} projects - click to expand`
                                  : `${clusterCount} projects - click to zoom`
                              }
                              className={[
                                'group',
                                'pointer-events-auto',
                                'absolute',
                                'flex',
                                'h-11',
                                'w-11',
                                'cursor-pointer',
                                'items-center',
                                'justify-center',
                                'rounded-full',
                                'border-0',
                                'bg-transparent',
                                'p-0',
                                'outline-none',
                                'focus-visible:ring-2',
                                'focus-visible:ring-white/90',
                                'focus-visible:ring-offset-2',
                                'focus-visible:ring-offset-transparent',
                              ].join(' ')}
                              style={{
                                left:
                                  marker.x,

                                top:
                                  marker.y,

                                transform:
                                  'translate(-50%, -50%)',
                              }}
                              onClick={(
                                event,
                              ) => {
                                event.stopPropagation();

                                handleClusterClick(
                                  marker,
                                );
                              }}
                            >
                              <span
                                aria-hidden="true"
                                className={[
                                  'pointer-events-none',
                                  'absolute',
                                  'h-9',
                                  'w-9',
                                  'rounded-full',
                                  'bg-[#ff5a52]/20',
                                  'transition-transform',
                                  'duration-200',
                                  'group-hover:scale-110',
                                ].join(' ')}
                              />


                              <span
                                aria-hidden="true"
                                className={[
                                  'pointer-events-none',
                                  'absolute',
                                  'h-7',
                                  'w-7',
                                  'rounded-full',
                                  'bg-[#ff5a52]/30',
                                  'transition-transform',
                                  'duration-200',
                                  'group-hover:scale-110',
                                ].join(' ')}
                              />


                              <span
                                aria-hidden="true"
                                className={[
                                  'pointer-events-none',
                                  'relative',
                                  'z-10',
                                  'flex',
                                  'h-5',
                                  'min-w-5',
                                  'items-center',
                                  'justify-center',
                                  'rounded-full',
                                  'bg-[#ff5a52]',
                                  'px-1',
                                  'font-mono',
                                  'text-[8px]',
                                  'font-bold',
                                  'leading-none',
                                  'text-white',
                                  'shadow-lg',
                                  'transition-transform',
                                  'duration-150',
                                  'group-hover:scale-110',
                                ].join(' ')}
                              >
                                {
                                  clusterCount
                                }
                              </span>
                            </button>
                          );
                        }


                        /*
                         * ===================================
                         * INDIVIDUAL PROJECT BULLET
                         * ===================================
                         */

                        const project =
                          marker.project;


                        if (
                          !project
                        ) {
                          return null;
                        }


                        return (
                          <button
                            key={
                              marker.key
                            }
                            type="button"
                            aria-label={`Open ${project.title}`}
                            title={
                              project.title
                            }
                            className={[
                              'group',
                              'pointer-events-auto',
                              'absolute',
                              'flex',
                              'h-9',
                              'w-9',
                              'cursor-pointer',
                              'items-center',
                              'justify-center',
                              'rounded-full',
                              'border-0',
                              'bg-transparent',
                              'p-0',
                              'outline-none',
                              'focus-visible:ring-2',
                              'focus-visible:ring-white/90',
                            ].join(' ')}
                            style={{
                              left:
                                marker.x,

                              top:
                                marker.y,

                              transform:
                                'translate(-50%, -50%)',
                            }}
                            onClick={(
                              event,
                            ) => {
                              event.stopPropagation();

                              handleProjectMarkerClick(
                                marker,
                                project,
                              );
                            }}
                          >
                            {/* Hover/focus halo */}

                            <span
                              aria-hidden="true"
                              className={[
                                'pointer-events-none',
                                'absolute',
                                'h-6',
                                'w-6',
                                'rounded-full',
                                'bg-[#ff5a52]/15',
                                'opacity-0',
                                'transition-all',
                                'duration-150',
                                'group-hover:opacity-100',
                                'group-focus-visible:opacity-100',
                              ].join(' ')}
                            />

                              {/* Visible project point */}

                            <span
                              aria-hidden="true"
                              className={[
                                'pointer-events-none',
                                'relative',
                                'z-10',
                                'h-3',
                                'w-3',
                                'rounded-full',
                                'bg-[#ff5a52]',
                                'shadow-lg',
                                'transition-transform',
                                'duration-150',
                                'group-hover:scale-125',
                                'group-focus-visible:scale-125',
                              ].join(' ')}
                            />
                          </button>
                        );
                      },
                    )
                  }
                </div>
              )
            : null
        }
      </div>


      {/* ================================================
          PROJECT POPUP
         ================================================ */}

      {
        selectedProject &&
        selectedProjectPosition &&
        !isProjectionTransitioning
          ? (
              <div
                role="dialog"
                aria-label={`${selectedProject.properties.title} project preview`}
                className={[
                  'pointer-events-auto',
                  'absolute',
                  'z-40',
                  'w-[14rem]',
                  'overflow-hidden',
                  'rounded-lg',
                  'border',
                  'border-white/[0.09]',
                  'bg-[#17212a]/95',
                  'text-white',
                  'shadow-xl',
                  'backdrop-blur-md',
                ].join(' ')}
                style={{
                  left:
                    selectedProjectPosition
                      .x,

                  top:
                    selectedProjectPosition
                      .y,

                  transform: [
                    selectedProjectPosition
                      .horizontal ===
                    'left'
                      ? 'translateX(calc(-100% - 16px))'
                      : 'translateX(16px)',

                    selectedProjectPosition
                      .vertical ===
                    'above'
                      ? 'translateY(calc(-100% - 16px))'
                      : 'translateY(16px)',
                  ].join(' '),
                }}
                onClick={(
                  event,
                ) => {
                  event.stopPropagation();
                }}
              >
                <div
                  aria-hidden="true"
                  className="h-[2px] w-full bg-[#ff5a52]"
                />


                <div
                  className={[
                    'px-3.5',
                    'pb-3.5',
                    'pt-3',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'flex',
                      'items-start',
                      'justify-between',
                      'gap-2',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        'min-w-0',
                        'pt-0.5',
                        'font-mono',
                        'text-[0.58rem]',
                        'font-semibold',
                        'uppercase',
                        'tracking-[0.17em]',
                        'text-[#ff5a52]',
                      ].join(' ')}
                    >
                      {
                        selectedProject
                          .properties
                          .category
                      }
                    </p>


                    <button
                      type="button"
                      aria-label="Close project preview"
                      title="Close project preview"
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        setSelectedProject(
                          null,
                        );
                      }}
                      className={[
                        '-mr-1',
                        '-mt-1',
                        'flex',
                        'h-7',
                        'w-7',
                        'shrink-0',
                        'items-center',
                        'justify-center',
                        'rounded-md',
                        'text-white/40',
                        'transition-colors',
                        'duration-150',
                        'hover:bg-white/[0.07]',
                        'hover:text-white',
                        'focus-visible:outline-none',
                        'focus-visible:ring-1',
                        'focus-visible:ring-white/60',
                      ].join(' ')}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      >
                        <path d="M5 5l10 10" />
                        <path d="M15 5L5 15" />
                      </svg>
                    </button>
                  </div>


                  <h3
                    className={[
                      'mt-1',
                      'pr-1',
                      'text-[0.82rem]',
                      'font-semibold',
                      'leading-[1.3rem]',
                      'text-white/95',
                    ].join(' ')}
                  >
                    {
                      selectedProject
                        .properties
                        .title
                    }
                  </h3>


                  <div
                    className={[
                      'mt-2',
                      'flex',
                      'items-center',
                      'gap-1.5',
                      'text-[0.68rem]',
                      'leading-4',
                      'text-white/45',
                    ].join(' ')}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-3 w-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 17s5-4.5 5-9a5 5 0 1 0-10 0c0 4.5 5 9 5 9Z" />

                      <circle
                        cx="10"
                        cy="8"
                        r="1.7"
                      />
                    </svg>

                    <span>
                      {
                        selectedProject
                          .properties
                          .locationLabel
                      }
                    </span>
                  </div>


                  <div
                    aria-hidden="true"
                    className="mt-3 h-px bg-white/[0.07]"
                  />


                  <Link
                    href={`/portfolio/${selectedProject.properties.slug}`}
                    onClick={(
                      event,
                    ) => {
                      event.stopPropagation();
                    }}
                    className={[
                      'mt-2.5',
                      'inline-flex',
                      'items-center',
                      'gap-1.5',
                      'text-[0.68rem]',
                      'font-semibold',
                      'text-[#ff5a52]',
                      'transition-colors',
                      'duration-150',
                      'hover:text-[#ff746d]',
                      'focus-visible:outline-none',
                      'focus-visible:underline',
                    ].join(' ')}
                  >
                    <span>
                      View project
                    </span>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8h9" />
                      <path d="m9 4 4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </div>
            )
          : null
      }
    </div>
  );
}

