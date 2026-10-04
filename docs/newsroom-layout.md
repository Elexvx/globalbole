# Newsroom layout

The layout borrows structural conventions from [AP](https://apnews.com/), [The Guardian](https://www.theguardian.com/international) and [Financial Times](https://www.ft.com/): a dominant lead package, compact supporting coverage, ruled section boundaries, and restrained metadata. It does not copy their branding, colors, assets or article content.

- The homepage consumes stories once: one lead, two supporting stories, three short headlines, then remaining stories grouped under their actual subject. All six category links show real inventory counts, including zero. No popularity rankings or automated “editor's picks” claims are used.
- Category pages use a clear lead and subsequent news rows. The archive is a chronological list grouped by date, with category navigation. A single-page archive has no redundant pagination.
- Lead order in the document and on narrow screens is identical. Tablet layouts avoid fixed-width sidebars squeezing the main story. The existing brand palette, theme values and 32/24/20px desktop and 28/22/18px mobile heading roles are preserved.
- Cover frames retain proportional `object-fit: cover`; article body images retain their natural full proportions and source captions.

## Ticker

`public/site-ticker.mjs` owns the shared speed of **48 CSS pixels per second**. It measures the complete first group, including the trailing gap, and computes duration from distance. Exact-width copies produce the loop; duplicate headlines are excluded from the keyboard and accessibility sequence. Resize and font-load changes remeasure without changing speed. Hover, keyboard focus, the pause button and a hidden document stop motion; reduced-motion preference provides a stationary, horizontally scrollable list. Static root enhancement uses the same module without React hydration.

## Checks

Run `npm test`, `npm run lint`, `npm run build`, `npm run check:export`, and `node scripts/check-seo.mjs`. Browser checks must include all five languages, narrow and wide CSS viewports, pause/resume, reduced motion, navigation and measured movement over elapsed animation time. Identical durations alone do not prove identical speed.
