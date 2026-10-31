import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildContent,languages} from '../scripts/content.mjs';
const issue='2026-10-31';
const keys=['uk-cma-meta-commercial-terms-2026-10-31','us-q3-employment-cost-index-2026-10-31','us-solar-battery-colocation-2026-10-31'];
const read=p=>readFileSync(p,'utf8');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const allArticles=buildContent();
const batch=()=>allArticles.filter(a=>a.issue===issue);
const disclosure={ 'zh-CN':/AI\s*生成示意图/, 'zh-TW':/AI\s*生成示意圖/, en:/AI-generated illustration/i, fr:/illustration.*(?:IA|intelligence artificielle)/i, ru:/иллюстраци[яию].*(?:ИИ|искусственн)/i };
test('October31 contains three complete subjects in all five editions with valid linked source notes',()=>{
 const all=allArticles, rows=batch();assert.equal(rows.length,15);
 assert.deepEqual([...new Set(rows.map(a=>a.translationKey))].sort(),[...keys].sort());
 for(const key of keys){assert.deepEqual(rows.filter(a=>a.translationKey===key).map(a=>a.lang).sort(),[...languages].sort());}
 for(const a of rows){assert.equal(a.date,issue);assert.equal(a.publishedAt,undefined);assert.equal(a.updatedAt,undefined);
  const defs=[...a.markdown.matchAll(/^\[\^(\d+)\]: (.+)$/gm)];assert.ok(defs.length>=2,`${a.lang}/${a.translationKey}: multiple primary/method/license notes`);
  for(const [,id,note]of defs){assert.match(note,/https:\/\//);assert.match(note,/\*[^*]+\*/);assert.match(note,/2026/);}
  const defined=new Set(defs.map(m=>m[1]));
  const body=a.markdown.split('\n').filter(line=>!/^\[\^\d+\]:/.test(line)).join('\n');
  const referenced=new Set([...body.matchAll(/\[\^(\d+)\](?!:)/g)].map(m=>m[1]));
  for(const id of referenced)assert.ok(defined.has(id),`undefined source ${id}`);
  for(const id of defined)assert.ok(referenced.has(id),`${a.lang}/${a.translationKey}: unreferenced source ${id} would be hidden`);
  // Each finalized source has four distinct reporting/analysis paragraphs (EIA five), beyond images/captions/notes.
  const prose=a.markdown.split(/\n\s*\n/).filter(p=>!/^!|^\[\^/.test(p)&&!disclosure[a.lang].test(p)&&! /^(?:图 [12]|圖 [12]|Figure [12]|Рисунок [12])/i.test(p)&&p.trim());
  assert.ok(prose.length>=4,`${a.lang}/${a.translationKey}: full reporting and analysis, not a brief`);
  assert.doesNotMatch(a.markdown,/genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|来源附注|來源附註/);
 }
 const log=JSON.parse(read('docs/news-publication-log.json'));
 for(const a of log.batches.flatMap(b=>b.articles).filter(a=>a.status==='withdrawn')){assert.equal(a.republish,false);assert.ok(!all.some(x=>x.translationKey===a.translationKey));}
});
test('October31 keeps statistical periods, scope, projections and primary source identities across translations',()=>{
 for(const a of batch()){
  const text=a.markdown.replace(/,/g,'.');
  if(a.translationKey===keys[0]){assert.match(text,/1998/);assert.match(text,/2027/);assert.match(text,/robots\.txt/);assert.match(text,/CMA opens investigation into Meta’s commercial terms/);assert.match(text,/Suspected abuse of a dominant position/);}
  if(a.translationKey===keys[1]){for(const n of ['0.8','0.7','0.9','3.4','3.1','3.9','0.6','3.2','0.5','2025','2021','2027'])assert.ok(text.includes(n),`${a.lang}: ${n}`);assert.match(text,/USDL-26-1620/);assert.match(text,/Employment Cost Index Summary — September 2026/);assert.match(text,/Workers’ Compensation/);}
  if(a.translationKey===keys[2]){assert.equal(a.category,'energy');for(const n of ['16','19','30','13','18','2017','2027','2028','EIA-860M'])assert.ok(text.includes(n));assert.match(text,/planned additions/);assert.match(text,/The share of solar generation with co-located battery storage is increasing/);}
 }
 const cn=key=>batch().find(a=>a.lang==='zh-CN'&&a.translationKey===key).markdown;
 assert.match(cn(keys[0]),/尚未认定/);assert.match(cn(keys[0]),/不属于本次正式调查范围/);
 assert.match(cn(keys[1]),/未经季节调整/);assert.match(cn(keys[1]),/不包括联邦政府/);assert.match(cn(keys[1]),/每小时/);
 assert.match(cn(keys[2]),/不是已实现结果/);assert.match(cn(keys[2]),/截至 2026 年 9 月/);assert.match(cn(keys[2]),/纵轴分母为各地总发电装机容量/);assert.match(cn(keys[2]),/不保证项目盈利/);
});
test('October31 media retain cover/body reuse, visible AI disclosure and exact original EIA charts',()=>{
 const p=JSON.parse(read(`docs/news-media/${issue}/provenance.json`));
 for(const asset of p.assets){assert.equal(hash(`public${asset.localPath}`),asset.sha256);assert.equal(asset.pixelsInspected,true);}
 for(const a of batch()){
  assert.ok(a.markdown.includes(`](${a.image})`));assert.ok(existsSync(`public${a.image}`));
  if(p.assets.find(x=>x.localPath===a.image)?.aiGenerated){assert.match(a.imageAlt,disclosure[a.lang]);assert.match(a.markdown,disclosure[a.lang]);}
  if(a.translationKey===keys[2])for(const n of ['main','chart2']){assert.ok(a.markdown.includes(`/news-media/${issue}/eia-${n}.svg`));assert.ok(a.markdown.includes(`https://www.eia.gov/todayinenergy/images/2026.10.30/${n}.svg`));assert.ok(a.markdown.includes('https://www.eia.gov/about/copyrights_reuse.php'));}
 }
 const originals={'eia-main.svg':'585b1041445a2a172feab31a1b88d03fa9e9ce58be4a27ccd02d0625dd51bf4e','eia-chart2.svg':'3343486aeaad7ef12bbfbbdb79bf946f504007dc15117c4f5b0dddd1bc80fee5'};
 const manifest=JSON.parse(read('content/generated/image-manifest.json'));
 for(const [name,sha]of Object.entries(originals)){assert.equal(hash(`public/news-media/${issue}/${name}`),sha);assert.equal(manifest[`/news-media/${issue}/${name}`],undefined);}
 assert.match(read('lib/image-assets.ts'),/if \(!asset\) return \{src:image\}/);
 assert.match(read('components/article-markdown.tsx'),/responsiveImageProps\(image, "body"\)/);
 assert.doesNotMatch(read('components/article-markdown.tsx'),/object-cover|story-cover/);
 assert.match(read('app/globals.css'),/\.markdown-body img\s*\{[^}]*max-width:\s*100%[^}]*height:\s*auto/s);
});

// SHA-256 from accepted October30 repair commit 2be64c24bbbd6e39a617121ea2bbab3711933fca.
const repairBaseline={
  ".vercel_build_output/config/build.json": "1980a6f25e7fa065bc6e1648be9fe5decc50d69bc84782db2fbe36bb9bd2502e",
  "content/image-cache-lock.json": "da06021ad94081a33c69f7e40d95f1504909599c4a460a2bdd3f2118384b9e5c",
  "scripts/image-build-cache.mjs": "16f7baa4a5d99d09a5e32b1554cad46f1f943f984eef1c6a68ddf3b1e886270a",
  "scripts/optimize-images.mjs": "4541c29519997ae03a1ae1472bc164beb65fa1f5cb255b1f7cd765947e4c72e0",
  "tests/image-build-cache.test.mjs": "dbcddeae08c969b1eeb993f9c90ec1e753bfc9a9fe6139ec183c97b4504a60a5"
};
test('October31 preserves all five accepted image-cache repair files byte-for-byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(hash(file),sha,file);});
