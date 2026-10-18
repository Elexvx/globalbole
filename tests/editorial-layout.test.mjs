import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {uniqueHomepageStories} from '../lib/home-selection.mjs';
const css=readFileSync('app/globals.css','utf8');
const home=readFileSync('components/reference-home.tsx','utf8');
test('secondary lead row never repeats lead, sidebars, or itself',()=>{
 const stories=['a','b','b','c','d','e','f'].map(slug=>({slug}));
 assert.deepEqual(uniqueHomepageStories(stories,['a','c'],4).map(x=>x.slug),['b','d','e','f']);
 assert.deepEqual(uniqueHomepageStories([],[],4),[]);
 assert.match(home,/uniqueHomepageStories\(ordered, \[hero, \.\.\.latest, \.\.\.picks\]\.map/);
 assert.match(home,/topStories.map/);
 assert.doesNotMatch(home,/techDetails|ref-tech-feature-grid/);
});
test('tablet cards stay two columns and phone business cards become one',()=>{
 assert.match(css,/@media \(min-width: 68rem\) \{\s*\.ref-four-up,/);
 assert.match(css,/@media \(max-width: 67\.999rem\) \{\s*\.ref-four-up, \.ref-archive-grid \{ grid-template-columns: repeat\(2/);
 assert.match(css,/\.ref-four-up, \.ref-archive-grid, \.ref-business-grid \{ grid-template-columns: minmax\(0, 1fr\);/);
 assert.match(css,/\.ref-hero-story \{ order: 0; \}/);
});
test('native script font tokens and lead hierarchy override generic heading baseline',()=>{
 for(const [locale,font] of [['zh-CN','PingFang SC'],['zh-TW','PingFang TC'],['ru','Segoe UI']]) {
  const block=css.match(new RegExp(`:root\\[lang="${locale}"\\] \\{([^}]+)`))?.[1];
  assert.ok(block?.includes(font)); assert.ok(block.includes('--site-font-display: var(--site-font-sans)'));
 }
 assert.match(css,/:root main \.ref-hero-title \{ font-size: clamp\(2rem, 2\.6vw, 2\.25rem\)/);
 assert.match(home,/ordered.slice\(0, 12\)/);
});

test('locale typography has equal specificity to every theme and wins by source order',()=>{
 for (const locale of ['zh-CN','zh-TW','ru']) {
  const language = css.indexOf(`:root[lang="${locale}"]`);
  for (const theme of ['civic-paper','capitol-night','campaign-trail','broadcast-pop'])
   assert.ok(language > css.indexOf(`:root[data-theme="${theme}"]`));
 }
});
