import type { ReactNode, Ref } from "react";

// Shared server-renderable markup. The static root needs only the tiny ticker
// enhancement; importing this component must never introduce React hydration.
export function WireTicker({
  children,
  label,
  rootRef,
  staticEntry = false,
}: {
  children: ReactNode;
  label: ReactNode;
  rootRef?: Ref<HTMLDivElement>;
  staticEntry?: boolean;
}) {
  return (
    <div ref={rootRef} data-news-ticker data-ticker-static={staticEntry || undefined} className="wire-ticker border-b border-border bg-background-wash">
      <div className="layout-wide flex min-h-8 items-center gap-4 overflow-hidden px-5 lg:px-8">
        <span className="kicker self-stretch inline-flex shrink-0 items-center bg-accent px-4 text-accent-foreground">{label}</span>
        <div className="wire-ticker-viewport min-w-0" data-ticker-viewport>
          <div className="wire-ticker-loop" data-ticker-track>
            <div className="wire-ticker-group" data-ticker-group>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
