import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { other: { "msvalidate.01": "85D64C4838DBA44D1E08BFEA2268C749" } },
  robots: {
    follow: true,
    googleBot: { follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  title: {
    default: "全球伯乐 News — 关注科技、财经、职场生活、国内外要闻与能源产业",
    template: "%s — 全球伯乐 News",
  },
  description: "全球伯乐 News，关注科技、财经、职场生活、国内外要闻与能源产业。",
  openGraph: {
    title: "全球伯乐 News",
    description: "全球伯乐 News，关注科技、财经、职场生活、国内外要闻与能源产业。",
    url: siteUrl + "/",
    siteName: "全球伯乐 News",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "全球伯乐 News",
    description: "全球伯乐 News，关注科技、财经、职场生活、国内外要闻与能源产业。",
  },
  icons: {
    icon: "/reference-assets/51321e5a444f1575.webp",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
