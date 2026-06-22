"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GeneralKnowledgeTestProps {
  onComplete: (score: number, metadata: Record<string, unknown>) => void;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
}

const QUESTIONS: Question[] = [
  { id: 1, category: "Geografie", question: "Was ist die Hauptstadt von Australien?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
  { id: 2, category: "Wissenschaft", question: "Welches Element hat das chemische Symbol 'Au'?", options: ["Silber", "Gold", "Aluminium", "Kupfer"], answer: 1 },
  { id: 3, category: "Geschichte", question: "In welchem Jahr fiel die Berliner Mauer?", options: ["1987", "1991", "1989", "1993"], answer: 2 },
  { id: 4, category: "Technik", question: "Wer erfand das World Wide Web?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Linus Torvalds"], answer: 2 },
  { id: 5, category: "Wissenschaft", question: "Wie viele Planeten hat unser Sonnensystem?", options: ["7", "8", "9", "10"], answer: 1 },
  { id: 6, category: "Geografie", question: "Welcher Fluss ist der längste der Welt?", options: ["Amazonas", "Nil", "Yangtze", "Mississippi"], answer: 1 },
  { id: 7, category: "Geschichte", question: "Wer schrieb 'Faust'?", options: ["Schiller", "Goethe", "Kafka", "Thomas Mann"], answer: 1 },
  { id: 8, category: "Wissenschaft", question: "Was ist die Lichtgeschwindigkeit (ca.)?", options: ["300.000 km/s", "150.000 km/s", "450.000 km/s", "200.000 km/s"], answer: 0 },
  { id: 9, category: "Technik", question: "In welchem Jahr wurde das iPhone erstmals vorgestellt?", options: ["2005", "2007", "2009", "2003"], answer: 1 },
  { id: 10, category: "Geografie", question: "Wie viele Kontinente gibt es?", options: ["5", "6", "7", "8"], answer: 2 },
  { id: 11, category: "Geschichte", question: "Wann begann der Zweite Weltkrieg?", options: ["1935", "1937", "1939", "1941"], answer: 2 },
  { id: 12, category: "Wissenschaft", question: "Was ist H₂O?", options: ["Salz", "Wasser", "Zucker", "Säure"], answer: 1 },
];

export function GeneralKnowledgeTest({ onComplete }: GeneralKnowledgeTestProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = QUESTIONS[currentQ];

  const categoryColors: Record<string, string> = {
    "Geografie": "text-green-400 bg-green-400/10 border-green-400/20",
    "Wissenschaft": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Geschichte": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    "Technik": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.answer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        const score = Math.round((newAnswers.filter(Boolean).length / QUESTIONS.length) * 100);
        setPhase("done");
        onComplete(score, { correct: newAnswers.filter(Boolean).length, total: QUESTIONS.length });
      }
    }, 1200);
  }, [selected, question, answers, currentQ, onComplete]);

  return (
    <div className="flex flex-col gap-6">
      {phase === "idle" && (
        <div className="text-center">
          <p className="text-5xl mb-4">🌍</p>
          <p className="text-white text-lg font-semibold mb-2">Allgemeinwissen</p>
          <p className="text-slate-400 text-sm mb-2">
            {QUESTIONS.length} Fragen aus Geschichte, Wissenschaft, Geografie und Technik.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {["Geschichte", "Wissenschaft", "Geografie", "Technik"].map((cat) => (
              <span key={cat} className={cn("text-xs px-2 py-1 rounded-full border", categoryColors[cat])}>
                {cat}
              </span>
            ))}
          </div>
          <Button onClick={() => setPhase("active")} size="lg">Starten</Button>
        </div>
      )}

      {phase === "active" && (
        <>
          <div className="flex justify-between items-center">
            <span className={cn("text-xs px-2 py-1 rounded-full border", categoryColors[question.category] || "text-slate-400 bg-white/5 border-white/10")}>
              {question.category}
            </span>
            <span className="text-sm text-slate-400">{currentQ + 1} / {QUESTIONS.length}</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-white font-semibold text-base leading-relaxed">{question.question}</p>
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
                <span className="font-mono text-xs mr-3 opacity-50">{["A", "B", "C", "D"][i]}</span>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="text-center">
          <p className="text-5xl mb-4">
            {answers.filter(Boolean).length >= 10 ? "🏆" : answers.filter(Boolean).length >= 7 ? "⭐" : "📖"}
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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
