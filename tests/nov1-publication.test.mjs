import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import {buildContent,languages} from '../scripts/content.mjs';
const issue='2026-11-01';
const keys=['china-october-pmi-2026-11-01','amazon-q3-cloud-cashflow-investment-2026-11-01','delhi-october-air-quality-2026-11-01','india-panchayat-ev-charging-mou-2026-11-01'];
const read=p=>readFileSync(p,'utf8');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const all=buildContent(), rows=all.filter(a=>a.issue===issue);
const parse=markdown=>unified().use(remarkParse).use(remarkGfm).parse(markdown);
function nodes(n){return [n,...(n.children||[]).flatMap(nodes)];}
const text=n=>n.type==='footnoteReference'||n.type==='image'?'':n.value??(n.children||[]).map(text).join('');
const norm=s=>s.normalize('NFKC').replace(/\s+/g,'');
const disclosure={'zh-CN':/AI\s*生成示意图/,'zh-TW':/AI\s*生成示意圖/,en:/AI-generated illustration/i,fr:/illustration.*(?:IA|intelligence artificielle)/i,ru:/иллюстраци[яию].*(?:ИИ|искусственн)/i};

test('November1 publishes exactly four complete source subjects in five full editions',()=>{
 assert.equal(rows.length,20);assert.deepEqual([...new Set(rows.map(a=>a.translationKey))].sort(),[...keys].sort());
 for(const key of keys){const versions=rows.filter(a=>a.translationKey===key);assert.deepEqual(versions.map(a=>a.lang).sort(),[...languages].sort());assert.equal(new Set(versions.map(a=>a.image)).size,1);assert.equal(new Set(versions.map(a=>a.category)).size,1);}
 for(const a of rows){
  assert.equal(a.date,issue);assert.equal(a.publishedAt,undefined);assert.equal(a.updatedAt,undefined);
  const ast=parse(a.markdown), ns=nodes(ast), definitions=ns.filter(n=>n.type==='footnoteDefinition'), refs=ns.filter(n=>n.type==='footnoteReference');
  assert.ok(definitions.length>=1,`${a.source}: source notes`);
  for(const link of ns.filter(n=>n.type==='link')){assert.match(link.url,/^https:\/\//,`${a.source}: canonical HTTPS source or license URL`);assert.doesNotMatch(link.url,/[）；。]$/,`${a.source}: punctuation swallowed by autolink`);}
  const ids=new Set(definitions.map(n=>n.identifier)), used=new Set(refs.map(n=>n.identifier));assert.deepEqual(ids,used,`${a.source}: all notes defined and visibly referenced`);
  for(const note of definitions){const links=nodes(note).filter(n=>n.type==='link');assert.ok(links.some(n=>/^https:\/\//.test(n.url)&&text(n).trim().length>=4),`${a.source}: titled original source URL`);assert.match(text(note),/2026/);}
  const paragraphs=ast.children.filter(n=>n.type==='paragraph'&&text(n).trim().length>80);assert.ok(paragraphs.length>=6,`${a.source}: complete reporting paragraphs`);assert.ok(ast.children.filter(n=>n.type==='heading'&&n.depth===2).length>=3,`${a.source}: structured explanation`);
  assert.doesNotMatch(a.markdown,/genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|01a0ebbd|turn\d+(?:view|search)|本站整理日期|判断口径|伯乐判断/);
  assert.ok(Buffer.byteLength(a.markdown)>1800,`${a.source}: substantial full edition`);
 }
 const log=JSON.parse(read('docs/news-publication-log.json'));
 const batch=log.batches.filter(b=>b.issue===issue);assert.equal(batch.length,1);assert.deepEqual(batch[0].articles.map(a=>a.translationKey).sort(),[...keys].sort());
 for(const a of log.batches.flatMap(b=>b.articles).filter(a=>a.status==='withdrawn')){assert.equal(a.republish,false);assert.ok(!all.some(x=>x.translationKey===a.translationKey));}
});

test('November1 translations retain original source identities, numerical periods and distinct topics',()=>{
 const required={
  [keys[0]]:['49.3','49.7','49.8','49.4','48.4','50.2','47.5','51.3','50.6','48.8','47.3','56.8','3200','4300','1965718','1965719'],
  [keys[1]]:['20260930'],
  [keys[2]]:['166','223','167','170','220','200','69','72','171','2018','2026','2331032'],
  [keys[3]]:['2026','2330751','CESL','EESL']
 };
 for(const a of rows){const s=a.markdown.replace(/(?<=\d)[\s\u00a0\u202f](?=\d{3}(?:\D|$))/g,'').replace(/,/g,'.');for(const marker of required[a.translationKey])assert.ok(s.includes(marker)||(['3200','4300'].includes(marker)&&s.includes(marker[0]+'.'+marker.slice(1))),`${a.source}: retained figure/source identifier ${marker}`);}
 for(const a of rows.filter(a=>a.translationKey===keys[1])){const s=a.markdown.replace(/,/g,'.');for(const variants of [['2019.44','201.944'],['280.76','28.076'],['459.84','45.984'],['177.73','17.773'],['1683','168.3'],['1306.91','130.691'],['2106.57','210.657'],['147.88','14.788'],['423.57','42.357'],['759','75.9'],['1722','172.2'],['2200','220'],['500','50'],['150','15'],['137','13.7'],['213','21.3']])assert.ok(variants.some(n=>s.includes(n)),`${a.source}: amount ${variants.join(' / ')}`);}
 const cn=k=>rows.find(a=>a.lang==='zh-CN'&&a.translationKey===k).markdown;
 assert.match(cn(keys[0]),/不能.*GDP|不能.*增速/);assert.match(cn(keys[0]),/季节调整/);assert.match(cn(keys[2]),/10月29日|10 月 29 日/);assert.match(cn(keys[2]),/PM10/);assert.match(cn(keys[3]),/未.*站点|站点.*未/);
});

test('November1 media are exact inspected assets reused in body with localized disclosure and attribution',()=>{
 const p=JSON.parse(read(`docs/news-media/${issue}/provenance.json`));assert.equal(p.assets.length,4);
 for(const asset of p.assets){assert.equal(hash(`public${asset.localPath}`),asset.sha256);assert.equal(asset.pixelsInspected,true);assert.ok(asset.width>0&&asset.height>0);assert.ok(asset.privacySanitization);}
 for(const a of rows){const asset=p.assets.find(x=>x.localPath===a.image);assert.ok(asset,`${a.source}: provenance`);const ns=nodes(parse(a.markdown));assert.ok(ns.some(n=>n.type==='image'&&n.url===a.image),`${a.source}: body reuses cover`);assert.ok(existsSync(`public${a.image}`));
  if(asset.aiGenerated){assert.match(a.imageAlt,disclosure[a.lang]);assert.match(a.markdown,disclosure[a.lang]);}
  else {assert.match(a.markdown,/https:\/\/creativecommons.org\/licenses\//);assert.match(a.markdown,/https:\/\/commons.wikimedia.org\/wiki\/File:/);}
  if(asset.captions?.[a.lang])assert.ok(norm(a.markdown).includes(norm(asset.captions[a.lang])),`${a.source}: full localized credit`);
  if(asset.coverAlt?.[a.lang])assert.equal(a.imageAlt,asset.coverAlt[a.lang]);
  const {data}=matter(read(a.source));assert.equal(data.cover,a.image);
 }
 assert.match(read('components/article-markdown.tsx'),/responsiveImageProps\(image, "body"\)/);assert.doesNotMatch(read('components/article-markdown.tsx'),/object-cover|story-cover/);
 assert.match(read('app/globals.css'),/\.markdown-body img\s*\{[^}]*max-width:\s*100%[^}]*height:\s*auto/s);
});

const repairBaseline={'.vercel_build_output/config/build.json':'1980a6f25e7fa065bc6e1648be9fe5decc50d69bc84782db2fbe36bb9bd2502e','content/image-cache-lock.json':'da06021ad94081a33c69f7e40d95f1504909599c4a460a2bdd3f2118384b9e5c','scripts/image-build-cache.mjs':'16f7baa4a5d99d09a5e32b1554cad46f1f943f984eef1c6a68ddf3b1e886270a','scripts/optimize-images.mjs':'4541c29519997ae03a1ae1472bc164beb65fa1f5cb255b1f7cd765947e4c72e0','tests/image-build-cache.test.mjs':'dbcddeae08c969b1eeb993f9c90ec1e753bfc9a9fe6139ec183c97b4504a60a5'};
// Only the reviewed November 4 exact-path quality entries may extend this repair baseline.
const approvedNov4AvifAddition = "  // November 4: reviewed full-frame equipment, circuitry, faces and solar-panel detail.\n  \"/news-media/2026-11-04/reid-gardner-bess-2025-chiocciola.jpg\": 59,\n  \"/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg\": 61,\n  \"/news-media/2026-11-04/first-source-job-fair-2014-mscala.jpg\": 62,\n  \"/news-media/2026-11-04/eichelbuck-landfill-solar-2019-schwarzkopf.jpg\": 61,\n";
function acceptedRepairHash(file) {
  if (file !== 'scripts/optimize-images.mjs') return hash(file);
  const current = read(file);
  assert.equal(current.split(approvedNov4AvifAddition).length, 2, 'approved November 4 quality block occurs exactly once');
  assert.ok(current.includes('const photoAvifQuality = {\n' + approvedNov4AvifAddition), 'approved entries remain inside the per-photo map');
  return createHash('sha256').update(current.replace(approvedNov4AvifAddition, '')).digest('hex');
}
test('November1 preserves all five accepted cache repair files byte for byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(acceptedRepairHash(file),sha,file);});
