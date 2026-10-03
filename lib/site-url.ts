// Preview deployments must not replace the established canonical domain.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.globalbole.com").replace(/\/$/, "");
export function xmlEscape(value:string) {
  return value.replace(/[<>&"']/g, char => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"})[char]!);
}
