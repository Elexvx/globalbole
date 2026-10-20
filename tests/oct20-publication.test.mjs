import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { buildContent, languages } from '../scripts/content.mjs';

const keys = [
  'modal-vera-agent-compute-2026-10-20',
  'us-new-home-affordability-inventory-2026-10-20',
  'us-spr-inventory-exchange-2026-10-20',
  'huaihe-catl-storage-cooperation-2026-10-20',
  'yinwang-catl-smart-battery-swap-2026-10-20',
  'ai-infrastructure-credit-obligations-2026-10-20',
];

test('October 20 publishes six complete aligned topics, not a capped three-report selection', () => {
  const all = buildContent();
  assert.equal(all.filter(a => a.issue === '2026-10-20').length, 30);
  for (const key of keys) {
    const editions = all.filter(a => a.translationKey === key);
    assert.deepEqual(editions.map(a => a.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(a => a.image)).size, 1);
    for (const article of editions) {
      assert.equal(article.date, '2026-10-20');
      assert.equal(article.issue, '2026-10-20');
      assert.ok(article.markdown.length > 1000);
      assert.match(article.markdown, /\[\^1\]:/);
      assert.ok(article.markdown.includes(article.image));
      assert.doesNotMatch(article.markdown, /PHOTO_SOURCE_URL|TODO|PLACEHOLDER|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断/);
      if (key.startsWith('us-spr')) {
        assert.ok(article.markdown.includes('/news-media/2026-10-20/spr-inventory-doe-2026-10-16.png'));
        assert.match(article.markdown, /282[.,]7|2[.,]827/);
        assert.match(article.markdown, /282[.,]2|2[.,]822/);
      }
    }
  }
  // A reverse tag alias breaks reciprocal hreflang even if each Chinese label
  // has one translation. Keep the new edition's labels bijective with the site.
  for (const lang of languages) {
    const map = new Map();
    for (const source of all.filter(a => a.lang === 'zh-CN')) {
      const target = all.find(a => a.translationKey === source.translationKey && a.lang === lang);
      source.tags.forEach((tag, i) => {
        const prior = map.get(target.tags[i]);
        assert.ok(!prior || prior === tag, `${lang}/${target.tags[i]}: reciprocal tag identity`);
        map.set(target.tags[i], tag);
      });
    }
  }
  const media = JSON.parse(readFileSync('docs/news-media/2026-10-20/provenance.json', 'utf8'));
  assert.equal(media.assets.length, 7);
  assert.equal(media.assets.filter(a => a.kind === 'ai_generated_editorial_illustration').length, 4);
  for (const asset of media.assets) {
    assert.equal(createHash('sha256').update(readFileSync(`public${asset.localPath}`)).digest('hex'), asset.sha256);
    assert.equal(asset.pixelIdentityVerified, true);
    assert.deepEqual(Object.keys(asset.captions).sort(), [...languages].sort());
  }
  const review = JSON.parse(readFileSync('docs/news-publication-review-2026-10-20.json', 'utf8'));
  assert.equal(review.selected.length, 6);
  assert.equal(review.held.length, 2);
  assert.deepEqual(review.held.map(a => a.candidate).sort((a,b) => a-b), [1, 8]);
});
