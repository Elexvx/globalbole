import { categories, categoryLabels } from './categories.mjs';
export const articleLanguages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
export const articleCategories = categories.map(category => category.slug);
const fields = ['slug','title','lang','translationKey','issue','category','categoryLabel','author','authorRole','date','displayDate','readTime','dek','image','imageAlt','tags','body','markdown'];
const textFields = fields.filter(key => !['readTime','tags','body'].includes(key));

export function parseArticleResponse(value) {
  const fail = message => { throw new Error(`Invalid article response: ${message}`); };
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.data) || value.total !== value.data.length) fail('envelope');
  const ids = new Set(), translations = new Set();
  const data = value.data.map(item => {
    if (!item || textFields.some(key => typeof item[key] !== 'string' || !item[key].trim())) fail('required string');
    if (!articleLanguages.includes(item.lang) || !articleCategories.includes(item.category)) fail('language/category');
    if (item.categoryLabel !== categoryLabels[item.category]) fail('categoryLabel must match category');
    if (!/^[a-z0-9-]+$/.test(item.slug) || !item.slug.startsWith(item.lang.toLowerCase()+'-') || !/^[a-z0-9-]+$/.test(item.issue)) fail('slug/issue');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !Number.isFinite(Date.parse(item.date)) || new Date(item.date).toISOString().slice(0,10)!==item.date) fail('date');
    if (!Number.isInteger(item.readTime) || item.readTime < 1 || item.readTime > 90) fail('readTime');
    if (!Array.isArray(item.tags) || !item.tags.length || item.tags.some(tag => typeof tag !== 'string' || !/^[\p{L}\p{N} -]+$/u.test(tag))) fail('tags');
    if (!Array.isArray(item.body) || item.body.length !== 0) fail('body must be empty; use markdown');
    if (!( /^\/(?!\/)/.test(item.image) || /^https:\/\//.test(item.image)) || item.image.includes('..')) fail('image URL');
    const translation = item.lang+':'+item.translationKey;
    if (ids.has(item.slug) || translations.has(translation)) fail('duplicate');
    ids.add(item.slug); translations.add(translation);
    // Allowlist: do not leak filesystem paths, drafts or backend-only fields.
    return Object.fromEntries(fields.map(key => [key,item[key]]));
  });
  return {schemaVersion:1,total:data.length,data};
}

export function createArticleResponse(articles) {
  return parseArticleResponse({schemaVersion:1,total:articles.length,data:articles});
}
