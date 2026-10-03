# Performance audit procedure

## Acceptance and limits

The requested acceptance service is [Google PageSpeed Insights](https://pagespeed.web.dev/), using the live `https://www.globalbole.com` origin. Test mobile and desktop separately on the homepage, the Chinese archive and at least one full news article. Record all four scored Lighthouse categories: Performance, Accessibility, Best Practices and SEO, plus the agentic-browsing check results. Do not silently substitute localhost scores for official PSI results.

Scores are observations of a particular run, not a permanent service guarantee. PSI lab data is distinct from its CrUX real-user data; field data reflects a rolling 28-day period and may be unavailable for low-traffic pages. Automated accessibility scores do not replace keyboard, screen-reader and visual checks. See [Google's PSI explanation](https://developers.google.com/speed/docs/insights/v5/about) and [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

## Repeatable official API audit

After content generation, run:

```sh
npm run content
npm run audit:pagespeed
# Or choose explicit existing paths:
npm run audit:pagespeed -- / /zh-CN/all-news/
```

The script uses the official Google PSI v5 API and tests both device strategies. It preserves raw reports, Lighthouse version, fetch time, environment, throttling/configuration, each category score and field-data availability under ignored `qa-evidence/pagespeed/`. Optional `PAGESPEED_API_KEY` is read only from the current process environment; do not commit or print credentials. The unauthenticated shared quota may be exhausted. A 429, runtime error, missing score or incomplete audit fails the command instead of producing a passing score. When API quota is unavailable, run the same URLs in the PSI webpage and keep each actual result URL and device tab.

Before/after audits must use the same target route and strategy. Repeat unusual results and record run variance. Preserve deployment commit SHA independently of the report timestamp. A Git push, a READY deployment, a public page fetch and an audit pass are four separate checks.

## Implemented delivery improvements

- Cover processing now includes local JPEG and PNG news media as well as earlier WebP reference media
- Responsive WebP derivatives reserve natural dimensions, provide small thumbnail sizes and preserve original-image proportions. Cover framing stays `object-fit: cover`; original body charts and photos remain unchanged and fully visible
- Derivative names include a hash of source bytes and transformation/encoder versions, making year-long immutable caching safe when content or recipes change
- Section links meet the 24px touch-target minimum, and archive/issue/featured card headings follow a valid heading hierarchy
- Archive headings and story cards are prerendered in HTML, with query pagination isolated as a client enhancement to avoid shifting the entire page after load
- Body images reserve known dimensions and load lazily below the article header
- News links load their target route on navigation instead of eagerly prefetching every visible archive/header/footer link; explicit prefetch overrides remain available
- Route views render synchronously during static export, avoiding hidden streaming shells that can reveal the whole main section after the footer has painted. Article Markdown is prerendered on the server; the browser loads the parser only if the optional public API supplies a changed body or locale
- Canonicals, structured data and crawlable source notes are checked independently of Lighthouse scores

## Pre-publication observations, 2026-10-03

Against the live source-image bytes, the five 832-pixel cover derivatives total 328,426 bytes instead of 1,385,066 bytes (about 76% less). These are comparable cover-file bytes, not total page transfer or a measured PSI improvement. Larger versions remain available for larger/high-density screens; original body images are retained.

The unauthenticated public PSI API returned quota exhaustion. The official homepage baseline was subsequently obtained through the PSI webpage; see the verified report below. Chromium with a desktop shell could not start in the restricted execution environment. Google's dedicated headless-shell test build subsequently enabled local Lighthouse diagnostics without changing browser security settings; direct production HTTPS audits hit an untrusted proxy certificate and were stopped without bypassing it.

### Local diagnostic baseline (not PSI acceptance)

- Lighthouse 13.5.0; official Chrome for Testing headless-shell 154.0.8037.92
- Clean browser profile per run; default Lighthouse mobile simulated throttling and desktop preset
- Baseline source: Git commit `5f6af7d0b6f9fdd3ae4a99bfc7e9cd452142072d`
- Local static HTTP server with gzip/Brotli content compression. This does not reproduce Vercel's network, HTTP/2, edge cache or real-user environment
- Routes: `/`, `/zh-CN/all-news/`, `/zh-CN/post/zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/`

| Route | Device | Performance | Accessibility | Best practices | SEO |
|---|---|---:|---:|---:|---:|
| Homepage | Mobile | 88 | 95 | 100 | 100 |
| Homepage | Desktop | 100 | 95 | 100 | 100 |
| Archive | Mobile | 56 | 98 | 100 | 100 |
| Archive | Desktop | 74 | 98 | 100 | 100 |
| Article | Mobile | 89 | 100 | 100 | 100 |
| Article | Desktop | 100 | 100 | 100 | 100 |

The baseline identified undersized homepage section links, skipped archive heading levels and a client-only archive that shifted its main content after load (mobile CLS 0.586; desktop 0.445). All are addressed in the patch. Final after-results must be rerun against the final build; add official PSI result URLs only after successful live audits. The score of 100 in the automated SEO category does not imply complete indexing or rich-result eligibility, hence the separate canonical/schema/export checks.

## Official PageSpeed baseline, 2026-10-03

[Google PSI homepage report](https://pagespeed.web.dev/analysis/https-www-globalbole-com/8jhpapfjma?form_factor=mobile), collected at 19:22:35–36 UTC before publication. Both reports use Lighthouse 13.5.0 and Google's HeadlessChrome 153.0.8010.36.

| Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 97 | 95 | 100 | 100 | 2.5 s | 30 ms | 0 |
| Desktop | 100 | 95 | 100 | 100 | 0.6 s | 0 ms | 0.001 |

PSI reports no available real-user data. Its additional agentic-browsing category passes both audited checks (100). Mobile settings: simulated 150ms RTT / 1638.4 Kbps, 412×823 at DPR 1.75, calibrated CPU multiplier 1.2. Desktop: 40ms / 10240 Kbps, 1350×940 at DPR 1, CPU multiplier 1. The complete raw Lighthouse JSON was extracted from the same public saved PSI report; this does not rely on the quota-limited public API.

### Final local diagnostic run before publication

| Route | Device | Performance | Accessibility | Best practices | SEO |
|---|---|---:|---:|---:|---:|
| Homepage | Mobile | 96 | 100 | 100 | 100 |
| Homepage | Desktop | 100 | 100 | 100 | 100 |
| Archive | Mobile | 96 | 100 | 100 | 100 |
| Archive | Desktop | 100 | 100 | 100 | 100 |
| Article | Mobile | 97 | 100 | 100 | 100 |
| Article | Desktop | 100 | 100 | 100 | 100 |

Same local server/tool configuration as the baseline. All three mobile pages have CLS 0; desktop reports 0.001. These measurements establish improvements and catch regressions, but the production PSI after-report remains the acceptance result.

### Live redirect verification

The first live deployment exposed a hosting-specific difference from permissive local route matching: Vercel normalizes extensionless requests to a trailing slash before applying custom redirects. Sources must include that slash. The redirect regression tests now use strict matching after normalization, and final acceptance includes real 308 responses on the production host. Static compatibility pages also retain correct canonical/noindex metadata as a fallback.

The first live after-run exposed an additional static-export edge: an asynchronous route view placed prerendered archive content in a hidden React streaming slot. Presence of headings in source HTML alone was insufficient. Canonical export checks now reject hidden streaming slots and client-rendering bailouts across every localized page; route views are synchronous and legacy query pagination is handled after mounting without suspending the archive.

### Root entry: progressive enhancement rather than full hydration

The canonical `/` document is a static reading/navigation surface. Its only active widget is the clock; links, the mobile details/summary menu, ticker animation, images, RSS and footer icons are native HTML/CSS. Its exported document now keeps all content, styles, metadata, JSON-LD and image preloads while using a small deferred clock script instead of bootstrapping the entire Next/React runtime. The clock uses cached Intl formatters, the visitor's local timezone, immediate updates and visibility/history restoration. The React clock and RSC route remain available for any client-side navigation to `/`; localized routes retain the full application, its localized navigation, search and theme controls.

This is the same delivery path for every visitor and user agent. It does not hide or omit content to change audit results. The export step checks an exact client-module allowlist and rejects pending streaming content or unknown scripts, so adding a new interactive root feature requires deliberate review instead of silently breaking it. Root HTML fell from approximately 265 KB to 93 KB, with one small application script. Public PageSpeed and browser interaction checks remain required after deployment.

## Verified production checkpoint: 2026-10-03, commit 0123ac0

Vercel's native Git deployment was READY and the production `build-info.json` served commit `0123ac00b74082f5ea145fd97489760e0519482f` before these reports were started. All results below come from Google's saved PSI reports, Lighthouse 13.5.0 / HeadlessChromium 153.0.8010.36, captured at 20:23 UTC. The homepage job initially displayed a loading state for several minutes but the original report subsequently completed; it was not replaced with a higher-scoring sample.

| Route | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Homepage | Mobile | 100 | 100 | 100 | 100 | 1.2 s | 0 ms | 0 |
| Homepage | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 ms | 0 |
| Archive | Mobile | 99 | 100 | 100 | 100 | 2.3 s | 10 ms | 0 |
| Archive | Desktop | 100 | 100 | 100 | 100 | 0.5 s | 50 ms | 0.001 |
| Article | Mobile | 99 | 100 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Article | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 30 ms | 0.001 |

- [Homepage report](https://pagespeed.web.dev/analysis/https-www-globalbole-com/h89sxzocw0?form_factor=mobile)
- [Archive report](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-all-news/k9ta4ofdxe?form_factor=mobile)
- [Article report](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-post-zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/rrvho63iqo?form_factor=mobile)

Both agentic-browsing checks pass for all six observations. No CrUX data is available. The original production archive baseline was 56 mobile / 79 desktop with CLS 0.586 / 0.445 ([report](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-all-news/hal6feqqju?form_factor=mobile)); the original article was 94 mobile / 88 desktop ([report](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-post-zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/7cwq9dg995?form_factor=mobile)). These are representative routes, not a claim that every exported page has been audited or that future runs must remain 100.

Functional checks on the deployed checkpoint covered the root clock's browser-local timezone and history restoration; desktop search, matching-result navigation, Back, and theme change/restoration on localized routes; narrow-window homepage menu opening/closing via Enter, visible keyboard focus, archive navigation and working mobile search. The canonical root retains its existing native menu/clock surface; localized application controls remain available.

### Further image-transfer improvement

Photographs now offer an AVIF source with WebP fallback; existing crop/focal-point CSS stays on the actual image. Original licensed files are unchanged. Per-photo quality checks retain fine texture: AVIF SSIM exceeds the existing WebP at 480, 832, 960 and 1280 pixels. At 832 pixels, Dario falls from 23.3 to 17.9 KB, Hamburg 57.5 to 38.8 KB, petroleum 136.9 to 124.3 KB and EV charging 92.4 to 78.6 KB. These are file-byte comparisons, not PSI scores.

Body photographs use responsive candidates with the original URL retained as the fallback. The employment chart uses a full-resolution, lossless WebP candidate (144.9 to 46.9 KB) verified pixel-identical to the original PNG. No lossy AVIF is applied to charts. Picture sources and fallbacks have identical sizes hints, and tests reject duplicate image preload markup. A final production browser/source-selection check and PSI audit are required after publication of this additional image change.

## Production image-delivery checkpoint: commit 94925be

Native Git deployment `dpl_9o7QhwvreEC7gWqAVN4fdt31cToz` reached READY, its production aliases were assigned, and `build-info.json` returned `94925bec4d418b5285620820cf9a222b5757517b`. Live AVIF responses have `image/avif` content type and content-hashed immutable caching. Browser checks confirm selected AVIF sources, unchanged proportional cover geometry, complete body images, preserved original body fallback URLs, and the full-resolution chart's source notes. There are no duplicate fallback image preload tags.

Official PSI, captured 20:51 UTC with the same Lighthouse/browser versions:

| Route | Mobile P/A/BP/SEO | Desktop P/A/BP/SEO | Mobile LCP | Mobile TBT | Mobile CLS |
|---|---|---|---:|---:|---:|
| `/` | 100/100/100/100 | 100/100/100/100 | 1.1 s | 0 ms | 0 |
| `/zh-CN/all-news/` | 100/100/100/100 | 100/100/100/100 | 1.8 s | 10 ms | 0 |
| Anthropic article | 97/100/100/100 | 100/100/100/100 | 2.5 s | 40 ms | 0 |
| `/zh-CN/` | 97/100/100/92 | 100/100/100/92 | 2.5 s | 0 ms | 0 |
| `/en/` | 100/100/100/100 | 100/100/100/100 | 1.4 s | 50 ms | 0 |

- [Homepage](https://pagespeed.web.dev/analysis/https-www-globalbole-com/c5l0l4y44o?form_factor=mobile)
- [Archive](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-all-news/gazbm7e3re?form_factor=mobile)
- [Article](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-post-zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/v7e7yw5opd?form_factor=mobile)
- [Localized Chinese home](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN/4ifrwcm5pb?form_factor=mobile)
- [English home](https://pagespeed.web.dev/analysis/https-www-globalbole-com-en/7l8g7je8w9?form_factor=mobile)

All ten observations pass both agentic-browsing checks. There is no CrUX data. One bounded [repeat article run at 20:56 UTC](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-post-zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/z4ngxo5qod?form_factor=mobile) also scored 97, with LCP 2.6 s, TBT 60 ms and CLS 0. The image fetched in 40–60 ms, but the actual element-render-delay breakdown was 1.08–1.11 s. This is a repeatable regression from the preceding 99 result, not a claim of universal improvement. The next narrow diagnostic changes only the critical article cover's decoding hint to synchronous presentation; below-fold body images remain lazy/asynchronous. Its effect must be checked in a new production report.

### Deliberate canonical exception

The `/zh-CN/` SEO score of 92 is caused solely by Lighthouse's root-target canonical heuristic. The canonical `/` and localized homepage have identical editorial main content (173 text chunks and 33 main links). Canonical, sitemap and hreflang agree on one preferred URL rather than competing duplicate self-canonicals. [Chrome's canonical audit documentation](https://developer.chrome.com/docs/lighthouse/seo/canonical) explicitly acknowledges valid root-target cases can fail this check; [its implementation](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/canonical.js) tests URL shape, not content equivalence. [Google allows equivalent-content consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

The correct response is to preserve valid consolidation and disclose this audit exception, not alter indexing semantics purely to make a score green. Existing localized internal navigation favors `/zh-CN/`; selecting it instead as the preferred search landing page would require a deliberate coordinated canonical/sitemap/hreflang decision, not duplicate self-canonicals. Check Google-selected canonicals in Search Console once access is available.

### Route-specific client delivery

An isolated build comparison found that merely making the catch-all selector a Server Component saved only 120 gzip bytes, so that cosmetic change was rejected. Explicit localized home, archive and article entries instead retain the same URL set, metadata, JSON-LD, visible markup and client views while avoiding unrelated view code in each initial entry. Local modern-browser gzip estimates fall from 211,781 bytes to 202,060 for localized home, 199,543 for archive and 200,573 for articles (4.6–5.8% less; one fewer initial script). These are local bundle estimates, not measured PSI transfer totals. The canonical root remains unchanged. The remaining category/tag/info/issue routes keep their existing fallback.

Regression tests cover the exact localized static URL set, independent future pagination per locale, both route-parameter shapes for language changes, translation identity, single tag decoding and preserved server Markdown. Moving route files requires regenerating Next's generated route types before standalone typechecking; `npm run build && npm run lint && npm run check:export` is the integration order for this patch. Browser navigation between explicit and fallback routes remains a post-deployment gate.

### Critical-image experiment outcome

The isolated synchronous-decoding change (`5f5aae6`) did not remove the article's render delay: [PSI](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-post-zh-cn-anthropic-ipo-government-policy-risk-2026-10-03/tpgwok2c31?form_factor=mobile) measured 95 performance, LCP 2.7 s, TBT 120 ms, CLS 0, with 1.13 s element-render delay. The same run's SEO 92 came from a robots.txt fetch timeout, not a canonical change. Production still serves the correct article canonical and robots.txt.

Because the decoding hint showed no benefit, it is reverted. The critical article cover returns to its previously measured direct responsive WebP image/preload delivery instead of the AVIF picture path. Body AVIF, lossless charts, and the successful homepage/archive image improvements remain. This is a scoped recovery of the demonstrated article regression; further performance claims require a new report.

The populated [energy category audit](https://pagespeed.web.dev/analysis/https-www-globalbole-com-zh-CN-category-energy/cyc3rgcy76?form_factor=mobile), captured at 21:07 UTC on `5f5aae6`, scored 95/100/100/100 mobile with LCP 2.9 s, TBT 90 ms and CLS 0. Its image diagnostics identified 832px candidates where roughly 650px was sufficient. A 704px derivative fills the gap between 480 and 832 pixels for common mobile widths and densities, preserving the existing quality and full image rather than lowering fidelity to reach a score. This also benefits archive and article candidates.
