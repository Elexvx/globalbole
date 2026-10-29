import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent, languages} from '../scripts/content.mjs';

const issue = '2026-10-28';
const keys = [
  'meta-nvidia-equity-financing-2026-10-28',
  'microsoft-voluntary-exit-eligibility-2026-10-28',
  'irena-renewables-grid-outlook-2026-10-28',
  'us-august-house-prices-mortgage-rates-2026-10-28',
  'epa-methane-rule-proposal-2026-10-28',
];
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');

test('October 28 publishes only the five reviewed subjects, with complete aligned editions', () => {
  const all = buildContent();
  const batch = all.filter(a => a.issue === issue);
  assert.equal(batch.length, 25);
  assert.deepEqual([...new Set(batch.map(a => a.translationKey))].sort(), [...keys].sort());
  for (const key of keys) {
    const group = batch.filter(a => a.translationKey === key);
    assert.deepEqual(group.map(a => a.lang).sort(), [...languages].sort());
    for (const a of group) {
      assert.equal(a.date, '2026-10-29', 'Held issue must not backdate its first publication');
      assert.equal(a.publishedAt, undefined, 'Unknown exact first-live time must not be invented');
      assert.equal(a.updatedAt, undefined);
      assert.ok(a.markdown.includes(a.image), 'Cover is reused in the complete body');
      assert.match(a.markdown, /\[\^1\]:/);
      assert.doesNotMatch(a.markdown, /TODO|PLACEHOLDER|EPA_PDF_URL|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|genui|本站整理日期|判断口径/);
    }
  }
  const log = JSON.parse(readFileSync('docs/news-publication-log.json', 'utf8'));
  assert.equal(log.batches.filter(b => b.issue === issue).length, 1);
  for (const a of log.batches.flatMap(b => b.articles).filter(a => a.status === 'withdrawn')) {
    assert.equal(a.republish, false);
    assert.ok(!all.some(active => active.translationKey === a.translationKey));
  }
});

test('October 28 photos retain checked bytes, licenses and all five factual captions', () => {
  const batch = buildContent().filter(a => a.issue === issue);
  const provenance = JSON.parse(readFileSync(`docs/news-media/${issue}/provenance.json`, 'utf8'));
  assert.equal(provenance.assets.length, 5);
  for (const asset of provenance.assets) {
    assert.equal(hash(`public${asset.localPath}`), asset.sha256);
    assert.equal(asset.pixelsInspected, true);
    assert.equal(asset.pixelsIdentical, true);
    assert.ok(asset.author && asset.license && asset.licenseURL && asset.sourcePageURL);
    assert.deepEqual(Object.keys(asset.captions).sort(), [...languages].sort());
    for (const article of batch.filter(a => a.translationKey === asset.article)) {
      assert.equal(article.image, asset.localPath);
      assert.ok(article.markdown.includes(asset.captions[article.lang]));
      assert.doesNotMatch(asset.captions[article.lang], /4K|元数据|中繼資料|metadata|métadonnées|метаданные|版式|cropp/i);
    }
  }
  for (const name of ['renewable-windfarm.jpg', 'natural-gas-flare.jpg']) {
    assert.equal(provenance.assets.find(a => a.filename === name).date, null, 'Upload dates must not become invented capture dates');
  }
});

test('October 28 restricted source budgets aggregate across all five editions', () => {
  const audit = JSON.parse(readFileSync(`docs/news-media/${issue}/source-use-audit.json`, 'utf8'));
  assert.equal(audit.finalManuscripts.length, 25);
  for (const a of audit.finalManuscripts) assert.equal(hash(a.path), a.sha256, a.path);
  for (const source of audit.protectedSources) {
    assert.equal(source.allocationEstimate.length, 5);
    assert.equal(source.total, source.allocationEstimate.reduce((sum, n) => sum + n, 0));
    assert.ok(source.total <= source.cap && source.cap <= 200, source.source);
  }
});
