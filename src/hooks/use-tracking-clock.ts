import { useEffect, useState } from "react";

export function useTrackingClock(enabled = true, intervalMs = 1_000): number {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, intervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, intervalMs]);

  return now;
}
