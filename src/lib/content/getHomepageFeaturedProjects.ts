type PortfolioProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  date: string;
  slug: string;
  thumbnail?: string;

  homepageFeatured?: boolean;
  homepageFeaturedOrder?: number;
};

export function getHomepageFeaturedProjects(
  projects: readonly PortfolioProject[],
  limit = 3,
): PortfolioProject[] {
  return projects
    .filter(
      (project) =>
        project.homepageFeatured === true,
    )
    .sort(
      (a, b) => {
        const orderA =
          a.homepageFeaturedOrder ??
          Number.MAX_SAFE_INTEGER;

        const orderB =
          b.homepageFeaturedOrder ??
          Number.MAX_SAFE_INTEGER;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      },
    )
    .slice(
      0,
      limit,
    );
}