"use client";
import * as Select from "@radix-ui/react-select";
import { useParams, useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/locales";
import { useI18n } from "@/lib/i18n";
import { useArticleData } from "@/lib/articles";
export function LanguageSelect() {
  const {allArticles:stories}=useArticleData();
  const {locale,t}=useI18n(); const params=useParams(); const router=useRouter();
  const change=(next:string)=>{
    const segments=Array.isArray(params.path)?[...params.path]:[];
    if(segments[0]==="post") {
      const current=stories.find(story=>story.slug===segments[1]);
      const translated=current?.translationKey && stories.find(story=>story.translationKey===current.translationKey && story.lang===next);
      if(translated)segments[1]=translated.slug;
    }
    router.push("/"+next+"/"+segments.map(encodeURIComponent).join("/")+(segments.length?"/":""));
  };
  return <Select.Root value={locale} onValueChange={change}><Select.Trigger aria-label={t("Language")} className="header-text-link"><Select.Value>{locale === "zh-CN" ? "中文" : locale === "zh-TW" ? "繁體中文" : localeNames[locale]}</Select.Value></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={5} className="z-[100] rounded-xl border border-border bg-card p-1 text-foreground shadow-xl"><Select.Viewport>{locales.map(item=><Select.Item key={item} value={item} className="cursor-pointer rounded-lg px-4 py-2 text-sm outline-none data-[highlighted]:bg-muted"><Select.ItemText>{localeNames[item]}</Select.ItemText></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>;
}
