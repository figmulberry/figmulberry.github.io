# Content Platform Specification

Architecture contract for the content system supporting Moses Thiong'o's portfolio website.

## Purpose

The content platform provides one structured source for publishable content and the relationships between that content.

It supports reuse across the website without manually duplicating the same content into individual presentation components.

This document defines architecture and invariants.

Operational publishing instructions belong in `content-authoring-guide.md`.

Website maintenance instructions belong in `site-maintenance-guide.md`.

---

## Architecture status

### Implemented

The current content engine supports these record types:

- article
- blog
- project
- media
- tool
- topic
- series

The production registry currently contains projects, articles, media, tools and series.

Blog is supported by the schema and application routes, but no production blog record currently exists.

### Architecture contract

Future content work should preserve the following rules unless the content architecture is intentionally redesigned.

---

## One source, many outputs

A content item should have one authoritative record.

Pages, recommendations, related-content surfaces and other derived views should query that source rather than maintain separate copies.

Routine publication should not require editing every place where the content may appear.

---

## Stable identity

Every content record has a stable ID and canonical slug.

IDs are relationship keys and must not be casually reused or changed.

Slugs use lowercase kebab-case.

Aliases may preserve previous or alternate routes where required.

---

## Shared content contract

Content records share core metadata including:

- ID
- content type
- slug
- aliases
- title
- description
- status
- publication date
- authors
- tags
- topics
- relationships
- search metadata

Individual content types extend this shared contract with type-specific fields.

---

## Publication state

Supported content states are:

- draft
- scheduled
- published
- archived

Published content is discoverable.

Scheduled content becomes discoverable when its publication time is reached.

Draft content must not be treated as published content.

---

## Relationships are data

Connections between content records are represented as explicit relationships rather than hard-coded presentation logic.

The relationship system supports incoming and outgoing resolution.

Related-content surfaces should use those relationships or established query helpers rather than duplicate relationship lists in UI components.

The registry rejects relationships to unknown content IDs.

A published record must not reference draft content.

Duplicate relationships are invalid.

---

## Registry

`src/content/engine/registry.ts` is the central production registry.

A new production content record must be imported and included in the registry unless its content type has an intentionally different registration mechanism.

Registry validation protects:

- content identity
- canonical slugs
- aliases
- relationships
- publication relationships
- series consistency

Validation failures are defects to correct, not checks to bypass.

---

## Articles

Articles use structured metadata plus authored body content.

They may include references, figures, table-of-contents metadata, requirements and series membership.

Article presentation is shared; routine article publication should not require modifying the shared renderer.

---

## Blogs

Blog is a supported content type with category, reading time and body content.

No production blog record currently exists.

The first production blog should establish and document the canonical authoring package without weakening the shared content contract.

---

## Projects

Projects are structured portfolio records.

A project may define:

- project metadata
- role and collaborators
- tools
- hero and thumbnail imagery
- case-study sections
- challenge and approach
- outcomes
- locations
- map placements
- homepage and portfolio ordering
- repository or live links

Normal project publication must use the shared project renderer and existing portfolio-map data contract.

A project should not require project-specific application architecture unless the shared platform itself is being extended.

---

## Media

Media records represent publishable external or internal media resources.

Media-specific metadata may include type, platform, duration and external URL.

Media records participate in the same registry and relationship system as other content.

---

## Tools

Tool records represent technologies used by or related to published work.

Tool relationships can connect technologies with real projects and articles.

The content-platform tool record is distinct from the current Built With presentation data.

Until those systems are intentionally unified, documentation and maintenance must preserve that distinction.

---

## Series

Series records maintain an ordered list of article IDs.

A series article also identifies its series and part number.

The registry validates both sides of that relationship.

Series members must exist, must be articles, must point back to the correct series, and must not reuse the same series position.

---

## Validation

Content validation occurs through the schema and registry before publication should be accepted.

Routine content work must pass:

```powershell
npm run typecheck
npm run build
```

The production build is also responsible for preparing GitHub Pages static routes.

---

## Rendering boundary

Content records describe content.

Shared renderers describe presentation.

Do not put ordinary content-specific exceptions into shared renderers when the requirement can be expressed through the existing content contract.

Change shared rendering architecture only when the platform itself needs a new reusable capability.

---

## Backward compatibility

Stable IDs, canonical slugs and valid aliases should be preserved when content evolves.

Existing public routes should not be broken casually.

Changes to schemas or shared renderers must consider already-published records.

---

## Accessibility

Published images require meaningful alternative text when the image conveys information.

Interactive presentation must remain keyboard-usable and understandable without relying solely on visual effects.

Accessibility is part of publication quality, not a post-publication correction.

---

## Production principle

Content should compound the usefulness of the website.

A new record should integrate through the existing content architecture wherever appropriate instead of creating an isolated one-off implementation.

When the architecture cannot express a legitimate new requirement, extend the shared architecture deliberately and document the new contract.
