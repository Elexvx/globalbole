"use client";

import { Text } from "@/lib/i18n";


import Link from "@/components/localized-link";
import { useParams } from "next/navigation";
import { Newsletter, SectionHeading, StoryCard } from "@/components/story-components";
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
  return (
    <main className="category-page">
      <section className="category-header layout-wide px-5 pt-8 lg:px-8">
        <div className="border-b-[0.1875rem] border-border-strong pb-5">
          <p className="kicker"><Text value="Section"/> / {<Text value={category.label}/>}</p>
          <h1 id="category-heading" className="headline mt-2 font-black">{<Text value={category.label}/>}</h1>
          <div className="category-header-details">
            <p className="dek max-w-2xl text-base"><Text value={category.description}/></p>
            <p className="font-mono type-caption uppercase tracking-[0.12em] text-muted-foreground">{categoryStories.length} <Text value="stories"/></p>
          </div>
        </div>
      </section>
      <div data-category-results={category.slug}>
      {categoryStories.length ? (
        <section className="layout-wide px-5 pb-10 lg:px-8" aria-labelledby="category-heading">
          <div className="category-story-grid">
            {categoryStories.map((story, index) => <StoryCard key={story.slug} story={story} priority={index < 3} />)}
          </div>
        </section>
      ) : <section className="layout-wide px-5 pb-14 lg:px-8"><p className="dek text-lg leading-8"><Text value="No stories in this section yet."/></p><Link href="/all-news/" className="mt-5 inline-flex text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link></section>}
      </div>
      <section className="layout-wide px-5 py-14 lg:px-8">
        <SectionHeading eyebrow="Across the site" title="The rest of the edition" href="/all-news/" />
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.filter((story) => story.category !== category.slug).slice(0, 3).map((story) => <StoryCard key={story.slug} story={story} />)}
        </div>
      </section>
      <Newsletter compact />
    </main>
  );
}
