import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {imageConcurrency, optimizeImages, runImageJobs} from '../scripts/optimize-images.mjs';

const nextTurn = () => new Promise(resolve => setImmediate(resolve));

test('image workers have a conservative, validated concurrency limit', () => {
  assert.ok(imageConcurrency() >= 1 && imageConcurrency() <= 4);
  assert.equal(imageConcurrency('1'), 1);
  assert.equal(imageConcurrency(4), 4);
  for (const value of [0, -1, 5, 1.5, '', 'many', NaN, null]) {
    assert.throws(() => imageConcurrency(value), /integer from 1 to 4/);
  }
});

test('the global image queue overlaps work without exceeding its limit', async () => {
  let active = 0, peak = 0;
  const completed = [];
  await runImageJobs(Array.from({length: 13}, (_, index) => async () => {
    active++;
    peak = Math.max(peak, active);
    await nextTurn();
    completed.push(index);
    active--;
  }), 3);
  assert.equal(peak, 3);
  assert.equal(active, 0);
  assert.deepEqual(completed.sort((a, b) => a - b), Array.from({length: 13}, (_, index) => index));
  await runImageJobs([], 4);
});

test('a failed encode stops new work and waits for active writes before rejecting', async () => {
  const error = new Error('fixture encode failure');
  const started = [], completed = [];
  const jobs = Array.from({length: 9}, (_, index) => async () => {
    started.push(index);
    if (index === 0) throw error;
    await nextTurn();
    completed.push(index);
  });
  await assert.rejects(runImageJobs(jobs, 3), actual => actual === error);
  assert.deepEqual(started, [0, 1, 2]);
  assert.deepEqual(completed, [1, 2]);
});

function legacyHash(bytes, encoder) {
  return createHash('sha256').update(bytes).update(JSON.stringify(encoder)).digest('hex').slice(0, 12);
}

// Small real encodes cover every existing delivery branch without adding a
// second full editorial-image build to npm test.
test('parallel cold builds preserve exact legacy URLs, encoded bytes, chart pixels and warm reuse', async t => {
  const rootDir = mkdtempSync(path.join(tmpdir(), 'image-optimizer-test-'));
  t.after(() => rmSync(rootDir, {recursive: true, force: true}));
  const mediaDir = path.join(rootDir, 'public/news-media/test');
  mkdirSync(mediaDir, {recursive: true});
  mkdirSync(path.join(rootDir, 'content/generated'), {recursive: true});
  const pixels = Buffer.alloc(320 * 192 * 3);
  for (let i = 0; i < pixels.length; i++) pixels[i] = (i * 17 + Math.floor(i / 320)) % 256;
  const source = () => sharp(pixels, {raw: {width: 320, height: 192, channels: 3}});
  const inputs = {
    'photo.jpg': await source().jpeg({quality: 91}).toBuffer(),
    'chart.png': await source().png().toBuffer(),
    'reference.webp': await source().webp({quality: 87}).toBuffer(),
  };
  for (const [filename, bytes] of Object.entries(inputs)) writeFileSync(path.join(mediaDir, filename), bytes);
  // Different source paths may still resolve to the same immutable filename.
  const duplicateDir = path.join(mediaDir, 'duplicate');
  mkdirSync(duplicateDir);
  writeFileSync(path.join(duplicateDir, 'photo.jpg'), inputs['photo.jpg']);
  const articles = [{
    image: '/news-media/test/photo.jpg',
    markdown: '![chart](/news-media/test/chart.png)\n[ref]: /news-media/test/reference.webp\n![duplicate](/news-media/test/duplicate/photo.jpg)',
  }];
  writeFileSync(path.join(rootDir, 'content/generated/articles.json'), JSON.stringify(articles));
  const cold = await optimizeImages({rootDir, concurrency: 4});
  assert.equal(cold.sources, 4);
  assert.equal(cold.variants, 13);
  assert.equal(cold.encoded, 9, 'Duplicate immutable outputs must be encoded only once');
  const manifestPath = path.join(rootDir, 'content/generated/image-manifest.json');
  const manifestBytes = readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes);
  for (const [filename, bytes] of Object.entries(inputs)) {
    const stem = path.parse(filename).name;
    const metadata = await sharp(bytes).metadata();
    const asset = manifest[`/news-media/test/${filename}`];
    const webpOptions = {quality: metadata.format === 'png' ? 86 : 76, effort: 5};
    const webpHash = legacyHash(bytes, {version: 1, rotate: true, ...webpOptions, sharp: sharp.versions.sharp, webp: sharp.versions.webp});
    assert.deepEqual(asset.variants.map(v => v.width), [160, 320]);
    for (const variant of asset.variants) {
      assert.equal(variant.src, `/optimized-assets/${stem}-${webpHash}-${variant.width}.webp`);
      const expected = await sharp(bytes).rotate().resize({width: variant.width, withoutEnlargement: true}).webp(webpOptions).toBuffer();
      assert.ok(readFileSync(path.join(rootDir, 'public', variant.src)).equals(expected));
    }
    if (metadata.format === 'jpeg') {
      const options = {quality: 65, effort: 6, chromaSubsampling: '4:4:4'};
      const hash = legacyHash(bytes, {version: 1, rotate: true, ...options, sharp: sharp.versions.sharp, aom: sharp.versions.aom, heif: sharp.versions.heif});
      for (const variant of asset.avifVariants) {
        assert.equal(variant.src, `/optimized-assets/${stem}-${hash}-${variant.width}.avif`);
        const expected = await sharp(bytes).rotate().resize({width: variant.width, withoutEnlargement: true}).avif(options).toBuffer();
        assert.ok(readFileSync(path.join(rootDir, 'public', variant.src)).equals(expected));
      }
    } else {
      assert.equal(asset.avifVariants, undefined);
    }
    if (metadata.format === 'png') {
      const options = {lossless: true, effort: 6};
      const hash = legacyHash(bytes, {version: 1, rotate: true, ...options, sharp: sharp.versions.sharp, webp: sharp.versions.webp});
      assert.deepEqual(asset.bodyVariants, [{src: `/optimized-assets/${stem}-${hash}-320.webp`, width: 320}]);
      const body = readFileSync(path.join(rootDir, 'public', asset.bodyVariants[0].src));
      assert.ok(body.equals(await sharp(bytes).rotate().resize({width: 320, withoutEnlargement: true}).webp(options).toBuffer()));
      assert.ok((await sharp(body).raw().toBuffer()).equals(await sharp(bytes).raw().toBuffer()));
    }
    assert.ok(readFileSync(path.join(mediaDir, filename)).equals(bytes));
  }
  const outputDir = path.join(rootDir, 'public/optimized-assets');
  const files = readdirSync(outputDir).sort();
  assert.equal(files.length, cold.encoded, 'No temporary or duplicate files remain');
  const mtimes = files.map(file => statSync(path.join(outputDir, file)).mtimeMs);
  const warm = await optimizeImages({rootDir, concurrency: 1});
  assert.equal(warm.encoded, 0);
  assert.ok(readFileSync(manifestPath).equals(manifestBytes));
  assert.deepEqual(files.map(file => statSync(path.join(outputDir, file)).mtimeMs), mtimes);

  const originalOutputs = new Map(files.map(file => [file, readFileSync(path.join(outputDir, file))]));
  const photo = path.join(rootDir, 'public', manifest['/news-media/test/photo.jpg'].avifVariants[1].src);
  const photoBytes = readFileSync(photo);
  const truncated = photoBytes.subarray(0, Math.floor(photoBytes.length / 2));
  assert.equal((await sharp(truncated).metadata()).width, 320, 'Truncated cache fixture retains a readable header');
  writeFileSync(photo, truncated);
  writeFileSync(path.join(rootDir, 'public', manifest['/news-media/test/chart.png'].bodyVariants[0].src), inputs['photo.jpg']);
  writeFileSync(path.join(rootDir, 'public', manifest['/news-media/test/reference.webp'].variants[0].src), Buffer.alloc(0));
  const repaired = await optimizeImages({rootDir, concurrency: 2});
  assert.equal(repaired.encoded, 3, 'Truncated, wrong-format and zero-byte legacy cache entries are regenerated');
  assert.ok(readFileSync(manifestPath).equals(manifestBytes));
  for (const [file, bytes] of originalOutputs) assert.ok(readFileSync(path.join(outputDir, file)).equals(bytes), file);
  assert.deepEqual(readdirSync(outputDir).sort(), files);
});

test('an encoding error leaves no reusable partial file and does not replace the prior manifest', async t => {
  const rootDir = mkdtempSync(path.join(tmpdir(), 'image-optimizer-failure-'));
  t.after(() => rmSync(rootDir, {recursive: true, force: true}));
  mkdirSync(path.join(rootDir, 'public/news-media'), {recursive: true});
  mkdirSync(path.join(rootDir, 'content/generated'), {recursive: true});
  const pixels = Buffer.alloc(320 * 192 * 3);
  for (let i = 0; i < pixels.length; i++) pixels[i] = i % 251;
  const jpeg = await sharp(pixels, {raw: {width: 320, height: 192, channels: 3}}).jpeg().toBuffer();
  const truncated = jpeg.subarray(0, 1000);
  assert.equal((await sharp(truncated).metadata()).width, 320, 'Fixture must fail during encoding, not metadata');
  writeFileSync(path.join(rootDir, 'public/news-media/broken.jpg'), truncated);
  writeFileSync(path.join(rootDir, 'content/generated/articles.json'), JSON.stringify([{image: '/news-media/broken.jpg'}]));
  const manifestPath = path.join(rootDir, 'content/generated/image-manifest.json');
  writeFileSync(manifestPath, '{"previous":"successful build"}\n');
  await assert.rejects(optimizeImages({rootDir, concurrency: 2}), /premature end|corrupt|VipsJpeg/i);
  assert.equal(readFileSync(manifestPath, 'utf8'), '{"previous":"successful build"}\n');
  assert.deepEqual(readdirSync(path.join(rootDir, 'public/optimized-assets')), []);
});
