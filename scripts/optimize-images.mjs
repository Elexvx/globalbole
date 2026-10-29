import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { availableParallelism } from "node:os";
import path from "node:path";
import sharp from "sharp";

// Per-photo quality was checked against the existing WebP at display resolutions.
// Fine-detail scenes need higher AVIF quality; use that conservative default for
// future photographs rather than applying portrait settings to every subject.
const photoAvifQuality = {
  // October 29: reviewed product lettering and module detail at full-frame display size.
  "/news-media/2026-10-29/skhynix-ddr5-mrdimm.jpg": 60,
  // October 28: exact-path settings retain archival photo detail within the WebP budget.
  "/news-media/2026-10-28/meta-headquarters.jpg": 60,
  "/news-media/2026-10-28/microsoft-campus.jpg": 60,
  "/news-media/2026-10-28/renewable-windfarm.jpg": 60,
  "/news-media/2026-10-28/us-home-sale.jpg": 60,
  // October 26 archival portrait: reviewed full-frame against the WebP fallback.
  "/news-media/2026-10-26/brazil-lula-official.jpg": 55,
  // October 25 portrait, lettering and refinery detail: reviewed against full-frame WebP.
  // Exact paths preserve every earlier edition's encoder settings.
  "/news-media/2026-10-25/audi-gerd-walker.jpg": 55,
  "/news-media/2026-10-25/uk-hm-treasury-plaque.jpg": 50,
  "/news-media/2026-10-25/varopreem-cressier-refinery.jpg": 60,
  // October 24 photos: full-frame review retains tank/sign and equipment detail.
  // Exact paths keep this transfer-budget adjustment isolated to the new issue.
  "/news-media/2026-10-24/oil-supply.jpg": 60,
  "/news-media/2026-10-24/fuel-cell-power.jpg": 60,
  // October 23 NERSC photo: full-frame 1280px review preserves rack detail.
  // Scope by exact path so older photographs with the same stem are unchanged.
  "/news-media/2026-10-23/datacenter.jpg": 59,
  // October 20 archival photos: retain full-frame detail within the WebP budget.
  "nvidia-headquarters-2018": 60,
  "spr-nederland-doe-2014": 60,
  // October 19 archival station: restrained quality preserves the sign and
  // full frame while avoiding a transfer-size regression on low-light grain.
  "hydrogen-station": 50,
  // October 18 photographs: reviewed at 1280px against the WebP fallback.
  "centinela-oxidos-encuentro-2017": 50,
  "kjuube-pv-battery-cabinet-2020": 60,
  // October 17 archival photographs: full-frame 1280px comparisons retain
  // subject detail while meeting the existing WebP/AVIF transfer budget.
  "byd-frankfurt": 60,
  "ev-el-paso": 60,
  "permian-pumpjack": 60,
  "walmart-wallkill": 60,
  "ourisman-bethesda": 60,
  "ford-kansas-assembly": 60,
  "cardinal-ohio-power": 55,
  "P20260929JB-0074-1200": 55,
  "hamburg-container-terminal-2019": 55,
  "ev-charging-2020": 60,
  "korean-peninsula-2014": 60,
  // Checked at 1280px against quality 60: facial detail remains clear at 55,
  // while the conservative default would exceed the existing WebP budget.
  "india-rbi-forex-oil-window-2026-10-11": 55,
};
const localRaster = /^\/(?:reference-assets|news-media)\/.+\.(?:webp|jpe?g|png)$/i;

// Bound the number of active Sharp pipelines, not just source images. AVIF can
// create its own encoder threads, so avoid an unbounded Promise.all (or changing
// Sharp's per-image threading/encoder settings). Four also fits libuv's default
// pool. A single-worker override makes cold-build comparisons reproducible.
export function imageConcurrency(value = process.env.IMAGE_OPTIMIZE_CONCURRENCY) {
  if (value === undefined) return Math.min(4, availableParallelism());
  const concurrency = Number(value);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) {
    throw new Error("IMAGE_OPTIMIZE_CONCURRENCY must be an integer from 1 to 4");
  }
  return concurrency;
}

export async function runImageJobs(jobs, concurrency) {
  concurrency = imageConcurrency(concurrency);
  let next = 0;
  let failure;
  async function worker() {
    while (!failure && next < jobs.length) {
      const job = jobs[next++];
      try { await job(); }
      catch (error) { failure ||= error; }
    }
  }
  // Finish already-running writes before rejecting. Do not start more work or
  // publish a manifest after a failed encode.
  await Promise.all(Array.from({length: Math.min(concurrency, jobs.length)}, worker));
  if (failure) throw failure;
}

export async function optimizeImages({rootDir = process.cwd(), concurrency = imageConcurrency()} = {}) {
  concurrency = imageConcurrency(concurrency);
  const started = performance.now();
  const articlesPath = path.resolve(rootDir, "content/generated/articles.json");
  const outputDir = path.resolve(rootDir, "public/optimized-assets");
  if (!existsSync(articlesPath)) throw new Error("Run content generation before optimizing images");
  const articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  // Include Markdown-only images too, including reference-style Markdown destinations.
  // Licensed originals are read-only; every derivative retains the complete frame.
  const images = [...new Set(articles.flatMap(article => [
    article.image,
    ...(article.markdown || "").match(/\/(?:reference-assets|news-media)\/[^\s<>"')]+\.(?:webp|jpe?g|png)(?=[\s)>"']|$)/gi) || [],
  ]))].filter(image => typeof image === "string" && localRaster.test(image));
  mkdirSync(outputDir, { recursive: true });
  const manifest = {};
  const jobs = new Map();
  let encoded = 0;
  for (const image of images) {
    const input = path.resolve(rootDir, "public", image.slice(1));
    if (!existsSync(input)) throw new Error(`Missing image: ${image}`);
    const metadata = await sharp(input).metadata();
    const { width, height } = metadata.autoOrient || metadata;
    if (!width || !height) throw new Error(`Missing dimensions: ${image}`);
    const bytes = readFileSync(input);
    const stem = path.basename(image, path.extname(image));
    // 704px avoids a large 480 -> 832 jump for common 350–400px mobile
    // content widths at 1.75–2x density, without reducing visual resolution.
    const widths = [...new Set([160, 320, 480, 704, 832, 960, 1280, Math.min(width, 1920)].filter(w => w <= width))].sort((a,b)=>a-b);

    function derivatives(format, options, targetWidths, encoder) {
      const hash = createHash("sha256").update(bytes).update(JSON.stringify(encoder)).digest("hex").slice(0, 12);
      const variants = [];
      for (const target of targetWidths) {
        const filename = `${stem}-${hash}-${target}.${format}`;
        const output = path.join(outputDir, filename);
        // A content/encoder hash makes immutable derivatives safe to reuse on rebuilds.
        if (!jobs.has(output)) jobs.set(output, async () => {
          if (existsSync(output)) {
            try {
              const cached = await sharp(output).metadata();
              if (cached.format === (format === "avif" ? "heif" : format) &&
                  cached.width === target && cached.height > 0 &&
                  Math.abs(cached.height - height * target / width) <= 1) {
                // Metadata alone can succeed for truncated files left by the old
                // direct-write pipeline. Decode all pixels before reusing them.
                await sharp(output).stats();
                return;
              }
            } catch {
              // Regenerate unreadable/incomplete legacy cache entries locally.
            }
          }
          // The cache-visible name is published only after a complete encode.
          // A cancelled build must never leave a partial file that a retry reuses.
          const temporary = `${output}.${randomUUID()}.tmp`;
          try {
            await sharp(input).rotate().resize({width: target, withoutEnlargement: true})
              [format](options).toFile(temporary);
            renameSync(temporary, output);
            encoded++;
          } finally {
            rmSync(temporary, {force: true});
          }
        });
        variants.push({src: `/optimized-assets/${filename}`, width: target});
      }
      return variants;
    }

    const webpOptions = {quality: metadata.format === "png" ? 86 : 76, effort: 5};
    const variants = derivatives("webp", webpOptions, widths,
      {version:1, rotate:true, ...webpOptions, sharp:sharp.versions.sharp, webp:sharp.versions.webp});
    const asset = {width, height, variants};
    // Photographs get an AVIF source with normal WebP fallback. Full chroma detail
    // is retained; no AVIF is applied to charts, diagrams, or transparent artwork.
    if (metadata.format === "jpeg") {
      const quality = photoAvifQuality[image] ?? photoAvifQuality[stem] ?? 65;
      asset.avifVariants = derivatives("avif",
        {quality, effort:6, chromaSubsampling:"4:4:4"}, widths,
        {version:1, rotate:true, quality, effort:6, chromaSubsampling:"4:4:4", sharp:sharp.versions.sharp, aom:sharp.versions.aom, heif:sharp.versions.heif});
    }
    // Body PNGs can contain small chart labels. Keep their original resolution and
    // lossless pixels rather than serving a lossy thumbnail of the editorial data.
    if (metadata.format === "png") asset.bodyVariants = derivatives("webp",
      {lossless:true, effort:6}, [width],
      {version:1, rotate:true, lossless:true, effort:6, sharp:sharp.versions.sharp, webp:sharp.versions.webp});
    manifest[image] = asset;
  }
  await runImageJobs([...jobs.values()], concurrency);
  writeFileSync(path.resolve(rootDir, "content/generated/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  const count = Object.values(manifest).reduce((sum,image)=>sum + image.variants.length + (image.avifVariants?.length || 0) + (image.bodyVariants?.length || 0), 0);
  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  console.log(`Responsive images: ${images.length} sources / ${count} content-hashed variants generated or reused (${encoded} encoded, concurrency ${concurrency}, ${seconds}s).`);
  return {sources: images.length, variants: count, encoded, concurrency};
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve("scripts/optimize-images.mjs")) await optimizeImages();
