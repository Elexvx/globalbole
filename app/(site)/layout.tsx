import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { I18nProvider } from "@/lib/i18n";
import { ArticleDataProvider } from "@/lib/articles";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <I18nProvider>
      <ArticleDataProvider>
        <SiteHeader />
        {children}
        <SiteFooter />
      </ArticleDataProvider>
    </I18nProvider>
  );
}
