# Moses Thiong'o

Source repository for Moses Thiong'o's portfolio and publishing website.

Production: https://figmulberry.github.io/

Current production release: `v2.0.0`

## Start here

Requires Node.js 24 and npm.

```powershell
npm install
npm run dev
```

Validation:

```powershell
npm run typecheck
npm run build
```

Production preview:

```powershell
npm run preview
```

## Where to make changes

| Task | Documentation |
| --- | --- |
| Add or update an article | `docs/content-authoring-guide.md#articles` |
| Add or update a blog | `docs/content-authoring-guide.md#blogs` |
| Add or update a portfolio project | `docs/content-authoring-guide.md#portfolio-projects` |
| Add or update media | `docs/content-authoring-guide.md#media` |
| Update a series | `docs/content-authoring-guide.md#series` |
| Update a tool / technology | `docs/content-authoring-guide.md#tools` |
| Update the homepage | `docs/site-maintenance-guide.md#homepage` |
| Update About | `docs/site-maintenance-guide.md#about` |
| Update Core Capabilities | `docs/site-maintenance-guide.md#core-capabilities` |
| Update Built With | `docs/site-maintenance-guide.md#built-with` |
| Update the Portfolio experience | `docs/site-maintenance-guide.md#portfolio` |
| Update the CV | `docs/site-maintenance-guide.md#cv` |
| Update navigation or global UI | `docs/site-maintenance-guide.md#navigation-and-global-ui` |
| Understand deployment | `docs/site-maintenance-guide.md#deployment` |
| Create a production release | `docs/site-maintenance-guide.md#versioning-and-releases` |
| Understand the content architecture | `docs/content-platform-specification.md` |

## Architecture

The website has two main layers:

- **Site experience** — Homepage, About, Portfolio, Core Capabilities, Built With, CV and global navigation.
- **Content platform** — articles, blogs, projects, media, tools, series and their relationships.

Published content is registered centrally and reused across the website. Routine content publication should not require editing shared renderers.

## Production

`main` is the production branch.

Feature, design, documentation and maintenance work should be completed on dedicated branches and validated before merge.

A production build runs:

```text
vite build
node scripts/postbuild.mjs
```

The postbuild step prepares GitHub Pages routes, portfolio project routes and aliases, `404.html`, and `.nojekyll`.

A push to `main` triggers the GitHub Pages workflow, which:

1. uses Node.js 24;
2. installs dependencies;
3. runs `npm run typecheck`;
4. runs `npm run build`;
5. uploads `dist`;
6. deploys to GitHub Pages.

## Documentation

- `docs/content-platform-specification.md` — content architecture and rules.
- `docs/content-authoring-guide.md` — how to publish and maintain content.
- `docs/site-maintenance-guide.md` — how to maintain the website and production workflow.
