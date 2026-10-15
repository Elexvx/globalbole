import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('app/globals.css', 'utf8');
const article = readFileSync('app/(site)/post/[slug]/view.tsx', 'utf8');

test('newsletter eyebrows remain legible on the accent background', () => {
  assert.match(css, /\.subscription-banner \.kicker\s*\{[^}]*color:\s*var\(--site-accent-foreground\);/);
});

test('the global control reset leaves utility typography available', () => {
  const reset = css.match(/button,\s*input,\s*select,\s*textarea\s*\{([^}]*)\}/)?.[1];
  assert.ok(reset);
  assert.match(reset, /font-family:\s*inherit;/);
  assert.doesNotMatch(reset, /\bfont\s*:/);
});

test('all article text including the table of contents can wrap long tokens', () => {
  assert.match(css, /\.article-copy\s*\{[^}]*overflow-wrap:\s*anywhere;/);
});

test('structured article paragraphs use the shared reading typography', () => {
  assert.match(article, /className="mt-4 type-body text-foreground\/85"/);
  assert.doesNotMatch(article, /className="mt-4 text-lg leading-8 text-foreground\/85"/);
});
