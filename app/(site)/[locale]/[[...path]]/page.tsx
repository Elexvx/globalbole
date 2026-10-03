import { Suspense } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { stories, categories } from "@/lib/data";
import { RouteView } from "@/components/route-view";
import { ArticleMarkdown } from "@/components/article-markdown";
import { brandNames } from "@/lib/site-brand";
import { routeSeo, JsonLd } from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams() {
  const tags=[...new Set(stories.flatMap(story=>story.tags.map(tag=>tag.replace(/\s+/g,"-"))))];
  const issues=[...new Set(stories.map(story=>story.issue).filter(Boolean))] as string[];
  const paths:string[][]=[[],["all-news"],["issues"],...["about","authors","contact","privacy"].map(item=>[item]),...categories.map(item=>["category",item.slug]),...stories.map(item=>["post",item.slug]),...tags.map(tag=>["tag",tag]),...issues.map(issue=>["issue",issue])];
  return locales.flatMap(locale=>[...paths,...Array.from({length:Math.max(0,Math.ceil(stories.filter(story=>story.lang===locale).length/12)-1)},(_,index)=>["all-news",String(index+2)])].map(path=>({locale,path})));
}
export async function generateMetadata({params}:{params:Promise<{locale:string;path?:string[]}>}) {
  const {locale,path=[]}=await params;
  if(!isLocale(locale))notFound();
  return routeSeo(locale,path).metadata;
}
export default async function Page({params}:{params:Promise<{locale:string;path?:string[]}>}) {
  const {locale,path=[]}=await params;
  if(!isLocale(locale))notFound();
  if(path[0] && !["category","post","tag","all-news","issues","issue","about","authors","contact","privacy"].includes(path[0])) notFound();
  const initialMarkdown=path[0]==="post" ? stories.find(story=>story.slug===path[1])?.markdown : undefined;
  return <><JsonLd data={routeSeo(locale,path).schema}/><Suspense fallback={<main className="p-12">{brandNames[locale]}…</main>}><RouteView path={path} initialMarkdown={initialMarkdown} initialLocale={locale}>{initialMarkdown ? <ArticleMarkdown markdown={initialMarkdown} locale={locale}/> : null}</RouteView></Suspense></>;
}
