"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/locales";

// Keep route content synchronous during static export. An async view can leave
// the entire main section in a hidden streaming slot until client script runs.
// Article parsing is still separately deferred for changed API content only.
import Home from "@/app/home-client";
import Category from "@/app/(site)/category/[slug]/view";
import Post from "@/app/(site)/post/[slug]/view";
import Tag from "@/app/(site)/tag/[slug]/view";
import Archive from "@/app/(site)/all-news/[[...page]]/view";
import Issues from "@/app/(site)/issues/page";
import Issue from "@/components/issue-view";
import Info from "@/components/info-view";

export function RouteView({path,initialMarkdown,initialLocale,children}: {path:string[];initialMarkdown?:string;initialLocale?:Locale;children?:ReactNode}) {
  switch(path[0]) {
    case undefined: return <Home/>;
    case "category": return <Category/>;
    case "post": return <Post initialMarkdown={initialMarkdown} initialLocale={initialLocale}>{children}</Post>;
    case "tag": return <Tag/>;
    case "all-news": return <Archive/>;
    case "issues": return <Issues/>;
    case "issue": return <Issue issue={path[1]}/>;
    case "about": case "authors": case "contact": case "privacy": return <Info page={path[0]}/>;
    default: return null;
  }
}
