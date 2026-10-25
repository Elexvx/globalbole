// Substantive visible-content changes, not deployments or build timestamps.
// Update these only when the corresponding public copy really changes.
const editorialPages = {
  about: '2026-10-25',
  authors: '2026-10-25',
  contact: '2026-10-25',
};
const tagDescriptionsUpdatedAt = '2026-10-25';

export function pageContentRevision(path) {
  if (path.length === 1) return editorialPages[path[0]];
  if (path.length === 2 && path[0] === 'tag') return tagDescriptionsUpdatedAt;
  return undefined;
}
