import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { articleLanguages } from '../lib/article-contract.mjs';
import { tagLabel, tagMatchesSlug } from '../lib/tag-routes.mjs';

const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[char]));
const links = html => [...new Set([...html.matchAll(/href="(\/[^"#?]*\/post\/[^"#?]+\/)"/g)].map(match => decodeURIComponent(match[1])))].sort();

export function checkTagExport(articles) {
  const tags = [...new Set(articles.flatMap(article => article.tags))];
  const slugs = [...new Set(tags.map(tag => tag.replace(/\s+/g, '-')))];
  const sitemap = readFileSync('out/sitemap.xml', 'utf8');
  const sitemapURLs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).href));
  const messages = JSON.parse(readFileSync('lib/messages.json', 'utf8'));
  let count = 0;
  for (const lang of articleLanguages) for (const slug of slugs) {
    const route = `/${lang}/tag/${slug}/`;
    const html = readFileSync(`out${route}index.html`, 'utf8');
    const label = tagLabel(slug, tags);
    const results = [...html.matchAll(/<section\b[^>]*data-tag-results="([^"]*)"[^>]*>([\s\S]*?)<\/section>/g)];
    assert.equal(results.length, 1, `${route}: one results region`);
    assert.equal(results[0][1], escape(slug), `${route}: decoded result tag`);
    const expected = articles.filter(article => article.lang === lang && article.tags.some(tag => tagMatchesSlug(tag, slug))).map(article => `/${lang}/post/${article.slug}/`).sort();
    assert.deepEqual(links(results[0][2]), expected, `${route}: exact matching articles`);
    if (!expected.length) assert.ok(results[0][2].includes(messages['No stories have been filed under this tag yet.'][lang]), `${route}: localized empty state`);
    assert.ok(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].includes(escape(label)), `${route}: readable heading`);
    const head = html.split('</head>')[0];
    assert.ok(head.match(/<title>([^<]*)<\/title>/)?.[1].includes(escape(label)), `${route}: readable metadata title`);
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.equal(new URL(canonical).pathname, `/${lang}/tag/${encodeURIComponent(slug)}/`, `${route}: exactly one URL encoding`);
    for (const alternative of articleLanguages) {
      const encodedPath = `/${alternative}/tag/${encodeURIComponent(slug)}/`;
      assert.ok(head.includes(encodedPath), `${route}: ${alternative} language alternate`);
    }
    const graph = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].flatMap(match => JSON.parse(match[1])['@graph'] || []);
    const page = graph.find(item => item['@type'] === 'WebPage');
    const breadcrumb = graph.find(item => item['@type'] === 'BreadcrumbList');
    assert.equal(page?.name, label, `${route}: readable structured-data title`);
    assert.equal(page?.url, canonical, `${route}: structured-data canonical`);
    assert.equal(breadcrumb?.itemListElement.at(-1).name, label, `${route}: readable breadcrumb`);
    assert.equal(sitemapURLs.has(canonical), expected.length > 0, `${route}: sitemap contains only languages with matching articles`);
    count++;
  }
  for (const slug of slugs) {
    const html = readFileSync(`out/tag/${slug}/index.html`, 'utf8');
    assert.ok(html.includes('<main'), `Legacy query-compatible tag route remains available: ${slug}`);
  }
  console.log(`Tags: ${count} localized routes and ${slugs.length} compatibility routes; decoded headings, exact results, source labels, canonical URLs, language alternates, JSON-LD and sitemap verified.`);
}
