import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildContent,languages} from '../scripts/content.mjs';
const keys=['china-battery-storage-system-value-2026-10-18','centinela-copper-labour-supply-chain-2026-10-18'];
const articles=buildContent();
test('October 18 original reports have complete linked editions and dated sources',()=>{
 for(const key of keys){
  const editions=articles.filter(a=>a.translationKey===key);
  assert.deepEqual(editions.map(a=>a.lang).sort(),[...languages].sort());
  for(const a of editions){
   assert.equal(a.issue,'2026-10-18');assert.equal(a.date,'2026-10-18');
   assert.ok(a.markdown.length>1000);assert.match(a.markdown,/\[\^1\]:/);
   assert.doesNotMatch(a.markdown,/chatgpt\.com\/c\/|\/workspace\/|Sentinel_|msg_[a-f0-9]+/);
   if(key.startsWith('china-battery')){assert.ok(a.markdown.includes('1200')||a.markdown.includes('1,200')||a.markdown.includes('1 200'));assert.match(a.markdown,/2024/);assert.match(a.markdown,/CC BY 4\.0/);assert.match(a.markdown,/not endorsed by the IEA/);}
  }
 }
 const review=JSON.parse(readFileSync('docs/news-publication-review-2026-10-18.json','utf8'));
 assert.equal(review.sourceHandoff.completeManuscriptReceived,false);
 assert.equal(review.sourceHandoff.candidateCount,8);
 assert.equal(review.selected.length,2);assert.equal(review.held.length,6);
 assert.ok(review.held.every(x=>x.reason));
});
