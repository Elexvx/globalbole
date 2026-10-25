// Preserve the precision editors can substantiate. A calendar date is not an
// instant: never turn it into an invented midnight/noon publication timestamp.
export function isCalendarDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function isPublicationTimestamp(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/);
  if (!match || !isCalendarDate(match[1])) return false;
  // -00:00 means an unknown local offset in RFC 3339, not a known timezone.
  return +match[2] < 24 && +match[3] < 60 && +match[4] < 60 &&
    match[5] !== '-00:00' && (match[5] === 'Z' || (+match[7] < 24 && +match[8] < 60)) &&
    Number.isFinite(Date.parse(value));
}

export function validateArticleDates(article, { now = Date.now() } = {}) {
  if (!isCalendarDate(article.date)) throw new Error('date must be a real YYYY-MM-DD publication date');
  if (article.publishedAt !== undefined) {
    if (!isPublicationTimestamp(article.publishedAt)) throw new Error('publishedAt must be a real ISO 8601 timestamp with seconds and a known timezone');
    // The date is the editorial publication day in the timestamp's own offset,
    // so a valid +08:00 release can be on the preceding UTC calendar day.
    if (article.publishedAt.slice(0, 10) !== article.date) throw new Error('publishedAt calendar date must match date in its stated timezone');
    if (Date.parse(article.publishedAt) > now) throw new Error('publishedAt must not be in the future');
  }
  if (article.updatedAt !== undefined) {
    if (!isCalendarDate(article.updatedAt)) throw new Error('updatedAt must be a real YYYY-MM-DD revision date');
    if (article.updatedAt < article.date) throw new Error('updatedAt must not precede date');
  }
}

export const articlePublishedDate = article => article.publishedAt || article.date;
export const articleModifiedDate = article => article.updatedAt || undefined;
export const articleLastModified = article => articleModifiedDate(article) || articlePublishedDate(article);

export function publicationTimeLabel(article) {
  if (!article.publishedAt) return undefined;
  const offset = article.publishedAt.endsWith('Z') ? '' : article.publishedAt.slice(-6);
  return `${article.publishedAt.slice(11, 19)} UTC${offset}`;
}

export function latestContentDate(values) {
  // Date-only changes may have happened at any time that day. Do not claim an
  // earlier exact release is the latest change when an undated edit overlaps it.
  // These bounds are for ordering only: output always retains source precision.
  const upperBound = value => Date.parse(value) + (isCalendarDate(value) ? 86_400_000 - 1 : 0);
  return values.filter(Boolean).reduce((latest, candidate) => {
    return !latest || upperBound(candidate) > upperBound(latest) ||
      (upperBound(candidate) === upperBound(latest) && isCalendarDate(candidate)) ? candidate : latest;
  }, undefined);
}

export const collectionLastModified = articles => latestContentDate(articles.map(articleLastModified));

export function rssPublicationDate(article) {
  // RSS 2.0 item pubDate is optional and requires an RFC 822 date-time.
  // https://www.rssboard.org/rss-specification#ltpubdategtSubelementOfLtitemgt
  return article.publishedAt ? new Date(article.publishedAt).toUTCString() : undefined;
}
