export const locales = ["zh-CN", "zh-TW", "en", "ru", "fr"] as const;
export type Locale = typeof locales[number];
export const localeNames: Record<Locale,string> = {"zh-CN":"简体中文","zh-TW":"繁體中文",en:"English",ru:"Русский",fr:"Français"};
export function isLocale(value:unknown): value is Locale { return locales.includes(value as Locale); }
