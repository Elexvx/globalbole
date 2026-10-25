import test from 'node:test';
import assert from 'node:assert/strict';
import { tagDescription } from '../lib/tag-descriptions.mjs';

test('tag descriptions state real collection size and publication range in five languages', () => {
  for (const locale of ['zh-CN', 'zh-TW', 'en', 'ru', 'fr']) {
    const copy = tagDescription(locale, 'Anthropic', [{date:'2026-10-01'}, {date:'2026-10-25'}]);
    assert.ok(copy.includes('Anthropic'));
    assert.ok(copy.includes('2'));
    assert.ok(copy.includes('2026-10-01–2026-10-25'));
  }
  assert.ok(tagDescription('en', 'Artificial intelligence', [{date:'2026-10-25'}]).includes('controlled tests'));
  assert.ok(tagDescription('en', 'Anthropic', [{date:'2026-10-25'}]).includes('1 published article,'));
  assert.ok(!tagDescription('en', 'Anthropic', []).includes('undefined'));
});
