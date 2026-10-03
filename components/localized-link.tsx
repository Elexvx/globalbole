"use client";
import NextLink from "next/link";
import { useI18n } from "@/lib/i18n";
import { isLocale } from "@/lib/locales";
export default function Link(props:React.ComponentProps<typeof NextLink>) {
  const {locale}=useI18n();
  let href = props.href;
  if(href === "/rss.xml") href = `/feeds/${locale}.xml`;
  if(typeof href === "string" && href.startsWith("/") && !href.startsWith("//") && !isLocale(href.split("/")[1]) && !/\.(xml|txt|webp|png|jpg|svg)(?:[?#]|$)/.test(href)) href = "/" + locale + href;
  const isStaticDocument = typeof href === "string" && /\.(xml|txt)(?:[?#]|$)/.test(href);
  // A news page contains many repeated links. Avoid downloading whole article
  // routes before a reader chooses one; navigation still loads them on demand.
  return <NextLink {...props} href={href} prefetch={isStaticDocument ? false : (props.prefetch ?? false)} />;
}
