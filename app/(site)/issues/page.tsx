"use client";
import Link from "@/components/localized-link";
import { useArticles } from "@/lib/articles";
import { Text } from "@/lib/i18n";
export default function Issues() {
  const {articles}=useArticles();
  const issues=[...new Set(articles.map(story=>story.issue).filter(Boolean))].sort().reverse();
  return <main className="layout-wide px-5 py-12 lg:px-8"><p className="kicker"><Text value="全球伯乐 News"/> / <Text value="The complete edition"/></p><h1 className="headline my-6 text-5xl font-black"><Text value="Issues"/></h1><div className="grid gap-6 md:grid-cols-2">{issues.map(issue=><Link key={issue} href={`/issue/${issue}/`} className="block border-t-[0.1875rem] border-border-strong bg-background-wash p-6"><p className="kicker"><Text value="Sample edition"/></p><h2 className="my-4 text-3xl font-bold">{issue}</h2><p>{articles.filter(story=>story.issue===issue).length} <Text value="stories"/></p><p className="mt-5 underline"><Text value="Read issue"/> →</p></Link>)}</div></main>;
}
