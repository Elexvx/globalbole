import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('global scale has a readable minimum and no ultra-wide ceiling', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  assert.match(css, /font-size:\s*max\(100%,\s*calc\(100vw\s*\/\s*90\)\)/);
  assert.match(css, /max-width:\s*84rem/);
  // Formula regression only; this is not a browser/device rendering test.
  for (const width of [1440, 1920, 3840, 7680, 15360]) {
    const root = Math.max(16, width / 90);
    assert.ok(Math.abs((84 * root / width) - 14 / 15) < 0.000001);
  }
  for (const width of [320, 390, 768, 1024]) assert.equal(Math.max(16, width / 90), 16);
});
