"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MathTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

type Op = "+" | "-" | "×" | "÷";

function generateProblem(difficulty: number): { a: number; b: number; op: Op; answer: number } {
  const ops: Op[] = difficulty < 5 ? ["+", "-"] : difficulty < 10 ? ["+", "-", "×"] : ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const max = Math.min(10 + difficulty * 5, 100);

  let a: number, b: number, answer: number;
  switch (op) {
    case "+":
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * max) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b;
      break;
    case "÷":
      b = Math.floor(Math.random() * 9) + 2;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }
  return { a, b, op, answer };
}

const TIME_LIMIT = 60;

export function MathTest({ onComplete }: MathTestProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [problem, setProblem] = useState(() => generateProblem(1));
  const [userAnswer, setUserAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endTest = useCallback((c: number, w: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("done");
    onComplete(c, { correct: c, wrong: w, total: c + w });
  }, [onComplete]);

  const startTest = useCallback(() => {
    setPhase("active");
    setCorrect(0);
    setWrong(0);
    setTimeLeft(TIME_LIMIT);
    setProblem(generateProblem(1));
    setUserAnswer("");
    setTimeout(() => inputRef.current?.focus(), 100);

    let t = TIME_LIMIT;
    let c = 0;
    let w = 0;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        endTest(c, w);
      }
    }, 1000);

    return { getC: () => c, getW: () => w, setC: (v: number) => { c = v; }, setW: (v: number) => { w = v; } };
  }, [endTest]);

  const [counters, setCounters] = useState({ c: 0, w: 0 });

  const handleStart = () => {
    const ctrls = startTest();
  };

  const submitAnswer = useCallback(() => {
    const num = parseInt(userAnswer, 10);
    if (isNaN(num)) return;

    const difficulty = correct + wrong;
    if (num === problem.answer) {
      setCorrect((c) => {
        const nc = c + 1;
        setFeedback("correct");
        setTimeout(() => {
          setFeedback(null);
          setProblem(generateProblem(Math.floor(nc / 3)));
          setUserAnswer("");
          inputRef.current?.focus();
        }, 300);
        return nc;
      });
    } else {
      setWrong((w) => {
        setFeedback("wrong");
        setTimeout(() => {
          setFeedback(null);
          setUserAnswer("");
          inputRef.current?.focus();
        }, 400);
        return w + 1;
      });
    }
  }, [userAnswer, problem.answer, correct, wrong]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === "idle" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🧮</p>
          <p className="text-white text-lg font-semibold mb-2">Kopfrechnen</p>
          <p className="text-slate-400 text-sm mb-6">
            60 Sekunden — so viele Aufgaben wie möglich lösen. Schwierigkeit steigt.
          </p>
          <Button onClick={handleStart} size="lg">Starten</Button>
        </div>
      )}

      {phase === "active" && (
        <>
          <div className="w-full">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>✓ {correct} richtig</span>
              <span className={cn(timeLeft <= 10 ? "text-red-400 font-bold" : "")}>
                ⏱ {timeLeft}s
              </span>
              <span>✗ {wrong} falsch</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  timeLeft <= 10 ? "bg-red-500" : "bg-blue-500"
                )}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

          <div
            className={cn(
              "w-full max-w-xs bg-white/5 border-2 rounded-2xl p-8 text-center transition-all",
              feedback === "correct" ? "border-green-500 bg-green-500/10" :
              feedback === "wrong" ? "border-red-500 bg-red-500/10" :
              "border-white/10"
            )}
          >
            <p className="text-4xl font-bold text-white font-mono">
              {problem.a} {problem.op} {problem.b} = ?
            </p>
          </div>

          <div className="w-full max-w-xs">
            <Input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
              placeholder="Antwort eingeben..."
              className="text-center text-xl font-mono"
              autoComplete="off"
            />
            <Button onClick={submitAnswer} className="w-full mt-3" size="lg">
              Bestätigen (Enter)
            </Button>
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🏁</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-4xl font-bold text-green-400">{correct}</p>
              <p className="text-slate-400 text-sm mt-1">Richtig</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-4xl font-bold text-red-400">{wrong}</p>
              <p className="text-slate-400 text-sm mt-1">Falsch</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Genauigkeit: {correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0}%
          </p>
        </div>
      )}
    </div>
  );
}
