import type {
  ContentRecord,
  ContentStatus,
  ContentType,
} from './types';

export function isDiscoverableContent(
  item: ContentRecord,
  now = new Date(),
): boolean {
  if (item.status === 'published') {
    return true;
  }

  if (item.status !== 'scheduled') {
    return false;
  }

  return (
    new Date(item.publishedAt).getTime() <=
    now.getTime()
  );
}

export function isRoutableContent(
  item: ContentRecord,
  now = new Date(),
): boolean {
  return (
    item.status === 'archived' ||
    isDiscoverableContent(item, now)
  );
}

export function getDiscoverableContent(
  records: readonly ContentRecord[],
  now = new Date(),
): ContentRecord[] {
  return records
    .filter((item) =>
      isDiscoverableContent(item, now),
    )
    .sort(compareContentDatesDescending);
}

export function getRoutableContent(
  records: readonly ContentRecord[],
  now = new Date(),
): ContentRecord[] {
  return records
    .filter((item) =>
      isRoutableContent(item, now),
    )
    .sort(compareContentDatesDescending);
}

export function getContentByStatus(
  records: readonly ContentRecord[],
  status: ContentStatus,
): ContentRecord[] {
  return records.filter(
    (item) => item.status === status,
  );
}

export function getDiscoverableByType<
  T extends ContentType,
>(
  records: readonly ContentRecord[],
  contentType: T,
  now = new Date(),
): Extract<
  ContentRecord,
  { contentType: T }
>[] {
  return getDiscoverableContent(
    records,
    now,
  ).filter(
    (
      item,
    ): item is Extract<
      ContentRecord,
      { contentType: T }
    > => item.contentType === contentType,
  );
}

export function getFeaturedContent(
  records: readonly ContentRecord[],
  now = new Date(),
): ContentRecord[] {
  return getDiscoverableContent(
    records,
    now,
  ).filter((item) => item.featured);
}

export function getLatestContent(
  records: readonly ContentRecord[],
  limit: number,
  now = new Date(),
): ContentRecord[] {
  validateLimit(limit);

  return getDiscoverableContent(
    records,
    now,
  ).slice(0, limit);
}

export function getLatestByType<
  T extends ContentType,
>(
  records: readonly ContentRecord[],
  contentType: T,
  limit: number,
  now = new Date(),
): Extract<
  ContentRecord,
  { contentType: T }
>[] {
  validateLimit(limit);

  return getDiscoverableByType(
    records,
    contentType,
    now,
  ).slice(0, limit);
}

export function getContentByTag(
  records: readonly ContentRecord[],
  tag: string,
  now = new Date(),
): ContentRecord[] {
  const normalizedTag = tag
    .trim()
    .toLocaleLowerCase();

  return getDiscoverableContent(
    records,
    now,
  ).filter((item) =>
    item.tags.some(
      (candidate) =>
        candidate
          .trim()
          .toLocaleLowerCase() ===
        normalizedTag,
    ),
  );
}

export function getContentByTopic(
  records: readonly ContentRecord[],
  topicId: string,
  now = new Date(),
): ContentRecord[] {
  return getDiscoverableContent(
    records,
    now,
  ).filter((item) =>
    item.topicIds.includes(topicId),
  );
}

function validateLimit(limit: number): void {
  if (
    !Number.isInteger(limit) ||
    limit < 0
  ) {
    throw new Error(
      'Content query limit must be a non-negative integer.',
    );
  }
}

function compareContentDatesDescending(
  left: ContentRecord,
  right: ContentRecord,
): number {
  const publishedDifference =
    new Date(right.publishedAt).getTime() -
    new Date(left.publishedAt).getTime();

  if (publishedDifference !== 0) {
    return publishedDifference;
  }

  return left.id.localeCompare(right.id);
}

export function getArticleBySlug(
  records: readonly ContentRecord[],
  slug: string,
): Extract<
  ContentRecord,
  { contentType: 'article' }
> | undefined {
  const normalizedSlug = slug.trim();

  const record = records.find(
    (item) =>
      item.contentType === 'article' &&
      (
        item.slug === normalizedSlug ||
        item.aliases.includes(normalizedSlug)
      ),
  );

  if (
    !record ||
    record.contentType !== 'article'
  ) {
    return undefined;
  }

  return record;
}