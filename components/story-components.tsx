"use client";

import { Text } from "@/lib/i18n";


import { storyHref } from "@/lib/links";

import { ArrowRight, Check, Clock3, Link2 } from "lucide-react";
import Link from "@/components/localized-link";
import { useState } from "react";
import type { Story } from "@/lib/data";
import { responsiveImageProps } from "@/lib/image-assets";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  inverse = false,
  divider = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  inverse?: boolean;
  divider?: boolean;
}) {
  return (
    <div className={"flex flex-wrap items-end justify-between gap-5 pb-4 " + (divider ? "newspaper-rule border-b " : "") + (inverse ? "border-background/30" : "border-border")}>
      <div>
        {eyebrow ? <p className={"kicker " + (inverse ? "text-background/60" : "")}>{<Text value={eyebrow}/>}</p> : null}
        <h2 className={"headline mt-2 text-[clamp(1.8rem,3.5vw,3.3rem)] font-black leading-none tracking-[-0.055em] " + (inverse ? "text-background" : "")}>{<Text value={title}/>}</h2>
      </div>
      {description ? <p className={"max-w-md text-sm leading-6 " + (inverse ? "text-background/70" : "text-muted-foreground")}>{<Text value={description}/>}</p> : null}
      {href ? (
        <Link href={href} className={"inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] underline decoration-accent underline-offset-4 " + (inverse ? "text-background" : "")}><Text value="View all"/>{linkLabel ? <> <Text value={linkLabel}/></> : null}<ArrowRight size="0.875rem" />
        </Link>
      ) : null}
    </div>
  );
}

export function StoryMeta({ story, compact = false }: { story: Story; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
      <span className="text-accent">{story.categoryLabel}</span>
      <span>/</span>
      <span>{story.displayDate}</span>
      {!compact ? (
        <>
          <span>/</span>
          <span className="inline-flex items-center gap-1"><Clock3 size="0.6875rem" /> {story.readTime} <Text value="min read"/></span>
        </>
      ) : null}
    </div>
  );
}

export function StoryCard({
  story,
  variant = "grid",
}: {
  story: Story;
  variant?: "grid" | "compact" | "feature" | "rail";
}) {
  if (variant === "compact") {
    return (
      <Link href={storyHref(story)} className="story-link group block border-b border-border py-4 first:pt-0 last:border-b-0">
        <div className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 bg-accent" />
          <div className="min-w-0">
            <h3 className="headline text-lg font-extrabold leading-[1.05] tracking-[-0.035em]">{story.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
              <span>{story.displayDate}</span>
              <span>/</span>
              <span className="text-accent">{story.categoryLabel}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    const imageProps = responsiveImageProps(story.image, "feature");
    return (
      <Link href={storyHref(story)} className="story-link group block">
        <div className="image-frame aspect-[16/10] border-2 border-foreground bg-muted">
          <img {...imageProps} alt={story.imageAlt} loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        </div>
        <div className="mt-6">
          <StoryMeta story={story} />
          <h3 className="headline mt-3 text-[clamp(2rem,4.6vw,4rem)] font-black leading-[0.96] tracking-[-0.065em]">{story.title}</h3>
          <p className="dek mt-4 max-w-2xl text-base leading-7">{story.dek}</p>
          <p className="mt-5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
            <span className="font-sans font-bold text-foreground"><Text value="By"/> {story.author}</span> / {story.displayDate} / {story.readTime} <Text value="min"/>
          </p>
        </div>
      </Link>
    );
  }

  const imageProps = responsiveImageProps(story.image);
  return (
    <Link href={storyHref(story)} className="story-link group block">
      <div className="image-frame aspect-[16/10] overflow-hidden border border-border bg-muted">
        <img {...imageProps} alt={story.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
      </div>
      <div className="mt-4">
        <StoryMeta story={story} compact />
        <h3 className={"headline mt-3 font-extrabold " + (variant === "rail" ? "text-xl" : "text-[1.45rem]")}>{story.title}</h3>
        <p className="dek mt-3 line-clamp-3 text-sm">{story.dek}</p>
      </div>
    </Link>
  );
}

export function Newsletter({ compact = false }: { compact?: boolean }) {
  return (
    <section className={"w-full border-y-[0.1875rem] border-border-strong bg-accent text-accent-foreground " + (compact ? "my-8" : "my-12")}>
      <div className="layout-wide px-5 py-8 text-accent-foreground sm:flex sm:items-center sm:justify-between sm:gap-8 lg:px-8">
        <div>
          <p className="kicker text-accent-foreground"><Text value="The Daily Whip"/></p>
          <h2 className="headline mt-2 text-3xl font-black leading-none tracking-[-0.055em]"><Text value="The sharpest read in your feed."/></h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-accent-foreground"><Text value="Three perspectives: technology, innovation and business."/></p>
        </div>
        <div className="mt-6 sm:mt-0"><Link href="/rss.xml" className="inline-flex rounded-full bg-accent-foreground px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-accent"><Text value="Subscribe via RSS →"/></Link><p className="mt-3 text-xs"><Text value="Free RSS feed · No email collection"/></p></div>
      </div>
    </section>
  );
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const href = (number: number) => number === 1 ? "/all-news/" : "/all-news/" + number + "/";
  const numbers = Array.from({length: totalPages}, (_, i) => i + 1).filter(n => n === 1 || n === totalPages || Math.abs(n-page) <= 1);
  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
      {page > 1 && <Link href={href(page-1)} className="inline-flex min-h-11 items-center px-3 text-sm font-bold underline underline-offset-4"><Text value="← Previous"/></Link>}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {numbers.map((n,i)=><span key={n} className="inline-flex items-center gap-2">
          {i > 0 && n-numbers[i-1] > 1 && <span aria-hidden="true">…</span>}
          <Link href={href(n)} aria-current={n===page?"page":undefined} className={"inline-flex size-11 items-center justify-center border border-border font-mono text-sm " + (n===page?"bg-foreground text-background":"hover:bg-muted")}>{n}</Link>
        </span>)}
      </div>
      {page < totalPages && <Link href={href(page+1)} className="inline-flex min-h-11 items-center px-3 text-sm font-bold underline underline-offset-4"><Text value="Next →"/></Link>}
      <p className="w-full text-center text-xs text-muted-foreground"><Text value="Page"/> {page} <Text value="of"/> {totalPages}</p>
    </nav>
  );
}
export function ShareBar({ story }: { story: Story }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="kicker mr-2"><Text value="Share"/></span>
      <button type="button" onClick={() => window.open("https://x.com/intent/post?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent(story.title), "_blank", "noopener,noreferrer")} className="rounded-full border border-border px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] transition hover:border-border-strong">X</button>
      <button type="button" onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href), "_blank", "noopener,noreferrer")} className="rounded-full border border-border px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] transition hover:border-border-strong">Facebook</button>
      <button type="button" onClick={() => window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(window.location.href), "_blank", "noopener,noreferrer")} className="rounded-full border border-border px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] transition hover:border-border-strong">LinkedIn</button>
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] transition hover:border-border-strong">
        {copied ? <Check size="0.75rem" /> : <Link2 size="0.75rem" />}
        <Text value={copied ? "Link copied" : "Copy link"}/>
      </button>
    </div>
  );
}
