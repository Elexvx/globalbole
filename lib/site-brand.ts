import type { Locale } from "./locales";
export const siteName = "全球伯乐 News";
export const brandNames: Record<Locale,string> = {"zh-CN":siteName,"zh-TW":"全球伯樂 News",en:"Global Bole News",ru:"Global Bole News",fr:"Global Bole News"};
export const positioning: Record<Locale, string> = {
  "zh-CN": "关注科技、财经、职场生活、国内外要闻与能源产业",
  "zh-TW": "關注科技、財經、職場生活、國內外要聞與能源產業",
  en: "Technology, finance, work and city life, current affairs, energy and industry",
  ru: "Технологии, экономика, работа и город, главные новости, энергетика и промышленность",
  fr: "Technologie, économie, emploi et ville, actualités, énergie et industrie",
};
