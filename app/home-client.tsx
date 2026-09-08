"use client";

import { ReferenceHome } from "@/components/reference-home";
import { useArticles } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

export default function HomeClient() {
  const { articles } = useArticles();
  const { locale } = useI18n();
  return <ReferenceHome stories={articles} locale={locale} prefix={`/${locale}`} />;
}
