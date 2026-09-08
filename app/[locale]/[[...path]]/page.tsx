import { Suspense } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { stories, categories } from "@/lib/data";
import Home from "@/app/page";
import Category from "@/app/category/[slug]/view";
import Post from "@/app/post/[slug]/view";
import Tag from "@/app/tag/[slug]/view";
import Archive from "@/app/all-news/[[...page]]/view";
import Issues from "@/app/issues/page";
import Issue from "@/components/issue-view";
import Info from "@/components/info-view";
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
  let view;
  switch(path[0]){
    case undefined:view=<Home/>;break;
    case "category":view=<Category/>;break;
    case "post":view=<Post/>;break;
    case "tag":view=<Tag/>;break;
    case "all-news":view=<Archive/>;break;
    case "issues":view=<Issues/>;break;
    case "issue":view=<Issue issue={path[1]}/>;break;
    case "about":case "authors":case "contact":case "privacy":view=<Info page={path[0]}/>;break;
    default:notFound();
  }
  return <><JsonLd data={routeSeo(locale,path).schema}/><Suspense fallback={<main className="p-12">{brandNames[locale]}…</main>}>{view}</Suspense></>;
}
