import { legacyMetadata } from "@/lib/seo";
export const metadata = legacyMetadata(["authors"]);
import Info from "@/components/info-view";
export default function Page(){ return <Info page="authors"/>; }
