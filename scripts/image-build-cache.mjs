import {createHash, randomUUID} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const origin = 'https://www.globalbole.com';
const assetPath = /^\/optimized-assets\/[A-Za-z0-9][A-Za-z0-9._-]*-[a-f\d]{12}-\d+\.(?:webp|avif)$/;
const digest = value => createHash('sha256').update(value).digest('hex');
const hex = value => typeof value === 'string' && /^[a-f\d]{64}$/.test(value);
const maximumBytes = 32 * 1024 * 1024;
const identityFields = ['src', 'sourceSha256', 'fingerprint', 'width', 'height', 'format'];
const sameIdentity = (a, b) => identityFields.every(key => a?.[key] === b?.[key]);

// Only build-time, public, immutable assets from this site's verified prior
// production are eligible. No credentials, arbitrary URLs or redirect following.
export function createImageBuildCache({rootDir, fetchImpl = globalThis.fetch,
  now = () => Date.now(), budgetMs = 8 * 60 * 1000, requestMs = 20000,
  remote = process.env.IMAGE_CACHE_OFFLINE !== '1', log = console.warn} = {}) {
  const directory = path.resolve(rootDir, '.next/cache/globalbole-images/v1');
  const lockPath = path.resolve(rootDir, 'content/image-cache-lock.json');
  let records = [];
  if (existsSync(lockPath)) {
    const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
    if (lock.version !== 1 || lock.origin !== origin || !/^[a-f\d]{40}$/.test(lock.productionCommit)) {
      throw new Error('Invalid pinned image cache lock');
    }
    records = lock.assets;
    if (!Array.isArray(records)) throw new Error('Invalid image cache asset list');
  }
  const entries = new Map();
  for (const record of records) {
    if (!assetPath.test(record.src) || !hex(record.sha256) || !hex(record.sourceSha256) ||
      !hex(record.fingerprint) || !Number.isSafeInteger(record.bytes) || record.bytes <= 0 ||
      record.bytes > maximumBytes || !Number.isSafeInteger(record.width) || record.width <= 0 ||
      !Number.isSafeInteger(record.height) || record.height <= 0 ||
      record.pixelWidth !== record.width || !Number.isSafeInteger(record.pixelHeight) ||
      record.pixelHeight <= 0 || Math.abs(record.pixelHeight - record.height) > 1 ||
      !['webp', 'avif'].includes(record.format) || !record.src.endsWith('.' + record.format) ||
      entries.has(record.src)) throw new Error('Invalid or duplicate pinned image cache entry');
    entries.set(record.src, record);
  }
  const deadline = now() + budgetMs;
  const remoteController = new AbortController();
  let remoteDisabled = !remote;
  const stats = {remoteRestored: 0, localRestored: 0, stored: 0, remoteFailures: 0, remoteDenied: false};
  function names(meta) {
    if (!hex(meta.fingerprint) || !hex(meta.sourceSha256) || !assetPath.test(meta.src)) return null;
    const file = path.join(directory, `${meta.fingerprint}-${path.basename(meta.src)}`);
    return {file, sidecar: file + '.json'};
  }
  function atomicWrite(filename, bytes) {
    mkdirSync(path.dirname(filename), {recursive: true});
    const temporary = `${filename}.${randomUUID()}.tmp`;
    try { writeFileSync(temporary, bytes); renameSync(temporary, filename); }
    finally { rmSync(temporary, {force: true}); }
  }
  async function valid(bytes, meta, record) {
    if (!bytes.length || bytes.length > maximumBytes || !sameIdentity(meta, record) ||
      bytes.length !== record.bytes || digest(bytes) !== record.sha256) return false;
    const pinned = entries.get(meta.src);
    if (pinned && sameIdentity(meta, pinned) && digest(bytes) !== pinned.sha256) return false;
    try {
      const data = await sharp(bytes).metadata();
      if (data.format !== (meta.format === 'avif' ? 'heif' : meta.format) ||
        data.width !== meta.width || data.width !== (record.pixelWidth ?? record.width) ||
        data.height !== (record.pixelHeight ?? record.height) ||
        Math.abs(data.height - meta.height) > 1) return false;
      if (pinned && sameIdentity(meta, pinned) &&
        (data.width !== pinned.pixelWidth || data.height !== pinned.pixelHeight)) return false;
      await sharp(bytes).stats(); // A readable header is insufficient for truncated files.
      return true;
    } catch { return false; }
  }
  async function localBytes(meta) {
    const files = names(meta);
    if (!files || !existsSync(files.file) || !existsSync(files.sidecar)) return null;
    try {
      const bytes = readFileSync(files.file);
      const record = JSON.parse(readFileSync(files.sidecar, 'utf8'));
      return await valid(bytes, meta, record) ? bytes : null;
    } catch { return null; }
  }
  async function storeBytes(meta, bytes) {
    const files = names(meta);
    if (!files || !bytes.length || bytes.length > maximumBytes) return;
    const pixels = await sharp(bytes).metadata();
    const record = {...meta, pixelWidth: pixels.width, pixelHeight: pixels.height, bytes: bytes.length, sha256: digest(bytes)};
    atomicWrite(files.file, bytes);
    atomicWrite(files.sidecar, JSON.stringify(record) + '\n');
    stats.stored++;
  }
  async function download(meta) {
    const pinned = entries.get(meta.src);
    if (remoteDisabled || now() >= deadline || !pinned || !sameIdentity(meta, pinned)) return null;
    try {
      const url = origin + meta.src;
      const response = await fetchImpl(url, {
        redirect: 'error', credentials: 'omit',
        signal: AbortSignal.any([remoteController.signal, AbortSignal.timeout(Math.max(1, Math.min(requestMs, deadline - now())))]),
        headers: {'User-Agent': 'GlobalboleBuildCache/1.0 (+https://www.globalbole.com/)', Accept: `image/${meta.format}`},
      });
      if (response.status === 401 || response.status === 403) {
        remoteDisabled = true; stats.remoteDenied = true;
        remoteController.abort(new Error('Remote image cache access denied'));
        throw new Error(`HTTP ${response.status}; further remote cache requests disabled`);
      }
      if (!response.ok || response.redirected || (response.url && response.url !== url)) throw new Error('Non-direct cache response');
      if (response.headers.get('content-type')?.split(';')[0].trim() !== `image/${meta.format}`) throw new Error('Unexpected image MIME type');
      const declared = response.headers.get('content-length');
      if (declared !== null && Number(declared) !== pinned.bytes) throw new Error('Unexpected image byte count');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Missing image body');
      const parts = []; let size = 0;
      try {
        for (;;) {
          const {done, value} = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > pinned.bytes || size > maximumBytes || now() >= deadline) throw new Error('Image cache transfer limit exceeded');
          parts.push(Buffer.from(value));
        }
      } catch (error) { await reader.cancel().catch(() => {}); throw error; }
      const bytes = Buffer.concat(parts);
      if (!await valid(bytes, meta, pinned)) throw new Error('Image cache integrity or pixel validation failed');
      await storeBytes(meta, bytes); stats.remoteRestored++;
      if (stats.remoteRestored % 200 === 0) console.log(`Image cache bootstrap: ${stats.remoteRestored} verified assets restored`);
      return bytes;
    } catch (error) {
      stats.remoteFailures++;
      if (stats.remoteFailures <= 5) log(`Image build cache miss: ${meta.src}: ${error.message}`);
      return null; // Retain the existing local encoder; never weaken checks or seek another origin.
    }
  }
  return {
    stats,
    acceptExisting(meta, output) {
      const pinned = entries.get(meta.src);
      if (pinned) {
        const bytes = readFileSync(output);
        return sameIdentity(meta, pinned) && bytes.length === pinned.bytes && digest(bytes) === pinned.sha256;
      }
      const files = names(meta);
      if (files && existsSync(files.sidecar)) {
        try {
          const record = JSON.parse(readFileSync(files.sidecar, 'utf8'));
          const bytes = readFileSync(output);
          return sameIdentity(meta, record) && bytes.length === record.bytes && digest(bytes) === record.sha256;
        } catch { return false; }
      }
      return true; // Legacy local output without a pinned record still gets full decode validation.
    },
    async prime(descriptors) {
      // Eight bounded network readers, separate from the unchanged <=4 encoders.
      let next = 0;
      const candidates = descriptors.filter(meta => {
        const files = names(meta);
        return files && !existsSync(path.join(rootDir, 'public', meta.src)) &&
          !(existsSync(files.file) && existsSync(files.sidecar)) &&
          sameIdentity(meta, entries.get(meta.src));
      });
      if (candidates.length) console.log(`Image cache bootstrap: ${candidates.length} pinned assets eligible; bounded direct requests only`);
      async function worker() {
        while (next < candidates.length && !remoteDisabled && now() < deadline) await download(candidates[next++]);
      }
      await Promise.all(Array.from({length: Math.min(8, candidates.length)}, worker));
    },
    async restore(meta, output) {
      let bytes = await localBytes(meta);
      if (bytes) stats.localRestored++;
      else bytes = await download(meta);
      if (!bytes) return false;
      atomicWrite(output, bytes); return true;
    },
    async remember(meta, output, {overwrite = false} = {}) {
      const files = names(meta);
      if (!files) return;
      // Existing cache is fully checked when read, not trusted merely because it exists.
      if (!overwrite && existsSync(files.file) && existsSync(files.sidecar)) return;
      await storeBytes(meta, readFileSync(output));
    },
  };
}
