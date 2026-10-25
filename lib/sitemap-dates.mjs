import { articleLastModified, collectionLastModified, latestContentDate } from './publication-dates.mjs';
import { decodeTagRouteSegment, tagMatchesSlug } from './tag-routes.mjs';
import { pageContentRevision } from './page-revisions.mjs';

export function routeLastModified(locale, path, stories) {
  const articles = stories.filter(story => story.lang === locale);
  if (path[0] === 'post') {
    const article = articles.find(story => story.slug === path[1]);
    return article ? articleLastModified(article) : undefined;
  }
  // Archive pages depend on the collection, not just their current slice:
  // publishing a new article can shift the contents of every following page.
  if (!path.length || ['all-news', 'issues'].includes(path[0])) return collectionLastModified(articles);
  if (path[0] === 'category') return collectionLastModified(articles.filter(story => story.category === path[1]));
  if (path[0] === 'issue') return collectionLastModified(articles.filter(story => story.issue === path[1]));
  if (path[0] === 'tag') {
    const tagged = articles.filter(story => story.tags.some(tag => tagMatchesSlug(tag, decodeTagRouteSegment(path[1]))));
    return tagged.length ? latestContentDate([collectionLastModified(tagged), pageContentRevision(path)]) : undefined;
  }
  // Only pages with an explicit, real content revision get a static lastmod.
  return pageContentRevision(path);
}
