import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const view = readFileSync('app/(site)/category/[slug]/view.tsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');

test('every category uses one chronological grid without an oversized duplicate lead', () => {
  assert.match(view, /filter\(\(story\) => story\.category === category\.slug\)/);
  assert.match(view, /sort\(\(a, b\) => b\.date\.localeCompare\(a\.date\)\)/);
  assert.match(view, /categoryStories\.map\(\(story, index\) => <StoryCard/);
  assert.match(view, /priority=\{index < 3\}/);
  assert.doesNotMatch(view, /variant="feature"|Desk notes|categoryStories\.slice/);
  assert.match(view, /data-category-results=\{category\.slug\}/);
  assert.match(view, /No stories in this section yet\./);
  assert.match(view, /id="category-heading"/);
  assert.match(view, /aria-labelledby="category-heading"/);
});

test('category cards use one, two and three columns at bounded responsive widths', () => {
  assert.match(css, /\.category-story-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(css, /@media \(min-width: 40rem\)\s*\{\s*\.category-story-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(min-width: 64rem\)\s*\{\s*\.category-story-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.category-story-grid > \.story-link\s*\{[^}]*min-width:\s*0;/);
  assert.match(css, /\.category-story-grid \.headline\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  assert.doesNotMatch(css.match(/\.category-story-grid \.headline\s*\{([^}]*)\}/)[1], /height|line-clamp/);
});
