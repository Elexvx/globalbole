import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent, languages} from '../scripts/content.mjs';

const keys = [
  'oil-prices-supply-risk-2026-10-24',
  'openai-training-containment-2026-10-24',
  'ai-vulnerability-response-2026-10-24',
  'uk-ai-biosecurity-funding-2026-10-24',
  'fuel-cells-datacenter-power-2026-10-24',
  'amex-earnings-workforce-2026-10-24',
];

test('October 24 contains six substantive current-issue stories in five aligned editions', () => {
  const all = buildContent();
  const issue = all.filter(a => a.issue === '2026-10-24');
  assert.equal(issue.length, 30);
  for (const key of keys) {
    const editions = issue.filter(a => a.translationKey === key);
    assert.deepEqual(editions.map(a => a.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(a => a.image)).size, 1);
    const refs = editions.map(a => [...a.markdown.matchAll(/^\[\^\d+\]:.*$/gm)]
      .flatMap(m => [...m[0].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1])).sort());
    for (let i = 1; i < refs.length; i++) assert.deepEqual(refs[i], refs[0]);
    for (const a of editions) {
      assert.equal(a.date, '2026-10-24');
      assert.equal(a.author, a.lang === 'zh-CN' ? '全球伯乐 News' : a.lang === 'zh-TW' ? '全球伯樂 News' : 'Global Bole News');
      assert.ok(a.markdown.length > 2000, `${a.slug}: substantive complete edition`);
      assert.match(a.markdown, /\[\^1\]:/);
      assert.ok(a.markdown.includes(a.image));
      assert.doesNotMatch(a.markdown, /TODO|PLACEHOLDER|REPLACE_MEDIA|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断/);
    }
  }
  const provenance = JSON.parse(readFileSync('docs/news-media/2026-10-24/provenance.json', 'utf8'));
  assert.equal(provenance.assets.length, 7);
  assert.equal(provenance.assets.filter(a => a.coverAllowed).length, 6);
  assert.equal(provenance.sourceSelectedImages.length, 8);
  for (const a of provenance.assets) {
    assert.equal(createHash('sha256').update(readFileSync(`public${a.localPath}`)).digest('hex'), a.sha256);
    assert.deepEqual(Object.keys(a.captions).sort(), [...languages].sort());
    assert.deepEqual(Object.keys(a.alts).sort(), [...languages].sort());
    assert.equal(a.pixelsInspected, true);
    assert.equal(a.sourceSelected, false, 'Replacement assets must not be attributed to original image selections');
    for (const edition of issue.filter(item => item.translationKey === a.article)) {
      assert.ok(edition.markdown.includes(a.localPath));
      assert.ok(edition.markdown.includes(a.captions[edition.lang]));
    }
  }
  const review = JSON.parse(readFileSync('docs/news-publication-review-2026-10-24.json', 'utf8'));
  assert.equal(review.selected.length, 6);
  assert.equal(review.held.length, 2);
  const log = JSON.parse(readFileSync('docs/news-publication-log.json', 'utf8'));
  const batch = log.batches.filter(b => b.issue === '2026-10-24');
  assert.equal(batch.length, 1);
  assert.deepEqual(batch[0].articles.map(a => a.translationKey).sort(), [...keys].sort());
  assert.ok(!all.some(a => a.translationKey === 'taiwan-national-day-maritime-tensions-2026-10-11'));
});

test('October 24 photo compression exceptions are scoped without changing general encoding defaults', () => {
  const optimizer = readFileSync('scripts/optimize-images.mjs', 'utf8');
  assert.match(optimizer, /"\/news-media\/2026-10-24\/oil-supply\.jpg": 60/);
  assert.match(optimizer, /"\/news-media\/2026-10-24\/fuel-cell-power\.jpg": 60/);
  assert.match(optimizer, /photoAvifQuality\[image\] \?\? photoAvifQuality\[stem\] \?\? 65/);
});
