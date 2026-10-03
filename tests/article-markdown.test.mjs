import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import swc from 'next/dist/build/swc/index.js';

// Exercise the actual TSX components with Next's installed compiler, without a build
// or an additional test dependency. Keep these loader hooks inside this test worker.
await swc.loadBindings();
const root = fileURLToPath(new URL('../', import.meta.url));
const rootUrl = pathToFileURL(root).href;
let lazyRendererImports = 0;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './article-markdown') lazyRendererImports++;
    let location;
    if (specifier.startsWith('@/')) location = path.join(root, specifier.slice(2));
    else if (specifier.startsWith('.') && context.parentURL?.startsWith(rootUrl) && !context.parentURL.includes('/node_modules/')) location = fileURLToPath(new URL(specifier, context.parentURL));
    if (location) {
      const file = ['', '.tsx', '.ts', '.mjs'].map(extension => location + extension).find(file => existsSync(file));
      if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(rootUrl) && !url.includes('/node_modules/')) {
      if (url.endsWith('.json')) return { format: 'module', source: `export default ${readFileSync(new URL(url), 'utf8')}`, shortCircuit: true };
      if (/\.tsx?$/.test(url)) return {
        format: 'module',
        source: swc.transformSync(readFileSync(new URL(url), 'utf8'), {
          filename: fileURLToPath(url),
          jsc: { parser: { syntax: 'typescript', tsx: url.endsWith('.tsx') }, transform: { react: { runtime: 'automatic' } } },
          module: { type: 'es6' },
        }).code,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
after(() => hooks.deregister());
const { ClientMarkdown } = await import('../components/client-markdown.tsx');

function renderResolved(element) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    output.on('data', chunk => { html += chunk; });
    output.on('end', () => resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(element, {
      onAllReady() { stream.pipe(output); },
      onError: reject,
    });
  });
}

test('an unchanged published snapshot renders its server children without importing the parser', () => {
  const before = lazyRendererImports;
  const html = renderToStaticMarkup(createElement(ClientMarkdown, {
    markdown: 'Published body', initialMarkdown: 'Published body', locale: 'en', initialLocale: 'en',
  }, createElement('p', { id: 'published-content' }, 'Complete published body')));
  assert.equal(html, '<p id="published-content">Complete published body</p>');
  assert.equal(lazyRendererImports, before);
});

test('a changed API body keeps the published content visible until the lazy renderer is ready', async () => {
  const element = createElement(ClientMarkdown, {
    markdown: '## Fresh body\n\nNew **API content**', initialMarkdown: 'Published body', locale: 'en', initialLocale: 'en',
  }, createElement('p', { id: 'published-content' }, 'Complete published body'));
  const loading = renderToStaticMarkup(element);
  assert.match(loading, /<p id="published-content">Complete published body<\/p>/);
  const refreshed = await renderResolved(element);
  assert.match(refreshed, /<h2 id="section-1"[^>]*>Fresh body<\/h2>/);
  assert.match(refreshed, /New <strong>API content<\/strong>/);
  assert.doesNotMatch(refreshed, /published-content/);
  assert.ok(lazyRendererImports > 0);
});

test('fresh Markdown also renders when no published snapshot exists', async () => {
  const html = await renderResolved(createElement(ClientMarkdown, { markdown: 'Newly available article', locale: 'fr' }));
  assert.match(html, /<p>Newly available article<\/p>/);
});

test('a locale change cannot reuse table-of-contents or footnote labels from another locale', async () => {
  const markdown = '## First\n\nCitation[^source]\n\n## Second\n\n[^source]: Attribution';
  const html = await renderResolved(createElement(ClientMarkdown, {
    markdown, initialMarkdown: markdown, locale: 'fr', initialLocale: 'en',
  }, createElement('p', null, 'English snapshot')));
  assert.match(html, /aria-label="Sommaire"/);
  assert.match(html, /Notes et sources/);
  assert.doesNotMatch(html, /English snapshot/);
});

test('server and refreshed bodies retain GFM, unique anchors, footnotes, licensing and safe full images in every locale', async () => {
  const { ArticleMarkdown } = await import('../components/article-markdown.tsx');
  const manifest = JSON.parse(readFileSync(path.join(root, 'content/generated/image-manifest.json'), 'utf8'));
  const [image, dimensions] = Object.entries(manifest)[0];
  const markdown = [
    '## Repeated heading', '', 'Citation[^source]', '', '```md', '## Not a heading', '```', '',
    '## Repeated heading', '', '### Detail', '', '| Key | Value |', '| --- | --- |', '| Full | Article |', '',
    '- [x] Verified', '', `![Uncropped image](${image})`, '',
    '[License: CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)', '',
    '[Unsafe link](javascript:alert%281%29)', '', '<script>alert("unsafe")</script>', '',
    '[^source]: Source attribution retained.',
  ].join('\n');
  for (const [locale, title, footnotes] of [
    ['zh-CN', '文章目录', '来源与说明'], ['zh-TW', '文章目錄', '來源與說明'], ['en', 'On this page', 'Source notes'],
    ['ru', 'Содержание', 'Источники'], ['fr', 'Sommaire', 'Notes et sources'],
  ]) {
    const html = renderToStaticMarkup(createElement(ArticleMarkdown, { markdown, locale }));
    assert.ok(html.includes(`aria-label="${title}"`));
    assert.ok(html.includes(footnotes));
    assert.match(html, /href="#section-1"/);
    assert.match(html, /href="#section-9"/);
    assert.match(html, /id="section-11"/);
    assert.doesNotMatch(html, /href="#section-6"/);
    assert.match(html, /<table>/);
    assert.match(html, /type="checkbox"[^>]*checked=""/);
    assert.match(html, /href="#user-content-fn-source"/);
    assert.match(html, /Source attribution retained/);
    assert.match(html, /href="https:\/\/creativecommons.org\/licenses\/by\/4.0\/"/);
    assert.ok(html.includes(`src="${image}"`));
    assert.ok(html.includes(`width="${dimensions.width}" height="${dimensions.height}"`));
    assert.match(html, /loading="lazy" decoding="async"/);
    assert.doesNotMatch(html, /object-cover|<script|javascript:/);
    const refreshed = await renderResolved(createElement(ClientMarkdown, { markdown, locale }));
    // Streaming SSR adds React's text separators and Suspense boundary comments.
    assert.equal(refreshed.replace(/<!--(?:\/?\$| )-->/g, ''), html);
  }
});

test('both article route families pass server-rendered Markdown through the client boundary', () => {
  for (const file of ['app/(site)/[locale]/[[...path]]/page.tsx', 'app/(site)/post/[slug]/page.tsx']) {
    const source = readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /^["']use client["']/);
    assert.match(source, /<ArticleMarkdown markdown=\{initialMarkdown\} locale=/);
    assert.match(source, /initialMarkdown=\{initialMarkdown\} initialLocale=/);
  }
  const renderer = readFileSync(path.join(root, 'components/article-markdown.tsx'), 'utf8');
  assert.doesNotMatch(renderer, /["']use client["']|useI18n|dangerouslySetInnerHTML/);
  assert.match(renderer, /skipHtml/);
  const view = readFileSync(path.join(root, 'app/(site)/post/[slug]/view.tsx'), 'utf8');
  assert.doesNotMatch(view, /from ["']@\/components\/article-markdown/);
  assert.match(view, /<ClientMarkdown[^>]+>\{children\}<\/ClientMarkdown>/);
  const boundary = readFileSync(path.join(root, 'components/client-markdown.tsx'), 'utf8');
  assert.match(boundary, /lazy\(\(\) => import\("\.\/article-markdown"\)/);
  assert.doesNotMatch(boundary, /ssr:\s*false|dangerouslySetInnerHTML/);
});
