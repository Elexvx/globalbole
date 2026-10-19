import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildContent,languages} from '../scripts/content.mjs';
const keys=['china-third-quarter-gdp-demand-2026-10-19','hydrogen-city-cluster-pilots-2026-10-19','anthropic-public-benefit-equity-2026-10-19','cleanaway-eqt-waste-infrastructure-2026-10-19'];
test('October 19 reports preserve complete five-language editions and verified media',()=>{
 const all=buildContent();
 for(const key of keys){
 const editions=all.filter(a=>a.translationKey===key);
 assert.deepEqual(editions.map(a=>a.lang).sort(),[...languages].sort());
 for(const a of editions){
 assert.equal(a.issue,'2026-10-19');assert.equal(a.date,'2026-10-19');assert.ok(a.markdown.length>1000);
 assert.match(a.markdown,/\[\^1\]:/);assert.ok(a.markdown.includes(a.image));
 assert.doesNotMatch(a.markdown,/chatgpt\.com\/c\/|\/workspace\/|Sentinel_|本站整理日期/);
 if(key.startsWith('china-third'))assert.match(a.markdown,/4[.,]5/);
 }
 }
 const audit=JSON.parse(readFileSync('docs/news-media/2026-10-19/provenance.json'));
 assert.equal(audit.sourceSelectedCandidates.length,3);
 assert.ok(audit.sourceSelectedCandidates.every(a=>a.decision&&a.sourcePageURL));
 const review=JSON.parse(readFileSync('docs/news-publication-review-2026-10-19.json'));
 assert.equal(review.selected.length,4);assert.equal(review.held.length,4);
});
