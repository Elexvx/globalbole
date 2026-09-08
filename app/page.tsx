import { categories, stories, type Category, type Story } from "@/lib/data";
import { responsiveImageProps } from "@/lib/image-assets";

const localePrefix = "/zh-CN";
const categoryLabels: Record<Category["slug"], string> = {
  technology: "科技",
  innovation: "创新",
  business: "商业",
};

function rootHref(path: string) {
  return path === "/" ? `${localePrefix}/` : `${localePrefix}${path}`;
}

function StaticStoryMeta({ story, compact = false }: { story: Story; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
      <span className="text-accent">{categoryLabels[story.category]}</span>
      <span>/</span>
      <span>{story.displayDate}</span>
      {!compact ? <><span>/</span><span>{story.readTime} 分钟阅读</span></> : null}
    </div>
  );
}

function StaticStoryCard({ story, variant = "grid" }: { story: Story; variant?: "grid" | "compact" | "feature" | "rail" }) {
  if (variant === "compact") {
    return (
      <a href={rootHref(`/post/${story.slug}/`)} className="story-link group block border-b border-border py-4 first:pt-0 last:border-b-0">
        <div className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 bg-accent" />
          <div className="min-w-0">
            <h3 className="headline text-lg font-extrabold leading-[1.05] tracking-[-0.035em]">{story.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
              <span>{story.displayDate}</span><span>/</span><span className="text-accent">{categoryLabels[story.category]}</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  const imageProps = responsiveImageProps(story.image, variant === "feature" ? "feature" : "card");
  if (variant === "feature") {
    return (
      <a href={rootHref(`/post/${story.slug}/`)} className="story-link group block">
        <div className="image-frame aspect-[16/9] border-2 border-foreground bg-muted">
          <img {...imageProps} alt={story.imageAlt} loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        </div>
        <div className="mt-6">
          <StaticStoryMeta story={story}/>
          <h3 className="headline mt-3 text-[clamp(2rem,4.6vw,4rem)] font-black leading-[0.96] tracking-[-0.065em]">{story.title}</h3>
          <p className="dek mt-4 max-w-2xl text-base leading-7">{story.dek}</p>
          <p className="mt-5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"><span className="font-sans font-bold text-foreground">作者 {story.author}</span> / {story.displayDate} / {story.readTime} 分钟</p>
        </div>
      </a>
    );
  }

  return (
    <a href={rootHref(`/post/${story.slug}/`)} className="story-link group block">
      <div className="image-frame aspect-[16/10] overflow-hidden border border-border bg-muted">
        <img {...imageProps} alt={story.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
      </div>
      <div className="mt-4">
        <StaticStoryMeta story={story} compact/>
        <h3 className={`headline mt-3 font-extrabold ${variant === "rail" ? "text-xl" : "text-[1.45rem]"}`}>{story.title}</h3>
        <p className="dek mt-3 line-clamp-3 text-sm">{story.dek}</p>
      </div>
    </a>
  );
}

function StaticSectionHeading({ eyebrow, title, href, linkLabel }: { eyebrow?: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 pb-4">
      <div>{eyebrow ? <p className="kicker">{eyebrow}</p> : null}<h2 className="headline mt-2 text-[clamp(1.8rem,3.5vw,3.3rem)] font-black leading-none tracking-[-0.055em]">{title}</h2></div>
      {href ? <a href={rootHref(href)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] underline decoration-accent underline-offset-4">查看全部{linkLabel ? ` ${linkLabel}` : ""} →</a> : null}
    </div>
  );
}

function StaticNewsletter() {
  return (
    <section className="my-8 w-full border-y-[0.1875rem] border-border-strong bg-accent text-accent-foreground">
      <div className="layout-wide px-5 py-8 text-accent-foreground sm:flex sm:items-center sm:justify-between sm:gap-8 lg:px-8">
        <div><p className="kicker text-accent-foreground">每日阅读</p><h2 className="headline mt-2 text-3xl font-black leading-none tracking-[-0.055em]">在阅读器中订阅更新。</h2><p className="mt-3 max-w-xl text-sm leading-6 text-accent-foreground">科技、创新、商业，三个方向读懂变化。</p></div>
        <div className="mt-6 sm:mt-0"><a href="/feeds/zh-CN.xml" className="inline-flex rounded-full bg-accent-foreground px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-accent">通过 RSS 订阅 →</a><p className="mt-3 text-xs">免费 RSS · 不收集邮箱</p></div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const ordered = stories.filter((story) => story.lang === "zh-CN").sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  const hero = ordered[0];
  const latest = ordered.slice(1, 5);
  const used = new Set([hero?.slug, ...latest.map((story) => story.slug)]);
  const picks = categories.flatMap((category) => {
    const story = ordered.find((item) => item.category === category.slug && !used.has(item.slug));
    if (story) used.add(story.slug);
    return story ? [story] : [];
  });
  const deep = [...ordered].filter((story) => !used.has(story.slug)).sort((a, b) => (b.markdown?.length || 0) - (a.markdown?.length || 0))[0];
  if (deep) used.add(deep.slug);
  const sections = categories.map((category) => ({ ...category, articles: ordered.filter((story) => story.category === category.slug && !used.has(story.slug)).slice(0, 4) }));
  if (!hero) return null;

  return (
    <main className="home-edition">
      <section className="layout-wide px-5 py-8 lg:px-8 lg:py-10"><div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-10"><div className="home-lead min-w-0"><StaticStoryCard story={hero} variant="feature"/></div><aside className="min-w-0 border-t-[0.1875rem] border-border-strong pt-4 md:border-t-0 md:border-l md:border-border md:pl-7"><h2 className="mb-5 text-xl font-bold">最新报道</h2>{latest.map((story) => <StaticStoryCard key={story.slug} story={story} variant="compact"/>)}<a href={rootHref("/all-news/")} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">全部文章 →</a></aside></div></section>
      {picks.length ? <section className="bg-background-wash"><div className="layout-wide px-5 py-8 lg:px-8"><StaticSectionHeading eyebrow="精选" title="编辑推荐"/><div className="mt-6 grid gap-7 md:grid-cols-3">{picks.map((story) => <StaticStoryCard key={story.slug} story={story} variant="rail"/>)}</div></div></section> : null}
      {sections.map((section) => section.articles.length ? <section key={section.slug} className="layout-wide px-5 py-9 lg:px-8 lg:py-12" aria-label={categoryLabels[section.slug]}><div className="pt-6"><StaticSectionHeading title={categoryLabels[section.slug]} href={`/category/${section.slug}/`} linkLabel={categoryLabels[section.slug]}/><div className="mt-7 grid items-start gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"><StaticStoryCard story={section.articles[0]}/><div className="min-w-0 md:border-l md:border-border md:pl-7">{section.articles.slice(1).map((story) => <StaticStoryCard key={story.slug} story={story} variant="compact"/>)}</div></div></div></section> : null)}
      {deep ? <section className="my-6 bg-foreground text-background"><div className="layout-wide grid items-center gap-8 px-5 py-10 md:grid-cols-2 lg:px-8 lg:py-14"><div className="overflow-hidden"><img {...responsiveImageProps(deep.image)} alt={deep.imageAlt} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover"/></div><div className="min-w-0"><p className="text-sm font-semibold tracking-wider">深度阅读</p><h2 className="mt-5 text-3xl font-bold leading-relaxed"><a href={rootHref(`/post/${deep.slug}/`)}>{deep.title}</a></h2><p className="mt-5 text-base leading-8 text-background/80">{deep.dek}</p><p className="mt-5 text-sm text-background/70">{deep.displayDate} · {deep.readTime} 分钟阅读</p></div></div></section> : null}
      <section className="layout-wide px-5 pt-8 lg:px-8"><StaticSectionHeading title="完整目录" href="/issues/"/><div className="mt-5 grid gap-4 sm:grid-cols-3">{[...new Set(ordered.map((story) => story.issue).filter(Boolean))].sort().reverse().slice(0, 3).map((issue) => <a key={issue} href={rootHref(`/issue/${issue}/`)} className="border-y border-border py-5"><p className="text-sm text-muted-foreground">各期目录</p><p className="my-3 text-xl font-bold">{issue}</p><span className="text-sm underline underline-offset-4">阅读本期 →</span></a>)}</div></section>
      <StaticNewsletter/>
      <div className="layout-wide px-5 py-8 text-center lg:px-8"><a href={rootHref("/all-news/")} className="inline-flex min-h-11 items-center border border-border-strong px-6 py-3 text-base font-semibold hover:bg-background-wash">阅读全部文章 →</a></div>
    </main>
  );
}
