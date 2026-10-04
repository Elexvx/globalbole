import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('a single responsive type scale defines all heading roles without viewport-root inflation', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  assert.match(css, /html\s*\{[\s\S]*?font-size:\s*100%/);
  assert.doesNotMatch(css, /font-size:\s*max\(100%,\s*calc\(100vw/);
  for(const role of ['h1','h2','h3']) {
    assert.match(css,new RegExp(`:root main ${role} \\{ font-size: var\\(--type-${role}\\); \\}`));
  }
  for(const token of ['h1','h2','h3','body','summary','ui','caption']) assert.ok(css.includes(`--type-${token}:`));
  assert.ok(css.includes('--type-h1: 2rem;'));
  assert.ok(css.includes('--type-h2: 1.5rem;'));
  assert.ok(css.includes('--type-h3: 1.25rem;'));
  assert.ok(css.includes('--type-h1: 1.75rem;'));
});
