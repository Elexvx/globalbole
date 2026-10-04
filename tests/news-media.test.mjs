import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {buildContent} from '../scripts/content.mjs';
const articles=buildContent();
const manifests=['2026-10-03','2026-10-04'].map(date=>JSON.parse(readFileSync(`docs/news-media/${date}/provenance.json`,'utf8')));
const assets=manifests.flatMap(manifest=>manifest.assets);
test('published news uses only documented source-original assets and reuses body images as covers',()=>{
  for(const article of articles){
    const images=[...article.markdown.matchAll(/!\[[^\n]*\]\((\/news-media\/[^\s)]+)\)/g)].map(match=>match[1]);
    assert.equal(new Set(images).size,images.length,'No duplicated images to inflate the image count');
    if(article.image) assert.ok(images.includes(article.image),'Cover must reuse a body image');
    else assert.equal(article.imageAlt,'');
    for(const image of images){
      const asset=assets.find(asset=>asset.localPath===image);
      assert.ok(asset,`${image}: current license record required`);
      assert.notEqual(asset.kind,'original_data_chart');
      assert.ok(asset.sourceURL && asset.rightsEvidenceURL && asset.license);
      assert.ok(article.markdown.includes(asset.caption),`${image}: source and license caption must be visible`);
      assert.equal(createHash('sha256').update(readFileSync(`public${image}`)).digest('hex'),asset.sha256);
    }
    assert.doesNotMatch(article.markdown,/制图：全球伯乐 News/);
  }
  for(const asset of manifests.flatMap(manifest=>manifest.retiredAssets)){
    assert.equal(existsSync(`public${asset.localPath}`),false,'Retired images must not remain public');
    if(asset.vectorAlternative)assert.equal(existsSync(`public${asset.vectorAlternative}`),false);
  }
});
test('current originals contain no private EXIF, IPTC or XMP metadata',async()=>{
  for(const asset of assets){
    const metadata=await sharp(`public${asset.localPath}`).metadata();
    assert.equal(metadata.exif,undefined);
    assert.equal(metadata.iptc,undefined);
    assert.equal(metadata.xmp,undefined);
  }
});
