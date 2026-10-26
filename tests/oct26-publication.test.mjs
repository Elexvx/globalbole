import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent, languages} from '../scripts/content.mjs';

const issue = '2026-10-26';
const keys = [
  'nextdc-grid-delay-governance-2026-10-26',
  'spacex-gpu-debt-claim-2026-10-26',
  'uk-rough-sleeping-funding-2026-10-26',
  'brazil-runoff-official-result-2026-10-26',
  'serbia-concession-transition-2026-10-26',
];
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');

test('October 26 has five complete, aligned language editions for each selected story', () => {
  const all = buildContent();
  const articles = all.filter(a => a.issue === issue);
  assert.equal(articles.length, 25);
  assert.deepEqual([...new Set(articles.map(a => a.translationKey))].sort(), [...keys].sort());
  for (const key of keys) {
    const editions = articles.filter(a => a.translationKey === key);
    assert.deepEqual(editions.map(a => a.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(a => a.image)).size, 1);
    const notes = editions.map(a => [...a.markdown.matchAll(/^\[\^\d+\]:.*$/gm)]
      .flatMap(m => [...m[0].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1])).sort());
    for (const refs of notes.slice(1)) assert.deepEqual(refs, notes[0]);
    for (const a of editions) {
      assert.equal(a.date, issue);
      assert.ok(a.markdown.length > 2000, a.slug);
      assert.ok(a.markdown.includes(a.image), a.slug);
      assert.match(a.markdown, /\[\^1\]:/);
      assert.doesNotMatch(a.markdown, /TODO|PLACEHOLDER|MEDIA_[A-Z]|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断/);
      assert.equal(a.publishedAt, undefined, 'Do not invent an exact first-live timestamp before deployment');
      assert.equal(a.updatedAt, undefined, 'New editions are not revisions');
    }
  }
  const log = JSON.parse(readFileSync('docs/news-publication-log.json', 'utf8'));
  const batches = log.batches.filter(b => b.issue === issue);
  assert.equal(batches.length, 1);
  assert.deepEqual(batches[0].articles.map(a => a.translationKey).sort(), [...keys].sort());
  for (const a of log.batches.flatMap(b => b.articles).filter(a => a.status === 'withdrawn')) {
    assert.equal(a.republish, false);
    assert.ok(!all.some(active => active.translationKey === a.translationKey));
  }
});

test('October 26 assets have exact bytes, lawful provenance and five-language captions', () => {
  const articles = buildContent().filter(a => a.issue === issue);
  const provenance = JSON.parse(readFileSync(`docs/news-media/${issue}/provenance.json`, 'utf8'));
  assert.equal(provenance.sourceSelectedImages.length, 8);
  assert.equal(provenance.assets.length, 6);
  for (const a of provenance.assets) {
    assert.equal(hash(`public${a.localPath}`), a.sha256);
    assert.equal(a.pixelsInspected, true);
    assert.equal(a.bodyAllowed, true);
    assert.ok(a.rightsBasis);
    assert.deepEqual(Object.keys(a.captions).sort(), [...languages].sort());
    assert.deepEqual(Object.keys(a.alts).sort(), [...languages].sort());
    for (const article of articles.filter(article => article.translationKey === a.article)) {
      assert.ok(article.markdown.includes(a.localPath));
      assert.ok(article.markdown.includes(a.captions[article.lang]));
    }
    if (a.kind === 'publisher_original_chart') {
      assert.equal(a.coverAllowed, false);
      assert.equal(a.sourceBytesUnchanged, true);
    }
  }
  for (const article of articles) assert.ok(provenance.assets.some(a => a.article === article.translationKey && a.localPath === article.image && a.coverAllowed));
});

test('October 26 source-use audit pins final manuscripts and restricted-source budgets', () => {
  const audit = JSON.parse(readFileSync(`docs/news-media/${issue}/source-use-audit.json`, 'utf8'));
  assert.equal(audit.finalManuscripts.length, 25);
  for (const a of audit.finalManuscripts) assert.equal(hash(a.path), a.sha256, a.path);
  for (const a of audit.articles) {
    assert.ok(keys.includes(a.translationKey));
    for (const s of a.sources) {
      assert.ok(s.url && s.title && s.dateInformation && s.rightsBasis);
      if (s.restricted) {
        assert.ok(Number.isFinite(s.cumulativeWords));
        assert.ok(s.cumulativeWords <= s.budgetWords);
        assert.ok(s.budgetWords <= 200);
        assert.equal(s.editions, 5);
      }
    }
  }
});
