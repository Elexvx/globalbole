"use client";
import { useArticles } from "@/lib/articles";
import { Text } from "@/lib/i18n";
import { StoryCard } from "./story-components";
export default function IssueView({issue}:{issue:string}) {
  const {articles}=useArticles();
  const edition=articles.filter(story=>story.issue===issue);
  return <main className="layout-wide px-5 py-12 lg:px-8"><p className="kicker"><Text value="Sample edition"/></p><h1 className="my-6 font-black"><Text value="Issue"/> {issue}</h1><p className="mb-8">{edition.length} <Text value="stories"/></p><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{edition.map((story,index)=><StoryCard key={story.slug} story={story} headingLevel={2} priority={index === 0}/>)}</div></main>;
}
