import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mountTicker, tickerIsPaused, tickerMetrics, tickerOffset, TICKER_SPEED_PX_PER_SECOND } from '../public/site-ticker.mjs';
import { staticHomeHtml } from '../scripts/finalize-static-home.mjs';

test('translated widths and mobile/desktop viewports always travel at 48 pixels per second', () => {
  assert.equal(TICKER_SPEED_PX_PER_SECOND, 48);
  for (const width of [1423.25, 1780, 2806.5, 3312.75, 4096]) {
    for (const viewport of [270, 390, 1024, 1680]) {
      const metrics = tickerMetrics(width, viewport);
      assert.equal(width / (metrics.durationMs / 1000), 48);
      assert.equal(tickerOffset(500, metrics.durationMs), 24);
      assert.ok((metrics.copies - 1) * width >= viewport);
    }
  }
});

test('complete groups include the seam gap, repeat enough times and wrap without drift', () => {
  const distance = 320.5; // Includes the source group’s trailing padding/gap.
  const { durationMs, copies } = tickerMetrics(distance, 1440);
  assert.equal(copies, 6);
  assert.equal(tickerOffset(durationMs, durationMs), 0);
  assert.ok(Math.abs(tickerOffset(durationMs * 100 + 250, durationMs) - 12) < 1e-9);
  assert.equal(tickerMetrics(0, 500), null);
  assert.equal(tickerMetrics(NaN, 500), null);
  assert.equal(tickerMetrics(100, Infinity), null);
  assert.equal(tickerOffset(null, durationMs), 0);
});

test('manual pause, pointer, focus, reduced motion and background tabs all stop motion', () => {
  const state = { userPaused: false, hovered: false, focused: false, reducedMotion: false, hidden: false };
  assert.equal(tickerIsPaused(state), false);
  for (const key of Object.keys(state)) assert.equal(tickerIsPaused({ ...state, [key]: true }), true);
});

function events(target = {}) {
  const handlers = new Map();
  return Object.assign(target, {
    addEventListener(type, fn) { if (!handlers.has(type)) handlers.set(type, new Set()); handlers.get(type).add(fn); },
    removeEventListener(type, fn) { handlers.get(type)?.delete(fn); },
    emit(type, props = {}) { handlers.get(type)?.forEach(fn => fn({ target: this, ...props })); },
    listenerCount() { return [...handlers.values()].reduce((total, list) => total + list.size, 0); },
  });
}

function fixture({ width = 1000, viewportWidth = 600, reduced = false } = {}) {
  const animations = [];
  const frames = new Map();
  let nextFrame = 0;
  let resize;
  let fontReady;
  const motion = events({ matches: reduced });
  const fonts = events({ ready: { then(fn) { fontReady = fn; } } });
  const win = events({
    matchMedia: query => query.includes('reduced-motion') ? motion : { matches: false },
    requestAnimationFrame(fn) { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() { this.disconnected = true; } },
  });
  const doc = events({ defaultView: win, fonts, hidden: false, activeElement: null });
  const link = { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, getBoundingClientRect: () => ({ left: 700, right: 900 }) };
  const clones = [];
  const group = {
    children: [link],
    getBoundingClientRect: () => ({ width }),
    contains: node => node === link,
    cloneNode() {
      const copyLink = { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } };
      return {
        attrs: {}, link: copyLink,
        setAttribute(key, value) { this.attrs[key] = value; },
        removeAttribute(key) { delete this.attrs[key]; },
        querySelectorAll: selector => selector === '[id]' ? [] : [copyLink],
        remove() { clones.splice(clones.indexOf(this), 1); },
      };
    },
  };
  const viewport = { clientWidth: viewportWidth, scrollLeft: 0, getBoundingClientRect: () => ({ left: 0, right: viewportWidth }) };
  const track = {
    querySelectorAll: () => [...clones],
    appendChild: clone => clones.push(clone),
    animate(keyframes, timing) {
      const animation = {
        keyframes, timing, currentTime: 0, playState: 'running',
        pause() { this.playState = 'paused'; },
        play() { this.playState = 'running'; },
        cancel() { this.playState = 'idle'; },
      };
      animations.push(animation);
      return animation;
    },
  };
  const toggle = events({
    hidden: true, dataset: { pauseLabel: 'Pause news ticker', resumeLabel: 'Resume news ticker' }, attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; },
  });
  const root = events({
    dataset: {}, ownerDocument: doc,
    querySelector: selector => ({ '[data-ticker-viewport]': viewport, '[data-ticker-track]': track, '[data-ticker-group]': group, '[data-ticker-toggle]': toggle })[selector],
    contains: node => node === link || node === toggle,
    matches: () => false,
  });
  return {
    root, toggle, group, viewport, animations, clones, motion, fonts, doc, win, link,
    setWidth(value) { width = value; },
    resize() { resize(); },
    fontReady() { fontReady(); },
    flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()); },
  };
}

test('runtime measures exact width, hides duplicate links from assistive technology and preserves phase on resize/fonts', () => {
  const f = fixture({ width: 1000.5, viewportWidth: 1440 });
  const dispose = mountTicker(f.root);
  assert.equal(mountTicker(f.root), dispose, 'Repeated mounting is idempotent');
  assert.equal(f.animations.length, 1);
  assert.equal(f.animations[0].timing.duration, 1000.5 / 48 * 1000);
  assert.deepEqual(f.animations[0].keyframes[1], { transform: 'translateX(-1000.5px)' });
  assert.equal(f.clones.length, 2);
  for (const clone of f.clones) {
    assert.equal(clone.attrs['aria-hidden'], 'true');
    assert.equal(clone.link.attrs.tabindex, '-1');
  }
  f.animations[0].currentTime = 2000;
  f.setWidth(1200);
  f.resize(); f.fontReady(); f.fonts.emit('loadingdone'); f.flush();
  assert.equal(f.animations.length, 2, 'Remeasurement is debounced');
  assert.equal(f.animations[1].currentTime, 2000, 'The existing pixel offset survives a font/width change');
  assert.equal(f.animations[1].timing.duration, 25000);
  f.viewport.clientWidth = 2500;
  f.win.emit('resize'); f.flush();
  assert.equal(f.clones.length, 3, 'Short strips get enough copies to fill a large viewport');
  dispose();
  assert.equal(f.animations.at(-1).playState, 'idle');
  assert.equal(f.clones.length, 0);
  assert.equal(f.toggle.hidden, true);
  for (const target of [f.root, f.toggle, f.doc, f.win, f.motion, f.fonts]) assert.equal(target.listenerCount(), 0);
  f.fontReady(); f.flush();
  assert.equal(f.animations.length, 3, 'Late font completion cannot restart a disposed ticker');
});

test('runtime pauses on hover/focus/visibility and keeps a manual pause across remounts', () => {
  const f = fixture();
  let dispose = mountTicker(f.root);
  const animation = f.animations[0];
  f.root.emit('pointerenter', { pointerType: 'touch' });
  assert.equal(animation.playState, 'running');
  f.root.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(animation.playState, 'paused');
  f.root.emit('pointerleave');
  assert.equal(animation.playState, 'running');
  animation.currentTime = 3000;
  f.root.emit('focusin', { target: f.link });
  assert.equal(animation.playState, 'paused');
  assert.equal(animation.currentTime, 0, 'Focused originals become visible even late in the loop');
  assert.equal(f.viewport.scrollLeft, 300);
  f.root.emit('focusout', { relatedTarget: null });
  assert.equal(f.viewport.scrollLeft, 0);
  assert.equal(animation.playState, 'running');
  f.doc.hidden = true; f.doc.emit('visibilitychange');
  assert.equal(animation.playState, 'paused');
  f.doc.hidden = false; f.doc.emit('visibilitychange');
  assert.equal(animation.playState, 'running');
  f.toggle.emit('click');
  assert.equal(animation.playState, 'paused');
  assert.equal(f.toggle.attrs['aria-label'], 'Resume news ticker');
  dispose(); dispose = mountTicker(f.root);
  assert.equal(f.animations.at(-1).playState, 'paused');
  f.toggle.emit('click');
  assert.equal(f.animations.at(-1).playState, 'running');
  assert.equal(f.toggle.attrs['aria-label'], 'Pause news ticker');
  dispose();
});

test('reduced motion is static and scrollable from first paint and responds to preference changes', () => {
  const f = fixture({ reduced: true });
  const dispose = mountTicker(f.root);
  assert.equal(f.animations.length, 0);
  assert.equal(f.clones.length, 0);
  assert.equal(f.toggle.hidden, true);
  assert.equal(f.root.dataset.tickerMotion, 'reduced');
  assert.equal(f.root.dataset.tickerReady, undefined);
  f.motion.matches = false; f.motion.emit('change');
  assert.equal(f.animations.length, 1);
  assert.equal(f.animations[0].playState, 'running');
  f.motion.matches = true; f.motion.emit('change');
  assert.equal(f.animations[0].playState, 'idle');
  assert.equal(f.clones.length, 0);
  assert.equal(f.toggle.hidden, true);
  dispose();
});

test('static root uses one native module without adding a client boundary or React hydration', () => {
  const input = '<html><head></head><body><time data-live-clock></time></body></html>';
  const output = staticHomeHtml(input);
  assert.equal((output.match(/src="\/site-ticker.mjs"/g) || []).length, 1);
  assert.match(output, /<script src="\/site-ticker.mjs" type="module"><\/script>/);
  assert.equal(staticHomeHtml(output), output);
  assert.doesNotMatch(readFileSync('components/wire-ticker.tsx', 'utf8'), /["']use client["']/);
  assert.doesNotMatch(output, /_next|__next_f/);
});
