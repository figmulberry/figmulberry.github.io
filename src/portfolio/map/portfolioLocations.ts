import {
  ROOT_LOCATION_ID,
  type PortfolioLocation,
} from './semanticTypes';


/**
 * Semantic portfolio geography registry.
 *
 * Phase 1 contains only the root. Existing countries,
 * regions, parks, places, and sites will be migrated into
 * this registry during Phase 2.
 *
 * Never calculate area-project meaning from an arbitrary
 * project point. Add a curated location node here instead.
 */
export const PORTFOLIO_LOCATIONS =
  [
    {
      id:
        ROOT_LOCATION_ID,

      label:
        'World',

      shortLabel:
        'World',

      level:
        'global',

      parentId:
        null,

      anchor:
        [
          0,
          0,
        ],

      bounds:
        [
          [
            -180,
            -82,
          ],
          [
            180,
            82,
          ],
        ],
    },
  ] as const satisfies
    readonly PortfolioLocation[];
