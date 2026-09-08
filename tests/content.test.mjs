import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildContent, languages } from "../scripts/content.mjs";

test("examples cover six issues, thirty topics and all five languages",()=>{
  const articles=buildContent();
  assert.equal(articles.length,150);
  assert.equal(new Set(articles.map(a=>a.issue)).size,6);
  for(const lang of languages){
    const edition=articles.filter(a=>a.lang===lang);
    assert.equal(edition.length,30);
    for(const [category,count] of Object.entries({technology:8,innovation:15,business:7}))
      assert.equal(edition.filter(a=>a.category===category).length,count);
  }
  for(const key of new Set(articles.map(a=>a.translationKey)))assert.deepEqual(articles.filter(a=>a.translationKey===key).map(a=>a.lang).sort(),[...languages].sort());
  for(const article of articles){assert.match(article.markdown,/^> /);assert.match(article.markdown,/\| --- \|/);assert.match(article.markdown,/## /);}
});

test("draft exclusion, new-file discovery and invalid content rejection",()=>{
  const original=process.cwd();
  const fixture=readFileSync("content/issues/2026-09-01/en/public-budget.md","utf8");
  const directory=mkdtempSync(path.join(tmpdir(),"politica-content-test-"));
  try{
    process.chdir(directory);
    mkdirSync("content/issues/test",{recursive:true});mkdirSync("public/reference-assets",{recursive:true});
    writeFileSync("public/reference-assets/4615cdf986890f9d.webp","");
    writeFileSync("content/issues/test/example.md",fixture);
    assert.equal(buildContent().length,1);
    writeFileSync("content/issues/test/example.md",fixture.replace("draft: false","draft: true"));
    assert.equal(buildContent().length,0);
    writeFileSync("content/issues/test/example.md",fixture.replace('lang: "en"','lang: "invalid"'));
    assert.throws(buildContent,/unsupported lang/);
    writeFileSync("content/issues/test/example.md",fixture);
    writeFileSync("content/issues/test/duplicate.md",fixture);
    assert.throws(buildContent,/duplicate/);
  }finally{process.chdir(original);rmSync(directory,{recursive:true,force:true});}
});
