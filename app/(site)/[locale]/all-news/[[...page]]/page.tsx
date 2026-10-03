import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { stories } from "@/lib/data";
import { routeSeo, JsonLd } from "@/lib/seo";
import Archive from "@/app/(site)/all-news/[[...page]]/view";

type Params = { locale: string; page?: string[] };
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap(locale => Array.from({
    length: Math.max(1, Math.ceil(stories.filter(story => story.lang === locale).length / 12)),
  }, (_, index) => ({ locale, page: index === 0 ? [] : [String(index + 1)] })));
}
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, page = [] } = await params;
  if (!isLocale(locale)) notFound();
  return routeSeo(locale, ["all-news", ...page]).metadata;
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, page = [] } = await params;
  if (!isLocale(locale)) notFound();
  return <><JsonLd data={routeSeo(locale, ["all-news", ...page]).schema}/><Archive/></>;
}
