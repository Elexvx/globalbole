import { StaticSiteFooter, StaticSiteHeader } from "@/components/static-site-chrome";
import { ReferenceHome } from "@/components/reference-home";
import { stories } from "@/lib/data";

export default function HomePage() {
  const localizedStories = stories.filter((story) => story.lang === "zh-CN");

  return <>
    <StaticSiteHeader />
    <ReferenceHome stories={localizedStories} locale="zh-CN" prefix="/zh-CN" />
    <StaticSiteFooter />
  </>;
}
