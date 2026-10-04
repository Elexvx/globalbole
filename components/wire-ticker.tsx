import type { ReactNode, Ref } from "react";
import type { Locale } from "@/lib/locales";

const controls: Record<Locale, { pause: string; resume: string }> = {
  "zh-CN": { pause: "暂停新闻滚动", resume: "继续新闻滚动" },
  "zh-TW": { pause: "暫停新聞捲動", resume: "繼續新聞捲動" },
  en: { pause: "Pause news ticker", resume: "Resume news ticker" },
  ru: { pause: "Приостановить ленту новостей", resume: "Продолжить ленту новостей" },
  fr: { pause: "Mettre le fil d’actualité en pause", resume: "Reprendre le fil d’actualité" },
};

// Shared server-renderable markup. The static root needs only the tiny ticker
// enhancement; importing this component must never introduce React hydration.
export function WireTicker({
  children,
  label,
  locale,
  rootRef,
  staticEntry = false,
}: {
  children: ReactNode;
  label: ReactNode;
  locale: Locale;
  rootRef?: Ref<HTMLDivElement>;
  staticEntry?: boolean;
}) {
  const copy = controls[locale];
  return (
    <div ref={rootRef} data-news-ticker data-ticker-static={staticEntry || undefined} className="wire-ticker border-b border-border bg-background-wash">
      <div className="layout-wide flex min-h-8 items-center gap-4 overflow-hidden px-5 lg:px-8">
        <span className="kicker self-stretch inline-flex shrink-0 items-center bg-accent px-4 text-accent-foreground">{label}</span>
        <div className="wire-ticker-viewport min-w-0" data-ticker-viewport>
          <div className="wire-ticker-loop" data-ticker-track>
            <div className="wire-ticker-group" data-ticker-group>{children}</div>
          </div>
        </div>
        <button
          type="button"
          className="wire-ticker-toggle"
          data-ticker-toggle
          data-pause-label={copy.pause}
          data-resume-label={copy.resume}
          aria-label={copy.pause}
          title={copy.pause}
          hidden
        >
          <svg className="wire-ticker-pause-icon" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3h3v10H4zM9 3h3v10H9z" /></svg>
          <svg className="wire-ticker-play-icon" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="m5 2 9 6-9 6z" /></svg>
        </button>
      </div>
    </div>
  );
}
