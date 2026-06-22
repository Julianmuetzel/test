"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "waiting" | "ready" | "result" | "tooEarly";

interface ReactionTimeTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

export function ReactionTimeTest({ onComplete }: ReactionTimeTestProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MAX_ATTEMPTS = 5;

  const startTest = useCallback(() => {
    setPhase("waiting");
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setPhase("ready");
      startRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "idle") {
      startTest();
      return;
    }

    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooEarly");
      return;
    }

    if (phase === "ready") {
      const rt = Math.round(performance.now() - startRef.current);
      setReactionTime(rt);
      const newAttempts = [...attempts, rt];
      setAttempts(newAttempts);

      if (newAttempts.length >= MAX_ATTEMPTS) {
        const avg = Math.round(newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length);
        const best = Math.min(...newAttempts);
        setPhase("result");
        onComplete(best, { average: avg, attempts: newAttempts });
      } else {
        setPhase("result");
      }
      return;
    }

    if (phase === "result" && attempts.length < MAX_ATTEMPTS) {
      startTest();
    }

    if (phase === "tooEarly") {
      startTest();
    }
  }, [phase, attempts, startTest, onComplete]);

  const getBgColor = () => {
    if (phase === "waiting") return "bg-red-900/30 border-red-500/30";
    if (phase === "ready") return "bg-green-900/40 border-green-500/40 cursor-pointer";
    if (phase === "tooEarly") return "bg-yellow-900/30 border-yellow-500/30";
    return "bg-white/5 border-white/10";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Versuch {Math.min(attempts.length + 1, MAX_ATTEMPTS)} von {MAX_ATTEMPTS}
        </p>
        <div className="flex gap-2 mt-2 justify-center">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i < attempts.length ? "bg-green-500" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <div
        onClick={handleClick}
        className={cn(
          "w-full max-w-sm h-64 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 select-none",
          getBgColor()
        )}
      >
        {phase === "idle" && (
          <div className="text-center px-6">
            <p className="text-2xl mb-2">👆</p>
            <p className="text-white font-semibold text-lg">Tippe hier</p>
            <p className="text-slate-400 text-sm mt-1">um zu starten</p>
          </div>
        )}
        {phase === "waiting" && (
          <div className="text-center">
            <p className="text-4xl mb-2">🔴</p>
            <p className="text-slate-300 font-medium">Warte...</p>
            <p className="text-slate-500 text-sm mt-1">Nicht zu früh klicken!</p>
          </div>
        )}
        {phase === "ready" && (
          <div className="text-center">
            <p className="text-5xl mb-2">🟢</p>
            <p className="text-green-300 font-bold text-xl">JETZT!</p>
          </div>
        )}
        {phase === "tooEarly" && (
          <div className="text-center">
            <p className="text-4xl mb-2">⚠️</p>
            <p className="text-yellow-300 font-semibold">Zu früh!</p>
            <p className="text-slate-400 text-sm mt-1">Tippe um erneut zu versuchen</p>
          </div>
        )}
        {phase === "result" && reactionTime !== null && (
          <div className="text-center">
            <p className="text-5xl font-bold text-white">{reactionTime}</p>
            <p className="text-slate-400 text-sm mt-1">Millisekunden</p>
            {attempts.length < MAX_ATTEMPTS && (
              <p className="text-slate-500 text-xs mt-3">Tippe für nächsten Versuch</p>
            )}
          </div>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {attempts.map((a, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <span className="text-white text-sm font-mono">{a} ms</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
