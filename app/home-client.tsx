"use client";

import { useEffect, useRef } from "react";
import { ReferenceHome } from "@/components/reference-home";
import { useArticles } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

export default function HomeClient() {
  const { articles } = useArticles();
  const { locale } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const content = JSON.stringify(articles.map(({slug, title, date, displayDate, dek, readTime, image, category, tags}) => [slug, title, date, displayDate, dek, readTime, image, category, tags]));
  useEffect(() => {
    let active = true;
    let dispose: (() => void) | undefined;
    const scriptUrl = "/site-home-layout.mjs";
    import(/* webpackIgnore: true */ scriptUrl).then(({mountHomeLayout}) => {
      if (active && rootRef.current) dispose = mountHomeLayout(rootRef.current);
    }).catch(() => { /* All reports remain available in their natural reading flow. */ });
    return () => { active = false; dispose?.(); };
  }, [locale, content]);
  return <ReferenceHome stories={articles} locale={locale} prefix={`/${locale}`} rootRef={rootRef} />;
}
