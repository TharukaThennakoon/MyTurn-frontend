"use client";

import { useEffect, useState } from "react";

type Props = {
  initialSeconds?: number;
};

export default function CountdownTimer({ initialSeconds = 892 }: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = (seconds / initialSeconds) * 100;

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        Time Remaining
      </p>
      <p className="text-4xl font-bold text-amber-500 tabular-nums mb-3">
        {mins}:{secs}
      </p>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}