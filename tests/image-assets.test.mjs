import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import sharp from 'sharp';

import {buildContent} from '../scripts/content.mjs';
import {optimizeImages} from '../scripts/optimize-images.mjs';
const articles = buildContent();
await optimizeImages();
const manifest = JSON.parse(readFileSync('content/generated/image-manifest.json', 'utf8'));

test('all local cover formats have content-hashed, correctly described responsive derivatives', async () => {
  for (const article of articles) {
    if (!/^\/(?:news-media|reference-assets)\/.+\.(?:png|jpe?g|webp)$/i.test(article.image)) continue;
    const asset = manifest[article.image];
    assert.ok(asset, `Missing ${article.image}`);
    assert.ok(existsSync(`public${article.image}`), 'Original source retained');
    assert.ok(asset.width > 0 && asset.height > 0);
    for (const variant of asset.variants) {
      assert.match(variant.src, /-[a-f\d]{12}-\d+\.webp$/);
      const actual = await sharp(`public${variant.src}`).metadata();
      assert.equal(actual.width, variant.width);
      assert.ok(actual.width <= asset.width, 'Never upscale originals');
      assert.ok(Math.abs(actual.height / actual.width - asset.height / asset.width) < .01, 'Do not crop derivatives');
    }
  }
});

test('body image layout reserves dimensions and keeps natural full-image sizing', () => {
  const body = readFileSync('components/article-markdown.tsx', 'utf8');
  assert.match(body, /imageDimensions/);
  assert.match(body, /loading="lazy"/);
  assert.doesNotMatch(body, /responsiveImageProps|object-cover/);
});


test('news links do not prefetch every visible article by default', () => {
  const links = readFileSync('components/localized-link.tsx', 'utf8');
  assert.match(links, /props\.prefetch \?\? false/);
});
