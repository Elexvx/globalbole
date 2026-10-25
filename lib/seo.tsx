import type { Metadata } from "next";
import { stories, categories, type Story } from "./data";
import { locales, isLocale, type Locale } from "./locales";
import { translatedTagSlug } from "./language-routes.mjs";
import { siteUrl } from "./site-url";
import { positioning, brandNames, brandAliases, siteName as publisherName } from "./site-brand";
import { homeSeo } from "./home-seo.mjs";
import { articleCitations } from "./article-citations.mjs";
import { articlePublishedDate } from "./publication-dates.mjs";
import { editorialPages, PUBLIC_CONTACT_EMAIL, type InfoPage } from "./editorial-policy";
import { tagDescription } from "./tag-descriptions.mjs";
import messages from "./messages.json";
import { decodeTagRouteSegment, tagLabel, tagMatchesSlug } from "./tag-routes.mjs";

const absolute = (path: string) => new URL(path, siteUrl + "/").href;
const translate = (key: string, locale: Locale) => (messages as Record<string, Record<string, string>>)[key]?.[locale] || key;
const articleLocale = (article: Story): Locale => isLocale(article.lang) ? article.lang : "en";
// Keep the fast, public root homepage canonical; /zh-CN/ remains a usable alias.
export const localizedCanonicalPath = (locale: Locale, path: string[] = []) =>
  locale === "zh-CN" && !path.length ? "/" : `/${locale}/${path.length ? path.join("/") + "/" : ""}`;

export function routeSeo(locale: Locale, path: string[] = []) {
  if (path[0] === "tag" && path[1]) path = [path[0], decodeTagRouteSegment(path[1]), ...path.slice(2)];
  const siteName = brandNames[locale];
  const infoPage = ["about", "authors", "contact", "privacy"].includes(path[0]) ? editorialPages[locale][path[0] as InfoPage] : undefined;
  const tagArticles = path[0] === "tag" ? stories.filter(story => story.lang === locale && story.tags.some(tag => tagMatchesSlug(tag, path[1]))) : [];
  const article = path[0] === "post" ? stories.find(story => story.slug === path[1]) : undefined;
  const contentLocale = article ? articleLocale(article) : locale;
  const canonicalPath = article ? localizedCanonicalPath(contentLocale, ["post", article.slug]) : localizedCanonicalPath(locale, path);
  const canonical = absolute(canonicalPath);
  const labels: Record<string, string> = { "all-news": "All News", issues: "Issues", issue: "Issues", about: "About 全球伯乐 News", authors: "Authors", contact: "Contact", privacy: "Privacy" };
  const category = categories.find(item => item.slug === path[1]);
  const section = path[0] === "category" ? translate(category?.label || path[1], locale)
    : path[0] === "tag" ? tagLabel(path[1], stories.flatMap(story => story.tags))
    : translate(labels[path[0]] || "", locale);
  const title = article?.title || infoPage?.title || (!path.length ? homeSeo[locale].title : `${section}${path[1] && path[0] !== "category" && path[0] !== "tag" ? ` · ${path[1]}` : ""}`);
  const description = article?.dek || infoPage?.description || (path[0] === "tag" ? tagDescription(locale, section, tagArticles) : !path.length ? homeSeo[locale].description : path[0] === "category" && category
    ? translate(category.description, locale)
    : `${siteName} · ${positioning[locale]}${section ? ` · ${section}` : ""}`);
  const metadataTitle = article?.seoTitle?.trim() || title;
  const documentTitle = article
    ? `${metadataTitle} — ${siteName}`
    : !path.length ? homeSeo[locale].title : `${title} — ${siteName}`;
  const metadataDescription = article?.seoDescription?.trim() || description;

  let alternateLocales: readonly Locale[] = locales;
  // Only advertise a matching content collection where that content exists.
  // Keep the translated homepage/category interfaces available and indexable.
  if (path[0] === "tag") alternateLocales = locales.filter(lang => Boolean(translatedTagSlug({slug:path[1],locale,next:lang,stories})));
  if (path[0] === "issue") alternateLocales = locales.filter(lang => stories.some(story => story.lang === lang && story.issue === path[1]));
  if (path[0] === "all-news" && path[1]) alternateLocales = locales.filter(lang => Math.ceil(stories.filter(story => story.lang === lang).length / 12) >= Number(path[1]));
  const languages: Record<string, string> = Object.fromEntries(article
    ? stories.filter(story => story.translationKey === article.translationKey).map(story => [articleLocale(story), absolute(localizedCanonicalPath(articleLocale(story), ["post", story.slug]))])
    : alternateLocales.map(lang => [lang, absolute(localizedCanonicalPath(lang, path[0]==="tag" ? ["tag",translatedTagSlug({slug:path[1],locale,next:lang,stories})!] : path))]));
  // An empty collection must not claim to be the translation of a populated one.
  const pageHasAlternate = Boolean(languages[contentLocale]);
  // Choose one fallback for the whole cluster, including when no Chinese translation exists.
  const fallbackLanguage = locales.find(lang => languages[lang]);
  const alternates = pageHasAlternate && fallbackLanguage ? { ...languages, "x-default": languages[fallbackLanguage] } : undefined;
  const images = article?.image ? [{ url: absolute(article.image), alt: article.imageAlt }] : undefined;
  const index = !article || contentLocale === locale;
  const metadata: Metadata = {
    title: { absolute: documentTitle }, description: metadataDescription,
    alternates: { canonical, languages: alternates, types: { "application/rss+xml": absolute(`/feeds/${contentLocale}.xml`) } },
    robots: { index, follow: true, googleBot: { index, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title: metadataTitle, description: metadataDescription, url: canonical, siteName, locale: contentLocale.replace("-", "_"), type: article ? "article" : "website", images, ...(article ? { publishedTime: articlePublishedDate(article), ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}), authors: [article.author], tags: article.tags } : {}) },
    twitter: { card: images ? "summary_large_image" : "summary", title: metadataTitle, description: metadataDescription, images },
  };

  const publisherId = absolute("/#publisher");
  const websiteId = absolute("/#website");
  const pageId = canonical + "#page";
  const articleId = canonical + "#article";
  const page = {
    "@type": path[0] === "contact" ? "ContactPage" : ["about", "authors"].includes(path[0]) ? "AboutPage" : path[0] === "tag" ? "CollectionPage" : "WebPage", "@id": pageId, url: canonical, name: title, description,
    inLanguage: contentLocale, isPartOf: { "@id": websiteId },
    ...(article ? { mainEntity: { "@id": articleId } } : infoPage ? { about: { "@id": publisherId } } : path[0] === "tag" ? { mainEntity: { "@type": "ItemList", numberOfItems: tagArticles.length, itemListElement: [...tagArticles].sort((a,b) => b.date.localeCompare(a.date)).map((story, index) => ({ "@type": "ListItem", position: index + 1, url: absolute(localizedCanonicalPath(locale, ["post", story.slug])), name: story.title })) } } : {}),
  };
  const knownPublisherAuthor = article && Object.values(brandNames).includes(article.author);
  const citations = article ? articleCitations(article.markdown) : [];
  const articleSchema = article ? {
    "@type": "NewsArticle", "@id": articleId, url: canonical,
    headline: article.title, description: article.dek, inLanguage: contentLocale,
    datePublished: articlePublishedDate(article), ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    ...(article.image ? { image: { "@type": "ImageObject", url: absolute(article.image), caption: article.imageAlt } } : {}),
    author: { "@type": "Organization", name: article.author, ...(knownPublisherAuthor ? { url: absolute(localizedCanonicalPath(contentLocale, ["authors"])) } : {}) },
    publisher: { "@id": publisherId }, mainEntityOfPage: { "@id": pageId },
    articleSection: translate(article.categoryLabel, contentLocale), keywords: article.tags,
    isAccessibleForFree: true, ...(citations.length ? { citation: citations } : {}),
  } : undefined;
  const breadcrumbItems = [
    { name: brandNames[contentLocale], item: absolute(localizedCanonicalPath(contentLocale)) },
    ...(article ? [{ name: translate(article.categoryLabel, contentLocale), item: absolute(localizedCanonicalPath(contentLocale, ["category", article.category])) }]
      : path[0] === "issue" ? [{ name: translate("Issues", locale), item: absolute(localizedCanonicalPath(locale, ["issues"])) }] : []),
    ...(path.length ? [{ name: title, item: canonical }] : []),
  ];
  const graph = [
    { "@type": "Organization", "@id": publisherId, name: publisherName, alternateName: brandAliases, url: absolute("/"), email: PUBLIC_CONTACT_EMAIL, contactPoint: { "@type": "ContactPoint", contactType: "editorial, corrections and rights", email: PUBLIC_CONTACT_EMAIL, availableLanguage: locales, url: absolute(localizedCanonicalPath(contentLocale, ["contact"])) }, publishingPrinciples: absolute(localizedCanonicalPath(contentLocale, ["about"])), correctionsPolicy: absolute(localizedCanonicalPath(contentLocale, ["contact"])) },
    { "@type": "WebSite", "@id": websiteId, name: publisherName, alternateName: brandAliases, url: absolute("/"), publisher: { "@id": publisherId }, inLanguage: locales },
    page,
    ...(articleSchema ? [articleSchema] : []),
    ...(breadcrumbItems.length > 1 ? [{ "@type": "BreadcrumbList", "@id": canonical + "#breadcrumb", itemListElement: breadcrumbItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })) }] : []),
  ];
  return { metadata, schema: { "@context": "https://schema.org", "@graph": graph } };
}

export function legacyMetadata(path: string[] = []): Metadata {
  const metadata = routeSeo("zh-CN", path).metadata;
  return { ...metadata, robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
