import {
  topoGridsPart1References,
} from '@/content/articles/topo-grids-part-1/references';

import {
  recreatingHistoricScaleBarsReferences,
} from '@/content/articles/recreating-historic-scale-bars-arcgis-pro/references';

import {
  foodLossGovernanceReferences,
} from '@/content/articles/the-spatial-governance-gap-of-food-loss-and-waste/references';

import type {
  ReferenceRecord,
} from './types';

const sourceReferences:
  readonly ReferenceRecord[] = [
    ...topoGridsPart1References,
    ...recreatingHistoricScaleBarsReferences,
    ...foodLossGovernanceReferences,
  ];

function validateReferenceRegistry(
  references: readonly ReferenceRecord[],
): readonly ReferenceRecord[] {
  const ids = new Set<string>();

  for (const reference of references) {
    const normalizedId =
      reference.id.trim();

    const normalizedCitation =
      reference.citation.trim();

    if (normalizedId.length === 0) {
      throw new Error(
        'Reference IDs cannot be empty.',
      );
    }

    if (normalizedCitation.length === 0) {
      throw new Error(
        `Reference ${reference.id} has an empty citation.`,
      );
    }

    if (ids.has(reference.id)) {
      throw new Error(
        `Duplicate reference ID: ${reference.id}`,
      );
    }

    ids.add(reference.id);
  }

  return references;
}

export const referenceRegistry =
  validateReferenceRegistry(
    sourceReferences,
  );

const referencesById =
  new Map<string, ReferenceRecord>(
    referenceRegistry.map(
      (reference) => [
        reference.id,
        reference,
      ],
    ),
  );

export function getReferencesByIds(
  referenceIds: readonly string[],
): ReferenceRecord[] {
  const seenIds = new Set<string>();

  return referenceIds.map(
    (referenceId) => {
      if (seenIds.has(referenceId)) {
        throw new Error(
          `Duplicate article reference ID: ${referenceId}`,
        );
      }

      seenIds.add(referenceId);

      const reference =
        referencesById.get(referenceId);

      if (!reference) {
        throw new Error(
          `Unknown reference ID: ${referenceId}`,
        );
      }

      return reference;
    },
  );
}
