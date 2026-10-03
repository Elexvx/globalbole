import { decodeTagRouteSegment } from "./tag-routes.mjs";

// Catch-all routes still expose path; explicit home/archive/article routes do not.
// Only read localized pathname segments, preserving legacy route behavior.
export function languageSwitchHref({ params, pathname, locale, next, stories }) {
  const prefix = "/" + locale + "/";
  const segments = Array.isArray(params.path) ? [...params.path]
    : params.locale === locale && pathname.startsWith(prefix)
      ? pathname.slice(prefix.length).split("/").filter(Boolean) : [];
  if (segments[0] === "tag" && segments[1]) segments[1] = decodeTagRouteSegment(segments[1]);
  if (segments[0] === "post") {
    const current = stories.find(story => story.slug === segments[1]);
    const translated = current?.translationKey && stories.find(story => story.translationKey === current.translationKey && story.lang === next);
    if (translated) segments[1] = translated.slug;
  }
  return "/" + next + "/" + segments.map(encodeURIComponent).join("/") + (segments.length ? "/" : "");
}
