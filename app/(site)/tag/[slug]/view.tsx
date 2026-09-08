"use client";

import { Text } from "@/lib/i18n";


import Link from "@/components/localized-link";
import { useParams, useSearchParams } from "next/navigation";
import { Newsletter, SectionHeading, StoryCard } from "@/components/story-components";
import { useArticles } from "@/lib/articles";

export default function TagPage() {
  const params = useParams<{ slug: string; path?:string[] }>();
  const query = useSearchParams();
  const rawSlug = params.path?.[1] || query.get("tag") || (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";
  const label = rawSlug.replace(/-/g, " ");
  const { articles } = useArticles();
  const matching = articles.filter((story) => story.tags.some((tag) => tag.toLowerCase() === label.toLowerCase() || tag.toLowerCase().replace(/\s+/g, "-") === rawSlug)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <section className="layout-wide px-5 pb-12 pt-10 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="border-b-[0.1875rem] border-border-strong pb-7">
          <p className="kicker"><Text value="Tag archive"/></p>
          <h1 className="headline mt-3 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.08em]">{label}</h1>
          <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">{matching.length} <Text value="stories"/> · {label}</p>
        </div>
      </section>
      <section className="layout-wide px-5 pb-16 lg:px-8">
        {matching.length ? (
          <>
            <SectionHeading eyebrow="Filed together" title="Stories in this thread" />
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{matching.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
          </>
        ) : (
          <div className="border-y border-border py-12"><p className="dek text-xl"><Text value="No stories have been filed under this tag yet."/></p><Link href="/all-news/" className="mt-6 inline-flex text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link></div>
        )}
      </section>
      <Newsletter compact />
    </main>
  );
}
