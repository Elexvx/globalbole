import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { homeSeo } from '../lib/home-seo.mjs';

const articles = JSON.parse(readFileSync('content/generated/articles.json', 'utf8'));
const languages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const brandNames = { 'zh-CN': '全球伯乐 News', 'zh-TW': '全球伯樂 News', en: 'Global Bole News', ru: 'Global Bole News', fr: 'Global Bole News' };
const decode = value => value.replace(/&quot;/g, '"').replace(/&apos;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const readPage = path => readFileSync(`out${decodeURIComponent(path)}${path.endsWith('/') ? 'index.html' : ''}`, 'utf8');
const head = html => html.split('</head>')[0];
const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i')) || tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, 'i'));
  return match ? decode(match[1]) : '';
};
const metaContent = (html, name, value) => {
  const tag = [...head(html).matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).find(candidate => attribute(candidate, name) === value);
  return tag ? attribute(tag, 'content') : '';
};
const titleText = html => decode(head(html).match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
const canonical = html => attribute([...head(html).matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).find(tag => attribute(tag, 'rel') === 'canonical') || '', 'href');
const graph = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => JSON.parse(match[1])['@graph'] || []);
const alternates = html => [...head(html).matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).filter(tag => attribute(tag, 'rel') === 'alternate' && attribute(tag, 'hreflang')).map(tag => [attribute(tag, 'hreflang'), attribute(tag, 'href')]);
const visibleText = value => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const classText = (html, tagName, className) => {
  for (const match of html.matchAll(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi'))) {
    if (attribute(match[0].slice(0, match[0].indexOf('>') + 1), 'class').split(/\s+/).includes(className)) return visibleText(match[0].replace(/^<[^>]+>|<\/[^>]+>$/g, ''));
  }
  return '';
};
const normalize = value => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

const home = readPage('/');
const base = canonical(home).replace(/\/$/, '');
assert.ok(base.startsWith('https://'), 'Canonical production URLs must use HTTPS');
assert.equal(canonical(readPage('/zh-CN/')), `${base}/`, 'Chinese duplicate consolidates to public root');

const homeTitles = new Set();
const homeDescriptions = new Set();
const homePages = new Map();
for (const locale of languages) {
  const path = locale === 'zh-CN' ? '/' : `/${locale}/`;
  const html = readPage(path);
  const expected = homeSeo[locale];
  const title = titleText(html);
  const description = metaContent(html, 'name', 'description');
  assert.equal(title, expected.title, `${path}: localized homepage title`);
  assert.equal(description, expected.description, `${path}: localized homepage description`);
  assert.equal(metaContent(html, 'property', 'og:title'), expected.title, `${path}: Open Graph title matches localized homepage title`);
  assert.equal(metaContent(html, 'property', 'og:description'), expected.description, `${path}: Open Graph description matches localized homepage description`);
  assert.equal(metaContent(html, 'name', 'twitter:title'), expected.title, `${path}: Twitter title matches localized homepage title`);
  assert.equal(metaContent(html, 'name', 'twitter:description'), expected.description, `${path}: Twitter description matches localized homepage description`);
  assert.equal(attribute([...head(html).matchAll(/<html\b[^>]*>/gi)][0]?.[0] || '', 'lang'), locale, `${path}: document language matches the homepage locale`);
  assert.ok(!homeTitles.has(normalize(title)), `${path}: homepage title is distinct across locales`);
  assert.ok(!homeDescriptions.has(normalize(description)), `${path}: homepage description is distinct across locales`);
  homeTitles.add(normalize(title));
  homeDescriptions.add(normalize(description));
  homePages.set(locale, html);
}
assert.deepEqual(alternates(home), alternates(readPage('/zh-CN/')), 'Both Chinese home entry points share the canonical language cluster');
for (const locale of languages) {
  const html = homePages.get(locale);
  assert.equal(canonical(html), locale === 'zh-CN' ? `${base}/` : `${base}/${locale}/`);
  assert.ok(graph(html).some(item => item['@type'] === 'WebSite'), `${locale}: homepage has site-name structured data`);
  assert.ok(graph(html).some(item => item['@type'] === 'Organization'), `${locale}: homepage identifies the publisher`);
  assert.equal(graph(html).some(item => item['@type'] === 'BreadcrumbList'), false, `${locale}: homepage does not emit a one-item breadcrumb`);
  assert.equal(graph(html).find(item => item['@type'] === 'WebPage').url, canonical(html));
}

const notFound = head(readFileSync('out/404.html', 'utf8'));
assert.ok(notFound.includes('content="noindex"'), 'Missing pages are excluded from indexing');
assert.ok(!/<meta name="(?:robots|googlebot)" content="index(?:,|")/i.test(notFound), '404 does not also inherit an explicit index instruction');
assert.equal(canonical(notFound), '', '404 does not claim the homepage as canonical');

let count = 0;
const uniqueArticleTitles = new Set();
const uniqueArticleDescriptions = new Set();
for (const article of articles) {
  const path = `/${article.lang}/post/${article.slug}/`;
  const html = readPage(path);
  const articleHead = head(html);
  const seoTitle = article.seoTitle?.trim();
  const seoDescription = article.seoDescription?.trim();
  assert.ok(seoTitle, `${path}: SEO title is present`);
  assert.ok(seoDescription, `${path}: SEO description is present`);
  const normalizedTitle = normalize(seoTitle);
  const normalizedDescription = normalize(seoDescription);
  assert.ok(!uniqueArticleTitles.has(normalizedTitle), `${path}: SEO title is unique among canonical articles`);
  assert.ok(!uniqueArticleDescriptions.has(normalizedDescription), `${path}: SEO description is unique among canonical articles`);
  uniqueArticleTitles.add(normalizedTitle);
  uniqueArticleDescriptions.add(normalizedDescription);

  assert.equal(canonical(html), base + path);
  assert.equal(titleText(html), `${seoTitle} — ${brandNames[article.lang]}`, `${path}: HTML title uses SEO title and publisher brand`);
  assert.equal(metaContent(html, 'name', 'description'), seoDescription, `${path}: HTML description uses SEO description`);
  assert.equal(metaContent(html, 'property', 'og:title'), seoTitle, `${path}: Open Graph title uses SEO title`);
  assert.equal(metaContent(html, 'property', 'og:description'), seoDescription, `${path}: Open Graph description uses SEO description`);
  assert.equal(metaContent(html, 'name', 'twitter:title'), seoTitle, `${path}: Twitter title uses SEO title`);
  assert.equal(metaContent(html, 'name', 'twitter:description'), seoDescription, `${path}: Twitter description uses SEO description`);
  assert.ok(articleHead.includes('property="og:type" content="article"'));
  assert.ok(!articleHead.includes('noindex'), `${path}: canonical article is indexable`);
  assert.equal(classText(html, 'h1', 'headline'), article.title, `${path}: visible article headline remains unchanged`);
  assert.equal(classText(html, 'p', 'dek'), article.dek, `${path}: visible article deck remains unchanged`);

  const translations = articles.filter(other => other.translationKey === article.translationKey);
  const languageLinks = Object.fromEntries(alternates(html));
  for (const lang of languages) assert.equal(Boolean(languageLinks[lang]), translations.some(other => other.lang === lang), `${path}: only actual translations advertised`);
  const schema = graph(html).find(item => item['@type'] === 'NewsArticle');
  assert.equal(schema.headline, article.title, `${path}: structured headline stays equal to visible headline`);
  assert.equal(schema.description, article.dek, `${path}: structured description stays equal to the visible deck`);
  assert.equal(schema.datePublished, article.date);
  assert.equal(schema.dateModified, article.updatedAt, `${path}: modification date only comes from editorial updatedAt`);
  assert.equal(schema.author.name, article.author);
  assert.equal(schema.author.url, `${base}/`, 'Existing brand byline is linked to the actual publisher');
  if (article.image) assert.equal(schema.image.url, base + article.image);
  else {
    assert.equal(schema.image, undefined, 'Text-only article must not invent a schema image');
    assert.ok(!articleHead.includes('property="og:image"'), 'Text-only article omits image metadata');
  }
  assert.equal(schema.mainEntityOfPage['@id'], canonical(html) + '#page');
  const breadcrumb = graph(html).find(item => item['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumb.itemListElement.length, 3, 'Article breadcrumb includes its section');
  assert.equal(breadcrumb.itemListElement[1].item, `${base}/${article.lang}/category/${article.category}/`);
  for (const citation of schema.citation || []) {
    assert.ok(article.markdown.includes(citation.url), 'Citation is present in the source article');
    assert.ok(decode(html).includes(`href="${citation.url}"`), 'Citation is also a visible crawlable link');
  }
  if (/^\[\^[^\]]+\]:/m.test(article.markdown)) assert.ok(schema.citation?.length, 'Published source notes are exposed as citations');
  if (/^\|[^\n]+\|\s*\n\|[ :|\-]+\|/m.test(article.markdown)) assert.ok(html.includes('<table>'));
  assert.ok(html.includes('id="section-'));
  const alias = readPage(`/post/${article.slug}/`);
  assert.equal(canonical(alias), base + path, 'Legacy article points at the matching story, never the homepage');
  assert.ok(head(alias).includes('noindex'), 'Nonredirected static legacy fallback is noindex');
  for (const lang of languages.filter(lang => lang !== article.lang && !translations.some(other => other.lang === lang))) {
    const duplicate = readPage(`/${lang}/post/${article.slug}/`);
    assert.ok(head(duplicate).includes('noindex'));
    assert.equal(canonical(duplicate), base + path);
  }
  count++;
}

for (const route of ['about', 'authors', 'contact', 'privacy', 'all-news', 'issues']) {
  const html = readPage(`/${route}/`);
  assert.equal(canonical(html), `${base}/zh-CN/${route}/`);
  assert.ok(head(html).includes('noindex'));
}

const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const sitemapEntries = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].map(match => ({
  url: decode(match[1].match(/<loc>([^<]+)<\/loc>/)[1]),
  lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  alternates: [...match[1].matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(link => [link[1], decode(link[2])]),
}));
const urls = sitemapEntries.map(entry => entry.url);
const sitemapByUrl = new Map(sitemapEntries.map(entry => [entry.url, entry]));
assert.equal(urls.length, new Set(urls).size, 'No duplicate sitemap URLs');
assert.ok(urls.includes(`${base}/`));
assert.ok(!urls.includes(`${base}/zh-CN/`));
assert.ok(!urls.some(url => new URL(url).pathname.startsWith('/post/')));
const articleByUrl = new Map(articles.map(article => [`${base}/${article.lang}/post/${article.slug}/`, article]));
for (const article of articles) assert.ok(sitemapByUrl.has(`${base}/${article.lang}/post/${article.slug}/`), 'Every canonical article appears in sitemap');
for (const entry of sitemapEntries) {
  const article = articleByUrl.get(entry.url);
  assert.equal(entry.lastmod ? decode(entry.lastmod) : undefined, article?.updatedAt, `${entry.url}: sitemap lastmod only uses a real updatedAt value`);
}
for (const url of urls) {
  const target = new URL(url);
  assert.equal(target.origin, base, 'Sitemap uses the canonical origin');
  assert.ok(existsSync(`out${decodeURIComponent(target.pathname)}index.html`), `Sitemap target exists: ${url}`);
  const html = readPage(target.pathname);
  assert.equal(canonical(html), url, `Sitemap contains canonical URLs: ${url}`);
  assert.deepEqual(sitemapByUrl.get(url).alternates, alternates(html), `${url}: XML and HTML language alternates match`);
  assert.ok(!head(html).includes('noindex'), `Sitemap target is indexable: ${url}`);
  for (const [lang, alternative] of alternates(html)) {
    const alternatePage = readPage(new URL(alternative).pathname);
    assert.equal(canonical(alternatePage), alternative, `${url}: alternate URL is canonical`);
    assert.ok(!head(alternatePage).includes('noindex'));
    if (lang !== 'x-default') assert.deepEqual(alternates(alternatePage), alternates(html), `${url}: reciprocal alternatives`);
  }
}
for (const [lang, url] of alternates(home)) {
  if (lang === 'zh-CN' || lang === 'x-default') assert.equal(url, `${base}/`);
}
assert.ok(readFileSync('out/robots.txt', 'utf8').includes(`Sitemap: ${base}/sitemap.xml`));

const rss = readFileSync('out/rss.xml', 'utf8');
const feedArticles = [...articles].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,50);
assert.equal((rss.match(/<item>/g)||[]).length, feedArticles.length, 'Legacy RSS retains its configured recent-item limit');
for (const article of feedArticles) assert.ok(rss.includes(`${base}/${article.lang}/post/${article.slug}/`), 'Legacy RSS points directly to canonical articles');
for (const lang of languages) {
  const feed = readFileSync(`out/feeds/${lang}.xml`, 'utf8');
  for (const article of articles.filter(item=>item.lang===lang)) assert.ok(feed.includes(`${base}/${lang}/post/${article.slug}/`), 'Localized RSS retains canonical articles');
}

assert.equal(readFileSync('out/googleb6feb3c043d379fd.html', 'utf8'), 'google-site-verification: googleb6feb3c043d379fd.html', 'Google ownership proof must be served byte-for-byte');
for (const path of ['/', '/zh-CN/']) assert.ok(head(readPage(path)).includes('<meta name="msvalidate.01" content="85D64C4838DBA44D1E08BFEA2268C749"'), 'Bing approved ownership proof is in the homepage head');
console.log(`SEO: ${count} canonical articles, five localized homepages, ${urls.length} sitemap URLs, article metadata/schema, true lastmod values, legacy fallbacks, RSS, and search verification preserved.`);
