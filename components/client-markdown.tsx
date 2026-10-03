"use client";

import { lazy, Suspense, type ReactNode } from "react";
import type { Locale } from "@/lib/locales";

// The parser is downloaded only when the optional article API supplies a new body.
// React.lazy keeps this import out of the published article's initial client graph.
const FreshMarkdown = lazy(() => import("./article-markdown").then(module => ({default: module.ArticleMarkdown})));

export function ClientMarkdown({markdown,locale,initialMarkdown,initialLocale,children}: {
  markdown:string;
  locale:Locale;
  initialMarkdown?:string;
  initialLocale?:Locale;
  children?:ReactNode;
}) {
  if (markdown === initialMarkdown && locale === initialLocale) return children;

  // Keep the complete published article visible while a refreshed body's parser loads.
  return <Suspense fallback={children}><FreshMarkdown markdown={markdown} locale={locale}/></Suspense>;
}
