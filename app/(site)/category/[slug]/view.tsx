"use client";

import { Text } from "@/lib/i18n";


import Link from "@/components/localized-link";
import { useParams } from "next/navigation";
import { Newsletter, SectionHeading, StoryCard, SectionDirectory } from "@/components/story-components";
import { useArticles } from "@/lib/articles";
import { getCategory } from "@/lib/data";

export default function CategoryPage() {
  const params = useParams<{ slug: string; path?:string[] }>();
  const slug = params.path?.[1] || (Array.isArray(params.slug) ? params.slug[0] : params.slug);
  const category = getCategory(slug);
  const { articles } = useArticles();

  if (!category) {
    return (
      <main className="layout-wide px-5 py-24 lg:px-8">
        <p className="kicker"><Text value="404 / Desk not found"/></p>
        <h1 className="headline mt-3 font-black "><Text value="That section is off the record."/></h1>
        <Link href="/all-news/" className="mt-8 inline-flex text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link>
      </main>
    );
  }

  const categoryStories = articles
    .filter((story) => story.category === category.slug)
    .sort((a, b) => b.date.localeCompare(a.date));
  const featured = categoryStories[0];

  return <main>
    <section className="news-page-heading layout-wide px-5 lg:px-8"><div>
      <p className="kicker"><Text value="Section"/></p><h1 className="headline font-black"><Text value={category.label}/></h1>
      <p className="dek"><Text value={category.description}/></p>
      <p className="news-count type-caption text-muted-foreground">{categoryStories.length} <Text value="stories"/></p>
    </div></section>
    <section className="news-columns layout-wide px-5 pb-12 lg:px-8">
      <div data-category-results={category.slug}>
        {featured ? <><div className="news-category-lead"><StoryCard story={featured} variant="feature" headingLevel={2}/></div>
          {categoryStories.length > 1 ? <section className="news-category-more"><h2 className="headline font-extrabold"><Text value="More from the desk"/></h2>{categoryStories.slice(1).map(story => <StoryCard key={story.slug} story={story} variant="list"/>)}</section> : null}
        </> : <div className="py-8"><p className="dek"><Text value="No stories in this section yet."/></p><Link href="/all-news/" className="mt-5 inline-flex min-h-11 items-center text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link></div>}
      </div>
      <SectionDirectory stories={articles} current={category.slug}/>
    </section>
    <section className="layout-wide px-5 py-10 lg:px-8"><SectionHeading title="The rest of the edition" href="/all-news/"/>
      <div className="news-related-grid mt-6">{articles.filter(story => story.category !== category.slug).slice(0,3).map(story => <StoryCard key={story.slug} story={story}/>)}</div>
    </section><Newsletter compact/>
  </main>;
}
