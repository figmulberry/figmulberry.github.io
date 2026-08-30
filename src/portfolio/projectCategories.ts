export const PROJECT_CATEGORIES = [
  'Geospatial',
  'Data',
  'GeoAI',
  'AI & QA',
  'Research',
  'Tools',
] as const;


export type ProjectCategory =
  (typeof PROJECT_CATEGORIES)[number];


export function isProjectCategory(
  value: string,
): value is ProjectCategory {
  return (
    PROJECT_CATEGORIES as
      readonly string[]
  ).includes(
    value,
  );
}


export function getActiveProjectCategories(
  projectCategories:
    readonly string[],
): ProjectCategory[] {
  const active =
    new Set(
      projectCategories.filter(
        isProjectCategory,
      ),
    );


  return PROJECT_CATEGORIES.filter(
    (
      category,
    ) =>
      active.has(
        category,
      ),
  );
}