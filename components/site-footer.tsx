import { Text } from "@/lib/i18n";
import { Rss } from "lucide-react";
import Link from "@/components/localized-link";
import { categories } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-[0.1875rem] border-border-strong bg-foreground text-background">
      <div className="layout-wide grid gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link href="/" className="font-display text-2xl font-black tracking-normal">
            <Text value="全球伯乐"/> <span className="brand-accent-inverse">News</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/70"><Text value="An independent political daily for the decisions behind the headlines."/></p>
          <p className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-background/50"><Text value="Copyright 2026 全球伯乐 News. Filed from the press gallery."/></p>
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
    </footer>
  );
}
