import {
  ROOT_LOCATION_ID,
  type PortfolioLocation,
} from './semanticTypes';


/**
 * Authoritative semantic geography for the portfolio map.
 *
 * Rules:
 *
 * 1. Projects reference these stable IDs through mapPlacements.
 * 2. `anchor` is the representative marker position.
 * 3. `bounds` is the preferred camera-fit extent when available.
 * 4. `parentId` is the map drill-down parent, chosen for useful
 *    geographic navigation rather than exhaustive political
 *    classification.
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


    {
      id:
        'country:usa',

      label:
        'United States',

      shortLabel:
        'USA',

      level:
        'country',

      parentId:
        ROOT_LOCATION_ID,

      anchor:
        [
          -98.5795,
          39.8283,
        ],

      bounds:
        [
          [
            -124.85,
            24.40,
          ],
          [
            -66.88,
            49.40,
          ],
        ],

      sortOrder:
        10,
    },


    {
      id:
        'country:kenya',

      label:
        'Kenya',

      shortLabel:
        'Kenya',

      level:
        'country',

      parentId:
        ROOT_LOCATION_ID,

      anchor:
        [
          37.9062,
          -0.0236,
        ],

      bounds:
        [
          [
            33.90,
            -4.70,
          ],
          [
            41.95,
            5.10,
          ],
        ],

      sortOrder:
        15,
    },


    {
      id:
        'place:garissa',

      label:
        'Garissa, Kenya',

      shortLabel:
        'Garissa',

      level:
        'place',

      parentId:
        'country:kenya',

      anchor:
        [
          39.6461,
          -0.4532,
        ],

      bounds:
        [
          [
            39.45,
            -0.65,
          ],
          [
            39.85,
            -0.25,
          ],
        ],

      sortOrder:
        10,
    },

    {
      id:
        'territory:american-samoa',

      label:
        'American Samoa',

      shortLabel:
        'American Samoa',

      level:
        'territory',

      parentId:
        ROOT_LOCATION_ID,

      anchor:
        [
          -170.7009,
          -14.2958,
        ],

      bounds:
        [
          [
            -171.20,
            -14.55,
          ],
          [
            -169.35,
            -14.05,
          ],
        ],

      sortOrder:
        20,
    },


    {
      id:
        'place:tutuila',

      label:
        'Tutuila, American Samoa',

      shortLabel:
        'Tutuila',

      level:
        'place',

      parentId:
        'territory:american-samoa',

      anchor:
        [
          -170.7009,
          -14.2958,
        ],

      bounds:
        [
          [
            -170.90,
            -14.38,
          ],
          [
            -170.50,
            -14.20,
          ],
        ],

      sortOrder:
        10,
    },


    {
      id:
        'zone:arctic',

      label:
        'Arctic',

      shortLabel:
        'Arctic',

      level:
        'zone',

      parentId:
        ROOT_LOCATION_ID,

      anchor:
        [
          0,
          82,
        ],

      sortOrder:
        30,
    },


    {
      id:
        'zone:antarctic',

      label:
        'Antarctic',

      shortLabel:
        'Antarctic',

      level:
        'zone',

      parentId:
        ROOT_LOCATION_ID,

      anchor:
        [
          0,
          -82,
        ],

      sortOrder:
        40,
    },


    {
      id:
        'park:acadia-national-park',

      label:
        'Acadia National Park',

      shortLabel:
        'Acadia',

      level:
        'park',

      parentId:
        'country:usa',

      /*
       * Representative Acadia National Park anchor.
       *
       * Projects covering the park generally can reuse this
       * location. Exact field sites should use child locations.
       */
      anchor:
        [
          -68.2733,
          44.3386,
        ],

      bounds:
        [
          [
            -68.45,
            44.20,
          ],
          [
            -68.05,
            44.45,
          ],
        ],

      sortOrder:
        10,
    },


    {
      id:
        'site:cadillac-mountain',

      label:
        'Cadillac Mountain, Acadia National Park',

      shortLabel:
        'Cadillac Mountain',

      level:
        'site',

      parentId:
        'park:acadia-national-park',

      /*
       * Precise-site test anchor.
       */
      anchor:
        [
          -68.2249,
          44.3520,
        ],

      bounds:
        [
          [
            -68.25,
            44.33,
          ],
          [
            -68.20,
            44.37,
          ],
        ],

      sortOrder:
        10,
    },
  ] as const satisfies
    readonly PortfolioLocation[];

