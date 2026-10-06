import { readFileSync, readdirSync, mkdirSync, writeFileSync, renameSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import { createArticleResponse } from "../lib/article-contract.mjs";
import { categoryLabels as categories } from "../lib/categories.mjs";
export const languages = ["zh-CN", "zh-TW", "en", "ru", "fr"];
function walk(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir,entry.name)) : entry.name.endsWith(".md") ? [path.join(dir,entry.name)] : []); }
// Tests and rebuilds can generate the same snapshot concurrently. Publish a
// complete file atomically so readers never observe a truncated JSON document.
function writeSnapshot(file, content) {
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, content);
  renameSync(temporary, file);
}
export function buildContent() {
  const root = path.resolve("content/issues");
  mkdirSync(root,{recursive:true});
  const ids = new Set();
  const articles = walk(root).sort().flatMap(file => {
    const {data,content} = matter(readFileSync(file,"utf8"));
    const fail = message => {throw new Error(`${file}: ${message}`);};
    for(const key of ["title","slug","translationKey","issue","lang","category","author","date","description"]) if(typeof data[key] !== "string" || !data[key].trim()) fail(`${key} must be a nonempty quoted string`);
    for(const key of ["seoTitle","seoDescription"]) if(data[key] !== undefined && (typeof data[key] !== "string" || !data[key].trim())) fail(`${key} must be a nonempty quoted string when provided`);
    if (!languages.includes(data.lang)) fail("unsupported lang");
    if (!/^[a-z0-9-]+$/.test(data.slug) || !/^[a-z0-9-]+$/.test(data.issue)) fail("slug and issue must use lowercase ASCII letters, numbers and hyphens");
    if (!Object.hasOwn(categories,data.category)) fail("unknown category");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date))) fail("invalid date");
    if (data.updatedAt !== undefined && (typeof data.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt) || !Number.isFinite(Date.parse(data.updatedAt)) || new Date(data.updatedAt).toISOString().slice(0,10) !== data.updatedAt)) fail("updatedAt must be a real YYYY-MM-DD revision date");
    if (typeof data.cover !== "string" || typeof data.coverAlt !== "string" || Boolean(data.cover.trim()) !== Boolean(data.coverAlt.trim())) fail("cover and coverAlt must be nonempty strings together, or both empty for a text-only article");
    if (data.cover && (!data.cover.startsWith("/") || data.cover.includes("..") || !existsSync(path.resolve("public",data.cover.slice(1))))) fail("cover file is missing from public/");
    if (!Array.isArray(data.tags) || !data.tags.length || data.tags.some(tag=>typeof tag!=="string" || !/^[\p{L}\p{N} ’'-]+$/u.test(tag))) fail("tags must contain letters, numbers, spaces, apostrophes or hyphens");
    if(!content.trim()) fail("article body is empty");
    if(data.draft !== undefined && typeof data.draft !== "boolean") fail("draft must be true or false");
    if(data.draft) return [];
    if(!data.cover) fail("published article requires a cover; use a labeled editorial illustration or licensed related photo when no source image is available");
    const key = `${data.lang}:${data.translationKey}`;
    const slug = `${data.lang.toLowerCase()}-${data.slug}`;
    if(ids.has(key) || ids.has(slug)) fail("duplicate translationKey or slug within this language");
    ids.add(key); ids.add(slug);
    const readTime = data.readTime ?? Math.max(1,Math.ceil(content.length/900));
    if(!Number.isInteger(readTime)||readTime<1||readTime>90)fail("readTime must be 1–90");
    return [{slug,title:data.title,lang:data.lang,translationKey:data.translationKey,issue:data.issue,category:data.category,categoryLabel:categories[data.category],author:data.author,authorRole:data.authorRole || (data.lang==="zh-CN"?"全球伯乐 News":data.lang==="zh-TW"?"全球伯樂 News":"Global Bole News"),date:data.date,...(data.updatedAt ? {updatedAt:data.updatedAt} : {}),displayDate:new Date(data.date+"T12:00:00Z").toLocaleDateString(data.lang,{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"}),readTime,dek:data.description,seoTitle:data.seoTitle?.trim() || data.title,seoDescription:data.seoDescription?.trim() || data.description,image:data.cover,imageAlt:data.coverAlt,tags:data.tags,body:[],markdown:content.trim(),source:path.relative(process.cwd(),file)}];
  });
  const translationCategories = new Map();
  for (const article of articles) {
    const category = translationCategories.get(article.translationKey);
    if (category && category !== article.category) throw new Error(`${article.translationKey}: translations must use the same category`);
    translationCategories.set(article.translationKey,article.category);
  }
  mkdirSync("content/generated",{recursive:true});
  writeSnapshot("content/generated/articles.json", JSON.stringify(articles,null,2)+"\n");
  mkdirSync("public/data/v1",{recursive:true});
  writeSnapshot("public/data/v1/articles.json", JSON.stringify(createArticleResponse(articles))+"\n");
  console.log(`Markdown: ${articles.length} articles / ${new Set(articles.map(a=>a.issue)).size} issues / ${new Set(articles.map(a=>a.lang)).size} languages`);
  return articles;
}
if(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildContent();
