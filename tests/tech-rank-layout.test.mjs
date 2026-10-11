import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// A tall business grid must not distribute three short signals over its height.
test('technology signals flow from the top without flex stretching', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  const rules = [...css.matchAll(/\.ref-(?:tech-rank-column(?:\s*>\s*\.ref-rank-list)?|rank-list)\s*\{([^}]*)\}/g)].map(match => match[1]).join('\n');
  assert.doesNotMatch(rules, /(?:flex(?:-grow|-direction)?|justify-content|(?:min-)?height)\s*:/);
  assert.doesNotMatch(rules, /display\s*:\s*(?:flex|grid)/);
  assert.match(css, /\.ref-tech-rank-column\s*>\s*\.ref-rank-list\s*\{\s*margin-top:\s*1\.25rem;/);
});
