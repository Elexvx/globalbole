import { stories } from "@/lib/data";
import View from "@/components/issue-view";
export function generateStaticParams(){return [...new Set(stories.map(story=>story.issue).filter(Boolean))].map(slug=>({slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <View issue={(await params).slug}/>;}
