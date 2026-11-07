import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const issue='2026-11-07';
const locales=['zh-CN','zh-TW','en','ru','fr'];
const keys=[
  'us-october-nonfarm-payrolls-revisions-2026-11-07',
  'canada-october-labour-force-survey-2026-11-07',
  'openai-biobasicsbench-hacktron-security-2026-11-07',
  'semi-chip-challenge-ibm-uchicago-quantum-2026-11-07',
  'china-mofcom-enb-aramid-antidumping-shipping-insurance-2026-11-07',
  'fao-october-food-price-index-doe-scaled-grid-2026-11-07'
];
const read=f=>readFileSync(f,'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${d}/${e.name}`):[`${d}/${e.name}`]);
const parse=s=>unified().use(remarkParse).use(remarkGfm).parse(s);
const nodes=n=>[n,...(n.children||[]).flatMap(nodes)];
const text=n=>['image','footnoteReference'].includes(n.type)?'':n.value??(n.children||[]).map(text).join('');
const normal=s=>s.normalize('NFKC').replace(/\s+/g,' ').trim();
const files=walk('content/issues').filter(f=>f.endsWith('.md')).sort();
const inventory=files.map(f=>{const {data,content}=matter(read(f));return {...data,file:f,body:content,ast:parse(content)};});
const rows=inventory.filter(a=>a.issue===issue);
const log=JSON.parse(read('docs/news-publication-log.json'));
const sources=log.batches.find(b=>b.issue===issue)?.articles||[];
const allAssets=readdirSync('docs/news-media').flatMap(d=>{const f=`docs/news-media/${d}/provenance.json`;return existsSync(f)?JSON.parse(read(f)).assets:[];});
const bodyParagraphs=a=>a.ast.children.filter((n,i,s)=>n.type==='paragraph'&&!nodes(n).some(x=>x.type==='image')&&!(i>0&&nodes(s[i-1]).some(x=>x.type==='image')));

test('November7 has six complete subjects in five editions with honest dates and full source linkage',()=>{
 assert.equal(rows.length,30);
 assert.deepEqual([...new Set(rows.map(a=>a.translationKey))].sort(),[...keys].sort());
 for(const key of keys){
  const group=rows.filter(a=>a.translationKey===key);
  assert.deepEqual(group.map(a=>a.lang).sort(),[...locales].sort());
  const ref=group.find(a=>a.lang==='zh-CN');
  const expectedURLs=nodes(ref.ast).filter(n=>n.type==='link').map(n=>n.url).sort();
  const expectedSections=ref.ast.children.filter(n=>n.type==='heading').length;
  const expectedParagraphs=bodyParagraphs(ref).length;
  assert.ok(expectedParagraphs >= 4,'Preserve full source paragraphs, not a short brief');
  for(const a of group){
   assert.equal(a.date,issue);assert.equal(a.slug,key);assert.equal(a.readTime,5);assert.equal(a.draft,false);
   assert.equal(a.publishedAt,undefined);assert.equal(a.updatedAt,undefined);
   assert.equal(a.author,'全球伯乐 News');assert.equal(a.cover,ref.cover);
   assert.equal(a.ast.children.filter(n=>n.type==='heading').length,expectedSections);
   assert.equal(bodyParagraphs(a).length,expectedParagraphs,'Each translation retains all substantive paragraphs');
   assert.deepEqual(nodes(a.ast).filter(n=>n.type==='link').map(n=>n.url).sort(),expectedURLs);
   const paragraphs=bodyParagraphs(a).map(n=>normal(text(n)));
   assert.equal(new Set(paragraphs).size,paragraphs.length,'No repeated padding');
   assert.ok(paragraphs.join('').length>=(a.lang.startsWith('zh')?480:1500),'Complete original depth, not a summary');
   assert.doesNotMatch(a.body,/genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|turn\d+(?:view|search)|本站整理日期|判断口径|伯乐判断|\ue200|\ue201|\ue202/);
   assert.ok(!nodes(a.ast).some(n=>n.type==='html'),'No raw HTML citation remnants');
   const definitions=nodes(a.ast).filter(n=>n.type==='footnoteDefinition');
   const referenced=[...new Set(nodes(a.ast).filter(n=>n.type==='footnoteReference').map(n=>n.identifier))].sort();
   assert.deepEqual(definitions.map(n=>n.identifier).sort(),referenced);
   for(const source of sources.find(s=>s.translationKey===key).sources){
    assert.ok(definitions.some(n=>nodes(n).some(x=>x.type==='link'&&x.url===source.url)),`${key}: documented source appears in visible notes`);
   }
  }
 }
});

test('November7 covers use actually present licensed assets with exact visible credits',()=>{
 for(const a of rows){
  const images=nodes(a.ast).filter(n=>n.type==='image');
  assert.equal(images.filter(n=>n.url===a.cover).length,1);
  assert.equal(new Set(images.map(n=>n.url)).size,images.length);
  for(const image of images){
   const asset=allAssets.find(x=>x.localPath===image.url);assert.ok(asset,image.url);
   assert.ok(existsSync(`public${image.url}`));assert.equal(hash(readFileSync(`public${image.url}`)),asset.sha256);
   assert.equal(asset.kind,'ai_generated_editorial_illustration');
   assert.equal(asset.generationTool,'OpenAI image_gen');
   assert.ok(asset.prompt&&asset.rightsBasis);
   const caption=asset.captions?.[a.lang] || (a.lang==='zh-CN'?asset.caption:null);
   assert.ok(caption,`${image.url}: full localized attribution`);
   assert.ok(a.ast.children.some(n=>n.type==='paragraph'&&normal(text(n))===normal(text(parse(caption)))),`${a.file}: complete adjacent credit`);
   const i=a.ast.children.findIndex(n=>nodes(n).some(x=>x.type==='image'&&x.url===image.url));
   assert.equal(normal(text(a.ast.children[i+1])),normal(text(parse(caption))),'Caption immediately follows image');
  }
 }
});

test('November7 preserves existing 685 editions, withdrawal protection and publication records',()=>{
 const old=inventory.filter(a=>a.issue<issue);
 assert.equal(old.length,685);
 const fingerprint=old.map(a=>`${a.file}\0${hash(readFileSync(a.file))}\n`).join('');
 assert.equal(hash(fingerprint),'63789cdb116b95371279d17b9fb1a8a59f723d85e9a5a3408693f1e86682d050');
 const batch=log.batches.filter(b=>b.issue===issue);assert.equal(batch.length,1);
 assert.equal(batch[0].publicationDate,issue);assert.deepEqual(batch[0].articles.map(a=>a.translationKey).sort(),[...keys].sort());
 for(const a of log.batches.flatMap(b=>b.articles).filter(a=>a.status==='withdrawn')){
  assert.equal(a.republish,false);assert.equal(a.withdrawalScope,'all-language-editions');assert.ok(!inventory.some(x=>x.translationKey===a.translationKey));
 }
});
