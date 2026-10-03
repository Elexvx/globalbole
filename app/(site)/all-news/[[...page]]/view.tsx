"use client";

import { Text } from "@/lib/i18n";


import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Newsletter, Pagination, SectionHeading, StoryCard } from "@/components/story-components";
import { useArticles } from "@/lib/articles";

const pageSize = 12;

// Query-string compatibility is an isolated client enhancement. The canonical
// path archive (heading, cards and links) stays present in exported HTML.
function QueryPage({onPage}: {onPage:(page:string|null)=>void}) {
  const query = useSearchParams();
  const value = query.get("page");
  useEffect(()=>{ onPage(value); },[value,onPage]);
  return null;
}

export default function AllNewsPage() {
  const params = useParams<{ page?: string | string[]; path?:string[] }>();
  const [queryPage, setQueryPage] = useState<string|null>(null);
  const rawPage = queryPage || params.path?.[1] || params.page;
  const page = Math.max(1, Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1);
  const { articles } = useArticles();
  const ordered = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = ordered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <main>
      <Suspense fallback={null}><QueryPage onPage={setQueryPage}/></Suspense>
      <section className="layout-wide px-5 pb-10 pt-10 lg:px-8 lg:pb-14 lg:pt-14">
        <div className="border-b-[0.1875rem] border-border-strong pb-7">
          <p className="kicker"><Text value="The complete edition"/></p>
          <h1 className="headline mt-3 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.08em]"><Text value="All News"/></h1>
          <p className="dek mt-5 max-w-2xl text-lg leading-8"><Text value="Every desk, every beat, one clean archive for the stories making the political weather."/></p>
          <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"><Text value="Page"/> {currentPage} <Text value="of"/> {totalPages} · {ordered.length} <Text value="stories"/></p>
        </div>
      </section>
      <section className="layout-wide px-5 pb-16 lg:px-8">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((story, index) => <StoryCard key={story.slug} story={story} headingLevel={2} priority={index === 0} />)}
        </div>
        <Pagination page={currentPage} totalPages={totalPages} />
      </section>
      <Newsletter compact />
    </main>
  );
}
