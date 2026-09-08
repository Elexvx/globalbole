import { categories, stories } from "@/lib/data";
import { RootClock } from "@/components/root-clock";

const localePrefix = "/zh-CN";
const categoryLabels = { technology: "科技", innovation: "创新", business: "商业" } as const;

function rootHref(path: string) {
  return path === "/" ? `${localePrefix}/` : `${localePrefix}${path}`;
}

const tickerStories = stories
  .filter((story) => story.lang === "zh-CN")
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
  .slice(0, 8);

export function StaticSiteHeader() {
  return (
    <header className="bg-surface">
      <div className="layout-wide flex items-center justify-end gap-3 px-5 py-2 lg:px-8">
        <a href={rootHref("/issues/")} className="header-text-link">各期目录</a>
        <a href={rootHref("/")} className="header-text-link">中文</a>
      </div>
      <div className="leader-bar" />
      <div className="wire-ticker border-b border-border bg-background-wash">
        <div className="layout-wide flex min-h-8 items-center gap-4 overflow-hidden px-5 lg:px-8">
          <span className="kicker self-stretch inline-flex shrink-0 items-center bg-accent px-4 text-accent-foreground">即时资讯</span>
          <div className="wire-ticker-viewport min-w-0">
            <div className="wire-ticker-loop flex min-w-max items-center gap-10 whitespace-nowrap">
              {[...tickerStories, ...tickerStories].map((story, index) => (
                <a key={`${story.slug}-${index}`} href={rootHref(`/post/${story.slug}/`)} className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                  <span className="mr-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-accent">{categoryLabels[story.category]}</span>{story.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="layout-wide px-5 lg:px-8">
        <div className="relative flex items-center justify-between gap-4 py-5 lg:py-7">
          <a href={rootHref("/")} className="min-w-0">
            <span className="block font-display text-[clamp(1.5rem,4.3vw,4rem)] font-black leading-none tracking-normal">全球伯乐 <span className="brand-accent">News</span></span>
            <span className="mt-2 hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:block">专注科技、创新、商业领域</span>
          </a>
          <div className="hidden items-center gap-8 text-right lg:flex">
            <RootClock />
            <a href="/feeds/zh-CN.xml" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition hover:bg-accent">RSS 订阅</a>
          </div>
          <details className="group lg:hidden">
            <summary className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-none border-2 border-border text-xl leading-none [&::-webkit-details-marker]:hidden" aria-label="打开菜单">☰</summary>
            <div className="absolute right-0 top-full z-40 w-[min(20rem,calc(100vw-2.5rem))] border border-border bg-card p-5 shadow-2xl">
              <nav className="grid gap-3 text-lg font-bold">
                {categories.map((category) => <a key={category.slug} href={rootHref(`/category/${category.slug}/`)} className="story-link py-2">{categoryLabels[category.slug]}</a>)}
                <a href={rootHref("/all-news/")} className="story-link py-2">全部文章</a>
                <a href="/feeds/zh-CN.xml" className="story-link py-2">RSS 订阅</a>
              </nav>
            </div>
          </details>
        </div>
      </div>
      <div className="desktop-edition-nav hidden bg-foreground text-background lg:block">
        <div className="layout-wide flex min-h-14 items-center justify-between gap-8 px-5 lg:px-8">
          <nav className="flex min-w-0 items-center gap-5">
            {categories.map((category) => <a key={category.slug} href={rootHref(`/category/${category.slug}/`)} className="theme-select-nav story-link whitespace-nowrap text-background">{categoryLabels[category.slug]}</a>)}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href={rootHref("/all-news/")} className="inline-flex h-11 items-center px-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-background transition hover:text-accent">全部文章</a>
          </div>
        </div>
      </div>
    </header>
  );
}

export function StaticSiteFooter() {
  return (
    <footer className="mt-16 border-t-[0.1875rem] border-border-strong bg-foreground text-background">
      <div className="layout-wide grid gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <a href={rootHref("/")} className="font-display text-2xl font-black tracking-normal">全球伯乐 <span className="brand-accent-inverse">News</span></a>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/70">专注科技、创新、商业领域</p>
          <p className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-background/50">© 2026 全球伯乐 News · 保留所有权利</p>
        </div>
        <div><p className="kicker kicker-on-dark">文章分类</p><div className="mt-4 grid gap-2 text-sm">{categories.map((category) => <a key={category.slug} href={rootHref(`/category/${category.slug}/`)} className="text-background/80 transition hover:text-accent">{categoryLabels[category.slug]}</a>)}<a href={rootHref("/all-news/")} className="text-background/80 transition hover:text-accent">全部文章</a></div></div>
        <div><p className="kicker kicker-on-dark">关于</p><div className="mt-4 grid gap-2 text-sm"><a href={rootHref("/about/")} className="text-background/80 transition hover:text-accent">关于本站</a><a href={rootHref("/authors/")} className="text-background/80 transition hover:text-accent">作者</a><a href={rootHref("/contact/")} className="text-background/80 transition hover:text-accent">联系我们</a><a href={rootHref("/privacy/")} className="text-background/80 transition hover:text-accent">隐私说明</a></div></div>
        <div><p className="kicker kicker-on-dark">资源</p><div className="mt-4 grid gap-3 text-sm"><a href={rootHref("/issues/")} className="text-background/80 transition hover:text-accent">各期目录</a><a href="/feeds/zh-CN.xml" className="text-background/80 transition hover:text-accent">RSS 订阅</a></div></div>
      </div>
    </footer>
  );
}
