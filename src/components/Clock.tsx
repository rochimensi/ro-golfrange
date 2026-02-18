"use client";

import { useEffect, useState } from "react";

const GMT3 = "America/Argentina/Buenos_Aires";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-AR", {
    timeZone: GMT3,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function Clock() {
  const [time, setTime] = useState<string>(() =>
    formatTime(new Date())
  );

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      dateTime={time}
      className="tabular-nums text-white/90"
      aria-label={`Hora actual ${time} GMT-3`}
    >
      {time}
    </time>
  );
}
