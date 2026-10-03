import { legacyMetadata } from "@/lib/seo";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  return legacyMetadata(["tag", (await params).slug]);
}
import { Suspense } from "react";
import View from "./view";
import { categories, stories } from "@/lib/data";
export const dynamicParams = false;
export function generateStaticParams() {
  const slugs = [...new Set(stories.flatMap(item => item.tags.map(tag => tag.replace(/\s+/g, "-"))))];
  return (slugs.length ? slugs : ["empty"]).map(slug => ({slug}));
}
export default function Page() { return <Suspense fallback={<main className="layout-wide px-5 py-24">Loading edition…</main>}><View /></Suspense>; }
