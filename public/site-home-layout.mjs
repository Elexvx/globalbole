// Fit a chronological prefix of whole rows; never crop a headline or stretch
// sparse rows to manufacture height. Coordinates retain subpixel precision.
export function completeRowCount(bottoms, boundary) {
  if (!Number.isFinite(boundary)) return 0;
  let count = 0;
  for (const bottom of bottoms) {
    if (!Number.isFinite(bottom) || bottom > boundary) break;
    count++;
  }
  return count;
}

const activeHomes = new WeakMap();

export function mountHomeLayout(root) {
  if (activeHomes.has(root)) return activeHomes.get(root);
  const pair = root.querySelector('[data-height-matched-columns]');
  const list = pair?.querySelector('[data-height-matched-list]');
  const reference = pair?.querySelector('[data-height-reference]');
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  if (!list || !reference || !win) return () => {};

  const desktop = win.matchMedia('(min-width: 64rem)');
  let frame = 0;
  let disposed = false;
  const listeners = [];
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  };

  function measure() {
    frame = 0;
    if (disposed) return;
    const rows = Array.from(list.children);
    // Restore before measuring, including rows hidden at the previous width.
    // All reads and writes finish synchronously before the browser paints.
    rows.forEach(row => { row.hidden = false; });
    if (!desktop.matches) {
      delete list.dataset.fittedCount;
      return;
    }
    const boundary = reference.getBoundingClientRect().bottom;
    const count = completeRowCount(rows.map(row => row.getBoundingClientRect().bottom), boundary);
    rows.forEach((row, index) => { row.hidden = index >= count; });
    list.dataset.fittedCount = String(count);
  }

  function scheduleMeasure() {
    if (!disposed && !frame) frame = win.requestAnimationFrame(measure);
  }

  listen(win, 'resize', scheduleMeasure);
  listen(win, 'pageshow', scheduleMeasure);
  listen(desktop, 'change', measure);
  listen(reference, 'load', scheduleMeasure, true);
  if (doc.fonts) {
    doc.fonts.ready.then(scheduleMeasure);
    listen(doc.fonts, 'loadingdone', scheduleMeasure);
  }
  const observer = win.ResizeObserver ? new win.ResizeObserver(scheduleMeasure) : null;
  observer?.observe(reference);
  observer?.observe(pair);
  measure();

  const dispose = () => {
    disposed = true;
    win.cancelAnimationFrame(frame);
    observer?.disconnect();
    listeners.forEach(remove => remove());
    Array.from(list.children).forEach(row => { row.hidden = false; });
    delete list.dataset.fittedCount;
    activeHomes.delete(root);
  };
  activeHomes.set(root, dispose);
  return dispose;
}

// The static root has no React hydration. Localized routes mount only after
// React commits, so measurements never mutate their server-rendered hydration.
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-home-layout-static]').forEach(mountHomeLayout);
}
