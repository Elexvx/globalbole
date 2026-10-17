import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { buildContent, languages } from '../scripts/content.mjs';

const reports = new Map([
  ['us-september-ppi-energy-margins-2026-10-16', '2026-10-16'],
  ['us-september-retail-sales-composition-2026-10-16', '2026-10-16'],
  ['global-ev-sales-regional-divergence-2026-10-16', '2026-10-16'],
  ['us-september-industrial-output-2026-10-17', '2026-10-17'],
]);
const articles = buildContent();

test('October 16–17 catch-up retains issue dates and the actual publication date in five editions', () => {
  for (const [key, issue] of reports) {
    const editions = articles.filter(article => article.translationKey === key);
    assert.deepEqual(editions.map(article => article.lang).sort(), [...languages].sort(), key);
    for (const article of editions) {
      assert.equal(article.issue, issue);
      assert.equal(article.date, '2026-10-17');
      assert.equal(article.category, key.startsWith('global-ev-') ? 'energy' : 'business');
      assert.doesNotMatch(article.markdown, /chatgpt\.com\/c\/|\/workspace\/|Sentinel_|msg_[a-f0-9]+/);
      const blocks = article.markdown.split(/\n\s*\n/);
      for (const [index, block] of blocks.entries()) {
        if (!block.startsWith('![')) continue;
        const caption = blocks[index + 1];
        const html = renderToStaticMarkup(createElement(ReactMarkdown, null, caption));
        assert.match(html, /^<p><em>[\s\S]*<\/em><\/p>$/, `${key}/${article.lang}: shared caption style`);
      }
    }
  }
});

test('catch-up publication review is explicit about original writing and limited selection', () => {
  const review = JSON.parse(readFileSync('docs/news-publication-review-2026-10-17.json', 'utf8'));
  assert.equal(review.sourceHandoff.completeManuscriptReceived, false);
  assert.equal(review.sourceHandoff.candidateCount, 16);
  assert.deepEqual(review.selected.map(item => item.translationKey).sort(), [...reports.keys()].sort());
  assert.equal(review.held.length, 12);
  assert.ok(review.held.every(item => item.reason));
  assert.doesNotMatch(JSON.stringify(review), /chatgpt\.com\/c\/|\/workspace\/|Sentinel_|msg_[a-f0-9]+/);
});

test('September retail footnotes retain the exact dated Census release rather than only a rolling URL', () => {
  const path = '/news-sources/2026-10-16/census-retail-sales-september-2026-CB26-165.pdf';
  const data = readFileSync(`public${path}`);
  assert.equal(data.subarray(0, 5).toString(), '%PDF-');
  assert.equal(createHash('sha256').update(data).digest('hex'), 'ca6a46c73ae50400510701f007d40a26b436bef039f26060e1ecde235d2a5a03');
  for (const article of articles.filter(item => item.translationKey === 'us-september-retail-sales-composition-2026-10-16')) {
    assert.ok(article.markdown.includes(`https://www.globalbole.com${path}`));
    assert.ok(article.markdown.includes('https://www.census.gov/retail/marts/www/marts_current.pdf'));
  }
});
