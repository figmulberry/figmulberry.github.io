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

### Architecture

The CV uses a single-source architecture.

```text

                         CV SINGLE-SOURCE ARCHITECTURE
                              AUTHOR HERE
                                  |
                                  v
                         src/cv/cvData.json
                         ------------------
                         SINGLE SOURCE OF TRUTH
                                  |
                  +---------------+---------------+
                  |                               |
                  v                               v
              WEB CV                         PDF CV
         src/pages/CV.tsx          scripts/cv/build-cv-pdf.py
                  |                               |
                  | renders                       | renders
                  v                               v
       Responsive interactive             Branded Arimo PDF
               CV UI                              |
                                                  v
                           public/downloads/Moses-Thiongo-CV.pdf
                                                  |
                                                  | copied by Vite
                                                  v
                            dist/downloads/Moses-Thiongo-CV.pdf
                                                  |
                                                  v
                                           GitHub Pages

```

`src/cv/cvData.json` is the authoritative CV content source.

`src/cv/cvData.ts` is only a typed TypeScript adapter that imports the JSON and exposes it to the application.

`src/cv/types.ts` defines the CV data contract.

`src/pages/CV.tsx` is the web renderer.

`scripts/cv/build-cv-pdf.py` is the branded PDF renderer and adapter.

`public/downloads/Moses-Thiongo-CV.pdf` is a generated artifact. Do not maintain its factual content manually.

### Content ownership

```text

src/cv/cvData.json
|
+-- profile
|   +-- name
|   +-- headline
|   +-- location
|   +-- summary
|   +-- researchInterests
|   +-- links
|
+-- experience
|   +-- every professional role
|       +-- title
|       +-- organization
|       +-- location
|       +-- dates
|       +-- highlights\[]
|
+-- education
|   +-- qualifications
|   +-- thesis/research
|   +-- advisors/supervisors
|   +-- awards
|
+-- selectedExpertise
+-- credentials
+-- skillGroups
+-- languages
+-- researchProjects
+-- publications
+-- presentations
+-- teaching
+-- leadership

```

For an ordinary CV content change, edit `src/cv/cvData.json`.

Do not duplicate the same factual content in `CV.tsx` or `build-cv-pdf.py`.

### Professional Experience parity

Professional Experience has a strict content-parity requirement.

```text

                         cvData.json
                              |
                        experience\[]
                              |
                +-------------+-------------+
                |                           |
                v                           v
              WEB                         PDF
                |                           |
         all roles rendered          all roles rendered
                |                           |
      all highlights rendered     all highlights rendered
                |                           |
                +-------------+-------------+
                              |
                              v
                    SAME PROFESSIONAL FACTS

```

The web CV and downloadable PDF may use different layouts, spacing, typography, interaction and pagination.

They must not silently contain different professional facts.

For every professional role, both representations must preserve:

\- title;

\- organization;

\- location;

\- dates;

\- every approved highlight/responsibility;

\- highlight order;

\- approved wording.

Do not truncate professional responsibilities to satisfy a layout constraint.

In particular, do not introduce rendering logic such as:

```tsx

role.highlights.slice(0, 4)

```

unless an intentionally different content product is being designed and documented.

> \*\*Pagination adapts to content. Content must not disappear to satisfy pagination.\*\*

### PDF pagination

The PDF renderer uses natural ReportLab flow.

Long employment records may continue across page boundaries.

The beginning of a professional role protects a meaningful opening unit consisting of its role title, metadata and first responsibility where applicable. Remaining responsibilities flow naturally.

Education similarly protects a meaningful opening unit so that an Education heading is not stranded at the bottom of a page.

Do not add hard-coded page breaks merely to make the current CV fit a particular page count.

The CV may gain pages as professional history grows. Correct pagination and complete content are more important than a fixed page count.

### Automatic PDF generation

```text

                         npm run build
                              |
                              v
                       npm run build:cv
                              |
                              v
                 scripts/cv/build-cv-pdf.py
                              |
                              | reads
                              v
                     src/cv/cvData.json
                              |
                              v
                   Generate branded PDF
                              |
                              v
          public/downloads/Moses-Thiongo-CV.pdf
                              |
                              v
                         Vite build
                              |
                              v
          dist/downloads/Moses-Thiongo-CV.pdf
                              |
                              v
                        GitHub Pages

```

`npm run build:cv` regenerates the branded PDF.

`npm run build` regenerates the PDF first, then runs the normal Vite and postbuild pipeline.

### PDF runtime dependencies

The PDF generation environment uses:

```text

Python 3.12
ReportLab 5.0.1
Arimo

```

Python dependencies are declared in:

`scripts/cv/requirements.txt`

The GitHub Pages workflow prepares Python, installs ReportLab and installs Arimo before the production build.

Local Windows generation may use installed Arimo fonts discovered by the PDF renderer.

GitHub Actions uses Arimo installed on the Ubuntu runner.

Do not commit private/local font files merely to make the PDF build portable.

### How to update the CV in the future

For a normal CV content change:

```text

1\. Edit src/cv/cvData.json.
2\. Add or change the appropriate canonical record.
3\. Do not manually duplicate the content in CV.tsx.
4\. Do not manually duplicate the content in build-cv-pdf.py.
5\. Run:
   npm run typecheck
6\. Run:
   npm run build
7\. Review the web CV.
8\. Review the downloadable PDF.
9\. Confirm professional-content parity.
10\. Test changed links.
11\. Commit only after both representations are correct.

```

### When to change the renderers

Change `src/pages/CV.tsx` only when changing web presentation or when the web renderer needs a reusable rendering capability.

Change `scripts/cv/build-cv-pdf.py` only when changing PDF presentation, pagination, adapters or generation behavior.

Change `src/cv/types.ts` only when intentionally changing the canonical CV data contract.

A normal content change should require no factual-content edit in either renderer.

### What not to do

Do not:

```text

\- maintain one wording for the web CV and another for the PDF;
\- manually edit the generated PDF;
\- hard-code professional roles or responsibilities into the PDF renderer;
\- hard-code factual CV records into the web renderer;
\- truncate professional responsibilities to make a web page shorter;
\- force fixed PDF page numbers for sections;
\- create another competing CV data source.

```

Remember:

```text

CONTENT CHANGE
      |
      v
EDIT cvData.json

```

```text

LAYOUT PROBLEM
      |
      v
FIX THE APPROPRIATE RENDERER

```

```text

DATA MODEL CANNOT EXPRESS A LEGITIMATE REQUIREMENT
      |
      v
EXTEND THE SHARED CV CONTRACT DELIBERATELY
      |
      v
DOCUMENT THE CHANGE

```

### Long-term reminder

If returning to this repository after months or years, begin with:

`src/cv/cvData.json`

That file owns the CV facts.

The website and downloadable PDF are derived representations of that data.

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
