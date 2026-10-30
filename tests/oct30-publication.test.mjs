import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent,languages} from '../scripts/content.mjs';
const issue='2026-10-30';
const keys=['us-q3-gdp-advance-2026-10-30','us-september-income-pce-2026-10-30','us-2025-consumer-expenditures-2026-10-30','mistral-large4-open-weights-2026-10-30','us-battery-strategy-battman-2026-10-30'];
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
test('October30 has five complete subjects, truthful date-only publication and all five languages',()=>{
 const all=buildContent(),batch=all.filter(a=>a.issue===issue);assert.equal(batch.length,25);
 assert.deepEqual([...new Set(batch.map(a=>a.translationKey))].sort(),[...keys].sort());
 for(const key of keys){const group=batch.filter(a=>a.translationKey===key);assert.deepEqual(group.map(a=>a.lang).sort(),[...languages].sort());
  for(const a of group){assert.equal(a.date,issue);assert.equal(a.publishedAt,undefined);assert.equal(a.updatedAt,undefined);assert.ok(a.markdown.includes(a.image));assert.match(a.markdown,/\[\^1\]:/);assert.doesNotMatch(a.markdown,/genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|本站整理日期|编辑判断是|編輯判斷是/);}
 }
 const log=JSON.parse(readFileSync('docs/news-publication-log.json','utf8'));assert.equal(log.batches.filter(b=>b.issue===issue).length,1);
 for(const a of log.batches.flatMap(b=>b.articles).filter(a=>a.status==='withdrawn')){assert.equal(a.republish,false);assert.ok(!all.some(x=>x.translationKey===a.translationKey));}
});
test('October30 preserves economic statistical definitions and battery forecast caveats',()=>{
 const zh=key=>buildContent().find(a=>a.translationKey===key&&a.lang==='zh-CN');
 assert.match(zh(keys[0]).markdown,/私人固定投资，包括住宅投资/);assert.match(zh(keys[0]).markdown,/3\.4%/);assert.match(zh(keys[0]).markdown,/0\.8%/);
 assert.match(zh(keys[1]).markdown,/金额及其变化按季节调整后的年率/);assert.match(zh(keys[1]).markdown,/百分比则是月度变化/);assert.match(zh(keys[1]).markdown,/不足 0\.1%/);
 assert.match(zh(keys[2]).title,/每消费单位/);assert.match(zh(keys[2]).markdown,/11 个月/);assert.match(zh(keys[2]).markdown,/10 月和 11 月/);
 assert.match(zh(keys[4]).markdown,/BloombergNEF 2026 年 6 月/);assert.match(zh(keys[4]).markdown,/不是新工厂已经建成/);
});
test('October30 has six reviewed archive photos with consistent attribution and hashes',()=>{
 const all=buildContent().filter(a=>a.issue===issue),p=JSON.parse(readFileSync(`docs/news-media/${issue}/provenance.json`,'utf8'));
 assert.equal(p.assets.length,6);assert.equal(p.aiGeneratedImages,0);
 for(const a of p.assets){assert.equal(hash(`public${a.localPath}`),a.sha256);assert.equal(a.pixelsInspected,true);assert.equal(a.pixelsIdentical,true);assert.equal(a.ICCunchanged,true);assert.ok(a.author&&a.license&&a.licenseURL&&a.sourcePageURL);assert.deepEqual(Object.keys(a.captions).sort(),[...languages].sort());
  for(const x of all.filter(x=>x.translationKey===a.article)){assert.ok(x.markdown.includes(a.localPath));assert.ok(x.markdown.includes(a.captions[x.lang]));assert.doesNotMatch(a.captions[x.lang],/元数据|中繼資料|metadata|métadonnées|метаданные|版式|cropp/i);}
 }
 const candidates=JSON.parse(readFileSync(`docs/news-media/${issue}/original-candidate-media.json`,'utf8'));assert.equal(candidates.assets.length,7);assert.equal(candidates.assets.find(x=>x.id==='M5').decision,'not-adopted');
});
test('Mistral includes the complete original documentation license in every language edition',()=>{
 const license=readFileSync(`public/news-sources/${issue}/mistral-ecosystem-open-weight-license.txt`,'utf8').trim();
 for(const a of buildContent().filter(a=>a.translationKey===keys[3])){
  const quoted=a.markdown.split('\n').filter(l=>l.startsWith('>')).map(l=>l.replace(/^> ?/,'')).join('\n').trim();assert.equal(quoted,license);assert.match(a.markdown,/2026 - Mistral/);assert.ok(a.markdown.includes(`/news-sources/${issue}/mistral-ecosystem-open-weight-license.txt`));
 }
});
test('October30 source budgets bind to exact complete25 texts',()=>{
 const a=JSON.parse(readFileSync(`docs/news-media/${issue}/source-use-audit.json`,'utf8'));assert.equal(a.finalManuscripts.length,25);
 for(const f of a.finalManuscripts)assert.equal(hash(f.path),f.sha256,f.path);
 assert.equal(a.protectedSources.length,2);
 for(const s of a.protectedSources){assert.equal(s.allocationEstimate.length,5);assert.equal(s.total,s.allocationEstimate.reduce((n,v)=>n+v,0));assert.ok(s.total<=s.cap&&s.cap<=200);}
});
