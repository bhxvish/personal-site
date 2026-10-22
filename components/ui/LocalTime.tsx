"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live clock in Bhavish's time zone. Renders a stable placeholder on the server. */
export default function LocalTime({ seconds = true }: { seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = format.format(new Date());
      setNow(seconds ? t : t.slice(0, 5));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  return (
    <time className="tabular" suppressHydrationWarning>
      {now ?? (seconds ? "--:--:--" : "--:--")} {site.tzLabel}
    </time>
  );
}
