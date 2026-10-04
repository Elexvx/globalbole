import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const articlesPath = path.resolve("content/generated/articles.json");
const outputDir = path.resolve("public/optimized-assets");
// Per-photo quality was checked against the existing WebP at display resolutions.
// Fine-detail scenes need higher AVIF quality; use that conservative default for
// future photographs rather than applying portrait settings to every subject.
const photoAvifQuality = {
  "dario-amodei-techcrunch-2023": 55,
  "hamburg-container-terminal-2019": 55,
  "ev-charging-2020": 60,
  "korean-peninsula-2014": 60,
};
const localRaster = /^\/(?:reference-assets|news-media)\/.+\.(?:webp|jpe?g|png)$/i;

export async function optimizeImages() {
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
  for (const image of images) {
    const input = path.resolve("public", image.slice(1));
    if (!existsSync(input)) throw new Error(`Missing image: ${image}`);
    const metadata = await sharp(input).metadata();
    const { width, height } = metadata.autoOrient || metadata;
    if (!width || !height) throw new Error(`Missing dimensions: ${image}`);
    const bytes = readFileSync(input);
    const stem = path.basename(image, path.extname(image));
    // 704px avoids a large 480 -> 832 jump for common 350–400px mobile
    // content widths at 1.75–2x density, without reducing visual resolution.
    const widths = [...new Set([160, 320, 480, 704, 832, 960, 1280, Math.min(width, 1920)].filter(w => w <= width))].sort((a,b)=>a-b);

    async function derivatives(format, options, targetWidths, encoder) {
      const hash = createHash("sha256").update(bytes).update(JSON.stringify(encoder)).digest("hex").slice(0, 12);
      const variants = [];
      for (const target of targetWidths) {
        const filename = `${stem}-${hash}-${target}.${format}`;
        const output = path.join(outputDir, filename);
        // A content/encoder hash makes immutable derivatives safe to reuse on rebuilds.
        if (!existsSync(output)) await sharp(input).rotate().resize({width: target, withoutEnlargement: true})
          [format](options).toFile(output);
        variants.push({src: `/optimized-assets/${filename}`, width: target});
      }
      return variants;
    }

    const webpOptions = {quality: metadata.format === "png" ? 86 : 76, effort: 5};
    const variants = await derivatives("webp", webpOptions, widths,
      {version:1, rotate:true, ...webpOptions, sharp:sharp.versions.sharp, webp:sharp.versions.webp});
    const asset = {width, height, variants};
    // Photographs get an AVIF source with normal WebP fallback. Full chroma detail
    // is retained; no AVIF is applied to charts, diagrams, or transparent artwork.
    if (metadata.format === "jpeg") {
      const quality = photoAvifQuality[stem] ?? 65;
      asset.avifVariants = await derivatives("avif",
        {quality, effort:6, chromaSubsampling:"4:4:4"}, widths,
        {version:1, rotate:true, quality, effort:6, chromaSubsampling:"4:4:4", sharp:sharp.versions.sharp, aom:sharp.versions.aom, heif:sharp.versions.heif});
    }
    // Body PNGs can contain small chart labels. Keep their original resolution and
    // lossless pixels rather than serving a lossy thumbnail of the editorial data.
    if (metadata.format === "png") asset.bodyVariants = await derivatives("webp",
      {lossless:true, effort:6}, [width],
      {version:1, rotate:true, lossless:true, effort:6, sharp:sharp.versions.sharp, webp:sharp.versions.webp});
    manifest[image] = asset;
  }
  writeFileSync("content/generated/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  const count = Object.values(manifest).reduce((sum,image)=>sum + image.variants.length + (image.avifVariants?.length || 0) + (image.bodyVariants?.length || 0), 0);
  console.log(`Responsive images: ${images.length} sources / ${count} content-hashed variants generated or reused.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve("scripts/optimize-images.mjs")) await optimizeImages();
