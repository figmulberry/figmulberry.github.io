import type {
  ContentRecord,
  ContentRelationship,
  ContentType,
  RelationshipType,
} from './types';

export type ResolvedRelationship = {
  relationship: ContentRelationship;
  source: ContentRecord;
  target: ContentRecord;
  direction: 'outgoing' | 'incoming';
};

export function getContentById(
  records: readonly ContentRecord[],
  id: string,
): ContentRecord | undefined {
  return records.find((record) => record.id === id);
}

export function getContentBySlug(
  records: readonly ContentRecord[],
  contentType: ContentType,
  slug: string,
): ContentRecord | undefined {
  return records.find(
    (record) =>
      record.contentType === contentType &&
      (
        record.slug === slug ||
        record.aliases.includes(slug)
      ),
  );
}

export function getOutgoingRelationships(
  records: readonly ContentRecord[],
  sourceId: string,
  relationshipType?: RelationshipType,
): ResolvedRelationship[] {
  const source = getContentById(records, sourceId);

  if (!source) {
    return [];
  }

  return source.relationships
    .filter(
      (relationship) =>
        relationshipType === undefined ||
        relationship.type === relationshipType,
    )
    .map((relationship) => {
      const target = getContentById(
        records,
        relationship.targetId,
      );

      if (!target) {
        return undefined;
      }

      return {
        relationship,
        source,
        target,
        direction: 'outgoing' as const,
      };
    })
    .filter(
      (
        item,
      ): item is ResolvedRelationship =>
        item !== undefined,
    );
}

export function getIncomingRelationships(
  records: readonly ContentRecord[],
  targetId: string,
  relationshipType?: RelationshipType,
): ResolvedRelationship[] {
  const target = getContentById(records, targetId);

  if (!target) {
    return [];
  }

  return records.flatMap((source) =>
    source.relationships
      .filter(
        (relationship) =>
          relationship.targetId === targetId &&
          (
            relationshipType === undefined ||
            relationship.type === relationshipType
          ),
      )
      .map((relationship) => ({
        relationship,
        source,
        target,
        direction: 'incoming' as const,
      })),
  );
}

export function getSemanticNeighbors(
  records: readonly ContentRecord[],
  contentId: string,
  relationshipTypes?: readonly RelationshipType[],
): ContentRecord[] {
  const allowedTypes = relationshipTypes
    ? new Set(relationshipTypes)
    : undefined;

  const relationships = [
    ...getOutgoingRelationships(records, contentId),
    ...getIncomingRelationships(records, contentId),
  ].filter(
    ({ relationship }) =>
      allowedTypes === undefined ||
      allowedTypes.has(relationship.type),
  );

  const uniqueNeighbors = new Map<
    string,
    ContentRecord
  >();

  for (const resolved of relationships) {
    const neighbor =
      resolved.direction === 'outgoing'
        ? resolved.target
        : resolved.source;

    if (
      neighbor.id !== contentId &&
      neighbor.status !== 'draft'
    ) {
      uniqueNeighbors.set(
        neighbor.id,
        neighbor,
      );
    }
  }

  return [...uniqueNeighbors.values()];
}

export function getContentByRelationshipTarget(
  records: readonly ContentRecord[],
  targetId: string,
  relationshipType?: RelationshipType,
): ContentRecord[] {
  return getIncomingRelationships(
    records,
    targetId,
    relationshipType,
  ).map(({ source }) => source);
}