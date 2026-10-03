"use client";
import * as Select from "@radix-ui/react-select";
import { useParams, usePathname, useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/locales";
import { useI18n } from "@/lib/i18n";
import { useArticleData } from "@/lib/articles";
import { languageSwitchHref } from "@/lib/language-routes.mjs";
export function LanguageSelect() {
  const {allArticles:stories}=useArticleData();
  const {locale,t}=useI18n(); const params=useParams(); const pathname=usePathname(); const router=useRouter();
  const change=(next:string)=>{
    router.push(languageSwitchHref({ params, pathname, locale, next, stories }));
  };
  return <Select.Root value={locale} onValueChange={change}><Select.Trigger aria-label={t("Language")} className="header-text-link"><Select.Value>{locale === "zh-CN" ? "中文" : locale === "zh-TW" ? "繁體中文" : localeNames[locale]}</Select.Value></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={5} className="z-[100] rounded-xl border border-border bg-card p-1 text-foreground shadow-xl"><Select.Viewport>{locales.map(item=><Select.Item key={item} value={item} className="cursor-pointer rounded-lg px-4 py-2 text-sm outline-none data-[highlighted]:bg-muted"><Select.ItemText>{localeNames[item]}</Select.ItemText></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>;
}
