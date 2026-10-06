import type { Locale } from "./locales";

export type HomeSeo = { title: string; description: string };
export const homeSeo: Record<Locale, HomeSeo>;
