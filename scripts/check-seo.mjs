import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { homeSeo } from '../lib/home-seo.mjs';
import { articleCitations, isRightsNotice } from '../lib/article-citations.mjs';
import { tagDescription } from '../lib/tag-descriptions.mjs';
import { tagMatchesSlug, tagLabel } from '../lib/tag-routes.mjs';
import { articlePublishedDate, publicationTimeLabel, rssPublicationDate } from '../lib/publication-dates.mjs';
import { routeLastModified } from '../lib/sitemap-dates.mjs';

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
assert.deepEqual(graph(home).filter(item => ['WebSite','Organization'].includes(item['@type'])), graph(readPage('/zh-CN/')).filter(item => ['WebSite','Organization'].includes(item['@type'])), 'Duplicate Chinese entry retains identical site identity data');
for (const locale of languages) {
  const html = homePages.get(locale);
  assert.equal(canonical(html), locale === 'zh-CN' ? `${base}/` : `${base}/${locale}/`);
  assert.ok(graph(html).some(item => item['@type'] === 'WebSite'), `${locale}: homepage has site-name structured data`);
  assert.ok(graph(html).some(item => item['@type'] === 'Organization'), `${locale}: homepage identifies the publisher`);
  const identities = graph(html);
  for (const [type, id] of [['WebSite', 'website'], ['Organization', 'publisher']]) {
    const nodes = identities.filter(item => item['@type'] === type);
    assert.equal(nodes.length, 1, `${locale}: exactly one ${type} identity`);
    assert.equal(nodes[0]['@id'], `${base}/#${id}`);
    assert.equal(nodes[0].name, '全球伯乐 News', `${locale}: established primary name is preserved`);
    assert.equal(nodes[0].url, `${base}/`);
    for (const alias of ['全球伯乐', '全球伯樂', 'Global Bole', 'GlobalBole', 'Global Bole News']) assert.ok(nodes[0].alternateName.includes(alias), `${locale}: ${type} exact real brand alias ${alias}`);
  }
  const brandLinks = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(match => match[0]).filter(link => link.includes('site-brand-title'));
  assert.equal(brandLinks.length, 2, `${locale}: header and footer expose crawlable brand links`);
  for (const link of brandLinks) {
    assert.equal(attribute(link, 'href'), `/${locale}/`, `${locale}: explicit brand links retain locale-safe navigation`);
  }

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
  assert.equal(schema.datePublished, articlePublishedDate(article), `${path}: schema preserves evidenced publication precision`);
  assert.equal(metaContent(html, 'property', 'article:published_time'), articlePublishedDate(article), `${path}: Open Graph uses the same publication date`);
  const visibleDates = [...html.matchAll(/<time\b[^>]*>/gi)].map(match => attribute(match[0], 'datetime'));
  assert.ok(visibleDates.includes(articlePublishedDate(article)), `${path}: visible date has matching semantic time`);
  if (article.publishedAt) assert.ok(decode(html).includes(publicationTimeLabel(article)), `${path}: known publication time shows its timezone`);
  assert.equal(schema.dateModified, article.updatedAt, `${path}: modification date only comes from editorial updatedAt`);
  if (article.updatedAt) assert.ok(html.includes(`<time dateTime="${article.updatedAt}">${article.updatedAt}</time>`), `${path}: real modification date is also visible`);
  assert.equal(schema.author.name, article.author);
  assert.equal(schema.author.url, `${base}/${article.lang}/authors/`, 'Existing organizational byline links to the substantive team page');
  assert.ok(html.includes(`href="/${article.lang}/authors/"`), 'Visible byline links to the same team page');
  assert.deepEqual(schema.citation || [], articleCitations(article.markdown), 'All factual source-note links are preserved, with rights notices separate');
  assert.ok((schema.citation || []).every(item => !isRightsNotice(item.url)), 'Licensing notices are not falsely presented as factual citations');
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


for (const locale of languages) {
  for (const route of ['about', 'authors', 'contact']) {
    const html = readPage(`/${locale}/${route}/`);
    const identity = graph(html).find(item => item['@type'] === 'Organization');
    assert.equal(identity.email, 'globalbole@globalbole.com');
    assert.equal(identity.contactPoint.url, `${base}/${locale}/contact/`);
    assert.equal(identity.publishingPrinciples, `${base}/${locale}/about/`);
    assert.equal(identity.correctionsPolicy, `${base}/${locale}/contact/`);
    assert.ok(html.includes('mailto:globalbole@globalbole.com'), `${locale}/${route}: public contact is crawlable`);
    assert.ok(graph(html).some(item => item['@type'] === (route === 'contact' ? 'ContactPage' : 'AboutPage')));
    assert.ok((html.match(/<h2\b/g) || []).length >= 2, `${locale}/${route}: substantive explanatory sections`);
  }
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
  const parts = new URL(entry.url).pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const locale = parts.length ? parts.shift() : 'zh-CN';
  assert.equal(entry.lastmod ? decode(entry.lastmod) : undefined, routeLastModified(locale, parts, articles), `${entry.url}: sitemap lastmod is derived from actual content, never build time`);
}
for (const url of urls) {
  const target = new URL(url);
  assert.equal(target.origin, base, 'Sitemap uses the canonical origin');
  assert.ok(existsSync(`out${decodeURIComponent(target.pathname)}index.html`), `Sitemap target exists: ${url}`);
  const html = readPage(target.pathname);
  const routeSegments = decodeURIComponent(target.pathname).split('/').filter(Boolean);
  if (routeSegments[1] === 'tag') {
    const [locale, , slug] = routeSegments;
    const matching = articles.filter(article => article.lang === locale && article.tags.some(tag => tagMatchesSlug(tag, slug)));
    const label = tagLabel(slug, articles.flatMap(article => article.tags));
    const expected = tagDescription(locale, label, matching);
    assert.equal(metaContent(html, 'name', 'description'), expected, `${url}: precise tag description`);
    assert.ok(visibleText(html).includes(expected), `${url}: description is also visible`);
    const collection = graph(html).find(item => item['@type'] === 'CollectionPage');
    assert.equal(collection.mainEntity.numberOfItems, matching.length);
    assert.equal(collection.mainEntity.itemListElement.length, matching.length);
  }
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
function checkFeedDates(xml, expectedArticles, label) {
  const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].map(match => ({
    link: decode(match[1].match(/<link>([^<]+)<\/link>/)?.[1] || ''),
    guid: decode(match[1].match(/<guid>([^<]+)<\/guid>/)?.[1] || ''),
    dates: [...match[1].matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map(date => decode(date[1])),
  }));
  assert.equal(items.length, expectedArticles.length, `${label}: expected item count is preserved`);
  assert.equal(new Set(items.map(item => item.guid)).size, items.length, `${label}: stable unique GUIDs`);
  for (const [index, article] of expectedArticles.entries()) {
    const item = items[index];
    const url = `${base}/${article.lang}/post/${article.slug}/`;
    assert.equal(item.link, url, `${label}: canonical article link and order`);
    assert.equal(item.guid, url, `${label}: canonical GUID stays unchanged`);
    const published = rssPublicationDate(article);
    assert.deepEqual(item.dates, published ? [published] : [], `${label}: no timestamp is invented for date-only articles`);
    if (published) {
      assert.ok(Date.parse(published) <= Date.now(), `${label}: no future RSS publication time`);
      assert.equal(Date.parse(published), Math.floor(Date.parse(article.publishedAt) / 1000) * 1000, `${label}: RSS retains the original instant to its supported second precision`);
    }
  }
}
checkFeedDates(rss, feedArticles, 'Legacy RSS');
for (const lang of languages) {
  const feed = readFileSync(`out/feeds/${lang}.xml`, 'utf8');
  checkFeedDates(feed, articles.filter(item=>item.lang===lang).sort((a,b)=>b.date.localeCompare(a.date)), `${lang} RSS`);
}

assert.equal(readFileSync('out/googleb6feb3c043d379fd.html', 'utf8'), 'google-site-verification: googleb6feb3c043d379fd.html', 'Google ownership proof must be served byte-for-byte');
for (const path of ['/', '/zh-CN/']) assert.ok(head(readPage(path)).includes('<meta name="msvalidate.01" content="85D64C4838DBA44D1E08BFEA2268C749"'), 'Bing approved ownership proof is in the homepage head');
console.log(`SEO: ${count} canonical articles, five localized homepages, ${urls.length} sitemap URLs, article metadata/schema, true lastmod values, legacy fallbacks, RSS, and search verification preserved.`);
