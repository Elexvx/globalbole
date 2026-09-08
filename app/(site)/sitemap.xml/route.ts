import { categories, stories } from "@/lib/data";
import { siteUrl, xmlEscape } from "@/lib/site-url";
import { locales } from "@/lib/locales";
import { routeSeo } from "@/lib/seo";
export const dynamic = "force-static";

export function GET() {
  const baseUrl = siteUrl;
  const publicPaths = [
    "/",
    "/all-news/",
    "/about/",
    "/authors/",
    "/contact/",
    "/privacy/",
    ...categories.map((category) => "/category/" + category.slug + "/"),
    "/issues/",
    ...[...new Set(stories.map(story=>story.issue).filter(Boolean))].map(issue=>"/issue/"+issue+"/"),
  ];
  const urls = locales.flatMap(locale=>[
    ...publicPaths.map(path=>"/"+locale+path),
    ...Array.from({length:Math.max(0,Math.ceil(stories.filter(s=>s.lang===locale).length/12)-1)},(_,i)=>`/${locale}/all-news/${i+2}/`),
    ...[...new Set(stories.filter(s=>s.lang===locale).flatMap(s=>s.tags.map(t=>t.replace(/\s+/g,"-"))))].map(t=>`/${locale}/tag/${t}/`),
    ...stories.filter(story=>(story.lang || "en")===locale).map(story=>"/"+locale+"/post/"+story.slug+"/"),
  ]).map(path=>{
    const [locale,...parts]=path.split("/").filter(Boolean);
    const article=parts[0]==="post"?stories.find(s=>s.slug===parts[1]):undefined;
    const alternatives=routeSeo(locale as typeof locales[number],parts).metadata.alternates?.languages || {};
    return "<url><loc>"+xmlEscape(baseUrl+path)+"</loc>"+(article?`<lastmod>${article.date}</lastmod>`:"")+Object.entries(alternatives).map(([lang,url])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(String(url))}"/>`).join("")+"</url>";
  }).join("");
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + "</urlset>", {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
