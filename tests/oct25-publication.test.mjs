import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent, languages} from '../scripts/content.mjs';

const keys = [
  'kimi-cyber-risk-reduction-2026-10-25',
  'audi-georgia-production-plan-2026-10-25',
  'earnings-fed-week-preview-2026-10-25',
  'varopreem-growth-strategy-2026-10-25',
  'english-mayor-growth-finance-2026-10-25',
];

test('October 25 publishes five complete stories in exactly five aligned editions', () => {
  const all = buildContent();
  const issue = all.filter(article => article.issue === '2026-10-25');
  assert.equal(issue.length, 25);
  assert.deepEqual([...new Set(issue.map(article => article.translationKey))].sort(), [...keys].sort());
  for (const key of keys) {
    const editions = issue.filter(article => article.translationKey === key);
    assert.deepEqual(editions.map(article => article.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(article => article.image)).size, 1);
    const references = editions.map(article => [...article.markdown.matchAll(/^\[\^\d+\]:.*$/gm)]
      .flatMap(match => [...match[0].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1])).sort());
    for (let i = 1; i < references.length; i++) assert.deepEqual(references[i], references[0]);
    for (const article of editions) {
      assert.equal(article.date, '2026-10-25');
      assert.equal(article.author, article.lang === 'zh-CN' ? '全球伯乐 News' : article.lang === 'zh-TW' ? '全球伯樂 News' : 'Global Bole News');
      assert.ok(article.markdown.length > 2000, `${article.slug}: full article required`);
      assert.match(article.markdown, /\[\^1\]:/);
      assert.ok(article.markdown.includes(article.image));
      assert.doesNotMatch(article.markdown, /TODO|PLACEHOLDER|REPLACE_MEDIA|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断/);
    }
  }
  const review = JSON.parse(readFileSync('docs/news-publication-review-2026-10-25.json', 'utf8'));
  assert.equal(review.sourceDelivery.candidateCount, 8);
  assert.equal(review.selected.length, 5);
  assert.equal(review.held.length, 3);
  const log = JSON.parse(readFileSync('docs/news-publication-log.json', 'utf8'));
  const batches = log.batches.filter(batch => batch.issue === '2026-10-25');
  assert.equal(batches.length, 1);
  assert.deepEqual(batches[0].articles.map(article => article.translationKey).sort(), [...keys].sort());
  const withdrawn = log.batches.flatMap(batch => batch.articles).filter(article => article.status === 'withdrawn');
  for (const article of withdrawn) {
    assert.equal(article.republish, false);
    assert.ok(!all.some(active => active.translationKey === article.translationKey));
  }
});

test('October 25 media preserves the eight-image handoff and verifies every published asset', () => {
  const issue = buildContent().filter(article => article.issue === '2026-10-25');
  const provenance = JSON.parse(readFileSync('docs/news-media/2026-10-25/provenance.json', 'utf8'));
  assert.equal(provenance.sourceSelectedImages.length, 8);
  assert.equal(new Set(provenance.sourceSelectedImages.map(image => image.candidate)).size, 8);
  for (const key of keys) {
    const cover = issue.find(article => article.translationKey === key).image;
    assert.ok(provenance.assets.some(asset => asset.article === key && asset.localPath === cover && asset.coverAllowed));
  }
  for (const asset of provenance.assets) {
    assert.ok(keys.includes(asset.article));
    assert.equal(createHash('sha256').update(readFileSync(`public${asset.localPath}`)).digest('hex'), asset.sha256);
    assert.deepEqual(Object.keys(asset.captions).sort(), [...languages].sort());
    assert.deepEqual(Object.keys(asset.alts).sort(), [...languages].sort());
    assert.equal(asset.pixelsInspected, true);
    assert.notEqual(asset.kind, 'original_data_chart');
    for (const article of issue.filter(article => article.translationKey === asset.article)) {
      assert.ok(article.markdown.includes(asset.localPath));
      assert.ok(article.markdown.includes(asset.captions[article.lang]));
    }
  }
});

test('October 25 source-use audit identifies the exact final manuscripts', () => {
  const audit = JSON.parse(readFileSync('docs/news-media/2026-10-25/source-use-audit.json', 'utf8'));
  assert.equal(audit.finalManuscripts.length, 25);
  for (const file of audit.finalManuscripts) {
    assert.match(file.path, /^content\/issues\/2026-10-25\/(zh-CN|zh-TW|en|ru|fr)\//);
    assert.equal(createHash('sha256').update(readFileSync(file.path)).digest('hex'), file.sha256);
  }
  function checkLimits(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (['cumulativeChargedUnits', 'cumulative_charged_units_including_context_allowance', 'derived_words_all_five_editions'].includes(key)) {
        assert.ok(Number.isFinite(child) && child <= 200, `${key}: bounded source use required`);
      }
      checkLimits(child);
    }
  }
  checkLimits(audit);
});
