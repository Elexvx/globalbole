import { categories, categoryLabels } from './categories.mjs';
import { validateArticleDates } from './publication-dates.mjs';
export const articleLanguages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
export const articleCategories = categories.map(category => category.slug);
const fields = ['slug','title','lang','translationKey','issue','category','categoryLabel','author','authorRole','date','publishedAt','updatedAt','displayDate','readTime','dek','seoTitle','seoDescription','image','imageAlt','tags','body','markdown'];
const optionalFields = new Set(['seoTitle','seoDescription','publishedAt','updatedAt']);
const textFields = fields.filter(key => !['readTime','tags','body','image','imageAlt','seoTitle','seoDescription','publishedAt','updatedAt'].includes(key));

export function parseArticleResponse(value) {
  const fail = message => { throw new Error(`Invalid article response: ${message}`); };
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.data) || value.total !== value.data.length) fail('envelope');
  const ids = new Set(), translations = new Set();
  const data = value.data.map(item => {
    if (!item || textFields.some(key => typeof item[key] !== 'string' || !item[key].trim())) fail('required string');
    for (const key of ['seoTitle','seoDescription']) if (item[key] !== undefined && (typeof item[key] !== 'string' || !item[key].trim())) fail(`${key} must be a nonempty string when provided`);
    try { validateArticleDates(item); } catch (error) { fail(error.message); }
    if (!articleLanguages.includes(item.lang) || !articleCategories.includes(item.category)) fail('language/category');
    if (item.categoryLabel !== categoryLabels[item.category]) fail('categoryLabel must match category');
    if (!/^[a-z0-9-]+$/.test(item.slug) || !item.slug.startsWith(item.lang.toLowerCase()+'-') || !/^[a-z0-9-]+$/.test(item.issue)) fail('slug/issue');
    if (!Number.isInteger(item.readTime) || item.readTime < 1 || item.readTime > 90) fail('readTime');
    if (!Array.isArray(item.tags) || !item.tags.length || item.tags.some(tag => typeof tag !== 'string' || !/^[\p{L}\p{N} ’'-]+$/u.test(tag))) fail('tags');
    if (!Array.isArray(item.body) || item.body.length !== 0) fail('body must be empty; use markdown');
    if (typeof item.image !== 'string' || typeof item.imageAlt !== 'string' || Boolean(item.image.trim()) !== Boolean(item.imageAlt.trim())) fail('image and imageAlt must be populated together or both empty');
    if (item.image && (!( /^\/(?!\/)/.test(item.image) || /^https:\/\//.test(item.image)) || item.image.includes('..'))) fail('image URL');
    const translation = item.lang+':'+item.translationKey;
    if (ids.has(item.slug) || translations.has(translation)) fail('duplicate');
    ids.add(item.slug); translations.add(translation);
    // Allowlist: do not leak filesystem paths, drafts or backend-only fields.
    const article = Object.fromEntries(fields.filter(key => !optionalFields.has(key) || item[key] !== undefined).map(key => [key,item[key]]));
    article.seoTitle ||= article.title;
    article.seoDescription ||= article.dek;
    return article;
  });
  return {schemaVersion:1,total:data.length,data};
}

export function createArticleResponse(articles) {
  return parseArticleResponse({schemaVersion:1,total:articles.length,data:articles});
}
