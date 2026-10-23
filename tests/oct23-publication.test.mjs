import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent, languages} from '../scripts/content.mjs';

const keys = [
  'microsoft-diagnostic-orchestrator-study-2026-10-23',
  'datacenter-community-investment-promises-2026-10-23',
  'china-fdi-january-september-2026-10-23',
  'japan-september-inflation-2026-10-23',
  'us-stocks-ai-reassessment-2026-10-23',
  'barclays-cost-cuts-third-quarter-2026-10-23',
];

test('October 23 publishes six verified current-issue stories in exactly five complete editions', () => {
  const all = buildContent();
  const issue = all.filter(a => a.issue === '2026-10-23');
  assert.equal(issue.length, 30);
  for (const key of keys) {
    const editions = issue.filter(a => a.translationKey === key);
    assert.deepEqual(editions.map(a => a.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(a => a.image)).size, 1);
    const refs = editions.map(a => [...a.markdown.matchAll(/^\[\^\d+\]:.*$/gm)]
      .flatMap(m => [...m[0].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1])).sort());
    for (let i = 1; i < refs.length; i++) assert.deepEqual(refs[i], refs[0]);
    for (const a of editions) {
      assert.equal(a.date, '2026-10-23');
      assert.ok(a.markdown.length > 1400);
      assert.match(a.markdown, /\[\^1\]:/);
      assert.ok(a.markdown.includes(a.image));
      assert.doesNotMatch(a.markdown, /TODO|PLACEHOLDER|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断|science\.adz4433/);
    }
  }
  const provenance = JSON.parse(readFileSync('docs/news-media/2026-10-23/provenance.json', 'utf8'));
  assert.equal(provenance.assets.length, 6);
  assert.equal(provenance.sourceSelectedImages.length, 8);
  assert.equal(provenance.assets.filter(a => a.kind === 'archival_documentary_photo').length, 4);
  assert.equal(provenance.assets.filter(a => a.kind === 'ai_generated_editorial_illustration').length, 2);
  for (const a of provenance.assets) {
    assert.equal(createHash('sha256').update(readFileSync(`public${a.localPath}`)).digest('hex'), a.sha256);
    assert.deepEqual(Object.keys(a.captions).sort(), [...languages].sort());
    assert.equal(a.pixelsInspected, true);
  }
  const review = JSON.parse(readFileSync('docs/news-publication-review-2026-10-23.json', 'utf8'));
  assert.equal(review.selected.length, 6);
  assert.equal(review.held.length, 2);
  assert.ok(!all.some(a => a.translationKey === 'taiwan-national-day-maritime-tensions-2026-10-11'));
});

test('the Barclays portrait cover retains its identifying roofline without changing body proportions', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  assert.match(css, /\.story-cover\[data-source-image="\/news-media\/2026-10-23\/barclays\.jpg"\]\s*\{\s*object-position:\s*50% 0%;/);
  assert.doesNotMatch(css, /\.markdown-body[^}]*barclays/);
});
