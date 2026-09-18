import { Suspense } from "react";
import View from "./view";
import { categories, stories } from "@/lib/data";
export const dynamicParams = false;
export function generateStaticParams() {
  return (stories.length ? stories.map(item => item.slug) : ["empty"]).map(slug => ({slug}));
}
export default function Page() { return <Suspense fallback={<main className="layout-wide px-5 py-24">Loading edition…</main>}><View /></Suspense>; }
