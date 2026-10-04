import { decodeTagRouteSegment, tagMatchesSlug } from "./tag-routes.mjs";

// Tags in linked translations are maintained in the same editorial order.
// Resolve their visible language-specific labels through the shared story identity.
export function translatedTagSlug({slug, locale, next, stories}) {
  for (const current of stories.filter(story=>story.lang===locale)) {
    const index=current.tags?.findIndex(tag=>tagMatchesSlug(tag,slug)) ?? -1;
    if(index<0) continue;
    const translated=stories.find(story=>story.translationKey===current.translationKey && story.lang===next);
    const tag=translated?.tags?.[index];
    if(tag) return tag.replace(/\s+/g,"-");
  }
  return undefined;
}

// Catch-all routes expose path; explicit home/archive/article routes do not.
export function languageSwitchHref({ params, pathname, locale, next, stories }) {
  const prefix = "/" + locale + "/";
  const segments = Array.isArray(params.path) ? [...params.path]
    : params.locale === locale && pathname.startsWith(prefix)
      ? pathname.slice(prefix.length).split("/").filter(Boolean) : [];
  if (segments[0] === "tag" && segments[1]) {
    const slug=decodeTagRouteSegment(segments[1]);
    segments[1]=translatedTagSlug({slug,locale,next,stories}) || slug;
  }
  if (segments[0] === "post") {
    const current = stories.find(story => story.slug === segments[1]);
    const translated = current?.translationKey && stories.find(story => story.translationKey === current.translationKey && story.lang === next);
    if (translated) segments[1] = translated.slug;
  }
  return "/" + next + "/" + segments.map(encodeURIComponent).join("/") + (segments.length ? "/" : "");
}
