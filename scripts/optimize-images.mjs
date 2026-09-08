import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const articlesPath = path.resolve("content/generated/articles.json");
const outputDir = path.resolve("public/optimized-assets");

export async function optimizeImages() {
  if (!existsSync(articlesPath)) {
    throw new Error("content/generated/articles.json is missing; run content generation first");
  }

  const articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  const covers = [...new Set(articles.map((article) => article.image))]
    .filter((image) => typeof image === "string" && image.startsWith("/reference-assets/") && image.endsWith(".webp"))
    .map((image) => path.resolve("public", image.slice(1)))
    .filter((file) => existsSync(file));

  mkdirSync(outputDir, { recursive: true });

  await Promise.all(covers.flatMap((input) => {
    const stem = path.basename(input, ".webp");
    return [
      { width: 480, quality: 72 },
      { width: 960, quality: 75 },
    ].map(({ width, quality }) =>
      sharp(input)
        .resize({ width, withoutEnlargement: true, fit: "inside" })
        .webp({ quality, effort: 4 })
        .toFile(path.join(outputDir, `${stem}-${width}.webp`)),
    );
  }));

  console.log(`Responsive images: ${covers.length} source covers / ${covers.length * 2} variants generated.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve("scripts/optimize-images.mjs")) {
  await optimizeImages();
}
