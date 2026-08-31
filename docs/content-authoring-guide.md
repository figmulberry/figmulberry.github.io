# Content Authoring Guide

Operational guide for adding and maintaining published content in Moses Thiong'o's portfolio website.

For architecture rules and content-model principles, see `content-platform-specification.md`.

## Core rule

Routine content publication should use the existing content model, registry and renderers.

Do not modify shared page architecture for an ordinary content update.

Before publication:

```powershell
npm run typecheck
npm run build
```

Then review the affected page in the browser on desktop and mobile.

---

## Articles

### Source

`src/content/articles/<article-slug>/`

Typical production article package:

```text
<article-slug>/
├── article.ts
├── body.md
├── references.ts        # where required
├── thumbnail.*
└── images/
```

Some articles also contain supporting files such as source notes, banners or image credits.

### Add an article

1. Create `src/content/articles/<article-slug>/`.
2. Add the article metadata record in `article.ts`.
3. Add the article body in `body.md`.
4. Add references where required.
5. Add thumbnail, banner or figure assets as needed.
6. Import the article into `src/content/engine/registry.ts`.
7. Add it to the registry source records.
8. Configure relationships and series metadata where applicable.
9. Run validation and build.
10. Review the article route and related-content behavior.

### Update an article

- Body copy: edit `body.md`.
- Title, description, category, dates, status, relationships or other metadata: edit `article.ts`.
- References: edit `references.ts` where the article uses one.
- Figures: update the relevant image asset and associated metadata.

### Automatic behavior

Registered articles participate in the shared content registry and can be discovered through content queries and relationships.

Published and scheduled visibility is controlled by content status and publication date.

### Do not

- Do not manually duplicate article content into homepage, tool or recommendation components.
- Do not edit the shared article renderer for a routine article update.
- Do not reuse another article's stable content ID.

---

## Blogs

### Current state

The content engine supports `blog` records, but there are currently no production blog records under `src/content/blogs/`.

The first production blog should therefore establish the canonical blog-authoring pattern before this section is treated as final operating procedure.

### Supported model

Blog records support the shared content fields plus:

- category
- reading time
- body

### Until the first production blog is implemented

Do not copy the article folder structure blindly.

When the first blog is added:

1. use the existing blog schema;
2. register the record through the central content registry;
3. verify the `/blog` and blog-detail routes;
4. validate publication status and relationships;
5. document the proven folder/file pattern here.

---

## Portfolio Projects

### Source

`src/content/projects/<project-slug>/`

Canonical starter:

`src/content/projects/__templates/full-portfolio-project/`

Typical project package:

```text
<project-slug>/
├── project.ts
├── thumbnail.*
├── hero.*
└── assets/
```

### Add a project

1. Decide the permanent project slug.
2. Create `src/content/projects/<project-slug>/`.
3. Copy the canonical project template as `project.ts`.
4. Add thumbnail, hero and body assets.
5. Replace all template placeholders.
6. Remove unused optional blocks.
7. Import the project into `src/content/engine/registry.ts`.
8. Add it to the registry source records.
9. Set locations and map placements using the existing map contract.
10. Run `npm run typecheck`.
11. Run `npm run build`.
12. Verify the generated project route.
13. Review desktop and mobile rendering.

### Update a project

Routine project content, metadata, tools, locations, map placement, featured state and case-study sections belong in the project's `project.ts` and its local assets.

### Automatic behavior

The portfolio catalogue, project detail page and static GitHub Pages project route are derived from the project content record and shared project infrastructure.

Project aliases are also included in static route generation.

### Do not

- Do not modify `PortfolioMap` for a normal new project.
- Do not modify the shared project renderer for ordinary project publication.
- Do not create project-specific rendering architecture unless the shared portfolio engine is intentionally being extended.

---

## Media

### Source

`src/content/media/<media-slug>/media.ts`

### Add or update media

1. Create or edit the appropriate `media.ts` record.
2. Maintain the shared metadata, status and relationships.
3. Set media-specific fields such as media type, platform, duration or external URL where applicable.
4. Import new media into `src/content/engine/registry.ts`.
5. Add new records to the registry source records.
6. Run validation and build.
7. Review the Media page and any related-content surfaces.

### Do not

Do not hard-code a new media item directly into the Media page if it belongs in the content registry.

---

## Series

### Source

`src/content/series/<series-slug>/series.ts`

### Series contract

A series maintains an ordered `partIds` list.

Each article belonging to that series must also declare:

- `seriesId`
- `seriesPart`

The registry validates both directions.

### Add a new article to an existing series

1. Set the article's `seriesId`.
2. Set its unique `seriesPart`.
3. Add the article ID to the series `partIds` in the intended order.
4. Run typecheck and build.

The build must not be allowed to proceed with duplicate series positions, missing members or mismatched series references.

---

## Tools

### Content-platform source

`src/content/tools/<tool-slug>/tool.ts`

Tool content records participate in the central content registry and relationship system.

### Built With presentation

The current Built With interface also uses:

- `src/built-with/toolData.ts`
- `src/built-with/toolDialogData.ts`

These are separate from the content-platform tool record and should not be assumed to update automatically from one another.

### Add or update a tool

First determine what is changing:

- Content identity / relationships: update the tool record under `src/content/tools/`.
- Built With card presentation: update `src/built-with/toolData.ts`.
- Built With dialog metadata: update `src/built-with/toolDialogData.ts`.

If a new content-platform tool record is created:

1. create its `tool.ts`;
2. import it into `src/content/engine/registry.ts`;
3. add it to the registry source records;
4. configure relationships from real content;
5. validate and build.

### Related content

Built With dialogs derive related articles and projects through the existing relationship/query helpers.

Do not manually duplicate related project or article cards when the relationship system already provides them.

---

## Publication checks

Before merging content work:

```powershell
npm run typecheck
npm run build
```

Then verify:

- the intended route renders;
- published/draft status behaves correctly;
- relationships resolve correctly;
- images and alt text are appropriate;
- desktop rendering is correct;
- mobile rendering is correct;
- no unrelated shared renderer was changed.

Content work should be completed on a dedicated branch and merged into `main` only after validation and review.
