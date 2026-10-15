import { isLocale } from "@/lib/locales";
import { positioning } from "@/lib/site-brand";
import copy from "@/lib/rss-copy.json";

/** Shared markup for static home, localized home, category, tag and archive pages. */
export function RssBanner({
  locale,
  compact = false,
}: {
  locale: string;
  compact?: boolean;
}) {
  const language = isLocale(locale) ? locale : "zh-CN";
  const text = copy[language];
  const href = `/feeds/${language}.xml`;

  return (
    <section
      className={`ref-newsletter layout-wide px-5 lg:px-8 ${compact ? "my-8" : "pt-[var(--space-section)]"}`}
      aria-labelledby="newsletter-heading"
      data-rss-banner
    >
      <div className="ref-newsletter-inner">
        <div>
          <p className="ref-kicker">{text.newsletter}</p>
          <h2 id="newsletter-heading" className="ref-newsletter-title">{text.newsletterTitle}</h2>
        </div>
        <div className="ref-newsletter-action">
          <p>{positioning[language]}</p>
          <a href={href} className="ref-newsletter-button">{text.subscribe} <span aria-hidden="true">→</span></a>
          <small>{text.rssNote}</small>
        </div>
      </div>
    </section>
  );
}
