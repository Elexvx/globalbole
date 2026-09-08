export const dynamic = "force-static";
import { siteUrl } from "@/lib/site-url";
export function GET() {
  const baseUrl = siteUrl;
  return new Response("User-agent: *\nAllow: /\n\nSitemap: " + baseUrl + "/sitemap.xml\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
