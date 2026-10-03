import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const articles=JSON.parse(readFileSync('content/generated/articles.json','utf8'));
const languages=['zh-CN','zh-TW','en','ru','fr'];
let count=0;
for(const a of articles){
 const html=readFileSync(`out/${a.lang}/post/${a.slug}/index.html`,'utf8');
 const head=html.split('</head>')[0];
 assert.ok(head.includes('rel="canonical"'));
 assert.ok(head.includes(`/${a.lang}/post/${a.slug}/`));
 assert.ok(head.includes('property="og:type" content="article"'));
 const translations=articles.filter(other=>other.translationKey===a.translationKey);
 for(const {lang} of translations)assert.ok(head.toLowerCase().includes(`hreflang="${lang.toLowerCase()}"`));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
 const article=schemas.flatMap(s=>s['@graph']).find(s=>s['@type']==='Article');
 assert.equal(article.headline,a.title);
 assert.equal(article.datePublished,a.date);
 assert.equal(article.author.name,a.author);
 if (/^\|[^\n]+\|\s*\n\|[ :|\-]+\|/m.test(a.markdown)) assert.ok(html.includes('<table>'));
 assert.ok(html.includes('id="section-'));
 count++;
}
const sitemap=readFileSync('out/sitemap.xml','utf8');
if (articles.length) {
 const duplicate=readFileSync(`out/fr/post/${articles.find(a=>a.lang==='zh-CN').slug}/index.html`,'utf8').split('</head>')[0];
 assert.ok(duplicate.includes('noindex'));
 assert.ok(sitemap.includes('/all-news/'));
 assert.ok(sitemap.includes('xhtml:link'));
 assert.ok(sitemap.includes('<lastmod>'));
} else {
 assert.ok(sitemap.includes('/all-news/'));
 assert.ok(!sitemap.includes('/post/'));
}
console.log(`SEO: ${count} article HTML documents verified; multilingual metadata, JSON-LD, content anchors, duplicate noindex and sitemap passed.`);
