# Site Maintenance Guide

Operational guide for maintaining Moses Thiong'o's portfolio website.

Content publication is covered separately in `content-authoring-guide.md`.

## Core rule

Change the authoritative source for the feature being maintained.

Do not duplicate data into presentation components when the website already derives it from shared data or the content registry.

For routine maintenance, avoid changing shared architecture unless the architecture itself is the intended change.

---

## Homepage

### Primary files

- `src/pages/Home.tsx` — homepage composition.
- `src/home-hero/GeoHero.tsx` — hero presentation.
- `src/home-hero/GeoInstrument.tsx` — hero instrument.
- `src/hero-globe/` — globe data, projection and rendering.

### Derived content

Homepage projects are selected through:

`src/lib/content/getHomepageFeaturedProjects.ts`

Homepage article selection uses:

`src/lib/content/getDailyFeaturedArticles.ts`

Project records control homepage eligibility and order through their homepage-featured fields.

### Routine update

- Change homepage composition in `src/pages/Home.tsx`.
- Change hero presentation in `src/home-hero/`.
- Change a featured project through the project content record rather than hard-coding the project into the homepage.
- Change article content through the article system rather than duplicating article data in `Home.tsx`.

### Do not

- Do not manually duplicate registered projects or articles into the homepage.
- Do not modify globe architecture for an ordinary homepage content update.

---

## About

### Source

Content:

`src/about/aboutData.ts`

Types:

`src/about/types.ts`

Presentation:

`src/pages/About.tsx`

### Routine update

For normal About content changes, update `aboutData.ts`.

Change `About.tsx` only when the page presentation or behavior itself needs to change.

Change `types.ts` only when the About data contract is intentionally being expanded or changed.

### Do not

Do not place routine biography or About content directly into the page component when it belongs in `aboutData.ts`.

---

## Core Capabilities

### Current implementation

The current Core Capabilities implementation is under:

`src/core-capabilities/`

Key content/data files include:

- `capabilityData.ts`
- `capabilityContent.ts`
- `supportingTraits.ts`

Presentation is handled by components including:

- `CoreCapabilities.tsx`
- `CapabilityCanvas.tsx`
- `CapabilityPanel.tsx`

### Routine update

Change capability content in the capability data/content files.

Change layout or interaction only in the relevant presentation files.

### Legacy caution

A separate `src/capabilities/` implementation also exists.

Do not assume both capability systems are active or edit both for the same routine change.

Confirm which implementation is rendered before changing architecture.

---

## Built With

### Presentation sources

- `src/built-with/toolData.ts` — Built With card data.
- `src/built-with/toolDialogData.ts` — dialog metadata.
- `src/built-with/BuiltWith.tsx` — section presentation.
- `src/built-with/ToolCard.tsx` — tool card presentation.
- `src/built-with/ToolDialog.tsx` — tool detail dialog.

### Related content

Tool dialogs use the existing content helpers to derive related articles and projects.

### Routine update

- Card presentation/content: update `toolData.ts`.
- Dialog metadata: update `toolDialogData.ts`.
- Tool relationships with registered content: use the content-platform tool and relationship system.

### Important distinction

Built With presentation data and content-platform tool records are currently separate systems.

Do not assume changing one automatically changes the other.

### Do not

Do not manually hard-code related article or project cards when the existing relationship helpers can derive them.

---

## Portfolio

### Primary sources

Landing page:

`src/pages/Portfolio.tsx`

Project content:

`src/content/projects/<project-slug>/project.ts`

Project detail presentation:

- `src/pages/projects/ProjectPage.tsx`
- `src/pages/projects/ProjectIntro.tsx`
- `src/pages/projects/ProjectCaseStudyRenderer.tsx`

Portfolio map:

- `src/portfolio/PortfolioMap.tsx`
- `src/portfolio/map/`

Project queries:

- `src/lib/content/getPortfolioProjects.ts`
- `src/lib/content/getPublishedProjects.ts`
- `src/lib/content/getHomepageFeaturedProjects.ts`

### Routine project update

Update the project record and its local assets.

Project ordering, featured state, locations and map placements are data carried by project records.

### Portfolio experience update

Change `Portfolio.tsx` only when changing the catalogue experience itself.

Change shared project renderers only when intentionally changing how all relevant projects are presented.

### Map rule

Normal project publication should use the existing `locations` and `mapPlacements` contract.

Do not modify `PortfolioMap.tsx` for a normal project addition.

---

## CV

### Source

CV content:

`src/cv/cvData.ts`

CV types:

`src/cv/types.ts`

Web presentation:

`src/pages/CV.tsx`

PDF build script:

`scripts/cv/build-cv-pdf.py`

### Routine update

Update CV content in `cvData.ts`.

Change `CV.tsx` only when changing web presentation.

Change `types.ts` only when intentionally changing the CV data contract.

### PDF

The website CV data and PDF-generation system are separate implementation paths.

When CV content changes, verify whether the PDF also requires regeneration or corresponding source updates before treating the CV update as complete.

### Validate

After a CV update:

```powershell
npm run typecheck
npm run build
```

Then review the web CV and all changed links.

---

## Navigation and Global UI

### Primary files

- `src/App.tsx` — application routes.
- `src/components/layout/Header.tsx` — global header/navigation.
- `src/components/layout/Footer.tsx` — global footer.
- `src/components/layout/Layout.tsx` — shared page layout.

### Routine update

Change `App.tsx` when adding, removing or changing an application route.

Change Header or Footer only for global navigation/presentation changes.

### Route caution

Application routing and GitHub Pages static-route preparation are related but separate.

When introducing a new route that must work on direct navigation in production, verify whether `scripts/postbuild.mjs` also needs to prepare it.

---

## Global Assets

### Public assets

Global browser-facing assets live under `public/`.

Current favicon files include:

- `favicon.svg`
- `favicon-32.png`
- `favicon-16.png`
- `apple-touch-icon.png`

Their HTML references are defined in `index.html`.

### Routine asset update

When replacing a global asset:

1. preserve the expected filename unless intentionally changing its reference;
2. verify the corresponding HTML or component reference;
3. run the production build;
4. verify the generated asset in `dist`;
5. test the production behavior after deployment where browser caching is relevant.

---

## Build

### Requirements

Node.js 24.x and npm.

### Commands

Development:

```powershell
npm run dev
```

TypeScript validation:

```powershell
npm run typecheck
```

Production build:

```powershell
npm run build
```

Production preview:

```powershell
npm run preview
```

### Production build contract

`npm run build` runs:

```text
vite build
node scripts/postbuild.mjs
```

The postbuild step prepares GitHub Pages static routing, including top-level routes, project routes, project aliases, `404.html` and `.nojekyll`.

A successful Vite build alone is therefore not the complete production build.

---

## Deployment

`main` is the production branch.

A push to `main` triggers `.github/workflows/deploy-pages.yml`.

The workflow:

1. checks out the repository;
2. configures Node.js 24;
3. installs dependencies;
4. runs `npm run typecheck`;
5. runs `npm run build`;
6. uploads `dist`;
7. deploys to GitHub Pages.

### Development rule

Do not perform normal feature or maintenance development directly on `main`.

Use a dedicated branch, validate the work, review it, then merge into `main`.

---

## Versioning and Releases

Production milestones are represented by Git tags and GitHub Releases.

Current production release:

`v2.0.0`

### Release rule

A release represents a verified production milestone, not every commit.

Create a release only after:

1. the intended work is complete;
2. typecheck passes;
3. the production build passes;
4. visual or functional QA is complete;
5. the work is merged into `main`;
6. production deployment is verified.

### Version consistency

Git/GitHub currently identify the production website as `v2.0.0` while `package.json` still reports `1.0.0`.

Do not change either value casually. Decide whether `package.json` is intended to track website release versions, then keep the chosen policy consistent.

---

## Standard validation

For code, content or presentation changes:

```powershell
npm run typecheck
npm run build
```

Also perform targeted browser QA for the area changed.

Before merge, confirm that no unrelated files were changed and that the working branch contains only the intended work.
