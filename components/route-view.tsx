"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/locales";

// Split each view at the client boundary while retaining static HTML prerendering.
// In particular, archive/home pages do not need the Markdown parser or share tools.
const Home = dynamic(() => import("@/app/home-client"));
const Category = dynamic(() => import("@/app/(site)/category/[slug]/view"));
const Post = dynamic(() => import("@/app/(site)/post/[slug]/view"));
const Tag = dynamic(() => import("@/app/(site)/tag/[slug]/view"));
const Archive = dynamic(() => import("@/app/(site)/all-news/[[...page]]/view"));
const Issues = dynamic(() => import("@/app/(site)/issues/page"));
const Issue = dynamic(() => import("@/components/issue-view"));
const Info = dynamic(() => import("@/components/info-view"));

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
