# Visual QA · Politica reference adaptation · 2026-09-08

## Scope

- Reference: `https://politica.xocoweb.workers.dev/`
- Implementation: `http://localhost:4173/zh-CN/`
- State: homepage, light/default theme, top of page, live clock enabled.
- Viewport: 1280 × 720 CSS px, devicePixelRatio 2.
- The reference site's visual hierarchy, header proportions, ticker, three-column lead, editorial sections, newsletter block, archive and footer were reproduced. Local Markdown content, local optimized images and the Global Bole News identity replace reference data and assets.
- Source capture: in-app browser tab 11; implementation capture: in-app browser tab 14. The browser bridge emitted both screenshots during the final QA pass; it does not expose a persistent screenshot path.

## Layout comparison

Reference measurements at 1280 CSS px:

- Header: 228 px.
- Lead section: top 228 px, height 1,115 px.
- Technology / business section: top 1,407 px, height 802 px.
- Innovation section: top 2,273 px, height 737 px.
- Six-desk section: top 3,073 px, height 712 px.
- Technology detail section: top 3,849 px, height 1,001 px.
- Newsletter section: top 4,850 px, height 264 px.
- Archive section: top 5,178 px, height 1,128 px.

Implementation measurements at the same viewport:

- Header: 231 px.
- Lead section: top 231 px, height 1,150 px.
- Technology / business section: top 1,445 px, height 764 px.
- Innovation section: top 2,273 px, height 683 px.
- Six-desk section: top 3,020 px, height 712 px.
- Technology detail section: top 3,636 px, height 1,073 px.
- Newsletter section: top 4,708 px, height 274 px.
- Archive section: top 5,047 px, height 1,071 px.
- Footer: top 6,213 px, height 373 px; final document height 6,586 px.
- Document width: `scrollWidth === clientWidth` at 1280 CSS px; no horizontal overflow.

The small height shifts are caused by adapted Chinese and multilingual line wrapping. The grid ordering, ratios, rules and primary section cadence match the reference structure.

## Functional QA

- `npm run lint`: passed.
- `npm test`: 5/5 passed.
- `npm run build`: passed; static generation completed for 1,067 pages.
- `npm run check:export`: passed; 1,065 HTML pages and 67,595 local references verified, with five languages, Markdown tables and no editor routes.
- English homepage: loaded with `lang="en"`, translated title/copy, local RSS link and article links.
- English article: `/en/post/en-digital-services/` loaded with localized title, Markdown body, headings, list and table.
- Traditional Chinese, Russian and French homepages loaded with localized route, title, headings, category names and RSS feed paths.
- Local image URLs were checked in the browser; the visible feature image loaded, and lazy images remained non-broken while below the fold.
- Static frontend contract remains Markdown-folder driven; no editor page or backend dependency was added.

## Responsive and scale QA

- Global scale uses `font-size: max(100%, calc(100vw / 90))` and the fluid wide layout cap, preserving the existing 320–1,024 px readable minimum while allowing 4K/8K canvases to expand.
- Responsive grid rules cover the source breakpoints at 40rem, 48rem and 64rem; mobile defaults stack the lead, cards, two-column sections and six desks.
- Images use local responsive variants and `aspect-ratio`; Markdown tables and code blocks retain bounded horizontal scrolling instead of expanding the page.
- Desktop overflow check passed at 1280 CSS px for the home and article routes. The current in-app browser surface exposes a fixed 1280 CSS viewport, so a new 390 px screenshot could not be captured in this final pass; the mobile behavior is covered by the responsive CSS contract and existing article overflow checks.

## Findings

- P0: none.
- P1: none.
- P2: none blocking delivery. The reference content is intentionally replaced with Global Bole News technology, innovation and business content, so copy and imagery are adapted rather than copied.

## Comparison history · empty-space refinement

- Earlier finding: the desktop `.ref-beats` section had a fixed `min-height: 44.5rem`, while the adapted Chinese content finished much earlier; the remaining lower half of the section was visible blank space.
- Fix: removed the fixed desktop minimum so the section follows its six content columns and retains only its normal content padding.
- Revised evidence: at the same 1280 × 720 CSS px viewport, the section changed from 712 px to 552 px; the following Technology section moved from top 3,796 px to 3,636 px, with `scrollWidth === clientWidth` still true. The new public deployment uses the same CSS after the final build.

## Result

final result: passed
