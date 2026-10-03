import { legacyMetadata } from "@/lib/seo";
export const metadata = legacyMetadata(["about"]);
import Info from "@/components/info-view";
export default function Page(){ return <Info page="about"/>; }
