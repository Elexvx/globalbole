import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const banner = read('components/rss-banner.tsx');
const copy = JSON.parse(read('lib/rss-copy.json'));

test('RSS banner copy is complete for all five locales', () => {
  assert.deepEqual(Object.keys(copy).sort(), ['zh-CN','zh-TW','en','ru','fr'].sort());
  for (const [locale, text] of Object.entries(copy)) {
    for (const field of ['newsletter','newsletterTitle','subscribe','rssNote']) {
      assert.ok(typeof text[field] === 'string' && text[field].trim(), `${locale}/${field}`);
    }
    assert.match(text.rssNote, /RSS/);
  }
});

test('shared RSS banner works without client hooks and keeps a localized feed link', () => {
  assert.doesNotMatch(banner, /["']use client["']|useEffect|useState|<form|<input/);
  assert.match(banner, /const language = isLocale\(locale\) \? locale : "zh-CN"/);
  assert.match(banner, /`\/feeds\/\$\{language\}\.xml`/);
  assert.match(banner, /data-rss-banner/);
  for (const className of ['ref-newsletter-inner','ref-newsletter-title','ref-newsletter-action','ref-newsletter-button']) {
    assert.match(banner, new RegExp(`className="${className}"`));
  }
  assert.match(banner, /positioning\[language\]/);
});

test('category, archive and tag newsletter uses the same banner', () => {
  const source = read('components/story-components.tsx');
  const wrapper = source.slice(source.indexOf('export function Newsletter'), source.indexOf('export function Pagination'));
  assert.match(wrapper, /<RssBanner locale=\{locale\} compact=\{compact\}/);
  assert.doesNotMatch(wrapper, /rounded-full|subscription-banner|bg-accent/);
  for (const path of ['app/(site)/category/[slug]/view.tsx','app/(site)/all-news/[[...page]]/view.tsx','app/(site)/tag/[slug]/view.tsx']) {
    assert.match(read(path), /<Newsletter compact\s*\/>/);
  }
});

test('both homepage states use the shared RSS banner', () => {
  const source = read('components/reference-home.tsx');
  assert.equal((source.match(/<RssBanner\b/g) || []).length, 2);
  assert.doesNotMatch(source, /className="ref-newsletter-inner"/);
});
