"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function HeaderClock() {
  const { locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <time dateTime={now?.toISOString()} className="block text-lg font-semibold leading-relaxed tabular-nums" aria-live="off">
      <span className="block whitespace-nowrap">{now ? now.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" }) : "—"}</span>
      <span className="block text-xl tracking-wider">{now ? now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }) : "--:--:--"}</span>
    </time>
  );
}
