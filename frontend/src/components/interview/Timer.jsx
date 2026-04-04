import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Timer({ durationMinutes, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 60; // Less than 1 minute

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm
      ${isLowTime ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 animate-pulse" : "bg-card text-foreground border-border"}
    `}>
      <Clock size={18} />
      <span className="font-mono font-medium text-lg tracking-wider">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
