import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {buildContent} from '../scripts/content.mjs';
const articles=buildContent();
const manifests=['2026-10-03','2026-10-04'].map(date=>JSON.parse(readFileSync(`docs/news-media/${date}/provenance.json`,'utf8')));
const assets=manifests.flatMap(manifest=>manifest.assets);
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
