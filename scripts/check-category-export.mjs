import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {categories} from '../lib/categories.mjs';
import {articleLanguages} from '../lib/article-contract.mjs';
import {innovationRelatedStories} from '../lib/home-selection.mjs';

// The marker is on a div/section. Track nested same-name elements so checks only
// inspect that visible region, never the ticker, recommendations or script data.
function markedBlocks(html, attribute) {
  const blocks=[];
  const starts=new RegExp(`<([a-z][\\w:-]*)\\b[^>]*\\b${attribute}="([^"]+)"[^>]*>`,'gi');
  for(const match of html.matchAll(starts)) {
    const start=match.index+match[0].length;
    const tags=new RegExp(`<(/?)${match[1]}\\b[^>]*>`,'gi');tags.lastIndex=start;
    let depth=1,tag;
    while((tag=tags.exec(html))) {
      depth+=tag[1]?-1:1;
      if(depth===0){blocks.push({category:match[2],html:html.slice(start,tag.index)});break;}
    }
    assert.equal(depth,0,`Unclosed ${attribute} region`);
  }
  return blocks;
}
const articleLinks=html=>[...new Set([...html.matchAll(/href="(\/[^"#?]*\/post\/[^"#?]+\/)"/g)].map(match=>decodeURIComponent(match[1])))].sort();
// Static React output may include a Suspense fallback main before its resolved main.
const mainRegions=html=>[...html.matchAll(/<main\b[^>]*>[\s\S]*?<\/main>/g)].map(match=>match[0]).join('');
const visibleText=html=>html.replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"');

export function checkCategoryExport(articles) {
  const messages=JSON.parse(readFileSync('lib/messages.json','utf8'));
  const sitemap=readFileSync('out/sitemap.xml','utf8');
  let count=0;
  for(const lang of articleLanguages) {
    const home=readFileSync(`out/${lang}/index.html`,'utf8');
    for(const category of categories) {
      const route=`/${lang}/category/${category.slug}/`;
      const html=readFileSync(`out${route}index.html`,'utf8');
      const main=mainRegions(html);
      const results=markedBlocks(main,'data-category-results');
      assert.equal(results.length,1,`${route}: one category results region`);
      assert.equal(results[0].category,category.slug);
      const expected=articles.filter(article=>article.lang===lang && article.category===category.slug).map(article=>`/${lang}/post/${article.slug}/`).sort();
      assert.deepEqual(articleLinks(results[0].html),expected,`${route}: only matching articles in category results`);
      if(!expected.length) assert.ok(results[0].html.includes(messages['No stories in this section yet.'][lang]),`${route}: translated empty state`);
      const head=html.split('</head>')[0];
      assert.ok(head.includes(route),`${route}: canonical/category route`);
      assert.ok(visibleText(main).includes(messages[category.label][lang]),`${route}: localized category label`);
      assert.ok(home.includes(`href="${route}"`),`${route}: home navigation`);
      assert.ok(sitemap.includes(route),`${route}: sitemap`);
      for(const alternative of articleLanguages) assert.ok(head.toLowerCase().includes(`hreflang="${alternative.toLowerCase()}"`),`${route}: ${alternative} alternate`);
      count++;
    }
    const ordered = articles.filter(article=>article.lang===lang)
      .sort((a,b)=>b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
    for (const block of markedBlocks(mainRegions(home), 'data-related-reports')) {
      const lead = ordered.find(article=>article.slug===block.category);
      assert.ok(lead, `${lang} home: related reports require a real lead`);
      const related = innovationRelatedStories(ordered, lead, 4);
      assert.deepEqual(articleLinks(block.html), related.map(article=>`/${lang}/post/${article.slug}/`).sort(),
        `${lang} home: exact relevant reports, without the lead or foreign editions`);
      const rows = [...block.html.matchAll(/<a\b[^>]*class="ref-rank-story"[^>]*>([\s\S]*?)<\/a>/g)];
      assert.equal(rows.length, related.length, `${lang} home: no duplicate related rows`);
      related.forEach((article, index) => {
        const row = rows[index][0];
        assert.deepEqual(articleLinks(row), [`/${lang}/post/${article.slug}/`], `${lang} home: relevant row order`);
        const label = messages[categories.find(category=>category.slug===article.category).label][lang];
        const renderedLabel = row.match(/<span class="ref-meta-accent">([\s\S]*?)<\/span>/)?.[1];
        assert.equal(visibleText(renderedLabel || ''), label, `${lang} home: row preserves actual category label`);
      });
      assert.doesNotMatch(block.html, /<img\b|<picture\b/, 'Related reports stay a compact text list');
    }
    for(const block of markedBlocks(mainRegions(home), 'data-category-section')) {
      const allowed=new Set(articles.filter(article=>article.lang===lang && article.category===block.category).map(article=>`/${lang}/post/${article.slug}/`));
      for(const href of articleLinks(block.html)) assert.ok(allowed.has(href),`${lang} home: ${href} borrowed into ${block.category}`);
    }
  }
  for(const category of categories) readFileSync(`out/category/${category.slug}/index.html`,'utf8');
  console.log(`Categories: ${count} localized routes, six compatibility routes, localized labels/empty states, exact category results and homepage desk membership verified.`);
}
