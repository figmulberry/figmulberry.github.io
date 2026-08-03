# The Kalabash Mosaics Content Platform Specification

**Version:** 1.0  
**Status:** Approved foundation  
**Repository:** `figmulberry.github.io`  
**Public website:** The Kalabash Mosaics  
**Last revised:** 2026-08-03

## 1. Purpose

The Kalabash Mosaics website is a long-term knowledge platform rather than a collection of disconnected static pages.

The platform must support regular publication and continued growth for at least the next ten years without requiring article-specific page components, duplicated metadata, or manual updates across multiple sections of the website.

The website is both:

1. the canonical content repository; and
2. the only public presentation layer.

No separate MyST publication, external article renderer, or secondary public content site forms part of the production architecture.

## 2. Core Principles

### 2.1 One source, many outputs

A content item is defined once.

The registry then makes it available to:

- its canonical detail page;
- the homepage;
- content-library pages;
- search;
- category pages;
- series pages;
- tool relationships;
- project relationships;
- related-content sections;
- sitemap generation;
- future RSS feeds;
- future newsletters;
- future APIs.

Publishing one item must not require manually editing all of these locations.

### 2.2 One website, one deployment

The React website is self-contained.

All production content, metadata, relationships, assets, routes, and presentation logic live in the `figmulberry.github.io` repository.

### 2.3 Stable identity

Every content item has a permanent string ID and slug.

Titles may change. URLs may receive aliases. The underlying ID must remain stable.

### 2.4 Relationships are data

Connections between articles, projects, tools, media, blogs, topics, and series are stored as identifiers.

They are not hard-coded into page components.

### 2.5 Content types share a foundation

Articles, blogs, projects, media, and future content types share a common base model while retaining their own specialized fields and page layouts.

### 2.6 Validation precedes publication

A production build must fail when published content contains critical defects, including:

- duplicate IDs;
- duplicate canonical slugs;
- invalid dates;
- missing required metadata;
- broken internal relationships;
- invalid series ordering;
- missing required assets;
- unknown content types;
- published items referencing draft-only content.

### 2.7 No placeholders in production

Placeholder articles, projects, media, images, descriptions, or relationships must not appear in the production registry.

Draft content may exist, but it must be excluded from public queries and routes.

### 2.8 Backward compatibility

Published URLs must remain valid.

When a slug changes, the previous slug must be preserved as an alias or redirect.

### 2.9 Accessible by default

Every public image requires meaningful alternative text unless it is explicitly decorative.

Interactive content must support keyboard navigation and visible focus.

Heading structure must remain logical and sequential.

### 2.10 Content becomes more valuable over time

Each new publication should strengthen the wider website through search, related content, categories, series, tools, projects, and homepage discovery.

The platform should compound in usefulness rather than merely accumulate pages.

## 3. Content Types

Version 1 recognizes:

- article;
- blog;
- project;
- media;
- tool;
- topic;
- series.

The architecture must allow future content types without rewriting the registry.

Potential future types include:

- course;
- workshop;
- dataset;
- template;
- map;
- publication;
- book;
- podcast;
- newsletter;
- conference talk;
- plugin.

## 4. Shared Content Fields

Every primary content item must support:

- `schemaVersion`
- `id`
- `contentType`
- `slug`
- `aliases`
- `title`
- `description`
- `status`
- `publishedAt`
- `updatedAt`
- `authors`
- `tags`
- `topicIds`
- `featured`
- `thumbnail`
- `banner`
- `relationships`
- `searchKeywords`

## 5. Status Model

Supported content statuses:

- `draft`
- `scheduled`
- `published`
- `archived`

Rules:

- Draft content is available during development but excluded from public queries.
- Scheduled content is excluded until its publication date.
- Published content appears in public routes and queries.
- Archived content remains accessible unless explicitly redirected or retired.
- Published content is never silently deleted.

## 6. Article Fields

Articles may additionally contain:

- `subtitle`
- `category`
- `difficulty`
- `seriesId`
- `seriesPart`
- `readingMinutes`
- `body`
- `tableOfContents`
- `figureIds`
- `referenceIds`
- `requirements`
- `learningObjectives`
- `relatedProjectIds`
- `canonicalSource`

Articles are substantial technical publications, tutorials, research notes, or deep dives.

## 7. Blog Fields

Blog posts may additionally contain:

- `category`
- `body`
- `readingMinutes`
- `relatedArticleIds`
- `relatedProjectIds`

Blogs are lighter, more timely, and more conversational than formal articles.

## 8. Project Fields

Projects may additionally contain:

- `category`
- `role`
- `client`
- `dateStarted`
- `dateCompleted`
- `toolIds`
- `challenge`
- `approach`
- `outcomes`
- `gallery`
- `downloads`
- `repositoryUrl`
- `liveUrl`
- `relatedArticleIds`
- `relatedMediaIds`

## 9. Media Fields

Media items may additionally contain:

- `mediaType`
- `duration`
- `platform`
- `externalUrl`
- `embedUrl`
- `transcript`
- `relatedArticleIds`
- `relatedProjectIds`

## 10. Tool Fields

Tools use stable IDs such as:

- `arcgis-pro`
- `qgis`
- `python`
- `jupyter`
- `power-bi`
- `microsoft-365`
- `vscode`
- `git`
- `librepcb`

Content references tools by ID rather than display name.

Tool pages and dialogs derive related content automatically from the registry.

## 11. Series

A series has:

- a stable series ID;
- a title;
- a description;
- an optional banner;
- an ordered list of content parts;
- a completion state;
- optional related tools and projects.

Series order must be deterministic.

Two articles may not occupy the same part number in one series.

## 12. Relationships

Relationships are bidirectional at query time.

For example, when an article contains:

```text
relatedToolIds: ["arcgis-pro"]