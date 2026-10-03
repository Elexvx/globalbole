"use client";

import { Text } from "@/lib/i18n";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/locales";


import Link from "@/components/localized-link";
import { useParams } from "next/navigation";
import { tagHref } from "@/lib/links";
import { ShareBar, StoryCard, StoryMeta } from "@/components/story-components";
import { useArticles } from "@/lib/articles";
import { categories } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { responsiveImageProps, responsiveAvifSourceProps } from "@/lib/image-assets";
import { ClientMarkdown } from "@/components/client-markdown";

export default function PostPage({slugOverride,initialMarkdown,initialLocale,children}: {slugOverride?:string;initialMarkdown?:string;initialLocale?:Locale;children?:ReactNode} = {}) {
  const params = useParams<{ slug: string; path?:string[] }>();
  const {locale,t}=useI18n();
  const slug = slugOverride || params.path?.[1] || (Array.isArray(params.slug) ? params.slug[0] : params.slug);
  const { articles, allArticles, hydrated } = useArticles();
  const story = articles.find((item) => item.slug === slug) || allArticles.find(item=>item.slug===slug);

  if (!story && !hydrated) {
    return <main className="layout-wide px-5 py-24 lg:px-8"><p className="kicker"><Text value="Loading the edition"/></p><p className="dek mt-4 text-xl"><Text value="Opening the story file…"/></p></main>;
  }

  if (!story) {
    return (
      <main className="layout-wide px-5 py-24 lg:px-8">
        <p className="kicker"><Text value="404 / Story not found"/></p>
        <h1 className="headline mt-3 text-5xl font-black tracking-[-0.06em]"><Text value="This story is not in the filing cabinet."/></h1>
        <Link href="/all-news/" className="mt-8 inline-flex text-sm font-bold underline decoration-accent underline-offset-4"><Text value="Browse all news →"/></Link>
      </main>
    );
  }

  const avif = responsiveAvifSourceProps(story.image, "article");
  const related = articles
    .filter((item) => item.slug !== story.slug && (item.category === story.category || item.tags.some((tag) => story.tags.includes(tag))))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <main>
      <article lang={story.lang || "en"} className="layout-wide px-5 pb-16 pt-10 lg:px-8 lg:pt-14">
        {(story.lang || "en") !== locale ? <p role="status" className="mb-6 rounded-lg border border-border p-4">{t("Translation unavailable")}</p> : null}
        <div className="mx-auto max-w-5xl">
          <Link href={"/category/" + story.category + "/"} className="kicker inline-flex items-center gap-2 underline decoration-accent underline-offset-4">
            {t(story.categoryLabel)} / {story.displayDate} / {story.readTime} {t("min read")}
          </Link>
          <h1 className="headline mt-5 max-w-5xl text-[clamp(2rem,7.4vw,7rem)] font-black">{story.title}</h1>
          <p className="dek mt-6 max-w-3xl text-xl leading-8 sm:text-2xl">{story.dek}</p>
          <div className="mt-8 grid gap-8 border-y border-border py-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-foreground text-sm font-black text-background">{story.author.split(" ").map((word) => word[0]).join("")}</div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em]"><Text value="By"/> {story.author}</p>
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">{story.authorRole}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 overflow-hidden border-2 border-foreground bg-muted">
            <picture>{avif ? <source {...avif}/> : null}<img {...responsiveImageProps(story.image, "article")} loading="eager" fetchPriority="high" decoding="async" alt={story.imageAlt} className="story-cover aspect-[16/9] h-full w-full object-cover" /></picture>
          </div>
          <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"><Text value="Image file / 全球伯乐 News reference desk"/></p>
          <div className="mt-7"><ShareBar story={story} /></div>
          <div className="mx-auto mt-10 grid gap-12 lg:grid-cols-[minmax(0,46rem)_15rem]">
            <div className="article-copy min-w-0">
              {story.markdown ? <ClientMarkdown markdown={story.markdown} locale={locale} initialMarkdown={initialMarkdown} initialLocale={initialLocale}>{children}</ClientMarkdown> : null}
              {story.body.map((section, index) => (
                <section key={index} className="mb-10">
                  <h2 className="headline text-3xl font-black leading-none tracking-[-0.055em]">{section.heading}</h2>
                  <p className="mt-4 text-lg leading-8 text-foreground/85">{section.body}</p>
                </section>
              ))}
              {story.quote ? <blockquote className="my-12 border-y-[0.1875rem] border-border-strong py-7 font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">“{story.quote}”</blockquote> : null}
              <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-5">
                <span className="kicker mr-2 py-2"><Text value="Tags"/></span>
                {story.tags.map((tag) => <Link key={tag} href={tagHref(tag)} className="rounded-full border border-border px-3 py-2 text-xs transition hover:border-border-strong">{t(categories.find(item=>item.slug===tag)?.label || tag)}</Link>)}
              </div>
            </div>
            <aside className="self-start border-t-[0.1875rem] border-border-strong pt-4 lg:sticky lg:top-6">
              <p className="kicker"><Text value="Filed under"/></p>
              <p className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-[-0.04em]">{t(story.categoryLabel)}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground"><Text value="Reporting from the independent political daily."/></p>
              <StoryMeta story={story} />
            </aside>
          </div>
        </div>
      </article>
      {related.length ? (
        <section className="border-y border-border bg-background-wash">
          <div className="layout-wide px-5 py-12 lg:px-8 lg:py-16">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
              <div><p className="kicker"><Text value="Keep reading"/></p><h2 className="headline mt-2 text-4xl font-black leading-none tracking-[-0.06em]"><Text value="More from the desk"/></h2></div>
              <Link href={"/category/" + story.category + "/"} className="hidden text-xs font-bold uppercase tracking-[0.14em] underline decoration-accent underline-offset-4 sm:block"><Text value="View section →"/></Link>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <StoryCard key={item.slug} story={item} />)}</div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
