import test from 'node:test';
import assert from 'node:assert/strict';
import { planHomeEdition } from '../lib/home-edition.mjs';
import { readFileSync } from 'node:fs';

test('front-page slots partition sparse and large editions without duplicates or lost stories', () => {
  for (const count of [0, 1, 2, 3, 6, 10, 40]) {
    const stories = Array.from({length:count}, (_, i) => ({slug:`story-${i}`}));
    const {hero, supporting, latest, remaining} = planHomeEdition(stories);
    assert.deepEqual([...(hero ? [hero] : []), ...supporting, ...latest, ...remaining], stories);
    assert.ok(supporting.length <= 2 && latest.length <= 3);
  }
  const item = {slug:'same'};
  assert.deepEqual(planHomeEdition([item,item]), {hero:item,supporting:[],latest:[],remaining:[]});
});

test('layout leaves brand colors and responsive semantic heading roles in place', () => {
  const css = readFileSync('app/globals.css','utf8');
  for (const value of ['--site-background: oklch(97.7% 0.003 250)', '--site-foreground: oklch(27% 0.05 270)', '--site-accent: oklch(44% 0.18 20)', ':root[data-theme="capitol-night"]']) assert.ok(css.includes(value));
  assert.doesNotMatch(css, /\.ref-latest\s*\{[^}]*order:\s*1/);
  assert.match(css, /\.ref-hero-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.65fr\)/);
});
