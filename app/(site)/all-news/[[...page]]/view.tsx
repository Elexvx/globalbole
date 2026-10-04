"use client";

import { Text } from "@/lib/i18n";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Newsletter, Pagination, SectionDirectory, StoryCard } from "@/components/story-components";
import { useArticles } from "@/lib/articles";

const pageSize = 12;

// Compatibility query pagination is read after mounting, without suspending
// the static archive. Published canonical pagination uses path segments.
export default function AllNewsPage() {
  const params = useParams<{ page?: string | string[]; path?:string[] }>();
  const [queryPage, setQueryPage] = useState<string|null>(null);
  useEffect(() => {
    const update = () => setQueryPage(new URLSearchParams(window.location.search).get("page"));
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [params.path, params.page]);
  const rawPage = queryPage || params.path?.[1] || params.page;
  const page = Math.max(1, Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1);
  const { articles } = useArticles();
  const ordered = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = ordered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const dateGroups = visible.reduce<{date:string; label:string; stories:typeof visible}[]>((groups, story) => {
    const group = groups.find(item => item.date === story.date);
    if (group) group.stories.push(story);
    else groups.push({date:story.date, label:story.displayDate, stories:[story]});
    return groups;
  }, []);

  return <main>
    <section className="news-page-heading layout-wide px-5 lg:px-8"><div>
      <p className="kicker"><Text value="The complete edition"/></p><h1 className="headline font-black"><Text value="All News"/></h1>
      <p className="news-count type-caption text-muted-foreground">{ordered.length} <Text value="stories"/>{totalPages > 1 ? <> · <Text value="Page"/> {currentPage} <Text value="of"/> {totalPages}</> : null}</p>
    </div></section>
    <section className="news-columns layout-wide px-5 pb-12 lg:px-8">
      <div>{dateGroups.map(group => <section key={group.date} className="news-date-group" aria-label={group.label}>
        <p className="news-date-heading kicker"><time dateTime={group.date}>{group.label}</time></p>
        {group.stories.map((story,index) => <StoryCard key={story.slug} story={story} variant="list" headingLevel={2} priority={group === dateGroups[0] && index === 0}/>)}
      </section>)}<Pagination page={currentPage} totalPages={totalPages}/></div>
      <SectionDirectory stories={ordered}/>
    </section>
    <Newsletter compact/>
  </main>;
}
