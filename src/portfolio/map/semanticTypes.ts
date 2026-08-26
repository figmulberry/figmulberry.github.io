export const ROOT_LOCATION_ID =
  'global';


export type LongitudeLatitude =
  readonly [
    longitude:
      number,
    latitude:
      number,
  ];


export type GeographicBounds =
  readonly [
    southWest:
      LongitudeLatitude,
    northEast:
      LongitudeLatitude,
  ];


export type LocationLevel =
  | 'global'
  | 'continent'
  | 'zone'
  | 'country'
  | 'territory'
  | 'region'
  | 'district'
  | 'place'
  | 'park'
  | 'site'
  | 'point';


export type ProjectMapScope =
  | 'global'
  | 'country-wide'
  | 'regional'
  | 'place-wide'
  | 'site-specific'
  | 'multi-location';


/**
 * A semantic geographic node.
 *
 * `anchor` is the curated point used to display the node.
 * It is not automatically presented as an exact project site.
 *
 * `bounds` is used for camera fitting when the user enters
 * the node.
 */
export type PortfolioLocation = {
  id:
    string;

  label:
    string;

  shortLabel?:
    string;

  level:
    LocationLevel;

  parentId:
    string |
    null;

  anchor:
    LongitudeLatitude;

  bounds?:
    GeographicBounds;

  sortOrder?:
    number;
};


/**
 * One project can have one or several valid map placements.
 *
 * A country-wide project can reference the country node.
 * A park project can reference the park node.
 * A multi-location project can contain several placements.
 */
export type ProjectMapPlacement = {
  locationId:
    string;

  scope:
    ProjectMapScope;
};


/**
 * Normalized project information required by the semantic
 * map engine.
 *
 * This is intentionally separate from the website's full
 * project-card/content type.
 */
export type SemanticProjectRecord = {
  projectId:
    string;

  title:
    string;

  slug:
    string;

  category:
    string;

  placements:
    readonly ProjectMapPlacement[];
};


export type LocationIndex = {
  byId:
    ReadonlyMap<
      string,
      PortfolioLocation
    >;

  childrenByParent:
    ReadonlyMap<
      string,
      readonly PortfolioLocation[]
    >;

  root:
    PortfolioLocation;
};


export type DirectProjectNode = {
  kind:
    'direct-project';

  id:
    string;

  location:
    PortfolioLocation;

  project:
    SemanticProjectRecord;

  placement:
    ProjectMapPlacement;
};


export type ChildLocationNode = {
  kind:
    'child-location';

  id:
    string;

  location:
    PortfolioLocation;

  projects:
    readonly SemanticProjectRecord[];

  projectCount:
    number;
};


export type DrilldownView = {
  currentLocation:
    PortfolioLocation;

  directProjects:
    readonly DirectProjectNode[];

  childLocations:
    readonly ChildLocationNode[];

  visibleProjectIds:
    readonly string[];
};


export type MapDrilldownState = {
  currentLocationId:
    string;

  path:
    readonly string[];

  expandedSameLocationId:
    string |
    null;
};

