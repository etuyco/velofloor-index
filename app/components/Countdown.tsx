"use client";

import { useEffect, useState } from "react";

// ISO 8601 (local time) — parsed reliably across browsers. Safari returns
// Invalid Date for the "June 15, 2026 00:00:00" format.
const TARGET_DATE = new Date("2026-06-22T00:00:00").getTime();

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const ZERO: TimeLeft = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

function getTimeLeft(): TimeLeft {
  const difference = TARGET_DATE - new Date().getTime();

  if (difference <= 0) {
    return ZERO;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: days.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export default function Countdown() {
  // Start from ZERO so server and client render the same markup (avoids hydration mismatch).
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto mb-10 bg-white p-6 rounded-2xl border border-brand-sand shadow-sm">
      <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest font-bold mb-4 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-emerald animate-ping"></span>{" "}
        Live Countdown to Launch
      </div>

      <div className="grid grid-cols-4 gap-4 text-brand-ink">
        {UNITS.map((unit) => (
          <div
            key={unit.key}
            className="bg-brand-paper p-3 rounded-lg border border-brand-sand"
          >
            <div className="font-mono font-bold text-3xl md:text-4xl tracking-tight">
              {timeLeft[unit.key]}
            </div>
            <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
