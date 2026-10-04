// A short front page, separate from the compact subject index below it.
// Never repeat a story between the three opening modules, even with sparse feeds.
export function planHomeEdition(ordered) {
  const unique = [...new Map(ordered.map(story => [story.slug, story])).values()];
  return { hero: unique[0], supporting: unique.slice(1, 3), latest: unique.slice(3, 6), remaining: unique.slice(6) };
}
