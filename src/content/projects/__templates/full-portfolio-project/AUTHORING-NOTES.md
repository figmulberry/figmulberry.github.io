# Full Portfolio Project — Authoring Notes

This folder contains the canonical code-side starter for a full portfolio project.

## Authoring sequence

1. Complete `Portfolio_Project_Authoring_Master_Template.docx`.
2. Decide the project slug.
3. Create:

   `src/content/projects/<project-slug>/`

4. Copy `project.ts.template` into that folder as:

   `project.ts`

5. Create:

   `assets/`

6. Add the final thumbnail, hero and figure assets.
7. Replace every `REPLACE_*` value.
8. Remove all unused optional example blocks.
9. Register the project in:

   `src/content/engine/registry.ts`

10. Run:

   `npm run typecheck`

11. Run:

   `npm run build`

12. Verify the generated route.
13. Review desktop and mobile rendering.

---

## Locked intro modes

Use one:

- `image-left`
- `image-right`
- `overlay`
- `wide`

Do not create a fifth project-specific intro mode unless the portfolio engine itself is intentionally being expanded.

---

## Production case-study body

Use:

`type: 'article'`

for production case-study sections.

Supported Article blocks:

- `paragraph`
- `figure`
- `pull`
- `before-after`
- `workflow`

The body is paragraph-first.

Do not place body text beside an image as a normal layout.

Side-by-side treatment is reserved for genuine image-image comparisons.

---

## Figure behavior

Figure numbering is automatic.

Every meaningful figure should have:

- meaningful alt text;
- an editorial caption;
- deliberate width;
- deliberate narrative placement.

Supported widths:

- `normal`
- `wide`
- `full`

---

## Featured Project

`portfolioFeatured: true`

means:

> This project is eligible for the daily Featured Project rotation.

It does not mean the project is permanently pinned.

The project remains visible in All Projects either way.

---

## Portfolio catalogue

The landing page shows six projects initially.

`SEE MORE` automatically reveals six additional projects until the filtered catalogue is exhausted.

No project-specific work is needed for this behavior.

---

## Portfolio map

Do not modify `PortfolioMap` for a normal new project.

Use the existing project `locations` and `mapPlacements` contract.

Only use semantic map location IDs that the map system recognizes.

---

## Publication rule

A project is not ready merely because it renders.

It must also pass:

- content review;
- asset review;
- accessibility review;
- desktop review;
- mobile review;
- `npm run typecheck`;
- `npm run build`;
- generated-route verification.

Most importantly:

> Publishing a normal portfolio project must not require editing the shared renderer or page architecture.
