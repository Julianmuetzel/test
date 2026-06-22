"use client";

import { cn } from "@/lib/utils";

interface HumanScoreProps {
  score: number;
  className?: string;
}

export function HumanScore({ score, className }: HumanScoreProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return "#a855f7";
    if (s >= 75) return "#3b82f6";
    if (s >= 50) return "#22c55e";
    return "#94a3b8";
  };

  const getLabel = (s: number) => {
    if (s >= 90) return "Außergewöhnlich";
    if (s >= 75) return "Überdurchschnittlich";
    if (s >= 50) return "Durchschnittlich";
    if (s > 0) return "Unter Durchschnitt";
    return "Noch keine Tests";
  };

  const color = getColor(score);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.5s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-xs text-slate-400 mt-1">Human Score</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium" style={{ color }}>
        {getLabel(score)}
      </span>
    </div>
  );
}
