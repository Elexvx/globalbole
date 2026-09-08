"use client";
import { HeaderClock } from "@/components/header-clock";

import { Text, useI18n } from "@/lib/i18n";


import { storyHref } from "@/lib/links";

import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "@/components/localized-link";
import { useEffect, useMemo, useState } from "react";
import { categories, type Story } from "@/lib/data";
import { useArticles } from "@/lib/articles";

const themes = [
  { value: "default", label: "Default" },
  { value: "civic-paper", label: "Civic Paper" },
  { value: "capitol-night", label: "Capitol Night" },
  { value: "campaign-trail", label: "Campaign Trail" },
  { value: "broadcast-pop", label: "Broadcast Pop" },
];

const navItems = [
  { href: "/category/technology/", label: "Technology" },
  { href: "/category/innovation/", label: "Innovation" },
  { href: "/category/business/", label: "Business" },
];

const matchesSearch = (story: Story, query: string) => {
  const haystack = [
    story.title,
    story.categoryLabel,
    story.author,
    story.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
};

function ThemeSelect({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const {t}=useI18n();
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const stored = window.localStorage.getItem("politica-theme") || "default";
    setTheme(stored);
    document.documentElement.dataset.theme = stored === "default" ? "" : stored;
  }, []);

  const changeTheme = (value: string) => {
    setTheme(value);
    window.localStorage.setItem("politica-theme", value);
    document.documentElement.dataset.theme = value === "default" ? "" : value;
  };

  return (
    <Select.Root value={theme} onValueChange={changeTheme}>
      <Select.Trigger
        aria-label={t("Choose visual theme")}
        className={
          "theme-select-nav inline-flex items-center gap-2 rounded-full border px-3 py-2 transition " +
          (dark ? "border-transparent bg-transparent text-background hover:bg-background/10" : "border-border bg-card text-foreground hover:border-border-strong") +
          (compact ? "w-full justify-between" : "")
        }
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown size="0.875rem" strokeWidth={1.8} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-50 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-sm text-foreground shadow-xl"
        >
          <Select.Viewport>
            {themes.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="cursor-pointer rounded-lg px-3 py-2 outline-none data-[highlighted]:bg-muted"
              >
                <Select.ItemText>{<Text value={item.label}/>}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function SearchResults({
  query,
  searching,
  onNavigate,
}: {
  query: string;
  searching: boolean;
  onNavigate?: () => void;
}) {
  const { articles } = useArticles();
  const results = useMemo(
    () => (query.trim() ? articles.filter((story) => matchesSearch(story, query)).slice(0, 5) : []),
    [articles, query],
  );

  if (!query.trim()) {
    return null;
  }
  if (searching) return <p className="text-sm text-muted-foreground"><Text value="Searching…"/></p>;
  if (!results.length) return <p className="text-sm text-muted-foreground"><Text value="No stories found."/></p>;

  return (
    <div className="mt-4 divide-y divide-border border-y border-border">
      {results.map((story) => (
        <Link
          key={story.slug}
          href={storyHref(story)}
          onClick={onNavigate}
          className="group flex items-start justify-between gap-4 py-3"
        >
          <span>
            <span className="kicker block">{story.categoryLabel}</span>
            <span className="story-link mt-1 block text-lg font-bold leading-tight">{story.title}</span>
          </span>
          <span className="shrink-0 pt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            {story.displayDate}
          </span>
        </Link>
      ))}
    </div>
  );
}

function DesktopSearch() {
  const {t}=useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(() => setSearching(false), 420);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative hidden lg:block" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <button
        type="button"
        aria-label={t("Search")}
        aria-expanded={open}
        aria-controls="desktop-search-panel"
        className="inline-flex h-11 items-center justify-center rounded-none border-0 px-2 text-background transition hover:bg-background/10"
        onClick={() => setOpen((value) => !value)}
      >
        <Search size="0.9375rem" strokeWidth={1.8} />
        <span className="sr-only"><Text value="Search"/></span>
      </button>
      {open ? (
        <div id="desktop-search-panel" className="absolute right-0 top-full z-40 max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto border border-border bg-card p-3 text-foreground shadow-md">
          <label className="kicker mb-2 block" htmlFor="desktop-site-search"><Text value="Search the edition"/></label>
          <div className="flex items-center gap-2 border border-border bg-background px-2 focus-within:border-foreground">
            <Search size="0.875rem" className="shrink-0 text-muted-foreground" />
            <input
              id="desktop-site-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search headlines, desks, or keywords.")}
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <SearchResults query={query} searching={searching} />
        </div>
      ) : null}
    </div>
  );
}

function MobileMenu() {
  const {t}=useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(() => setSearching(false), 420);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("Open menu")}
          className="inline-flex size-11 items-center justify-center rounded-none border-2 border-border lg:hidden"
        >
          <Menu size="1.1875rem" strokeWidth={1.8} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
        <Dialog.Content aria-describedby={undefined} className="mobile-menu-panel fixed inset-0 z-50 overflow-y-auto bg-background text-foreground outline-none">
          <Dialog.Title className="sr-only"><Text value="全球伯乐 News navigation"/></Dialog.Title>
          <div className="leader-bar" />
          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-5 pb-8 pt-5">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <Link href="/" onClick={() => setOpen(false)} className="font-display text-2xl font-black tracking-normal">
                <Text value="全球伯乐"/> <span className="brand-accent">News</span>
              </Link>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t("Close menu")}
                  className="inline-flex size-11 items-center justify-center rounded-none border-2 border-border"
                >
                  <X size="1.1875rem" strokeWidth={1.8} />
                </button>
              </Dialog.Close>
            </div>
            <div className="mt-8">
              <label className="kicker mb-2 block" htmlFor="mobile-site-search"><Text value="Search the edition"/></label>
              <div className="flex items-center gap-3 border border-border bg-card px-3 focus-within:border-foreground">
                <Search size="1.0625rem" className="text-muted-foreground" />
                <input
                  id="mobile-site-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("Search headlines, desks, or keywords.")}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <SearchResults query={query} searching={searching} onNavigate={() => setOpen(false)} />
            </div>
            <nav className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6 sm:grid-cols-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="story-link min-w-0 min-h-11 break-words font-display text-xl font-extrabold sm:text-2xl"
                >
                  {<Text value={item.label}/>}
                </Link>
              ))}
              <Link
                href="/all-news/"
                onClick={() => setOpen(false)}
                className="story-link min-w-0 min-h-11 break-words font-display text-xl font-extrabold sm:text-2xl"
              ><Text value="All News"/></Link>
              <Link href="/rss.xml" onClick={() => setOpen(false)} className="story-link min-w-0 min-h-11 break-words font-display text-xl font-extrabold sm:text-2xl"><Text value="RSS feed"/></Link>
            </nav>
            <div className="mt-auto pt-10">
              <p className="kicker mb-3"><Text value="Visual edition"/></p>
              <ThemeSelect compact />
              <Link href="/issues/" onClick={() => setOpen(false)} className="mt-4 inline-flex text-sm font-bold underline underline-offset-4">
                <Text value="Issues"/>
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function SiteHeader() {
  const {articles}=useArticles();
  const tickerStories=articles.slice(0,8);

  return (
    <header className="bg-surface">
      <div className="leader-bar" />
      <div className="wire-ticker border-b border-border bg-background-wash">
        <div className="layout-wide flex min-h-8 items-center gap-4 overflow-hidden px-5 lg:px-8">
          <span className="kicker self-stretch inline-flex shrink-0 items-center bg-accent px-4 text-accent-foreground"><Text value="The Wire"/></span>
          <div className="wire-ticker-viewport min-w-0">
            <div className="wire-ticker-loop flex min-w-max items-center gap-10 whitespace-nowrap">
              {[...tickerStories, ...tickerStories].map((story, index) => (
                <Link key={story.slug + "-" + index} href={storyHref(story)} className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                  <span className="mr-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-accent">{story.categoryLabel}</span>
                  {story.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="layout-wide px-5 lg:px-8">
        <div className="site-brand-row flex items-center justify-between gap-4 py-5 lg:py-7">
          <Link href="/" className="min-w-0">
            <span className="block font-display text-[clamp(1.5rem,4.3vw,4rem)] font-black leading-none tracking-normal">
              <Text value="全球伯乐"/> <span className="brand-accent">News</span>
            </span>
            <span className="mt-2 hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:block"><Text value="Power, policy, and the people who move them"/></span>
          </Link>
          <div className="header-actions hidden items-center gap-6 text-right lg:flex">
            <div>
              <HeaderClock />
            </div>
            <Link href="/rss.xml" className="header-action-link">RSS</Link>
            <Link href="/rss.xml" className="header-action-link"><Text value="Subscribe"/></Link>
          </div>
          <MobileMenu />
        </div>
      </div>
      <div className="desktop-edition-nav hidden bg-foreground text-background lg:block">
        <div className="layout-wide flex min-h-11 items-center justify-between gap-8 px-5 lg:px-8">
          <nav className="flex min-w-0 items-center gap-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="theme-select-nav story-link whitespace-nowrap text-background">
                {<Text value={item.label}/>}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <ThemeSelect dark />
            <DesktopSearch />
            <Link href="/all-news/" className="inline-flex h-11 items-center px-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-background transition hover:text-accent"><Text value="All News"/></Link>
          </div>
        </div>
      </div>
    </header>
  );
}
