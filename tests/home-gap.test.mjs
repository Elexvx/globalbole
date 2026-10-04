import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// The requested correction preserves the original homepage composition.
test('original homepage column order and editorial modules remain in place', () => {
 const home=readFileSync('components/reference-home.tsx','utf8');
 assert.ok(home.indexOf('className="ref-latest"') < home.indexOf('className="ref-hero-story"'));
 assert.ok(home.indexOf('className="ref-hero-story"') < home.indexOf('className="ref-picks"'));
 for(const name of ['ref-four-up','ref-two-column','ref-innovation-grid','ref-beats-grid','ref-tech-feature-grid','ref-archive-grid']) assert.ok(home.includes(name));
 assert.match(home,/takeRemaining\(ordered, used, 6\)/);
 assert.match(home,/<div className="ref-latest-list"[^>]*tabIndex=\{0\}/);
 assert.ok(home.indexOf('id="latest-heading"') < home.indexOf('className="ref-latest-list"'));
 assert.match(home,/<aside className="ref-picks"[^>]*tabIndex=\{0\}/);
});

test('only desktop hero sidebars are size-contained, with accessible overflow', () => {
 const css=readFileSync('app/globals.css','utf8');
 const patch=css.slice(css.indexOf('/* Keep the original three-column front page.'));
 assert.match(patch,/@media \(min-width: 64rem\)/);
 assert.match(patch,/\.ref-hero-grid > \.ref-latest,[\s\S]*\.ref-hero-grid > \.ref-picks[\s\S]*contain: size;[\s\S]*min-height: 0;[\s\S]*\.ref-latest-list,[\s\S]*overflow-y: auto;/);
 assert.doesNotMatch(patch,/font-size|grid-template-columns|order:|height:\s*\d+(?:px|rem|vh)/);
 assert.match(css,/grid-template-columns: 15rem minmax\(0, 1fr\) 19rem/);
});


test('Latest heading is outside the scrolling list and never becomes a scroll container', () => {
 const css=readFileSync('app/globals.css','utf8');
 const patch=css.slice(css.indexOf('/* Keep the original three-column front page.'));
 assert.match(patch,/\.ref-hero-grid > \.ref-latest \{[^}]*display: flex;[^}]*flex-direction: column;/);
 assert.match(patch,/\.ref-latest > \.ref-heading-small,[\s\S]*flex-shrink: 0/);
 assert.doesNotMatch(patch,/\.ref-hero-grid > \.ref-latest[^}]*overflow-y/);
});
