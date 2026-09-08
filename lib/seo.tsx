import type { Metadata } from "next";
import { stories, categories } from "./data";
import { locales, type Locale } from "./locales";
import { siteUrl } from "./site-url";
import { positioning, brandNames } from "./site-brand";
import messages from "./messages.json";

const absolute = (path: string) => new URL(path, siteUrl + "/").href;
const translate = (key: string, locale: Locale) => (messages as Record<string, Record<string,string>>)[key]?.[locale] || key;
export function routeSeo(locale: Locale, path: string[] = []) {
  const siteName = brandNames[locale];
  const article = path[0] === "post" ? stories.find(s => s.slug === path[1]) : undefined;
  const translations = article ? stories.filter(s => s.translationKey === article.translationKey) : [];
  const canonical = article ? `/${article.lang}/post/${article.slug}/` : `/${locale}/${path.length ? path.join("/") + "/" : ""}`;
  const labels: Record<string,string> = {"all-news":"All news",issues:"Issues",issue:"Issues",about:"About 全球伯乐 News",authors:"Authors",contact:"Contact",privacy:"Privacy"};
  const category = categories.find(c => c.slug === path[1]);
  const section = path[0] === "category" ? translate(category?.label || path[1],locale) : path[0] === "tag" ? path[1] : translate(labels[path[0]] || "",locale);
  const title = article?.title || (path.length ? `${section}${path[1] && path[0] !== "category" && path[0] !== "tag" ? ` · ${path[1]}` : ""}` : positioning[locale]);
  const description = article?.dek || `${siteName} · ${positioning[locale]}${section ? `。${section}` : ""}`;
  const languages = Object.fromEntries(article ? translations.map(s=>[s.lang,absolute(`/${s.lang}/post/${s.slug}/`)]) : locales.map(l=>[l,absolute(`/${l}/${path.length ? path.join("/")+"/" : ""}`)]));
  languages["x-default"] = article ? languages["zh-CN"] || absolute(canonical) : absolute(`/zh-CN/${path.length ? path.join("/")+"/" : ""}`);
  const images = article ? [{url:absolute(article.image),alt:article.imageAlt}] : undefined;
  const metadata: Metadata = {
    title: {absolute: `${title} — ${siteName}`}, description, alternates:{canonical:absolute(canonical),languages,types:{"application/rss+xml":absolute(`/feeds/${locale}.xml`)}},
    robots:{index:!article || article.lang === locale,follow:true,googleBot:{"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
    openGraph:{title,description,url:absolute(canonical),siteName,locale:locale.replace("-","_"),type:article?"article":"website",images,...(article?{publishedTime:article.date,authors:[article.author],tags:article.tags}:{})},
    twitter:{card:images?"summary_large_image":"summary",title,description,images},
  };
  const page = {"@type":article?"Article":"WebPage","@id":absolute(canonical)+"#page",url:absolute(canonical),name:title,description,inLanguage:article?.lang || locale,isPartOf:{"@id":siteUrl+"/#website"},...(article?{headline:article.title,datePublished:article.date,image:absolute(article.image),author:{"@type":"Organization",name:article.author},publisher:{"@id":siteUrl+"/#publisher"},mainEntityOfPage:absolute(canonical),articleSection:translate(article.categoryLabel,locale),isAccessibleForFree:true}:{})};
  return {metadata, schema:{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":siteUrl+"/#publisher",name:siteName,url:siteUrl,description:positioning[locale]},{"@type":"WebSite","@id":siteUrl+"/#website",name:siteName,url:siteUrl,publisher:{"@id":siteUrl+"/#publisher"},inLanguage:locales},page,{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:siteName,item:absolute(`/${locale}/`)},...(path.length?[{"@type":"ListItem",position:2,name:title,item:absolute(canonical)}]:[])]}]}};
}
export function JsonLd({data}:{data:unknown}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
