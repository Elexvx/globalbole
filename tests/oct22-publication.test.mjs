import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { buildContent, languages } from '../scripts/content.mjs';
const keys = ["openai-monitoring-boundaries-2026-10-22", "meta-muse-capital-spending-2026-10-22", "china-nand-upgrade-delivery-2026-10-22", "nvidia-europe-robotics-deployment-2026-10-22", "tesla-cash-flow-capex-2026-10-22", "kinder-morgan-gas-investment-2026-10-22", "ebay-workforce-focus-2026-10-22"];
test('October 22 retains seven current-issue stories in exactly five aligned languages', () => {
 const all=buildContent(), issue=all.filter(a=>a.issue==='2026-10-22');
 assert.equal(issue.length,35);
 for(const key of keys){
  const editions=issue.filter(a=>a.translationKey===key);
  assert.deepEqual(editions.map(a=>a.lang).sort(),[...languages].sort());
  assert.equal(new Set(editions.map(a=>a.image)).size,1);
  const footnoteURLs=editions.map(a=>[...a.markdown.matchAll(/^\[\^\d+\]:.*$/gm)].flatMap(m=>[...m[0].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m=>m[1])).sort());
  for(let i=1;i<footnoteURLs.length;i++)assert.deepEqual(footnoteURLs[i],footnoteURLs[0]);
  for(const a of editions){
   assert.equal(a.date,'2026-10-22');assert.ok(a.markdown.length>1400);
   assert.match(a.markdown,/\[\^1\]:/);assert.ok(a.markdown.includes(a.image));
   assert.doesNotMatch(a.markdown,/TODO|PLACEHOLDER|chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期|判断口径|伯乐判断/);
   if(key.startsWith('tesla')){assert.match(a.markdown,/tesla-model-y-69-official/);assert.match(a.markdown,/tesla-model-y-70-official/);assert.ok(!a.image.includes('model-y'));}
  }
 }
 const media=JSON.parse(readFileSync('docs/news-media/2026-10-22/provenance.json','utf8'));
 assert.equal(media.assets.length,9);assert.equal(media.sourceSelectedImages.length,8);
 assert.equal(media.assets.filter(a=>a.kind==='ai_generated_editorial_illustration').length,6);
 for(const a of media.assets){assert.equal(createHash('sha256').update(readFileSync(`public${a.localPath}`)).digest('hex'),a.sha256);assert.equal(a.pixelIdentityVerified,true);assert.deepEqual(Object.keys(a.captions).sort(),[...languages].sort());}
 const review=JSON.parse(readFileSync('docs/news-publication-review-2026-10-22.json','utf8'));
 assert.equal(review.selected.length,7);assert.deepEqual(review.held.map(a=>a.candidate),[8]);
 assert.ok(!all.some(a=>a.translationKey==='taiwan-national-day-maritime-tensions-2026-10-11'));
});
