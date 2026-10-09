import { readdirSync,readFileSync,existsSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { languages } from "./content.mjs";
import { checkCategoryExport } from "./check-category-export.mjs";
import { checkTagExport } from "./check-tag-export.mjs";
const escapeHtml=value=>value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#x27;"}[char]));
const articles=JSON.parse(readFileSync("content/generated/articles.json","utf8"));
const files=readdirSync("out",{recursive:true}).filter(file=>file.endsWith(".html"));
const missing=new Set();let checks=0;
for(const file of files){
  const html=readFileSync(path.join("out",file),"utf8");
  if (/<html\b/i.test(html)) {
    assert.match(html, /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="\/_next\/static\/[^"<>]+\.css")[^>]*>/i, `${file}: shared build stylesheet must survive export`);
    assert.doesNotMatch(html, /<style\b[^>]*\bdata-precedence="next"/i, `${file}: do not duplicate the build stylesheet in every exported page`);
  }
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
  for (const file of files.filter(file=>file.startsWith(lang + path.sep))) {
    const localized = readFileSync(path.join("out",file),"utf8");
    assert.ok(!localized.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING'), `${file}: canonical content must not bail out to client rendering`);
    assert.ok(!/<div hidden id="S:/.test(localized), `${file}: static main content must not wait inside a hidden streaming slot`);
  }
  const ordered = articles.filter(item=>item.lang===lang).sort((a,b)=>b.date.localeCompare(a.date));
  for (let offset=0; offset<ordered.length; offset+=12) {
    const page = offset ? `${offset/12+1}/` : "";
    const archive = readFileSync(`out/${lang}/all-news/${page}index.html`, "utf8");
    assert.match(archive, /<h1\b[^>]*>/, "Archive heading must be prerendered without JavaScript");
    for (const article of ordered.slice(offset,offset+12)) {
      assert.ok(archive.includes(escapeHtml(article.title)), `${lang}/${page}: chronological archive card titles must be prerendered`);
    }
  }
  for(const article of articles.filter(a=>a.lang===lang)){
    const html=readFileSync(`out/${lang}/post/${article.slug}/index.html`,"utf8");
    if (/^\|[^\n]+\|\s*\n\|[ :|\-]+\|/m.test(article.markdown)) {
      assert.ok(html.includes("<table>"),"Markdown source tables must be present in exported HTML");
    }
    if (/^\[\^[^\]]+\]:/m.test(article.markdown)) {
      assert.ok(html.includes('class="footnotes"'),"Source notes must be rendered in a footnote section");
      assert.match(html,/<h2[^>]*id="footnote-label"[^>]*>/,"Footnote label ID must be preserved");
      assert.ok(!html.includes('id="section-undefined"'),"Generated source-note headings need valid IDs");
      for (const match of html.matchAll(/href="#(user-content-fn[^\"]*)"/g)) {
        assert.ok(html.includes(`id="${match[1]}"`),`Footnote target must exist: ${match[1]}`);
      }
    }
    const translations=articles.filter(candidate=>candidate.translationKey===article.translationKey);
    for (const translation of translations) {
      assert.ok(html.toLowerCase().includes(`hreflang="${translation.lang.toLowerCase()}"`),"Available language alternatives required");
    }
    assert.ok(html.includes('rel="canonical"'),"Article canonical URL required");
  }
}
assert.equal(existsSync("out/editor/index.html"),false);
assert.equal(existsSync("out/preview/index.html"),false);
checkCategoryExport(articles);
checkTagExport(articles);
console.log(`Verified ${files.length} HTML pages and ${checks} local references, five languages, available translations, source tables and no editor routes.`);

const buildInfo = JSON.parse(readFileSync("out/build-info.json", "utf8"));
assert.ok(buildInfo.commit === null || /^[a-f0-9]{40}$/.test(buildInfo.commit), "Build marker contains only a public commit SHA or null");
assert.deepEqual(Object.keys(buildInfo), ["commit"], "Do not publish other build environment values");
