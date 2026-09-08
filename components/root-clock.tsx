"use client";

import { useEffect, useState } from "react";

export function RootClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <time dateTime={now.toISOString()} suppressHydrationWarning className="block text-right text-lg font-semibold leading-relaxed tabular-nums">
      <span className="block whitespace-nowrap">{now.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
      <span className="block text-xl tracking-wider">{now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })}</span>
    </time>
  );
}
