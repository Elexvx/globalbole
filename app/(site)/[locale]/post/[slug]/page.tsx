import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { stories } from "@/lib/data";
import { routeSeo, JsonLd } from "@/lib/seo";
import { ArticleMarkdown } from "@/components/article-markdown";
import Post from "@/app/(site)/post/[slug]/view";

type Params = { locale: string; slug: string };
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap(locale => stories.map(story => ({ locale, slug: story.slug })));
}
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return routeSeo(locale, ["post", slug]).metadata;
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const initialMarkdown = stories.find(story => story.slug === slug)?.markdown;
  return <><JsonLd data={routeSeo(locale, ["post", slug]).schema}/><Post initialMarkdown={initialMarkdown} initialLocale={locale}>{initialMarkdown ? <ArticleMarkdown markdown={initialMarkdown} locale={locale}/> : null}</Post></>;
}
