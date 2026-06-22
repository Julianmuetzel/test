"use client";

import { use, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactionTimeTest } from "@/components/tests/reaction-time-test";
import { MemoryTest } from "@/components/tests/memory-test";
import { TypingTest } from "@/components/tests/typing-test";
import { MathTest } from "@/components/tests/math-test";
import { LogicTest } from "@/components/tests/logic-test";
import { GeneralKnowledgeTest } from "@/components/tests/general-knowledge-test";
import { ArrowLeft, Trophy, Zap } from "lucide-react";

const TEST_CONFIG: Record<string, {
  name: string;
  icon: string;
  description: string;
  tips: string[];
}> = {
  "reaction-time": {
    name: "Reaktionszeit",
    icon: "⚡",
    description: "5 Versuche — der beste zählt für dein Ranking.",
    tips: ["Warte auf Grün", "Zu früh = ungültig", "Entspannt bleiben"],
  },
  memory: {
    name: "Gedächtnis",
    icon: "🧠",
    description: "Zahlenfolgen werden immer länger. Wie weit kommst du?",
    tips: ["Volle Konzentration", "Gruppenweise merken", "Ruhig eintippen"],
  },
  typing: {
    name: "Tippgeschwindigkeit",
    icon: "⌨️",
    description: "Tippe den Text vollständig ab. WPM und Genauigkeit zählen.",
    tips: ["Genauigkeit > Tempo", "Touch-Typing hilft", "Ruhe bewahren"],
  },
  math: {
    name: "Kopfrechnen",
    icon: "🧮",
    description: "60 Sekunden, so viele Aufgaben wie möglich.",
    tips: ["Tempo entwickeln", "Keine Fehler einplanen", "Rechner verboten 😄"],
  },
  logic: {
    name: "Logiktest",
    icon: "🧩",
    description: "10 Fragen — Muster, Zahlenreihen und Schlussfolgerungen.",
    tips: ["Zeit nehmen", "Muster suchen", "Ausschlussverfahren"],
  },
  "general-knowledge": {
    name: "Allgemeinwissen",
    icon: "🌍",
    description: "12 Fragen aus Geschichte, Wissenschaft, Geografie & Technik.",
    tips: ["Erste Intuition", "Keine Suche erlaubt", "Beste Schätzung"],
  },
};

interface ResultData {
  percentile: number | null;
  humanScore: number;
  xpGained: number;
  newLevel: number;
  streak: number;
  score: number;
}

export default function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "active" | "result">("intro");
  const [result, setResult] = useState<ResultData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const config = TEST_CONFIG[slug];

  const handleComplete = useCallback(
    async (score: number, metadata: Record<string, unknown>) => {
      if (status !== "authenticated") {
        router.push("/login");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/tests/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testSlug: slug, score, metadata }),
        });
        const data = await res.json();
        setResult({ ...data, score });
        setPhase("result");
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [slug, status, router]
  );

  if (!config) {
    return (
      <div className="p-8 text-center">
        <p className="text-white">Test nicht gefunden.</p>
        <Link href="/tests"><Button className="mt-4">Zurück</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{config.name}</h1>
          <p className="text-slate-400 text-sm">{config.description}</p>
        </div>
      </div>

      {phase === "intro" && (
        <Card>
          <CardContent className="p-8 text-center">
            <span className="text-6xl mb-6 block">{config.icon}</span>
            <h2 className="text-2xl font-bold text-white mb-3">{config.name}</h2>
            <p className="text-slate-400 mb-6">{config.description}</p>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {config.tips.map((tip) => (
                <Badge key={tip} variant="secondary">{tip}</Badge>
              ))}
            </div>

            {status !== "authenticated" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 text-sm text-yellow-300">
                Melde dich an, um dein Ergebnis zu speichern und an Rankings teilzunehmen.
              </div>
            )}

            <Button
              size="xl"
              variant="gradient"
              onClick={() => setPhase("active")}
              className="w-full"
            >
              Test starten
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "active" && (
        <Card>
          <CardContent className="p-6">
            {slug === "reaction-time" && <ReactionTimeTest onComplete={handleComplete} />}
            {slug === "memory" && <MemoryTest onComplete={handleComplete} />}
            {slug === "typing" && <TypingTest onComplete={handleComplete} />}
            {slug === "math" && <MathTest onComplete={handleComplete} />}
            {slug === "logic" && <LogicTest onComplete={handleComplete} />}
            {slug === "general-knowledge" && <GeneralKnowledgeTest onComplete={handleComplete} />}

            {submitting && (
              <div className="mt-4 text-center text-slate-400 text-sm animate-pulse">
                Ergebnis wird gespeichert...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {phase === "result" && result && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">
              {(result.percentile ?? 0) >= 90 ? "🏆" : (result.percentile ?? 0) >= 75 ? "⭐" : "🎯"}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Ergebnis</h2>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6 mb-6">
              <p className="text-6xl font-bold text-white mb-2">
                {result.score.toLocaleString("de-DE")}
              </p>
              {result.percentile != null && (
                <div className="mt-4">
                  <p className="text-slate-400 text-sm mb-1">Du bist besser als</p>
                  <p className="text-4xl font-bold text-blue-400">{result.percentile}%</p>
                  <p className="text-slate-400 text-sm">aller Nutzer weltweit</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-yellow-400 justify-center">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">+{result.xpGained}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">XP</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-purple-400 justify-center">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold">{result.humanScore}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Human Score</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => { setPhase("intro"); setResult(null); }}
              >
                Nochmal versuchen
              </Button>
              <Link href="/rankings">
                <Button variant="secondary" size="lg" className="w-full">
                  Rankings ansehen
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="w-full">
                  Zum Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
