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
  ] as const satisfies
    readonly PortfolioLocation[];
