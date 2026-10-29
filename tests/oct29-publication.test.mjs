import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent,languages} from '../scripts/content.mjs';
const issue='2026-10-29';
const keys=['fed-october-rate-hold-dissent-2026-10-29','microsoft-quarterly-earnings-accounting-2026-10-29','google-carbon-access-benchmarks-2026-10-29','skhynix-preliminary-results-capacity-2026-10-29','maryland-clean-energy-grant-applications-2026-10-29'];
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
test('October29 contains only the five complete reviewed subjects in all languages',()=>{
 const all=buildContent(),batch=all.filter(a=>a.issue===issue);
 assert.equal(batch.length,25);assert.deepEqual([...new Set(batch.map(a=>a.translationKey))].sort(),[...keys].sort());
 for(const key of keys){const group=batch.filter(a=>a.translationKey===key);assert.deepEqual(group.map(a=>a.lang).sort(),[...languages].sort());
  for(const a of group){assert.equal(a.date,issue);assert.equal(a.publishedAt,undefined);assert.equal(a.updatedAt,undefined);assert.ok(a.markdown.includes(a.image));assert.match(a.markdown,/\[\^1\]:/);assert.doesNotMatch(a.markdown,/TODO|PLACEHOLDER|\{\{IMAGE\}\}|genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|本站整理日期|判断口径/);}
 }
 const zh=key=>batch.find(a=>a.translationKey===key&&a.lang==='zh-CN');
 assert.match(zh(keys[0]).markdown,/10 票赞成、2 票反对/);assert.match(zh(keys[0]).markdown,/3\.75%—4\.00%/);assert.doesNotMatch(zh(keys[0]).title,/十名委员/);
 assert.match(zh(keys[2]).markdown,/计划本周/);assert.match(zh(keys[2]).markdown,/无防护栏/);assert.match(zh(keys[3]).markdown,/审阅未完成/);assert.match(zh(keys[3]).markdown,/104\.6155 万亿韩元/);
 assert.match(zh(keys[4]).markdown,/10 月 26 日/);assert.match(zh(keys[4]).markdown,/美元\/MWh-ac/);
 const log=JSON.parse(readFileSync('docs/news-publication-log.json','utf8'));assert.equal(log.batches.filter(b=>b.issue===issue).length,1);
 for(const a of log.batches.flatMap(b=>b.articles).filter(a=>a.status==='withdrawn')){assert.equal(a.republish,false);assert.ok(!all.some(x=>x.translationKey===a.translationKey));}
});
test('October29 photographs have actual checked bytes, rights and aligned archive captions',()=>{
 const all=buildContent().filter(a=>a.issue===issue),p=JSON.parse(readFileSync(`docs/news-media/${issue}/provenance.json`,'utf8'));
 assert.equal(p.assets.length,5);assert.equal(p.aiGeneratedImages,0);
 for(const a of p.assets){assert.equal(hash(`public${a.localPath}`),a.sha256);assert.equal(a.pixelsInspected,true);assert.equal(a.pixelsIdentical,true);assert.ok(a.author&&a.license&&a.licenseURL&&a.sourcePageURL);assert.deepEqual(Object.keys(a.captions).sort(),[...languages].sort());
  for(const x of all.filter(x=>x.translationKey===a.article)){assert.equal(x.image,a.localPath);assert.ok(x.markdown.includes(a.captions[x.lang]));assert.doesNotMatch(a.captions[x.lang],/4K|元数据|中繼資料|metadata|métadonnées|метаданные|版式|cropp/i);}
 }
 assert.equal(p.assets.find(a=>a.article===keys[1]).date,null,'A filename is not a verified capture date');
 assert.equal(p.assets.find(a=>a.article===keys[4]).license,'Public Domain Mark 1.0');
});
test('October29 source-use review is bound to the exact25 full texts and cumulative budgets',()=>{
 const a=JSON.parse(readFileSync(`docs/news-media/${issue}/source-use-audit.json`,'utf8'));assert.equal(a.finalManuscripts.length,25);
 for(const f of a.finalManuscripts)assert.equal(hash(f.path),f.sha256,f.path);
 for(const s of a.protectedSources){assert.equal(s.allocationEstimate.length,5);assert.equal(s.total,s.allocationEstimate.reduce((n,v)=>n+v,0));assert.ok(s.total<=s.cap&&s.cap<=200,s.source);}
 assert.ok(a.protectedSources.length>=5);
});
