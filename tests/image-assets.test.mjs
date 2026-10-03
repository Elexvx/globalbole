import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

import {buildContent} from '../scripts/content.mjs';
import {optimizeImages} from '../scripts/optimize-images.mjs';
const articles = buildContent();
const originalHashes = new Map(articles.map(article => [article.image, createHash('sha256').update(readFileSync(`public${article.image}`)).digest('hex')]));
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

test('body images use responsive delivery, reserve dimensions, and keep natural full-image sizing', () => {
  const body = readFileSync('components/article-markdown.tsx', 'utf8');
  assert.match(body, /responsiveImageProps\(image, "body"\)/);
  assert.match(body, /responsiveAvifSourceProps\(image, "body"\)/);
  assert.match(body, /loading="lazy"/);
  assert.doesNotMatch(body, /object-cover|story-cover/);
});

test('the critical article cover retains the measured WebP delivery path while body images stay lazy', () => {
  const cover = readFileSync('app/(site)/post/[slug]/view.tsx', 'utf8');
  assert.match(cover, /responsiveImageProps\(story.image, "article"\)/);
  assert.match(cover, /loading="eager" fetchPriority="high" decoding="async"/);
  assert.doesNotMatch(cover, /responsiveAvifSourceProps|<picture>/);
  const body = readFileSync('components/article-markdown.tsx', 'utf8');
  assert.match(body, /loading="lazy" decoding="async"/);
});


test('news links do not prefetch every visible article by default', () => {
  const links = readFileSync('components/localized-link.tsx', 'utf8');
  assert.match(links, /props\.prefetch \?\? false/);
});


test('optimized photographs have complete AVIF sources and smaller aggregate transfers', async () => {
  let allAvifBytes = 0, allWebpBytes = 0;
  for (const [image, asset] of Object.entries(manifest)) {
    if (!/\.jpe?g$/i.test(image)) continue;
    assert.deepEqual(asset.avifVariants.map(variant=>variant.width), asset.variants.map(variant=>variant.width));
    let avifBytes = 0, webpBytes = 0;
    for (const [index, variant] of asset.avifVariants.entries()) {
      assert.match(variant.src, /-[a-f\d]{12}-\d+\.avif$/);
      const actual = await sharp(`public${variant.src}`).metadata();
      assert.equal(actual.width, variant.width);
      assert.ok(Math.abs(actual.height / actual.width - asset.height / asset.width) < .01, 'AVIF retains the full frame');
      avifBytes += statSync(`public${variant.src}`).size;
      webpBytes += statSync(`public${asset.variants[index].src}`).size;
    }
    assert.ok(avifBytes < webpBytes, `${image}: AVIF must reduce aggregate transfer bytes`);
    allAvifBytes += avifBytes;
    allWebpBytes += webpBytes;
  }
  assert.ok(allAvifBytes < allWebpBytes * .9, 'AVIF must provide material overall transfer savings');
});

test('body charts retain every original pixel in full-resolution lossless derivatives', async () => {
  for (const [image, asset] of Object.entries(manifest)) {
    if (!/\.png$/i.test(image)) continue;
    assert.equal(asset.avifVariants, undefined, 'Do not apply photographic encoding to charts');
    assert.equal(asset.bodyVariants.length, 1);
    const derivative = asset.bodyVariants[0];
    assert.equal(derivative.width, asset.width);
    const originalPixels = await sharp(`public${image}`).rotate().ensureAlpha().raw().toBuffer();
    const derivativePixels = await sharp(`public${derivative.src}`).ensureAlpha().raw().toBuffer();
    assert.ok(derivativePixels.equals(originalPixels), 'Chart pixels must be lossless');
    assert.ok(statSync(`public${derivative.src}`).size < statSync(`public${image}`).size);
  }
});

test('image optimization leaves licensed originals byte-for-byte unchanged', () => {
  for (const [image, hash] of originalHashes) {
    assert.equal(createHash('sha256').update(readFileSync(`public${image}`)).digest('hex'), hash);
  }
});
