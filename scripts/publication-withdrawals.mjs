import { existsSync, readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";

export function readWithdrawnArticles(file = "docs/news-publication-log.json") {
  // Isolated content fixtures can run without a publication history.
  if (!existsSync(file)) return [];
  const log = JSON.parse(readFileSync(file, "utf8"));
  return log.batches.flatMap(batch => batch.articles).filter(article => article.status === "withdrawn");
}

export function assertNoWithdrawnArticles(articles, withdrawn = readWithdrawnArticles()) {
  const keys = new Set(withdrawn.map(article => article.translationKey));
  for (const article of articles) {
    assert.ok(!keys.has(article.translationKey), `${article.translationKey}: withdrawn article must not be republished`);
  }
}

export function checkWithdrawnExport(articles, directory = "out", withdrawn = readWithdrawnArticles()) {
  assertNoWithdrawnArticles(articles, withdrawn);
  const markers = [...new Set(withdrawn.flatMap(article => [
    article.translationKey,
    ...(article.withdrawnMedia || []).map(file => path.basename(file, path.extname(file))),
  ]))];
  if (!markers.length) return;
  // Check every exported route and text payload, covering lists, tags, feeds,
  // sitemap, API data and RSC/client data, as well as retired image derivatives.
  for (const file of readdirSync(directory, { recursive: true, withFileTypes: true })) {
    const filename = path.join(file.parentPath, file.name);
    for (const marker of markers) assert.ok(!filename.includes(marker), `${filename}: withdrawn route or asset remains exported`);
    if (!file.isFile() || !/\.(?:html|xml|json|txt|js)$/.test(file.name)) continue;
    const content = readFileSync(filename, "utf8");
    for (const marker of markers) assert.ok(!content.includes(marker), `${filename}: withdrawn content or media reference remains exported`);
  }
  console.log(`Withdrawals: ${withdrawn.length} stories absent from all exported routes, assets and text payloads.`);
}
