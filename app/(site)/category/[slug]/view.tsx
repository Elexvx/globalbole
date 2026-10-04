"use client";

import { Text } from "@/lib/i18n";


import Link from "@/components/localized-link";
import { useParams } from "next/navigation";
import { Newsletter, SectionHeading, StoryCard, StoryMeta } from "@/components/story-components";
import { useArticles } from "@/lib/articles";
import { categories, getCategory } from "@/lib/data";

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

  return (
    <main>
      <section className="layout-wide px-5 pb-12 pt-10 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="border-b-[0.1875rem] border-border-strong pb-7">
          <p className="kicker"><Text value="Section"/> / {<Text value={category.label}/>}</p>
          <h1 className="headline mt-3 font-black ">{<Text value={category.label}/>}</h1>
          <p className="dek mt-5 max-w-2xl text-lg leading-8"><Text value={category.description}/></p>
          <p className="mt-6 font-mono type-caption uppercase tracking-[0.12em] text-muted-foreground">{categoryStories.length} <Text value="stories"/> / <Text value={category.label}/></p>
        </div>
      </section>
      <div data-category-results={category.slug}>
      {featured ? (
        <section className="layout-wide px-5 pb-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <StoryCard story={featured} variant="feature" headingLevel={2} />
            <div className="border-t-[0.1875rem] border-border-strong pt-5 lg:border-l lg:border-t-0 lg:pl-8">
              <p className="kicker"><Text value="Desk notes"/></p>
              <p className="dek mt-5 text-xl leading-8"><Text value="The story behind the headline is usually found in the meeting notes, implementation calendar, and people asked to carry it out."/></p>
              <div className="mt-8 border-t border-border pt-5">
                <StoryMeta story={featured} />
                <p className="mt-3 text-sm leading-6 text-muted-foreground"><Text value="By"/> {featured.author}, {featured.authorRole}.</p>
              </div>
            </div>
          </div>
        </section>
      ) : <section className="layout-wide px-5 pb-14 lg:px-8"><p className="dek text-lg leading-8"><Text value="No stories in this section yet."/></p><Link href="/all-news/" className="mt-5 inline-flex text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link></section>}
      {categoryStories.length > 1 ? <section className="border-y border-border bg-background-wash">
        <div className="layout-wide px-5 py-12 lg:px-8 lg:py-16">
          <SectionHeading eyebrow={category.label} title="More from the desk" />
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {categoryStories.slice(1).map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
        </div>
      </section> : null}
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
