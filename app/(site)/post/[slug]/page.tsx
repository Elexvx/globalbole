import { legacyMetadata } from "@/lib/seo";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  return legacyMetadata(["post", (await params).slug]);
}
import { Suspense } from "react";
import View from "./view";
import { stories } from "@/lib/data";
import { ArticleMarkdown } from "@/components/article-markdown";
export const dynamicParams = false;
export function generateStaticParams() {
  return (stories.length ? stories.map(item => item.slug) : ["empty"]).map(slug => ({slug}));
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const initialMarkdown=stories.find(story=>story.slug===slug)?.markdown;
  return <Suspense fallback={<main className="layout-wide px-5 py-24">Loading edition…</main>}><View initialMarkdown={initialMarkdown} initialLocale="zh-CN">{initialMarkdown ? <ArticleMarkdown markdown={initialMarkdown} locale="zh-CN"/> : null}</View></Suspense>;
}
