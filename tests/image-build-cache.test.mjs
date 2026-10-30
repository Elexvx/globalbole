import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import sharp from 'sharp';
import {createImageBuildCache} from '../scripts/image-build-cache.mjs';
import {optimizeImages} from '../scripts/optimize-images.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('Other-framework cache declaration preserves default caches without changing static output or routing', () => {
  const config = JSON.parse(readFileSync(new URL('../.vercel_build_output/config/build.json', import.meta.url), 'utf8'));
  assert.deepEqual(config, {cache: ['**/node_modules/**', '**/.yarn/cache/**', '**/.shadow-cljs/**', '.next/cache/globalbole-images/**']});
  const deployment = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(deployment.framework, null);
  assert.equal(deployment.outputDirectory, 'out');
  assert.equal(deployment.installCommand, 'npm ci');
  assert.equal(deployment.buildCommand, 'npm run build');
  assert.equal(existsSync(new URL('../.vercel/output/config.json', import.meta.url)), false);
});

async function fixture(t) {
  const rootDir = mkdtempSync(path.join(tmpdir(), 'globalbole-build-cache-'));
  t.after(() => rmSync(rootDir, {recursive: true, force: true}));
  const bytes = await sharp({create: {width: 160, height: 96, channels: 3, background: '#2b5678'}}).webp({quality: 76}).toBuffer();
  const fingerprint = hash('source plus exact encoder fixture');
  const meta = {src: `/optimized-assets/fixture-${fingerprint.slice(0, 12)}-160.webp`,
    sourceSha256: hash('source fixture'), fingerprint, width: 160, height: 96, format: 'webp'};
  const record = {...meta, pixelWidth: meta.width, pixelHeight: meta.height, bytes: bytes.length, sha256: hash(bytes)};
  mkdirSync(path.join(rootDir, 'content'), {recursive: true});
  const lock = {version: 1, origin: 'https://www.globalbole.com', productionCommit: '1'.repeat(40), assets: [record]};
  const lockPath = path.join(rootDir, 'content/image-cache-lock.json');
  writeFileSync(lockPath, JSON.stringify(lock));
  const output = path.join(rootDir, 'public', meta.src);
  const response = (body = bytes, headers = {'content-type': 'image/webp'}) => new Response(body, {headers});
  return {rootDir, bytes, meta, record, lock, lockPath, output, response};
}

test('pinned bootstrap preserves exact bytes, uses the fixed public origin, and restores offline from Next cache', async t => {
  const f = await fixture(t); let calls = 0;
  const cache = createImageBuildCache({...f, fetchImpl: async (url, options) => {
    calls++; assert.equal(url, 'https://www.globalbole.com' + f.meta.src);
    assert.equal(options.redirect, 'error'); assert.equal(options.credentials, 'omit');
    assert.ok(options.signal instanceof AbortSignal); assert.ok(!('Authorization' in options.headers));
    return f.response();
  }});
  await cache.prime([f.meta]); assert.equal(calls, 1);
  assert.equal(await cache.restore(f.meta, f.output), true);
  assert.ok(readFileSync(f.output).equals(f.bytes));
  assert.equal(cache.stats.remoteRestored, 1); assert.equal(cache.stats.localRestored, 1);
  rmSync(f.output);
  const offline = createImageBuildCache({...f, remote: false, fetchImpl: () => {throw new Error('must stay offline');}});
  assert.equal(await offline.restore(f.meta, f.output), true);
  assert.ok(readFileSync(f.output).equals(f.bytes));
  assert.equal(offline.stats.localRestored, 1); assert.equal(offline.stats.remoteRestored, 0);
});

test('source or complete encoder fingerprint changes never reuse the old production asset', async t => {
  const f = await fixture(t); let calls = 0;
  const cache = createImageBuildCache({...f, fetchImpl: async () => {calls++; return f.response();}});
  for (const changed of [{sourceSha256: hash('different source')}, {fingerprint: hash('different encoder')}, {width: 161}, {height: 97}]) {
    assert.equal(await cache.restore({...f.meta, ...changed}, f.output), false);
  }
  assert.equal(calls, 0); assert.equal(existsSync(f.output), false);
});

test('unneeded and withdrawn cache records cannot be copied wholesale into public output', async t => {
  const f = await fixture(t); let calls = 0;
  const cache = createImageBuildCache({...f, fetchImpl: async () => {calls++; return f.response();}});
  await cache.prime([]);
  assert.equal(calls, 0); assert.equal(existsSync(path.join(f.rootDir, 'public')), false);
  assert.equal(await cache.restore({...f.meta, src: '/optimized-assets/unknown-0123456789ab-160.webp'}, f.output), false);
  assert.equal(calls, 0);
});

test('tampered, oversized, wrong-type, truncated and wrong-dimension responses are not installed', async t => {
  const f = await fixture(t);
  const wrongSize = await sharp({create: {width: 159, height: 96, channels: 3, background: '#2b5678'}}).webp().toBuffer();
  const variants = [
    () => f.response(Buffer.from('bad bytes')),
    () => f.response(Buffer.concat([f.bytes, f.bytes])),
    () => f.response(f.bytes, {'content-type': 'text/html'}),
    () => f.response(f.bytes, {'content-type': 'image/webp', 'content-length': String(f.bytes.length + 1)}),
    () => f.response(f.bytes.subarray(0, Math.floor(f.bytes.length / 2))),
    () => f.response(wrongSize),
  ];
  for (const response of variants) {
    const cache = createImageBuildCache({...f, log: () => {}, fetchImpl: async () => response()});
    assert.equal(await cache.restore(f.meta, f.output), false);
    assert.equal(existsSync(f.output), false); assert.equal(cache.stats.remoteRestored, 0);
  }
  // Even a lock with a valid byte hash cannot bless a different decoded size.
  f.lock.assets[0] = {...f.record, bytes: wrongSize.length, sha256: hash(wrongSize)};
  writeFileSync(f.lockPath, JSON.stringify(f.lock));
  const cache = createImageBuildCache({...f, log: () => {}, fetchImpl: async () => f.response(wrongSize)});
  assert.equal(await cache.restore(f.meta, f.output), false);
});

test('authentication or access denial disables further remote requests without alternate origins', async t => {
  const f = await fixture(t);
  for (const status of [401, 403]) {
    let calls = 0;
    const cache = createImageBuildCache({...f, log: () => {}, fetchImpl: async () => {calls++; return new Response('', {status});}});
    assert.equal(await cache.restore(f.meta, f.output), false);
    assert.equal(await cache.restore(f.meta, f.output), false);
    assert.equal(calls, 1); assert.equal(cache.stats.remoteDenied, true);
  }
});

test('redirects are rejected and the stage deadline prevents unbounded cache requests', async t => {
  const f = await fixture(t); let calls = 0;
  const redirected = createImageBuildCache({...f, log: () => {}, fetchImpl: async (_, options) => {
    calls++; assert.equal(options.redirect, 'error');
    return new Response(null, {status: 302, headers: {location: 'https://example.com/image.webp'}});
  }});
  assert.equal(await redirected.restore(f.meta, f.output), false); assert.equal(calls, 1);
  let time = 0;
  const expired = createImageBuildCache({...f, now: () => time, budgetMs: 10, fetchImpl: async () => {calls++; return f.response();}});
  time = 11; await expired.prime([f.meta]);
  assert.equal(await expired.restore(f.meta, f.output), false); assert.equal(calls, 1);
});

test('a damaged private cache is rejected and repaired only with independently verified bytes', async t => {
  const f = await fixture(t); let calls = 0;
  const cache = createImageBuildCache({...f, log: () => {}, fetchImpl: async () => {calls++; return f.response();}});
  await cache.prime([f.meta]);
  const dir = path.join(f.rootDir, '.next/cache/globalbole-images/v1');
  const file = readdirSync(dir).find(name => name.endsWith('.webp'));
  writeFileSync(path.join(dir, file), Buffer.from('corrupt'));
  assert.equal(await cache.restore(f.meta, f.output), true);
  assert.equal(calls, 2); assert.ok(readFileSync(f.output).equals(f.bytes));
  assert.ok(readFileSync(path.join(dir, file)).equals(f.bytes));
  assert.ok(readdirSync(dir).every(name => !name.endsWith('.tmp')));
});

test('arbitrary URLs, traversal, invalid sizes and duplicate lock records are refused', async t => {
  const f = await fixture(t);
  for (const bad of [
    {...f.record, src: 'https://example.com/a.webp'}, {...f.record, src: '/optimized-assets/../escape-0123456789ab-160.webp'},
    {...f.record, bytes: 33 * 1024 * 1024}, {...f.record, fingerprint: '0123456789ab'},
  ]) {
    writeFileSync(f.lockPath, JSON.stringify({...f.lock, assets: [bad]}));
    assert.throws(() => createImageBuildCache(f), /Invalid/);
  }
  writeFileSync(f.lockPath, JSON.stringify({...f.lock, assets: [f.record, f.record]}));
  assert.throws(() => createImageBuildCache(f), /duplicate/);
});

test('same-sized valid but different pixels cannot bypass the pinned existing-output fast path', async t => {
  const f = await fixture(t);
  mkdirSync(path.join(f.rootDir, 'public/news-media/test'), {recursive: true});
  mkdirSync(path.join(f.rootDir, 'content/generated'), {recursive: true});
  const input = await sharp({create: {width: 160, height: 96, channels: 3, background: '#2b5678'}}).jpeg().toBuffer();
  writeFileSync(path.join(f.rootDir, 'public/news-media/test/photo.jpg'), input);
  writeFileSync(path.join(f.rootDir, 'content/generated/articles.json'), JSON.stringify([{image: '/news-media/test/photo.jpg'}]));
  rmSync(f.lockPath);
  await optimizeImages({rootDir: f.rootDir});
  const plan = await optimizeImages({rootDir: f.rootDir, planOnly: true});
  const target = plan.descriptors.find(d => d.format === 'webp');
  const output = path.join(f.rootDir, 'public', target.src);
  const correct = readFileSync(output);
  writeFileSync(f.lockPath, JSON.stringify({...f.lock, assets: [{...target, pixelWidth: target.width, pixelHeight: target.height, bytes: correct.length, sha256: hash(correct)}]}));
  writeFileSync(output, await sharp({create: {width: 160, height: 96, channels: 3, background: '#dc2040'}}).webp({quality: 76}).toBuffer());
  const repaired = await optimizeImages({rootDir: f.rootDir});
  assert.equal(repaired.encoded, 1);
  assert.ok(readFileSync(output).equals(correct));
});

test('the shared deadline aborts a real active HTTP body rather than only checking before a request', async t => {
  const f = await fixture(t);
  const server = createServer((request, response) => {
    response.writeHead(200, {'content-type': 'image/webp'});
    response.write(f.bytes.subarray(0, 4)); // Deliberately never finish the response.
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => {server.closeAllConnections(); server.close();});
  const localURL = `http://127.0.0.1:${server.address().port}/fixture`;
  const started = Date.now();
  const cache = createImageBuildCache({...f, budgetMs: 100, requestMs: 2000, log: () => {},
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://www.globalbole.com' + f.meta.src);
      // Test-only local transport; production never receives this injected fetch.
      const response = await fetch(localURL, options);
      return new Response(response.body, {status: response.status, headers: response.headers});
    }});
  assert.equal(await cache.restore(f.meta, f.output), false);
  assert.ok(Date.now() - started < 1500, 'The stage deadline must abort the hung body');
  assert.equal(cache.stats.remoteFailures, 1); assert.equal(existsSync(f.output), false);
});

test('a chunk exceeding the locked byte count cancels the body without installing it', async t => {
  const f = await fixture(t); let cancelled = false;
  const body = new ReadableStream({
    start(controller) {controller.enqueue(new Uint8Array(f.bytes.length + 1));},
    cancel() {cancelled = true;},
  });
  const cache = createImageBuildCache({...f, log: () => {},
    fetchImpl: async () => new Response(body, {headers: {'content-type': 'image/webp'}})});
  assert.equal(await cache.restore(f.meta, f.output), false);
  assert.equal(cancelled, true); assert.equal(existsSync(f.output), false);
});

test('without a lock, neither priming nor restoration makes a network request', async t => {
  const f = await fixture(t); rmSync(f.lockPath);
  const cache = createImageBuildCache({...f, fetchImpl: () => {throw new Error('Unexpected network request');}});
  await cache.prime([f.meta]);
  assert.equal(await cache.restore(f.meta, f.output), false);
  assert.equal(cache.stats.remoteFailures, 0);
});

test('legacy one-pixel rounding is retained but the locked actual pixel height remains exact', async t => {
  const f = await fixture(t);
  const bytes = await sharp({create: {width: 160, height: 95, channels: 3, background: '#2b5678'}}).webp().toBuffer();
  f.lock.assets[0] = {...f.record, pixelHeight: 95, bytes: bytes.length, sha256: hash(bytes)};
  writeFileSync(f.lockPath, JSON.stringify(f.lock));
  const cache = createImageBuildCache({...f, fetchImpl: async () => f.response(bytes)});
  assert.equal(await cache.restore(f.meta, f.output), true);
  assert.equal((await sharp(readFileSync(f.output)).metadata()).height, 95);
  rmSync(f.output);
  f.lock.assets[0].pixelHeight = 96;
  writeFileSync(f.lockPath, JSON.stringify(f.lock));
  const inconsistent = createImageBuildCache({...f, log: () => {}, fetchImpl: async () => f.response(bytes)});
  assert.equal(await inconsistent.restore(f.meta, f.output), false);
  assert.equal(existsSync(f.output), false);
});
