import { legacyMetadata } from "@/lib/seo";
export async function generateMetadata({params}:{params:Promise<{page?:string[]}>}) {
  return legacyMetadata(["all-news", ...((await params).page || [])]);
}
import { Suspense } from "react";
import View from "./view";
import { categories, stories } from "@/lib/data";
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({length:Math.max(1,Math.ceil(stories.filter(story=>story.lang==="zh-CN").length/12))}, (_,index) => ({page:index === 0 ? [] : [String(index+1)]}));
}
export default function Page() { return <Suspense fallback={<main className="layout-wide px-5 py-24">Loading edition…</main>}><View /></Suspense>; }
