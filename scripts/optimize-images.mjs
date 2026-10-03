import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const articlesPath = path.resolve("content/generated/articles.json");
const outputDir = path.resolve("public/optimized-assets");

export async function optimizeImages() {
  if (!existsSync(articlesPath)) throw new Error("Run content generation before optimizing images");
  const articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  // Keep licensed originals intact; generate only display derivatives for local covers.
  const covers = [...new Set(articles.map(article => article.image))]
    .filter(image => typeof image === "string" && /^\/(?:reference-assets|news-media)\/.+\.(?:webp|jpe?g|png)$/i.test(image));
  mkdirSync(outputDir, { recursive: true });
  const manifest = {};
  for (const image of covers) {
    const input = path.resolve("public", image.slice(1));
    if (!existsSync(input)) throw new Error(`Missing cover: ${image}`);
    const metadata = await sharp(input).metadata();
    const { width, height } = metadata.autoOrient || metadata;
    if (!width || !height) throw new Error(`Missing dimensions: ${image}`);
    const hash = createHash("sha256").update(readFileSync(input)).update(JSON.stringify({version:1, rotate:true, quality:metadata.format === "png" ? 86 : 76, effort:5, sharp:sharp.versions.sharp, webp:sharp.versions.webp})).digest("hex").slice(0, 12);
    const stem = path.basename(image, path.extname(image));
    const widths = [...new Set([160, 320, 480, 832, 960, 1280, Math.min(width, 1920)].filter(w => w <= width))].sort((a,b)=>a-b);
    const variants = [];
    for (const target of widths) {
      const filename = `${stem}-${hash}-${target}.webp`;
      // Never crop here: CSS alone controls cover framing, full diagrams remain available.
      await sharp(input).rotate().resize({width: target, withoutEnlargement: true})
        .webp({quality: metadata.format === "png" ? 86 : 76, effort: 5})
        .toFile(path.join(outputDir, filename));
      variants.push({src: `/optimized-assets/${filename}`, width: target});
    }
    manifest[image] = {width, height, variants};
  }
  writeFileSync("content/generated/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Responsive images: ${covers.length} covers / ${Object.values(manifest).reduce((sum,image)=>sum+image.variants.length,0)} content-hashed variants generated.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve("scripts/optimize-images.mjs")) await optimizeImages();
