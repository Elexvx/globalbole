"use client";
import { createContext, useContext, useEffect } from "react";
import { useParams } from "next/navigation";
import messages from "./messages.json";
import { isLocale, type Locale } from "./locales";
const Context = createContext<Locale>("zh-CN");
export function I18nProvider({children}:{children:React.ReactNode}) {
  const params = useParams();
  const locale = isLocale(params?.locale) ? params.locale : "zh-CN";
  useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dataset.locale=locale;},[locale]);
  return <Context.Provider value={locale}>{children}</Context.Provider>;
}
export function useI18n() {
  const locale = useContext(Context);
  const t = (key:string) => (messages as Record<string,Record<string,string>>)[key]?.[locale] || key;
  return {locale,t};
}
export function Text({value}:{value:string}) { const {t}=useI18n(); return <>{t(value)}</>; }
