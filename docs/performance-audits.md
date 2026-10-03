# Performance audit procedure

## Acceptance and limits

The requested acceptance service is [Google PageSpeed Insights](https://pagespeed.web.dev/), using the live `https://www.globalbole.com` origin. Test mobile and desktop separately on the homepage, the Chinese archive and at least one full news article. Record all four Lighthouse categories: Performance, Accessibility, Best Practices and SEO. Do not silently substitute localhost scores for official PSI results.

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
- Locale route views are split at a client boundary with server prerendering retained. Article Markdown is prerendered on the server; the browser loads the parser only if the optional public API supplies a changed body or locale
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
