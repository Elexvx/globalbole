import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { completeRowCount, mountHomeLayout } from '../public/site-home-layout.mjs';
import { innovationRelatedStories, relatedStoryScore } from '../lib/home-selection.mjs';
import { categoryPool } from '../lib/categories.mjs';
import { staticHomeHtml } from '../scripts/finalize-static-home.mjs';

const home = readFileSync('components/reference-home.tsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');

test('fitting includes only the maximum chronological prefix of complete rows', () => {
  assert.equal(completeRowCount([100, 200, 300, 400], 400), 4);
  assert.equal(completeRowCount([100, 200, 300, 400], 399.99), 3);
  assert.equal(completeRowCount([100.25, 201.5, 375.75], 201.49), 1);
  assert.equal(completeRowCount([450, 500], 400), 0);
  assert.equal(completeRowCount([100, NaN, 200], 300), 1);
  assert.equal(completeRowCount([], 100), 0);
  assert.equal(completeRowCount([100], Infinity), 0);
  for (let boundary = 0; boundary <= 1200; boundary++) {
    const bottoms = [96.5, 205, 348.25, 457.75, 612, 801, 946.5, 1128];
    const count = completeRowCount(bottoms, boundary);
    assert.ok(count === 0 || bottoms[count - 1] <= boundary);
    assert.ok(count === bottoms.length || bottoms[count] > boundary);
  }
});

function events(target = {}) {
  const listeners = new Map();
  return Object.assign(target, {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type) { listeners.get(type)?.forEach(fn => fn()); },
    count() { return [...listeners.values()].reduce((sum, entries) => sum + entries.size, 0); },
  });
}

function fittingFixture() {
  const frames = new Map();
  let nextFrame = 0;
  let resizeCallback;
  let fontReady;
  let boundary = 460;
  let heights = [100, 140, 120, 100, 120, 90];
  const rows = heights.map((_, index) => ({
    hidden: false,
    getBoundingClientRect() {
      assert.equal(this.hidden, false, 'Every candidate must be restored before measurement');
      return { bottom: 100 + heights.slice(0, index + 1).reduce((a, b) => a + b, 0) };
    },
  }));
  const list = { children: rows, dataset: {} };
  const reference = events({ getBoundingClientRect: () => ({ bottom: boundary }) });
  const pair = { querySelector: selector => selector === '[data-height-matched-list]' ? list : reference };
  const desktop = events({ matches: true });
  const fonts = events({ ready: { then(fn) { fontReady = fn; } } });
  const observed = [];
  let disconnected = false;
  const win = events({
    matchMedia(query) { assert.equal(query, '(min-width: 64rem)'); return desktop; },
    requestAnimationFrame(fn) { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class {
      constructor(fn) { resizeCallback = fn; }
      observe(node) { observed.push(node); }
      disconnect() { disconnected = true; }
    },
  });
  const root = { querySelector: () => pair, ownerDocument: { defaultView: win, fonts } };
  return {
    root, list, rows, reference, pair, desktop, fonts, win, observed,
    setBoundary(value) { boundary = value; },
    setHeights(value) { heights = value; },
    resize() { resizeCallback(); }, fontReady() { fontReady(); },
    disconnected: () => disconnected,
    flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); },
    visible: () => rows.filter(row => !row.hidden).length,
  };
}

test('runtime fits actual right height, expands after resize and remeasures translated/font row sizes', () => {
  const f = fittingFixture();
  const dispose = mountHomeLayout(f.root);
  assert.equal(mountHomeLayout(f.root), dispose);
  assert.equal(f.visible(), 3);
  assert.equal(f.list.dataset.fittedCount, '3');
  assert.deepEqual(f.observed, [f.reference, f.pair]);
  f.setBoundary(680); f.resize(); f.flush();
  assert.equal(f.visible(), 5, 'Hidden rows return when more complete rows fit');
  f.setHeights([130, 175, 130, 175, 130, 175]);
  f.fontReady(); f.fonts.emit('loadingdone'); f.flush();
  assert.equal(f.visible(), 3, 'Long translated rows do not extend past the reference');
  f.setBoundary(405); f.reference.emit('load'); f.flush();
  assert.equal(f.visible(), 2, 'Right-column image changes trigger a fresh measurement');
  dispose();
  assert.equal(f.visible(), 6);
  assert.equal(f.list.dataset.fittedCount, undefined);
  assert.ok(f.disconnected());
  for (const target of [f.win, f.reference, f.desktop, f.fonts]) assert.equal(target.count(), 0);
  f.fontReady(); f.flush();
  assert.equal(f.visible(), 6, 'Late font loading cannot restart a disposed page');
});

test('narrow viewports show the entire natural-height list and restore desktop fitting on return', () => {
  const f = fittingFixture();
  const dispose = mountHomeLayout(f.root);
  f.desktop.matches = false; f.desktop.emit('change');
  assert.equal(f.visible(), 6);
  assert.equal(f.list.dataset.fittedCount, undefined);
  f.setBoundary(150); f.win.emit('resize'); f.flush();
  assert.equal(f.visible(), 6);
  f.desktop.matches = true; f.desktop.emit('change');
  assert.equal(f.visible(), 0, 'No clipped half-row is forced into an insufficient height');
  f.setBoundary(810); f.win.emit('pageshow'); f.flush();
  assert.equal(f.visible(), 6);
  dispose();
});

test('empty/missing reference columns retain a readable unmodified list', () => {
  const root = { querySelector: () => null, ownerDocument: { defaultView: {} } };
  assert.equal(typeof mountHomeLayout(root), 'function');
  mountHomeLayout(root)();
});

test('static root and hydrated locale homes use the same fitted-row enhancement', () => {
  const input = '<html><head></head><body><time data-live-clock></time></body></html>';
  const output = staticHomeHtml(input);
  assert.equal((output.match(/src="\/site-home-layout.mjs"/g) || []).length, 1);
  assert.match(output, /<script src="\/site-home-layout.mjs" type="module"><\/script>/);
  assert.equal(staticHomeHtml(output), output);
  assert.match(readFileSync('app/(root)/page.tsx', 'utf8'), /<ReferenceHome[^>]+staticEntry/);
  const client = readFileSync('app/home-client.tsx', 'utf8');
  assert.match(client, /mountHomeLayout\(rootRef\.current\)/);
  assert.match(client, /dispose\?\.\(\)/);
  assert.match(client, /\[locale, content\]/);
  assert.doesNotMatch(home, /["']use client["']/);
  assert.match(home, /categoryPool\(ordered, "technology"\)/);
  assert.match(home, /data-height-matched-list/);
  assert.match(home, /data-height-reference/);
  assert.match(css, /\.ref-two-column\s*\{[^}]*align-items:\s*start;/);
  assert.match(css, /\.ref-rank-story\[hidden\]\s*\{\s*display:\s*none;/);
  assert.doesNotMatch(css.match(/\.ref-rank-list\s*\{([^}]*)\}/)[1], /height|overflow|line-clamp/);
});

test('three named homepage desks share four desktop cards, consistent media and responsive 1/2/4 columns', () => {
  assert.match(home, /categoryPool\(ordered, desk\.category, 4\)/);
  assert.match(home, /className="ref-archive-grid ref-desk-grid"/);
  assert.match(css, /\.ref-desk-grid\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(css, /@media \(min-width: 40rem\)\s*\{\s*\.ref-desk-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /@media \(min-width: 64rem\)\s*\{\s*\.ref-desk-grid\s*\{\s*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/);
  assert.match(css, /\.ref-card-image,\s*\.ref-archive-image\s*\{\s*aspect-ratio:\s*16 \/ 10;/);
  assert.match(css, /\.ref-archive-grid\s*\{[^}]*gap:\s*2rem 1\.5rem;/);
});

test('innovation uses a large lead and the same compact numbered rows, without thumbnail cards', () => {
  const section = home.slice(home.indexOf('{deep ? <section'), home.indexOf('{additionalDesks.filter'));
  assert.match(section, /ref-innovation-feature/);
  assert.match(section, /text.relatedReports/);
  assert.match(section, /<article className="ref-innovation-feature" data-category-section="innovation">/);
  assert.match(section, /data-related-reports=\{deep.slug\}/);
  assert.match(section, /innovationRelated.map\(\(story, index\) => <RankedStory/);
  assert.doesNotMatch(section, /ref-scan-image|variant="thumbnail"|innovationStories.slice/);
  assert.match(home, /category=\{copy.categoryNames\[story.category\]\}/);
});

test('related stories keep same-desk priority, then evidence-backed technology and other topics, with no duplicates', () => {
  const lead = { slug: 'lead', lang: 'en', category: 'innovation', tags: ['Automotive industry', 'Public policy'] };
  const story = (slug, category, tags, lang = 'en') => ({ slug, lang, category, tags });
  const unrelated = story('random', 'technology', ['Artificial intelligence']);
  const broad = story('broad', 'business', ['Public policy']);
  const vehicle = story('vehicle', 'technology', ['Vehicle regulation']);
  const energy = story('ev', 'energy', ['Electric vehicles']);
  const same = story('innovation', 'innovation', ['Other subject']);
  const foreign = story('foreign', 'technology', ['Vehicle regulation'], 'fr');
  const result = innovationRelatedStories([unrelated, broad, energy, lead, vehicle, foreign, same, vehicle], lead);
  assert.deepEqual(result, [same, vehicle, energy]);
  assert.equal(relatedStoryScore(lead, broad), 0);
  assert.equal(relatedStoryScore(lead, unrelated), 0);
  assert.ok(relatedStoryScore(lead, vehicle) > 0);
  assert.deepEqual(innovationRelatedStories([unrelated, broad, lead], lead), []);
  assert.deepEqual(innovationRelatedStories([vehicle], undefined), []);
});

test('all five editions have four real related items, four stories per named desk and twelve archive cards', () => {
  const articles = JSON.parse(readFileSync('content/generated/articles.json', 'utf8'));
  const selectedKeys = [];
  for (const locale of ['zh-CN', 'zh-TW', 'en', 'ru', 'fr']) {
    const ordered = articles.filter(story => story.lang === locale).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
    const lead = categoryPool(ordered, 'innovation', 1)[0];
    const related = innovationRelatedStories(ordered, lead);
    assert.equal(related.length, 4, locale);
    assert.equal(new Set([lead.slug, ...related.map(story => story.slug)]).size, 5);
    for (const story of related) {
      assert.equal(story.lang, locale);
      assert.ok(ordered.includes(story), 'Selections preserve real source objects and their true categories');
      assert.ok(story.category === 'innovation' || relatedStoryScore(lead, story) > 0);
    }
    selectedKeys.push(related.map(story => story.translationKey));
    for (const category of ['energy', 'current-affairs', 'work-life']) assert.equal(categoryPool(ordered, category, 4).length, 4, `${locale}/${category}`);
    assert.equal(ordered.slice(0, 12).length, 12);
  }
  for (const keys of selectedKeys) assert.deepEqual(keys, selectedKeys[0], 'Related subjects agree across all editions');
  assert.match(home, /ordered.slice\(0, 12\).map\(\(story\) => <ArchiveCard/);
  assert.match(home, /title=\{text.latestStories\} href="\/all-news\/"/);
});
