import { stories, type Story } from "./data";
export function storyHref(story: Pick<Story,"slug">) {
  return `/post/${encodeURIComponent(story.slug)}/`;
}
export function tagHref(tag:string) {
  const slug = tag.replace(/\s+/g,"-");
  return `/tag/${encodeURIComponent(slug)}/`;
}
