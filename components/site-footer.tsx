import { Text } from "@/lib/i18n";
import { Globe2, Mail, Rss } from "lucide-react";
import Link from "@/components/localized-link";
import { categories } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24 border-t-4 border-accent bg-foreground text-background">
      <div className="site-footer-main layout-wide grid gap-12 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-display text-3xl font-black tracking-normal">
            <Text value="全球伯乐"/> <span className="brand-accent-inverse">News</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/70"><Text value="Technology, innovation, and business reporting for people who move ideas forward."/></p>
          <div className="site-footer-social mt-7 flex gap-2">
            <Link href="/about/" aria-label="About" className="inline-flex size-10 items-center justify-center border border-background/30 text-background/80"><Globe2 size="1rem" /></Link>
            <Link href="/contact/" aria-label="Contact" className="inline-flex size-10 items-center justify-center border border-background/30 text-background/80"><Mail size="1rem" /></Link>
            <Link href="/rss.xml" aria-label="RSS" className="inline-flex size-10 items-center justify-center border border-background/30 text-background/80"><Rss size="1rem" /></Link>
          </div>
        </div>
        <div>
          <p className="kicker kicker-on-dark"><Text value="Sections"/></p>
          <div className="mt-4 grid gap-2 text-sm">
            {categories.map((category) => (
              <Link key={category.slug} href={"/category/" + category.slug + "/"} className="text-background/80 transition hover:text-accent">{<Text value={category.label}/>}</Link>
            ))}
            <Link href="/all-news/" className="text-background/80 transition hover:text-accent"><Text value="All News"/></Link>
          </div>
        </div>
        <div>
          <p className="kicker kicker-on-dark"><Text value="About"/></p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/about/" className="text-background/80 transition hover:text-accent"><Text value="About 全球伯乐 News"/></Link>
            <Link href="/authors/" className="text-background/80 transition hover:text-accent"><Text value="Authors"/></Link>
            <Link href="/contact/" className="text-background/80 transition hover:text-accent"><Text value="Contact"/></Link>
            <Link href="/privacy/" className="text-background/80 transition hover:text-accent"><Text value="Privacy"/></Link>
          </div>
        </div>
        <div>
          <p className="kicker kicker-on-dark"><Text value="Resources"/></p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/issues/" className="text-background/80 transition hover:text-accent"><Text value="Issues"/></Link>
            <Link href="/rss.xml" className="inline-flex items-center gap-2 text-background/80 transition hover:text-accent"><Rss size="0.875rem" /><Text value="RSS feed"/></Link>
          </div>
        </div>
      </div>
      <div className="site-footer-bottom border-t border-background/20"><div className="layout-wide flex flex-wrap justify-between gap-3 px-5 py-4 lg:px-8"><p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-background/50"><Text value="Copyright 2026 全球伯乐 News."/></p><p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-background/50">Filed from the global tech desk</p></div></div>
    </footer>
  );
}
