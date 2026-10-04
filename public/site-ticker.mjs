// One physical speed for every language, breakpoint and entry point. Duration
// comes from the rendered group width, including its trailing inter-group gap.
export const TICKER_SPEED_PX_PER_SECOND = 48;

export function tickerMetrics(distance, viewportWidth) {
  if (!Number.isFinite(distance) || distance <= 0 || !Number.isFinite(viewportWidth)) return null;
  return {
    durationMs: distance / TICKER_SPEED_PX_PER_SECOND * 1000,
    copies: Math.max(2, Math.ceil(Math.max(0, viewportWidth) / distance) + 1),
  };
}

export function tickerOffset(currentTime, durationMs) {
  if (!Number.isFinite(currentTime) || !Number.isFinite(durationMs) || durationMs <= 0) return 0;
  return ((currentTime % durationMs) + durationMs) % durationMs / 1000 * TICKER_SPEED_PX_PER_SECOND;
}

export function tickerIsPaused({ userPaused, hovered, focused, reducedMotion, hidden }) {
  return Boolean(userPaused || hovered || focused || reducedMotion || hidden);
}

const activeTickers = new WeakMap();

export function mountTicker(root) {
  if (activeTickers.has(root)) return activeTickers.get(root);
  const viewport = root.querySelector('[data-ticker-viewport]');
  const track = root.querySelector('[data-ticker-track]');
  const group = root.querySelector('[data-ticker-group]');
  const toggle = root.querySelector('[data-ticker-toggle]');
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  if (!viewport || !track || !group || !toggle || !win || typeof track.animate !== 'function') return () => {};

  const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    userPaused: root.dataset.tickerUserPaused === 'true',
    hovered: win.matchMedia('(hover: hover)').matches && root.matches(':hover'),
    focused: root.contains(doc.activeElement),
    reducedMotion: motion.matches,
    hidden: doc.hidden,
  };
  let animation;
  let distance = 0;
  let durationMs = 0;
  let copies = 0;
  let frame = 0;
  let disposed = false;
  const listeners = [];
  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  };
  const removeCopies = () => {
    track.querySelectorAll('[data-ticker-clone]').forEach(clone => clone.remove());
  };

  function syncPlayback() {
    const paused = tickerIsPaused(state);
    root.dataset.tickerPaused = String(paused);
    root.dataset.tickerUserPaused = String(state.userPaused);
    const label = state.userPaused ? toggle.dataset.resumeLabel : toggle.dataset.pauseLabel;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    if (animation) paused ? animation.pause() : animation.play();
  }

  function measure() {
    frame = 0;
    if (disposed) return;
    const nextDistance = group.getBoundingClientRect().width;
    const metrics = tickerMetrics(nextDistance, viewport.clientWidth);
    root.dataset.tickerMotion = state.reducedMotion ? 'reduced' : 'auto';
    if (!metrics || !group.children.length || state.reducedMotion) {
      animation?.cancel();
      animation = undefined;
      removeCopies();
      copies = 0;
      toggle.hidden = true;
      delete root.dataset.tickerReady;
      syncPlayback();
      return;
    }
    if (animation && nextDistance === distance && metrics.copies === copies) {
      syncPlayback();
      return;
    }
    const offset = tickerOffset(animation?.currentTime ?? 0, durationMs) % nextDistance;
    animation?.cancel();
    removeCopies();
    distance = nextDistance;
    durationMs = metrics.durationMs;
    copies = metrics.copies;
    for (let index = 1; index < copies; index++) {
      const clone = group.cloneNode(true);
      clone.setAttribute('data-ticker-clone', '');
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('data-ticker-group');
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      // Mouse users can follow a visible duplicate headline, while keyboard and
      // screen-reader users encounter each headline exactly once.
      clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(node => node.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
    viewport.scrollLeft = 0;
    animation = track.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${distance}px)` }],
      { duration: durationMs, iterations: Infinity, easing: 'linear' },
    );
    animation.currentTime = offset / TICKER_SPEED_PX_PER_SECOND * 1000;
    root.dataset.tickerReady = 'true';
    toggle.hidden = false;
    syncPlayback();
  }

  function scheduleMeasure() {
    if (!disposed && !frame) frame = win.requestAnimationFrame(measure);
  }

  listen(toggle, 'click', () => { state.userPaused = !state.userPaused; syncPlayback(); });
  listen(root, 'pointerenter', event => { if (event.pointerType !== 'touch') { state.hovered = true; syncPlayback(); } });
  listen(root, 'pointerleave', () => { state.hovered = false; syncPlayback(); });
  listen(root, 'focusin', event => {
    state.focused = true;
    syncPlayback();
    if (animation && group.contains(event.target)) {
      // Originals may have moved out of view by the time a keyboard user tabs
      // into the strip. Reveal the focused headline in its stationary group.
      animation.currentTime = 0;
      const item = event.target.getBoundingClientRect();
      const view = viewport.getBoundingClientRect();
      if (item.left < view.left) viewport.scrollLeft += item.left - view.left;
      else if (item.right > view.right) viewport.scrollLeft += item.right - view.right;
    }
  });
  listen(root, 'focusout', event => {
    state.focused = root.contains(event.relatedTarget);
    if (!state.focused) viewport.scrollLeft = 0;
    syncPlayback();
  });
  listen(doc, 'visibilitychange', () => { state.hidden = doc.hidden; syncPlayback(); });
  listen(motion, 'change', () => { state.reducedMotion = motion.matches; measure(); });
  listen(win, 'pageshow', () => { state.hidden = doc.hidden; scheduleMeasure(); });
  listen(win, 'resize', scheduleMeasure);
  if (doc.fonts) {
    doc.fonts.ready.then(scheduleMeasure);
    listen(doc.fonts, 'loadingdone', scheduleMeasure);
  }
  const observer = win.ResizeObserver ? new win.ResizeObserver(scheduleMeasure) : null;
  observer?.observe(group);
  observer?.observe(viewport);
  measure();

  const dispose = () => {
    disposed = true;
    win.cancelAnimationFrame(frame);
    animation?.cancel();
    observer?.disconnect();
    listeners.forEach(remove => remove());
    removeCopies();
    toggle.hidden = true;
    delete root.dataset.tickerReady;
    delete root.dataset.tickerPaused;
    delete root.dataset.tickerMotion;
    activeTickers.delete(root);
  };
  activeTickers.set(root, dispose);
  return dispose;
}

// Only the static entry initializes itself. Hydrated routes mount after React's
// commit, preventing DOM mutations during hydration and cleaning up on changes.
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-news-ticker][data-ticker-static]').forEach(mountTicker);
}
