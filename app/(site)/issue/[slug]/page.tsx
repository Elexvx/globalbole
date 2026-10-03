import { legacyMetadata } from "@/lib/seo";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  return legacyMetadata(["issue", (await params).slug]);
}
import { stories } from "@/lib/data";
import View from "@/components/issue-view";
export function generateStaticParams(){const slugs=[...new Set(stories.map(story=>story.issue).filter(Boolean))];return (slugs.length?slugs:["empty"]).map(slug=>({slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <View issue={(await params).slug}/>;}
