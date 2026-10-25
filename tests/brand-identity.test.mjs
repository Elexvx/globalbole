import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { homeSeo } from '../lib/home-seo.mjs';

const source = readFileSync('lib/site-brand.ts', 'utf8');
const compiled = stripTypeScriptTypes(source.replace(/^import type .*;\n/m, '').replace(/\bexport /g, ''));
const { siteName, brandAliases } = Function(compiled + '\nreturn {siteName, brandAliases};')();
const locales = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];

test('real brand aliases share one existing publication identity without renaming titles', () => {
  assert.equal(siteName, '全球伯乐 News');
  for (const alias of ['全球伯乐', '全球伯樂', 'Global Bole', 'GlobalBole', 'Global Bole News']) assert.ok(brandAliases.includes(alias));
  assert.equal(new Set(brandAliases).size, brandAliases.length);
  assert.ok(!brandAliases.includes(siteName));
  for (const locale of locales) assert.ok(homeSeo[locale].title.includes(locale === 'zh-CN' ? siteName : locale === 'zh-TW' ? '全球伯樂 News' : 'Global Bole News'));
  const seo = readFileSync('lib/seo.tsx', 'utf8');
  assert.equal((seo.match(/alternateName: brandAliases/g) || []).length, 2);
  assert.ok(seo.includes('absolute("/#publisher")'));
  assert.ok(seo.includes('absolute("/#website")'));
});

test('descriptions and About introductions naturally identify the same five-language publication', () => {
  for (const locale of locales) {
    const shortName = locale === 'zh-CN' ? '全球伯乐' : locale === 'zh-TW' ? '全球伯樂' : 'Global Bole News';
    assert.ok(homeSeo[locale].description.startsWith(shortName));
  }
  const info = readFileSync('lib/editorial-policy.ts', 'utf8');
  assert.equal((info.match(/GlobalBole/g) || []).length, 5);
  assert.doesNotMatch(info, /当前内容为功能测试示例|構建時自動生成|build-time demonstration/);
});

test('brand aliases do not add new organizations, credentials, social profiles or account settings', () => {
  assert.doesNotMatch(source, /sameAs|legalName|foundingDate|contactPoint|verification/);
  const seo = readFileSync('lib/seo.tsx', 'utf8');
  assert.equal((seo.match(/"@type": "WebSite"/g) || []).length, 1);
  assert.match(seo, /alternateName: brandAliases, url: absolute\("\/"\)/);
});
