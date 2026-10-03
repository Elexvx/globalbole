import { stories } from "@/lib/data";
import { siteUrl, xmlEscape } from "@/lib/site-url";
export const dynamic = "force-static";

export function GET() {
  const baseUrl = xmlEscape(siteUrl);
  const items = [...stories].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 50).map((story) => (
    "<item>" +
    "<title>" + xmlEscape(story.title) + "</title>" +
    "<link>" + baseUrl + "/" + (story.lang || "en") + "/post/" + encodeURIComponent(story.slug) + "/</link>" +
    "<guid>" + baseUrl + "/" + (story.lang || "en") + "/post/" + encodeURIComponent(story.slug) + "/</guid>" +
    "<pubDate>" + new Date(story.date + "T12:00:00Z").toUTCString() + "</pubDate>" +
    "<description>" + xmlEscape(story.dek) + "</description>" +
    "</item>"
  )).join("");
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0"><channel>' +
    "<title>全球伯乐 News</title><link>" + baseUrl + "</link><description>关注科技、财经、职场生活、国内外要闻与能源产业</description>" +
    items +
    "</channel></rss>";
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
