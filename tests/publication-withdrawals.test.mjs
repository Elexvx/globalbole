import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildContent, languages } from "../scripts/content.mjs";
import { readWithdrawnArticles, assertNoWithdrawnArticles, checkWithdrawnExport } from "../scripts/publication-withdrawals.mjs";

const key = "taiwan-national-day-maritime-tensions-2026-10-11";

test("withdrawal retains deduplication history while removing every language edition and exclusive image", () => {
  const withdrawn = readWithdrawnArticles();
  const record = withdrawn.find(article => article.translationKey === key);
  assert.ok(record);
  assert.equal(record.republish, false);
  assert.equal(record.withdrawnAt, "2026-10-11");
  assert.equal(record.withdrawalScope, "all-language-editions");
  assert.equal(record.eventDate, "2026-10-10");
  assert.equal(record.sources.length, 4, "Retain the existing public source URLs for event-level deduplication");
  const articles = buildContent();
  assertNoWithdrawnArticles(articles, withdrawn);
  for (const lang of languages) assert.equal(existsSync(`content/issues/2026-10-11/${lang}/${key}.md`), false);
  const provenance = JSON.parse(readFileSync("docs/news-media/2026-10-11/provenance.json", "utf8"));
  for (const media of record.withdrawnMedia) {
    assert.equal(existsSync(`public${media}`), false);
    assert.ok(!provenance.assets.some(asset => asset.localPath === media));
    assert.ok(provenance.retiredAssets.some(asset => asset.localPath === media && asset.sourceURL && asset.license));
    assert.ok(!articles.some(article => article.image === media || article.markdown.includes(media)));
  }
});

test("content generation rejects a withdrawn stable key in every language, even under a new filename or slug", () => {
  const original = process.cwd();
  const directory = mkdtempSync(path.join(tmpdir(), "globalbole-withdrawal-content-"));
  try {
    process.chdir(directory);
    mkdirSync("docs", { recursive: true });
    mkdirSync("content/issues/test", { recursive: true });
    writeFileSync("docs/news-publication-log.json", JSON.stringify({ batches: [{ articles: [{ translationKey: key, status: "withdrawn" }] }] }));
    for (const lang of languages) {
      writeFileSync("content/issues/test/renamed.md", `---\ntitle: "Restored story"\nslug: "different-slug"\ntranslationKey: "${key}"\nissue: "2026-10-11"\nlang: "${lang}"\ncategory: "current-affairs"\nauthor: "News desk"\ndate: "2026-10-11"\ndescription: "Restored story."\n---\nRestored body.\n`);
      assert.throws(buildContent, /withdrawn article must not be republished/);
    }
    assert.doesNotThrow(() => assertNoWithdrawnArticles([{ translationKey: "unrelated-story" }]));
  } finally {
    process.chdir(original);
    rmSync(directory, { recursive: true, force: true });
  }
});

test("export validation catches old routes, list/feed/API references and cached exclusive image derivatives", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "globalbole-withdrawal-export-"));
  const withdrawn = [{ translationKey: key, withdrawnMedia: ["/news-media/2026-10-11/taiwan-national-day-ceremony-2026-10-10.jpg"] }];
  try {
    for (const filename of ["index.html", "tag/index.html", "feeds/en.xml", "sitemap.xml", "data/v1/articles.json", "post/index.txt"]) {
      const file = path.join(directory, filename);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, key);
      assert.throws(() => checkWithdrawnExport([], directory, withdrawn), /withdrawn content or media reference remains exported/);
      writeFileSync(file, "unrelated content");
    }
    for (const filename of [`en/post/en-${key}/index.html`, "optimized-assets/taiwan-national-day-ceremony-2026-10-10-123456789abc-320.webp"]) {
      const file = path.join(directory, filename);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "old asset");
      assert.throws(() => checkWithdrawnExport([], directory, withdrawn), /withdrawn route or asset remains exported/);
      if (filename.endsWith("index.html")) rmSync(path.dirname(file), { recursive: true });
      else rmSync(file);
    }
    assert.doesNotThrow(() => checkWithdrawnExport([], directory, withdrawn));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
