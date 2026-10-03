import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/locales";
import { routeSeo, JsonLd } from "@/lib/seo";
import Home from "@/app/home-client";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return routeSeo(locale, []).metadata;
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><JsonLd data={routeSeo(locale, []).schema}/><Home/></>;
}
