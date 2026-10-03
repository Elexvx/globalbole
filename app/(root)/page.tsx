import { StaticSiteFooter, StaticSiteHeader } from "@/components/static-site-chrome";
import { ReferenceHome } from "@/components/reference-home";
import { stories } from "@/lib/data";
import { routeSeo, JsonLd } from "@/lib/seo";

export const metadata = routeSeo("zh-CN").metadata;

export default function HomePage() {
  const localizedStories = stories.filter((story) => story.lang === "zh-CN");

  return <>
    <JsonLd data={routeSeo("zh-CN").schema} />
    <StaticSiteHeader />
    <ReferenceHome stories={localizedStories} locale="zh-CN" prefix="/zh-CN" />
    <StaticSiteFooter />
  </>;
}
