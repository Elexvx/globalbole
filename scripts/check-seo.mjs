import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const articles = JSON.parse(readFileSync('content/generated/articles.json', 'utf8'));
const languages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const readPage = path => readFileSync(`out${decodeURIComponent(path)}${path.endsWith('/') ? 'index.html' : ''}`, 'utf8');
const head = html => html.split('</head>')[0];
const canonical = html => decode(head(html).match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '');
const graph = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => JSON.parse(match[1])['@graph'] || []);
const alternates = html => [...head(html).matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi)].map(match => [match[1], decode(match[2])]);
const home = readPage('/');
const base = canonical(home).replace(/\/$/, '');
assert.ok(base.startsWith('https://'), 'Canonical production URLs must use HTTPS');
assert.equal(canonical(readPage('/zh-CN/')), `${base}/`, 'Chinese duplicate consolidates to public root');
assert.deepEqual(alternates(home), alternates(readPage('/zh-CN/')), 'Both home entry points share the canonical language cluster');
assert.ok(graph(home).some(item => item['@type'] === 'WebSite'), 'Root homepage has site-name structured data');
assert.ok(graph(home).some(item => item['@type'] === 'Organization'), 'Root homepage identifies the publisher');
assert.equal(graph(home).some(item => item['@type'] === 'BreadcrumbList'), false, 'Homepage does not emit a one-item breadcrumb');
assert.equal(graph(home).find(item => item['@type'] === 'WebPage').url, `${base}/`);
const notFound = head(readFileSync('out/404.html', 'utf8'));
assert.ok(notFound.includes('content="noindex"'), 'Missing pages are excluded from indexing');
assert.ok(!/<meta name="(?:robots|googlebot)" content="index(?:,|")/i.test(notFound), '404 does not also inherit an explicit index instruction');
assert.equal(canonical(notFound), '', '404 does not claim the homepage as canonical');
let count = 0;
for (const article of articles) {
  const path = `/${article.lang}/post/${article.slug}/`;
  const html = readPage(path);
  assert.equal(canonical(html), base + path);
  assert.ok(head(html).includes('property="og:type" content="article"'));
  assert.ok(!head(html).includes('noindex'), `${path}: canonical article is indexable`);
  const translations = articles.filter(other => other.translationKey === article.translationKey);
  const languageLinks = Object.fromEntries(alternates(html));
  for (const lang of languages) assert.equal(Boolean(languageLinks[lang]), translations.some(other => other.lang === lang), `${path}: only actual translations advertised`);
  const schema = graph(html).find(item => item['@type'] === 'NewsArticle');
  assert.equal(schema.headline, article.title);
  assert.equal(schema.datePublished, article.date);
  assert.equal(schema.dateModified, undefined, 'Do not invent a modification date');
  assert.equal(schema.author.name, article.author);
  assert.equal(schema.author.url, `${base}/`, 'Existing brand byline is linked to the actual publisher');
  if (article.image) assert.equal(schema.image.url, base + article.image);
  else {
    assert.equal(schema.image, undefined, "Text-only article must not invent a schema image");
    assert.ok(!head(html).includes('property="og:image"'), "Text-only article omits image metadata");
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
  alternates: [...match[1].matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(link => [link[1], decode(link[2])]),
}));
const urls = sitemapEntries.map(entry => entry.url);
assert.equal(urls.length, new Set(urls).size, 'No duplicate sitemap URLs');
assert.ok(urls.includes(`${base}/`));
assert.ok(!urls.includes(`${base}/zh-CN/`));
assert.ok(!urls.some(url => new URL(url).pathname.startsWith('/post/')));
for (const url of urls) {
  const target = new URL(url);
  assert.equal(target.origin, base, 'Sitemap uses the canonical origin');
  assert.ok(existsSync(`out${decodeURIComponent(target.pathname)}index.html`), `Sitemap target exists: ${url}`);
  const html = readPage(target.pathname);
  assert.equal(canonical(html), url, `Sitemap contains canonical URLs: ${url}`);
  assert.deepEqual(sitemapEntries.find(entry => entry.url === url).alternates, alternates(html), `${url}: XML and HTML language alternates match`);
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
for (const article of articles) assert.ok(rss.includes(`${base}/${article.lang}/post/${article.slug}/`), 'Legacy RSS points directly to canonical articles');
console.log(`SEO: ${count} canonical news articles, ${urls.length} sitemap URLs, root/locale consolidation, legacy fallback metadata, truthful sources and reciprocal language links verified.`);

assert.equal(readFileSync("out/googleb6feb3c043d379fd.html", "utf8"), "google-site-verification: googleb6feb3c043d379fd.html", "Google ownership proof must be served byte-for-byte");
for (const path of ["/", "/zh-CN/"]) assert.ok(head(readPage(path)).includes('<meta name="msvalidate.01" content="85D64C4838DBA44D1E08BFEA2268C749"'), "Bing approved ownership proof is in the homepage head");
