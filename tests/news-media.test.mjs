import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {buildContent} from '../scripts/content.mjs';
const articles=buildContent();
const manifests=readdirSync('docs/news-media',{withFileTypes:true})
  .filter(entry=>entry.isDirectory() && existsSync(`docs/news-media/${entry.name}/provenance.json`))
  .map(entry=>JSON.parse(readFileSync(`docs/news-media/${entry.name}/provenance.json`,'utf8')));
const assets=manifests.flatMap(manifest=>manifest.assets);
const xmlEscape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
function checkRightsOnlyXmp(xmp,asset) {
  const retained=asset.privacySanitization?.retainedRightsXMP;
  assert.ok(retained?.creator && retained?.rights,'Retained XMP needs an explicit creator/rights record');
  assert.equal(retained.creator,asset.photographer,'The retained creator must match the documented photographer');
  assert.ok(asset.copyright && retained.rights.includes(asset.copyright),'The retained rights must contain the documented copyright');
  assert.ok(asset.rightsEvidenceURL && retained.rights.includes(asset.rightsEvidenceURL),'The retained rights must identify the documented permission');
  const expected=`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator><rdf:Seq><rdf:li>${xmlEscape(retained.creator)}</rdf:li></rdf:Seq></dc:creator><dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(retained.rights)}</rdf:li></rdf:Alt></dc:rights></rdf:Description></rdf:RDF></x:xmpmeta>`;
  assert.equal(xmp.toString('utf8').trim(),expected,'Only the exact reviewed creator/rights XMP structure is allowed');
}
test('published news has documented covers reused in body and labels generated editorial illustrations',()=>{
  for(const article of articles){
    const images=[...article.markdown.matchAll(/!\[[^\n]*\]\((\/news-media\/[^\s)]+)\)/g)].map(match=>match[1]);
    assert.equal(new Set(images).size,images.length,'No duplicated images to inflate the image count');
    assert.ok(article.image && article.imageAlt,'Every published article must have a cover and alt text');
    assert.ok(images.includes(article.image),'Cover must reuse a body image');
    for(const image of images){
      const asset=assets.find(asset=>asset.localPath===image);
      assert.ok(asset,`${image}: current license record required`);
      assert.notEqual(asset.kind,'original_data_chart');
      if(asset.kind==='ai_generated_editorial_illustration') {
        assert.equal(asset.generationTool,'OpenAI image_gen');
        assert.ok(asset.prompt && asset.rightsBasis);
        assert.match(article.markdown,/AI生成(?:概念)?示意(?:图|圖)|AI.generated (?:conceptual |editorial )?illustration|(?:illustration|image)(?: conceptuelle)? générée par (?:l['’])?IA|(?:иллюстрация.{0,40}ИИ|ИИ.{0,40}иллюстрация)/iu,'Generated illustrations must be visibly identified');
      } else {
        assert.ok(asset.sourceURL && asset.rightsEvidenceURL && asset.license);
        assert.ok(article.markdown.includes(asset.licenseURL || asset.rightsEvidenceURL),'Visible source license must be retained');
      }
      if(article.lang==='zh-CN') assert.ok(article.markdown.includes(asset.caption),`${image}: accurate image caption must be visible`);
      assert.equal(createHash('sha256').update(readFileSync(`public${image}`)).digest('hex'),asset.sha256);
    }
    assert.doesNotMatch(article.markdown,/制图：全球伯乐 News/);
  }
  for(const asset of manifests.flatMap(manifest=>manifest.retiredAssets || [])){
    assert.equal(existsSync(`public${asset.localPath}`),false,'Retired images must not remain public');
    if(asset.vectorAlternative)assert.equal(existsSync(`public${asset.vectorAlternative}`),false);
  }
});
test('current originals contain no private EXIF, IPTC or XMP metadata',async()=>{
  for(const asset of assets){
    const metadata=await sharp(`public${asset.localPath}`).metadata();
    assert.equal(metadata.exif,undefined);
    assert.equal(metadata.iptc,undefined);
    if(metadata.xmp) checkRightsOnlyXmp(metadata.xmp,asset);
  }
});

test('the rights-only XMP exception rejects undocumented and additional private metadata',()=>{
  const asset={photographer:'Verified photographer',copyright:'Copyright owner',rightsEvidenceURL:'https://example.org/permission',privacySanitization:{retainedRightsXMP:{creator:'Verified photographer',rights:'Copyright owner. Permission: https://example.org/permission'}}};
  const xmp=asset.privacySanitization.retainedRightsXMP;
  const valid=`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator><rdf:Seq><rdf:li>${xmlEscape(xmp.creator)}</rdf:li></rdf:Seq></dc:creator><dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(xmp.rights)}</rdf:li></rdf:Alt></dc:rights></rdf:Description></rdf:RDF></x:xmpmeta>`;
  assert.doesNotThrow(()=>checkRightsOnlyXmp(Buffer.from(valid),asset));
  assert.throws(()=>checkRightsOnlyXmp(Buffer.from(valid),{...asset,privacySanitization:{}}));
  assert.throws(()=>checkRightsOnlyXmp(Buffer.from(valid.replace('</rdf:Description>','<private:email>private@example.org</private:email></rdf:Description>')),asset));
  assert.throws(()=>checkRightsOnlyXmp(Buffer.from(valid.replace('</rdf:Description>','<exif:GPSLatitude>25.0</exif:GPSLatitude></rdf:Description>')),asset));
  assert.throws(()=>checkRightsOnlyXmp(Buffer.from(valid.replace(xmp.creator,'Unverified creator')),asset));
});
