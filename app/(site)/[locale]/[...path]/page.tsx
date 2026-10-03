import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { stories, categories } from "@/lib/data";
import { RouteView } from "@/components/route-view";
import { routeSeo, JsonLd } from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams() {
  const tags=[...new Set(stories.flatMap(story=>story.tags.map(tag=>tag.replace(/\s+/g,"-"))))];
  const issues=[...new Set(stories.map(story=>story.issue).filter(Boolean))] as string[];
  const paths:string[][]=[["issues"],...["about","authors","contact","privacy"].map(item=>[item]),...categories.map(item=>["category",item.slug]),...tags.map(tag=>["tag",tag]),...issues.map(issue=>["issue",issue])];
  return locales.flatMap(locale=>paths.map(path=>({locale,path})));
}
export async function generateMetadata({params}:{params:Promise<{locale:string;path?:string[]}>}) {
  const {locale,path=[]}=await params;
  if(!isLocale(locale))notFound();
  return routeSeo(locale,path).metadata;
}
export default async function Page({params}:{params:Promise<{locale:string;path?:string[]}>}) {
  const {locale,path=[]}=await params;
  if(!isLocale(locale))notFound();
  if(path[0] && !["category","tag","issues","issue","about","authors","contact","privacy"].includes(path[0])) notFound();
  return <><JsonLd data={routeSeo(locale,path).schema}/><RouteView path={path}/></>;
}
