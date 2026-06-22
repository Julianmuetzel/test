"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEXTS = [
  "Der schnelle braune Fuchs springt über den faulen Hund. Das Leben ist schön und voller Möglichkeiten.",
  "In einer Welt voller Technologie ist es wichtig, die menschliche Verbindung nicht zu vergessen.",
  "Programmieren ist die Kunst, einem Computer zu erklären, was er tun soll, bevor man es selbst weiß.",
  "Die Fähigkeit, schnell tippen zu können, ist eine der wertvollsten Fertigkeiten im digitalen Zeitalter.",
  "Wissen ist Macht, aber Anwendung von Wissen ist Stärke. Teste deine Grenzen täglich aufs Neue.",
];

interface TypingTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

export function TypingTest({ onComplete }: TypingTestProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [text] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  const startTest = useCallback(() => {
    setPhase("active");
    setTyped("");
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > text.length) return;
    setTyped(value);

    if (value.length === text.length) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const words = text.split(" ").length;
      const calculatedWpm = Math.round(words / elapsed);

      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === text[i]) correct++;
      }
      const acc = Math.round((correct / text.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(acc);
      setPhase("done");
      onComplete(calculatedWpm, { wpm: calculatedWpm, accuracy: acc, textLength: text.length });
    }
  }, [text, startTime, onComplete]);

  const renderText = () => {
    return text.split("").map((char, i) => {
      let cls = "text-slate-500";
      if (i < typed.length) {
        cls = typed[i] === char ? "text-white" : "text-red-400 bg-red-400/20";
      } else if (i === typed.length) {
        cls = "text-white border-l-2 border-blue-400 animate-pulse";
      }
      return (
        <span key={i} className={cn("transition-colors", cls)}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {phase === "idle" && (
        <div className="text-center">
          <p className="text-5xl mb-4">⌨️</p>
          <p className="text-white text-lg font-semibold mb-2">Tippgeschwindigkeit</p>
          <p className="text-slate-400 text-sm mb-6">
            Tippe den Text so schnell und korrekt wie möglich ab.
          </p>
          <Button onClick={startTest} size="lg">Starten</Button>
        </div>
      )}

      {phase === "active" && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-lg leading-relaxed font-mono">
            {renderText()}
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            className="opacity-0 h-0 absolute pointer-events-none"
            tabIndex={-1}
          />
          <div className="flex justify-between text-sm text-slate-400">
            <span>{typed.length} / {text.length} Zeichen</span>
            <span>{Math.round((typed.length / text.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(typed.length / text.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-slate-500 text-sm">Klicke in diesen Bereich zum Tippen</p>
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => inputRef.current?.focus()}>
              Fokus setzen
            </Button>
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🎉</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{wpm}</p>
              <p className="text-slate-400 text-sm mt-1">WPM</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{accuracy}%</p>
              <p className="text-slate-400 text-sm mt-1">Genauigkeit</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
