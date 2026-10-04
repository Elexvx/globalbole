import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';

export function assertStaticHomeManifest(manifest) {
  const modules = Object.keys(manifest.clientModules || {});
  const allowed = [
    '/node_modules/next/dist/esm/client/components/layout-router.js',
    '/node_modules/next/dist/esm/client/components/render-from-template-context.js',
    '/node_modules/next/dist/esm/client/components/client-page.js',
    '/node_modules/next/dist/esm/client/components/client-segment.js',
    '/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js',
    '/node_modules/next/dist/esm/lib/framework/boundary-components.js',
    '/node_modules/next/dist/esm/lib/metadata/generate/icon-mark.js',
    '/node_modules/next/dist/client/components/builtin/global-error.js',
    '/components/root-clock.tsx',
    '/node_modules/lucide-react/dist/esm/Icon.mjs',
  ];
  const unexpected = modules.filter(module => !allowed.some(suffix=>module.endsWith(suffix)));
  assert.deepEqual(unexpected, [], 'Static home gained an interactive client module; review its progressive enhancement before publishing');
}

export function staticHomeHtml(html) {
  assert.ok(!/<!--\$\?-->|id="(?:B|S):\d+"|BAILOUT_TO_CLIENT_SIDE_RENDERING/.test(html), 'Static home must already contain fully visible server-rendered content');
  assert.ok(html.includes('data-live-clock'), 'Keep the live clock enhancement available');
  let clockScripts = 0;
  let preferenceScripts = 0;
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attributes, body) => {
    if (/\btype="application\/ld\+json"/i.test(attributes)) return tag;
    const src = attributes.match(/\bsrc="([^"]+)"/i)?.[1];
    if (src === '/site-clock.js') { clockScripts++; return tag; }
    if (src === '/site-preferences.js') { preferenceScripts++; return tag; }
    if (src?.startsWith('/_next/static/') && /\.js(?:[?#]|$)/.test(src)) return '';
    if (!src && /^(?:\(self\.__next_f=|self\.__next_f\.push\()/.test(body.trim())) return '';
    throw new Error('Unknown executable script on static home; refusing to remove a possible feature');
  });
  html = html.replace(/<link\b[^>]*>/gi, tag => {
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1];
    return href?.startsWith('/_next/static/') && /\.js(?:[?#]|$)/.test(href) && /\b(?:as="script"|rel="modulepreload")/i.test(tag) ? '' : tag;
  });
  assert.ok(clockScripts <= 1, 'Only one root clock script is required');
  if (!clockScripts) html = html.replace('</head>', '<script src="/site-clock.js" defer></script></head>');
  assert.ok(preferenceScripts <= 1, 'Only one root language enhancement is required');
  if (!preferenceScripts) html = html.replace('</head>', '<script src="/site-preferences.js" defer></script></head>');
  return html;
}

export function finalizeStaticHome() {
  const context = {globalThis:{}};
  vm.runInNewContext(readFileSync('.next/server/app/(root)/page_client-reference-manifest.js','utf8'), context, {timeout:1000});
  const manifest = context.globalThis.__RSC_MANIFEST?.['/(root)/page'];
  assert.ok(manifest, 'Expected root client-reference manifest must be present');
  assertStaticHomeManifest(manifest);
  const file = 'out/index.html';
  const original = readFileSync(file,'utf8');
  const result = staticHomeHtml(original);
  writeFileSync(file,result);
  console.log(`Static homepage: ${original.length - result.length} HTML characters of unnecessary hydration removed; live clock, native menu and content retained.`);
}
