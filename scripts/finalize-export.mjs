import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { languages } from "./content.mjs";
const articles=JSON.parse(readFileSync("content/generated/articles.json","utf8"));
const base=(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4173")).replace(/\/$/,"");
const escape=value=>String(value).replace(/[<>&"']/g,char=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"})[char]);
// Static output only: give crawlers the same language that React uses after hydration.
for(const file of readdirSync("out",{recursive:true}).filter(file=>file.endsWith(".html"))) {
  const locale=languages.find(lang=>file.startsWith(lang+path.sep)) || "zh-CN";
  const target=path.join("out",file);
  writeFileSync(target,readFileSync(target,"utf8").replace(/<html([^>]*?)lang="[^"]*"/,`<html$1lang="${locale}"`));
}
mkdirSync("out/feeds",{recursive:true});
for(const lang of languages){
  const brand=lang==="zh-CN"?"全球伯乐 News":lang==="zh-TW"?"全球伯樂 News":"Global Bole News";
  const items=articles.filter(article=>article.lang===lang).sort((a,b)=>b.date.localeCompare(a.date)).map(article=>`<item><title>${escape(article.title)}</title><description>${escape(article.dek)}</description><link>${escape(base+"/"+lang+"/post/"+article.slug+"/")}</link><guid>${escape(base+"/"+lang+"/post/"+article.slug+"/")}</guid><pubDate>${new Date(article.date+"T12:00:00Z").toUTCString()}</pubDate></item>`).join("");
  writeFileSync(`out/feeds/${lang}.xml`,`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${brand} · ${lang}</title><language>${lang}</language><link>${escape(base+"/"+lang+"/")}</link><description>${brand}</description>${items}</channel></rss>`);
}
console.log("Static HTML languages and five RSS feeds generated.");
