export type CapabilityFamilyId =
  | 'spatial-analysis'
  | 'geoai-automation'
  | 'data-analytics'
  | 'remote-sensing'
  | 'documentation'
  | 'development';

export type CapabilityNodeType =
  | 'primary'
  | 'skill';

export type CapabilityAccent =
  | 'cyan'
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'fuchsia';

export type CapabilityPanelState =
  | 'open'
  | 'minimized'
  | 'closed';

export type CapabilityMetric = {
  value: number;
  suffix?: string;
  label: string;
};

export type CapabilityProject = {
  id: string;
  title: string;
  description: string;

  thumbnail?: string;

  href?: string;

  tags: string[];
};

export type CapabilityNode = {
  id: string;
  label: string;

  familyId: CapabilityFamilyId;

  type: CapabilityNodeType;

  /**
   * Temporary internal visual hierarchy.
   *
   * This is NOT displayed as a proficiency
   * percentage or public factual claim.
   */
  prominence: number;

  relatedIds: string[];

  metric?: CapabilityMetric;
};

export type CapabilityFamily = {
  id: CapabilityFamilyId;

  label: string;

  description: string;

  accent: CapabilityAccent;

  /**
   * We will populate factual public-facing
   * experience metrics only after verifying them.
   */
  metric?: CapabilityMetric;

  nodes: CapabilityNode[];

  projects: CapabilityProject[];

  relatedTags: string[];

  relatedTopicIds: string[];
};