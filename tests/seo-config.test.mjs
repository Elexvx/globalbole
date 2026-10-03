import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { match, compile } = require('next/dist/compiled/path-to-regexp');
const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;
const resolveRedirect = pathname => {
  for (const redirect of redirects) {
    // Vercel normalizes extensionless URLs first, then matches redirects strictly.
    const normalized = pathname.endsWith('/') ? pathname : pathname + '/';
    const result = match(redirect.source, { decode: decodeURIComponent, strict: true })(normalized);
    if (result) return { destination: compile(redirect.destination, { encode: encodeURIComponent })(result.params), permanent: redirect.permanent };
  }
};

test('legacy aliases redirect permanently to matching localized content', () => {
  for (const route of ['about', 'authors', 'contact', 'privacy', 'all-news', 'issues']) {
    for (const suffix of ['', '/']) assert.deepEqual(resolveRedirect(`/${route}${suffix}`), { destination: `/zh-CN/${route}/`, permanent: true });
  }
  for (const lang of ['zh-CN', 'zh-TW', 'en', 'ru', 'fr']) {
    const slug = `${lang.toLowerCase()}-example-story`;
    assert.deepEqual(resolveRedirect(`/post/${slug}/`), { destination: `/${lang}/post/${slug}/`, permanent: true });
  }
  assert.deepEqual(resolveRedirect('/all-news/2/'), { destination: '/zh-CN/all-news/2/', permanent: true });
  assert.deepEqual(resolveRedirect('/issue/2026-10-03/'), { destination: '/zh-CN/issue/2026-10-03/', permanent: true });
  assert.deepEqual(resolveRedirect('/category/technology/'), { destination: '/zh-CN/category/technology/', permanent: true });
  assert.deepEqual(resolveRedirect('/tag/Anthropic/'), { destination: '/zh-CN/tag/Anthropic/', permanent: true });
  assert.deepEqual(resolveRedirect('/tag/%E8%83%BD%E6%BA%90/'), { destination: '/zh-CN/tag/%E8%83%BD%E6%BA%90/', permanent: true });
});

test('retired taxonomy redirects keep precedence and localized routes do not loop', () => {
  for (const route of ['category', 'tag']) for (const slug of ['world', 'politics', 'culture', 'cities']) {
    assert.deepEqual(resolveRedirect(`/${route}/${slug}/`), { destination: '/zh-CN/all-news/', permanent: true });
  }
  for (const pathname of ['/', '/zh-CN/', '/en/', '/zh-CN/category/technology/', '/zh-CN/tag/Anthropic/', '/zh-CN/post/zh-cn-example-story/']) assert.equal(resolveRedirect(pathname), undefined);
});

test('canonical defaults do not silently change to preview deployment origins', () => {
  for (const file of ['lib/site-url.ts', 'scripts/finalize-export.mjs']) {
    const code = readFileSync(file, 'utf8');
    assert.ok(code.includes('https://www.globalbole.com'));
    assert.ok(!code.includes('process.env.VERCEL_URL'));
    assert.ok(!code.includes('process.env.VERCEL_PROJECT_PRODUCTION_URL'));
  }
});


test('long-lived caching applies only to versioned build assets and content-hashed derivatives', () => {
  const { headers } = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const images = headers.find(rule => rule.source === '/optimized-assets/:path*');
  assert.equal(images.headers.find(header => header.key === 'Cache-Control').value, 'public, max-age=31536000, immutable');
  const buildAssets = headers.find(rule => rule.source === '/_next/static/:path*');
  assert.equal(buildAssets.headers.find(header => header.key === 'Cache-Control').value, 'public, max-age=31536000, immutable');
  const fonts = headers.find(rule => rule.source === '/fonts/:path*');
  assert.equal(fonts.headers.find(header => header.key === 'Cache-Control').value, 'public, max-age=604800');
  assert.ok(!headers.some(rule => ['/news-media/:path*', '/:path*'].includes(rule.source)));
});


test('redirect sources include the slash that Vercel enforces before matching', () => {
  assert.ok(redirects.every(redirect=>redirect.source.endsWith('/')));
});
