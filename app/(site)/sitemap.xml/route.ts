import { categories, stories } from "@/lib/data";
import { xmlEscape } from "@/lib/site-url";
import { locales } from "@/lib/locales";
import { routeSeo } from "@/lib/seo";
export const dynamic = "force-static";

export function GET() {
  const publicPaths: string[][] = [
    [], ["all-news"], ["about"], ["authors"], ["contact"], ["privacy"], ["issues"],
    ...categories.map(category => ["category", category.slug]),
  ];
  const entries = locales.flatMap(locale => {
    const articles = stories.filter(story => story.lang === locale);
    const paths = [
      ...publicPaths,
      ...[...new Set(articles.map(story => story.issue).filter(Boolean))].map(issue => ["issue", issue!]),
      ...Array.from({ length: Math.max(0, Math.ceil(articles.length / 12) - 1) }, (_, index) => ["all-news", String(index + 2)]),
      ...[...new Set(articles.flatMap(story => story.tags.map(tag => tag.replace(/\s+/g, "-"))))].map(tag => ["tag", tag]),
      ...articles.map(story => ["post", story.slug]),
    ];
    return paths.map(path => {
      const article = path[0] === "post" ? articles.find(story => story.slug === path[1]) : undefined;
      const metadata = routeSeo(locale, path).metadata;
      const canonical = String(metadata.alternates!.canonical);
      const alternatives = metadata.alternates?.languages || {};
      return "<url><loc>" + xmlEscape(canonical) + "</loc>" +
        // The content currently records a publication date, not an invented update time.
        (article ? `<lastmod>${xmlEscape(article.date)}</lastmod>` : "") +
        Object.entries(alternatives).map(([lang, url]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(String(url))}"/>`).join("") + "</url>";
    });
  });
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + entries.join("") + "</urlset>", {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
