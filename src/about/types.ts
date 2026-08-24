export type AboutPrinciple = {
  id: string;
  label: string;
  description: string;
};

export type AboutValue = {
  id: string;
  number: string;
  title: string;
  lead: string;
  description: string;
};

export type RecommendationRelationship =
  | 'manager'
  | 'mentor'
  | 'teacher'
  | 'colleague';

export type Recommendation = {
  id: string;
  name: string;
  role: string;
  relationship: string;
  relationshipType: RecommendationRelationship;
  recommendation: string;
  emphasis: string[];
  source?: string;
  sourceUrl?: string;
};

export type AboutData = {
  eyebrow: string;
  headline: string;
  introduction: string[];
  introductionBold: string[];
  introductionItalic: string[];
  principles: AboutPrinciple[];
  values: AboutValue[];
  recommendations: Recommendation[];
};
