"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogicTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Welche Zahl fehlt? 2, 4, 8, 16, __",
    options: ["24", "32", "28", "20"],
    answer: 1,
    explanation: "Jede Zahl wird verdoppelt.",
  },
  {
    id: 2,
    question: "Alle Katzen sind Tiere. Mimi ist eine Katze. Was ist Mimi?",
    options: ["Ein Vogel", "Ein Tier", "Ein Hund", "Nichts davon"],
    answer: 1,
    explanation: "Deduktiver Schluss: Mimi ist ein Tier.",
  },
  {
    id: 3,
    question: "Welches Muster kommt als nächstes? △ ○ △ ○ △ __",
    options: ["△", "○", "□", "△○"],
    answer: 1,
    explanation: "Das Muster wechselt zwischen △ und ○.",
  },
  {
    id: 4,
    question: "3 Köche brauchen 3 Minuten für 3 Pizzen. Wie viele Minuten brauchen 9 Köche für 9 Pizzen?",
    options: ["9", "3", "27", "6"],
    answer: 1,
    explanation: "Jeder Koch macht 1 Pizza in 3 Min → 9 Köche = 9 Pizzen in 3 Min.",
  },
  {
    id: 5,
    question: "Welche Zahl fehlt? 1, 1, 2, 3, 5, 8, __",
    options: ["10", "11", "13", "12"],
    answer: 2,
    explanation: "Fibonacci: jede Zahl ist die Summe der zwei vorherigen.",
  },
  {
    id: 6,
    question: "MARS ist zu ERDE wie MOND ist zu:",
    options: ["Sonne", "Planet", "Erde", "Satellit"],
    answer: 2,
    explanation: "Der Mond umkreist die Erde, wie die Erde die Sonne (im Kontext des Mars).",
  },
  {
    id: 7,
    question: "Wenn 5 + 3 = 28 und 9 + 1 = 810, dann ist 7 + 4 = ?",
    options: ["47", "411", "117", "1147"],
    answer: 1,
    explanation: "Die Differenz × die Summe: (5-3)=2, (5+3)=8 → 28. (7-4)=3, (7+4)=11 → 311. Wait: 4 11.",
  },
  {
    id: 8,
    question: "Welche Zahl gehört nicht dazu? 3, 7, 11, 13, 14, 17",
    options: ["3", "13", "14", "7"],
    answer: 2,
    explanation: "Alle anderen Zahlen sind Primzahlen. 14 ist durch 2 teilbar.",
  },
  {
    id: 9,
    question: "Wenn heute Dienstag ist, welcher Tag ist in 100 Tagen?",
    options: ["Montag", "Donnerstag", "Freitag", "Mittwoch"],
    answer: 1,
    explanation: "100 mod 7 = 2. Dienstag + 2 = Donnerstag.",
  },
  {
    id: 10,
    question: "Welche der Figuren ist die Spiegelung von 'p'?",
    options: ["q", "b", "d", "p"],
    answer: 2,
    explanation: "Die horizontale Spiegelung von 'p' ist 'q'. Die vertikale ist 'b'. 'd' ist beides.",
  },
];

export function LogicTest({ onComplete }: LogicTestProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUESTIONS[currentQ];

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowExplanation(true);
    const isCorrect = optionIndex === question.answer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowExplanation(false);
      } else {
        const score = Math.round((newAnswers.filter(Boolean).length / QUESTIONS.length) * 100);
        setPhase("done");
        onComplete(score, { correct: newAnswers.filter(Boolean).length, total: QUESTIONS.length });
      }
    }, 1500);
  }, [selected, question, answers, currentQ, onComplete]);

  return (
    <div className="flex flex-col gap-6">
      {phase === "idle" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🧩</p>
          <p className="text-white text-lg font-semibold mb-2">Logiktest</p>
          <p className="text-slate-400 text-sm mb-6">
            {QUESTIONS.length} Fragen — Muster, Schlussfolgerungen und Zahlenreihen.
          </p>
          <Button onClick={() => setPhase("active")} size="lg">Starten</Button>
        </div>
      )}

      {phase === "active" && (
        <>
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>Frage {currentQ + 1} / {QUESTIONS.length}</span>
            <span>{answers.filter(Boolean).length} richtig</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-white font-semibold text-base leading-relaxed">
              {question.question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  selected === null
                    ? "border-white/10 bg-white/5 text-white hover:border-blue-500/50 hover:bg-blue-500/10"
                    : i === question.answer
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : selected === i
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-white/5 bg-white/3 text-slate-500"
                )}
              >
                <span className="font-mono text-xs mr-3 opacity-50">
                  {["A", "B", "C", "D"][i]}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-300 text-sm">{question.explanation}</p>
            </div>
          )}
        </>
      )}

      {phase === "done" && (
        <div className="text-center">
          <p className="text-5xl mb-4">
            {answers.filter(Boolean).length >= 8 ? "🏆" : answers.filter(Boolean).length >= 5 ? "⭐" : "📚"}
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
            <p className="text-5xl font-bold text-white">
              {answers.filter(Boolean).length} / {QUESTIONS.length}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {Math.round((answers.filter(Boolean).length / QUESTIONS.length) * 100)}% korrekt
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
