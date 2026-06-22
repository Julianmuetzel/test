"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MemoryTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
}

type Phase = "idle" | "showing" | "input" | "correct" | "wrong" | "done";

export function MemoryTest({ onComplete }: MemoryTestProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [userInput, setUserInput] = useState("");
  const [showIndex, setShowIndex] = useState(-1);
  const [bestLevel, setBestLevel] = useState(0);

  const startLevel = useCallback((level: number) => {
    const seq = generateSequence(level);
    setSequence(seq);
    setUserInput("");
    setShowIndex(-1);
    setPhase("showing");

    let i = 0;
    const show = () => {
      if (i < seq.length) {
        setShowIndex(i);
        setTimeout(() => {
          setShowIndex(-1);
          setTimeout(() => {
            i++;
            show();
          }, 300);
        }, 700);
      } else {
        setTimeout(() => setPhase("input"), 500);
      }
    };
    setTimeout(show, 800);
  }, []);

  const handleSubmit = useCallback(() => {
    const entered = userInput.replace(/\s/g, "");
    const correct = sequence.join("");
    if (entered === correct) {
      setBestLevel(currentLevel);
      setPhase("correct");
      setTimeout(() => {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        startLevel(nextLevel);
      }, 1200);
    } else {
      setPhase("wrong");
      onComplete(currentLevel - 1, { maxLevel: currentLevel - 1, sequence });
    }
  }, [userInput, sequence, currentLevel, startLevel, onComplete]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-slate-400 text-sm">Ebene {currentLevel} — {currentLevel} Ziffern</p>
        <p className="text-slate-500 text-xs mt-1">Merke die Zahlenfolge</p>
      </div>

      {phase === "idle" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🧠</p>
          <p className="text-white text-lg font-semibold mb-2">Gedächtnistest</p>
          <p className="text-slate-400 text-sm mb-6">
            Zahlenfolgen werden angezeigt. Gib sie danach ein.
          </p>
          <Button onClick={() => { setCurrentLevel(3); startLevel(3); }} size="lg">
            Starten
          </Button>
        </div>
      )}

      {phase === "showing" && (
        <div className="text-center">
          <div className="flex gap-3 justify-center flex-wrap min-h-[80px] items-center">
            {sequence.map((n, i) => (
              <div
                key={i}
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-150",
                  showIndex === i
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white/5 text-transparent border border-white/10"
                )}
              >
                {showIndex === i ? n : "?"}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-4">Aufmerksam zuschauen...</p>
        </div>
      )}

      {phase === "input" && (
        <div className="w-full max-w-sm text-center">
          <p className="text-white font-semibold mb-4">Welche Ziffern waren das?</p>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9 ]*"
            placeholder="z.B. 4 7 2 9"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="text-center text-xl font-mono tracking-widest mb-4"
            autoFocus
          />
          <Button onClick={handleSubmit} size="lg" className="w-full">
            Bestätigen
          </Button>
        </div>
      )}

      {phase === "correct" && (
        <div className="text-center">
          <p className="text-4xl mb-2">✅</p>
          <p className="text-green-400 font-semibold text-lg">Korrekt!</p>
          <p className="text-slate-400 text-sm mt-1">Nächste Ebene...</p>
        </div>
      )}

      {phase === "wrong" && (
        <div className="text-center">
          <p className="text-4xl mb-2">❌</p>
          <p className="text-red-400 font-semibold text-lg">Falsch!</p>
          <p className="text-white mt-2">Korrekte Folge: <span className="font-mono text-blue-400">{sequence.join(" ")}</span></p>
          <p className="text-slate-400 text-sm mt-2">Du hast Ebene {bestLevel} erreicht</p>
        </div>
      )}
    </div>
  );
}
