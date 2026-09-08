import { readdirSync,readFileSync,existsSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { languages } from "./content.mjs";
const articles=JSON.parse(readFileSync("content/generated/articles.json","utf8"));
const files=readdirSync("out",{recursive:true}).filter(file=>file.endsWith(".html"));
const missing=new Set();let checks=0;
for(const file of files){
  const html=readFileSync(path.join("out",file),"utf8");
  for(const match of html.matchAll(/(?:href|src)="(\/[^"<>]*)"/g)){
    const url=decodeURIComponent(match[1].split(/[?#]/)[0]);if(url.startsWith("//"))continue;
    const target=path.join("out",url);
    if(!existsSync(target)&&!existsSync(path.join(target,"index.html")))missing.add(url);checks++;
  }
}
assert.deepEqual([...missing],[],"Missing static assets or routes");
for(const lang of languages){
  assert.match(readFileSync(`out/${lang}/index.html`,"utf8"),new RegExp(`<html[^>]*lang="${lang}"`));
  assert.ok(existsSync(`out/feeds/${lang}.xml`));
  for(const article of articles.filter(a=>a.lang===lang)){
    const html=readFileSync(`out/${lang}/post/${article.slug}/index.html`,"utf8");
    assert.ok(html.includes("<table>"),"Markdown table must be present in exported HTML");
    assert.ok(html.includes('hreflang="en"') || html.includes('hrefLang="en"'),"Language alternatives required");
  }
}
assert.equal(existsSync("out/editor/index.html"),false);
assert.equal(existsSync("out/preview/index.html"),false);
console.log(`Verified ${files.length} HTML pages and ${checks} local references, five languages, Markdown tables and no editor routes.`);
