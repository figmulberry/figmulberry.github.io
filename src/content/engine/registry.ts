import { contentRecordSchema } from './schema';

import { topoGridsPart1Article } from
  '@/content/articles/topo-grids-part-1/article';

import { topoGridsPart2Article } from
  '@/content/articles/topo-grids-part-2/article';

import { recreatingHistoricScaleBarsArticle } from
  '@/content/articles/recreating-historic-scale-bars-arcgis-pro/article';

import { foodLossGovernanceArticle } from
  '@/content/articles/the-spatial-governance-gap-of-food-loss-and-waste/article';

import { aGrainOfLoveMedia } from
  '@/content/media/a-grain-of-love/media';

import { nacisPresentationMedia } from
  '@/content/media/nacis-presentation/media';

import { featureOutlineMasksMedia } from
  '@/content/media/feature-outline-masks/media';

import { historicTopographicMapRecreationSeries } from
  '@/content/series/historic-topographic-map-recreation/series';

import { roleOfGisMedia } from
  '@/content/media/role-of-gis/media';

import { arcgisProTool } from
  '@/content/tools/arcgis-pro/tool';

import { tutuilaTerrainStudyProject } from
  '@/content/projects/tutuila-terrain-study/project';

import { arcticAntarcticSeaIceProject } from
  '@/content/projects/arctic-antarctic-sea-ice-extent/project';

import { orphanedOilGasWellsProject } from
  '@/content/projects/orphaned-oil-gas-wells-density/project';

import { usPublicLibrariesAreaProject } from
  '@/content/projects/us-public-libraries-area-2019/project';

import type {
  ArticleContent,
  ContentRecord,
  SeriesContent,
} from './types';

const sourceRecords: readonly ContentRecord[] = [
  arcgisProTool,

  tutuilaTerrainStudyProject,
  arcticAntarcticSeaIceProject,
  orphanedOilGasWellsProject,
  usPublicLibrariesAreaProject,

  aGrainOfLoveMedia,
  nacisPresentationMedia,
  featureOutlineMasksMedia,
  historicTopographicMapRecreationSeries,
  topoGridsPart1Article,
  topoGridsPart2Article,
  recreatingHistoricScaleBarsArticle,
  foodLossGovernanceArticle,
  roleOfGisMedia,
];

function validateRegistry(
  records: readonly ContentRecord[],
): ContentRecord[] {
  const validated = records.map((record) =>
    contentRecordSchema.parse(record),
  );

  validateUniqueIdentities(validated);
  validateRelationships(validated);
  validateSeries(validated);

  return validated;
}

function validateUniqueIdentities(
  records: readonly ContentRecord[],
): void {
  const ids = new Set<string>();
  const canonicalRoutes = new Set<string>();
  const aliases = new Set<string>();

  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(
        `Duplicate content ID: ${record.id}`,
      );
    }

    ids.add(record.id);

    const canonicalRoute =
      `${record.contentType}:${record.slug}`;

    if (
      canonicalRoutes.has(
        canonicalRoute,
      )
    ) {
      throw new Error(
        `Duplicate canonical slug: ${canonicalRoute}`,
      );
    }

    canonicalRoutes.add(
      canonicalRoute,
    );

    for (
      const alias of record.aliases
    ) {
      const aliasRoute =
        `${record.contentType}:${alias}`;

      if (
        aliases.has(aliasRoute) ||
        canonicalRoutes.has(
          aliasRoute,
        )
      ) {
        throw new Error(
          `Duplicate or conflicting alias: ${aliasRoute}`,
        );
      }

      aliases.add(
        aliasRoute,
      );
    }
  }

  for (
    const canonicalRoute of
    canonicalRoutes
  ) {
    if (
      aliases.has(canonicalRoute)
    ) {
      throw new Error(
        `Alias conflicts with canonical route: ${canonicalRoute}`,
      );
    }
  }
}

function validateRelationships(
  records: readonly ContentRecord[],
): void {
  const recordsById = new Map(
    records.map((record) => [
      record.id,
      record,
    ]),
  );

  for (const record of records) {
    const seenEdges =
      new Set<string>();

    for (
      const relationship of
      record.relationships
    ) {
      if (
        relationship.targetId ===
        record.id
      ) {
        throw new Error(
          `${record.id} cannot relate to itself.`,
        );
      }

      const target =
        recordsById.get(
          relationship.targetId,
        );

      if (!target) {
        throw new Error(
          `${record.id} references unknown content ID: ${relationship.targetId}`,
        );
      }

      const edgeKey =
        `${relationship.type}:${relationship.targetId}`;

      if (
        seenEdges.has(edgeKey)
      ) {
        throw new Error(
          `${record.id} contains duplicate relationship: ${edgeKey}`,
        );
      }

      seenEdges.add(edgeKey);

      if (
        record.status ===
          'published' &&
        target.status ===
          'draft'
      ) {
        throw new Error(
          `${record.id} is published but references draft content: ${target.id}`,
        );
      }
    }
  }
}

function validateSeries(
  records: readonly ContentRecord[],
): void {
  const recordsById = new Map(
    records.map((record) => [
      record.id,
      record,
    ]),
  );

  const seriesRecords =
    records.filter(
      (
        record,
      ): record is SeriesContent =>
        record.contentType ===
        'series',
    );

  const seriesParts =
    new Set<string>();

  for (const record of records) {
    if (
      record.contentType !==
      'article'
    ) {
      continue;
    }

    validateArticleSeries(
      record,
      recordsById,
      seriesParts,
    );
  }

  for (
    const series of seriesRecords
  ) {
    validateSeriesMembers(
      series,
      recordsById,
    );
  }
}

function validateArticleSeries(
  article: ArticleContent,
  recordsById: ReadonlyMap<
    string,
    ContentRecord
  >,
  seriesParts: Set<string>,
): void {
  if (
    article.seriesId ===
      undefined ||
    article.seriesPart ===
      undefined
  ) {
    return;
  }

  const series =
    recordsById.get(
      article.seriesId,
    );

  if (!series) {
    throw new Error(
      `${article.id} references unknown series: ${article.seriesId}`,
    );
  }

  if (
    series.contentType !==
    'series'
  ) {
    throw new Error(
      `${article.id} seriesId does not point to a series: ${article.seriesId}`,
    );
  }

  const partKey =
    `${article.seriesId}:${article.seriesPart}`;

  if (
    seriesParts.has(partKey)
  ) {
    throw new Error(
      `Duplicate series part: ${partKey}`,
    );
  }

  seriesParts.add(partKey);

  if (
    !series.partIds.includes(
      article.id,
    )
  ) {
    throw new Error(
      `${article.id} is missing from ${series.id}.partIds`,
    );
  }
}

function validateSeriesMembers(
  series: SeriesContent,
  recordsById: ReadonlyMap<
    string,
    ContentRecord
  >,
): void {
  const seenMembers =
    new Set<string>();

  for (
    const partId of
    series.partIds
  ) {
    if (
      seenMembers.has(partId)
    ) {
      throw new Error(
        `${series.id} contains duplicate member: ${partId}`,
      );
    }

    seenMembers.add(partId);

    const member =
      recordsById.get(
        partId,
      );

    if (!member) {
      throw new Error(
        `${series.id} references unknown member: ${partId}`,
      );
    }

    if (
      member.contentType !==
      'article'
    ) {
      throw new Error(
        `${series.id} member is not an article: ${partId}`,
      );
    }

    if (
      member.seriesId !==
      series.id
    ) {
      throw new Error(
        `${partId} does not point back to series ${series.id}`,
      );
    }
  }
}

export const contentRegistry =
  validateRegistry(
    sourceRecords,
  );