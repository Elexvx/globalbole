import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { I18nProvider } from "@/lib/i18n";
import { ArticleDataProvider } from "@/lib/articles";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: { index: false, follow: true },
  title: {
    default: "全球伯乐 News — 专注科技、创新、商业领域",
    template: "%s — 全球伯乐 News",
  },
  description: "全球伯乐 News，专注科技、创新、商业领域。",
  icons: {
    icon: "/reference-assets/51321e5a444f1575.webp",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <ArticleDataProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          </ArticleDataProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
