"use client";
import { useParams, usePathname } from "next/navigation";
import { locales, localeNames } from "@/lib/locales";
import { useI18n } from "@/lib/i18n";
import { useArticleData } from "@/lib/articles";
import { languageSwitchHref } from "@/lib/language-routes.mjs";

// Native links are available in the exported HTML, before hydration or without JS.
export function LanguageSelect() {
  const {allArticles:stories}=useArticleData();
  const {locale,t}=useI18n();
  const params=useParams();
  const pathname=usePathname();
  return <details className="language-menu">
    <summary aria-label={t("Language")}>◎ <span>{localeNames[locale]}</span></summary>
    <nav aria-label={t("Language")}>{locales.map(next=><a
      key={next} lang={next} hrefLang={next} data-language={next}
      aria-current={locale===next ? "true" : undefined}
      href={languageSwitchHref({params,pathname,locale,next,stories})}
      onClick={()=>{try{localStorage.setItem("globalbole-locale",next);}catch{}}}
    >{localeNames[next]}</a>)}</nav>
  </details>;
}
