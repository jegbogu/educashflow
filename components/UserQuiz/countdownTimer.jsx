import { useEffect, useState } from "react";

/**
 * Simple countdown component.
 * - Starts from `start` seconds on mount.
 * - Calls `onComplete()` once when it reaches 0 (parent handles lock / retry visibility).
 * - To restart the timer, parent should REMOUNT it (e.g., by changing a `key`).
 */
export default function CountdownTimer({ start = 10, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(start);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (typeof onComplete === "function") onComplete();
      return; // stop ticking
    }

    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onComplete]);

  return <p className="text-lg font-semibold">{timeLeft}s</p>;
}
