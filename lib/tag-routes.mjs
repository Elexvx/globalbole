// Route params may still contain URL escapes in the static-export client router.
// Decode that boundary once only. URLSearchParams.get() is already decoded.
export function decodeTagRouteSegment(segment) {
  try { return decodeURIComponent(segment); }
  catch { return segment; }
}

export function tagMatchesSlug(tag, slug) {
  const key = value => value.toLowerCase().replace(/\s+/g, '-');
  return key(tag) === key(slug);
}

export function tagLabel(slug, tags) {
  return tags.find(tag => tagMatchesSlug(tag, slug)) || slug.replace(/-/g, ' ');
}
