"use client";

import { Text } from "@/lib/i18n";
import Link from "@/components/localized-link";
import { SectionHeading, StoryCard, Newsletter } from "@/components/story-components";
import { storyHref } from "@/lib/links";
import { useArticles } from "@/lib/articles";
import { categories } from "@/lib/data";

export default function HomePage() {
  const { articles } = useArticles();
  const ordered = [...articles].sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
  const hero = ordered[0];
  const latest = ordered.slice(1,5);
  const used = new Set([hero?.slug,...latest.map(s=>s.slug)]);
  const picks = categories.flatMap(category=>{
    const story=ordered.find(s=>s.category===category.slug&&!used.has(s.slug));
    if(story)used.add(story.slug);
    return story?[story]:[];
  });
  const deep = [...ordered].filter(s=>!used.has(s.slug)).sort((a,b)=>(b.markdown?.length||0)-(a.markdown?.length||0))[0];
  if(deep)used.add(deep.slug);
  const sections = categories.map(category=>({
    ...category,
    articles:ordered.filter(s=>s.category===category.slug&&!used.has(s.slug)).slice(0,4),
  }));
  if(!hero) return null;
  return (
    <main className="home-edition">
      <section className="layout-wide px-5 py-8 lg:px-8 lg:py-10">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-10">
          <div className="home-lead min-w-0">
            <StoryCard story={hero} variant="feature"/>
          </div>
          <aside className="min-w-0 border-t-[0.1875rem] border-border-strong pt-4 md:border-t-0 md:border-l md:border-border md:pl-7">
            <h2 className="mb-5 text-xl font-bold"><Text value="The Latest"/></h2>
            {latest.map(story=><StoryCard key={story.slug} story={story} variant="compact"/>)}
            <Link href="/all-news/" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"><Text value="All News"/> →</Link>
          </aside>
        </div>
      </section>
      {picks.length ? <section className="bg-background-wash">
        <div className="layout-wide px-5 py-8 lg:px-8">
          <SectionHeading eyebrow="Curated" title="Editor's Picks" divider={false}/>
          <div className="mt-6 grid gap-7 md:grid-cols-3">
            {picks.map(story=><StoryCard key={story.slug} story={story} variant="rail"/>)}
          </div>
        </div>
      </section>:null}
      {sections.map(section=>section.articles.length ? (
        <section key={section.slug} className="layout-wide px-5 py-9 lg:px-8 lg:py-12" aria-label={section.label}>
          <div className="border-t-[0.1875rem] border-border-strong pt-6">
            <SectionHeading title={section.label} description={section.slug === "business" ? undefined : section.description} href={"/category/"+section.slug+"/"}/>
            <div className="mt-7 grid items-start gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <StoryCard story={section.articles[0]}/>
              <div className="min-w-0 md:border-l md:border-border md:pl-7">
                {section.articles.slice(1).map(story=><StoryCard key={story.slug} story={story} variant="compact"/>)}
              </div>
            </div>
          </div>
        </section>
      ):null)}
      {deep?<section className="my-6 bg-foreground text-background">
        <div className="layout-wide grid items-center gap-8 px-5 py-10 md:grid-cols-2 lg:px-8 lg:py-14">
          <div className="overflow-hidden"><img src={deep.image} alt={deep.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover"/></div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wider"><Text value="Long reads"/></p>
            <h2 className="mt-5 text-3xl font-bold leading-relaxed"><Link href={storyHref(deep)}>{deep.title}</Link></h2>
            <p className="mt-5 text-base leading-8 text-background/80">{deep.dek}</p>
            <p className="mt-5 text-sm text-background/70">{deep.displayDate} · {deep.readTime} <Text value="min read"/></p>
          </div>
        </div>
      </section>:null}
      <section className="layout-wide px-5 pt-8 lg:px-8">
        <SectionHeading title="The complete edition" href="/issues/" divider={false}/>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[...new Set(ordered.map(s=>s.issue).filter(Boolean))].sort().reverse().slice(0,3).map(issue=><Link key={issue} href={`/issue/${issue}/`} className="border-y border-border py-5"><p className="text-sm text-muted-foreground"><Text value="Issues"/></p><p className="my-3 text-xl font-bold">{issue}</p><span className="text-sm underline underline-offset-4"><Text value="Read issue"/> →</span></Link>)}
        </div>
      </section>
      <Newsletter compact/>
      <div className="layout-wide px-5 py-8 text-center lg:px-8">
        <Link href="/all-news/" className="inline-flex min-h-11 items-center border border-border-strong px-6 py-3 text-base font-semibold hover:bg-background-wash"><Text value="Read the complete edition →"/></Link>
      </div>
    </main>
  );
}
