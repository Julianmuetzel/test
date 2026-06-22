"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TESTS = [
  { slug: "reaction-time", name: "Reaktionszeit", icon: "⚡" },
  { slug: "memory", name: "Gedächtnis", icon: "🧠" },
  { slug: "typing", name: "Tippgeschwindigkeit", icon: "⌨️" },
  { slug: "math", name: "Kopfrechnen", icon: "🧮" },
  { slug: "logic", name: "Logik", icon: "🧩" },
  { slug: "general-knowledge", name: "Allgemeinwissen", icon: "🌍" },
];

const FLAG_MAP: Record<string, string> = {
  Deutschland: "🇩🇪", Österreich: "🇦🇹", Schweiz: "🇨🇭", USA: "🇺🇸",
  Großbritannien: "🇬🇧", Frankreich: "🇫🇷", Japan: "🇯🇵", China: "🇨🇳",
};

export default function RankingsPage() {
  const [activeTest, setActiveTest] = useState("reaction-time");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/rankings?test=${activeTest}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeTest]);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Rankings</h1>
        <p className="text-slate-400 text-sm">Weltweite Bestenlisten für jede Fähigkeit</p>
      </div>

      {/* Test Selector */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {TESTS.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActiveTest(t.slug)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTest === t.slug
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
            )}
          >
            <span>{t.icon}</span>
            {t.name}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {TESTS.find((t) => t.slug === activeTest)?.icon}{" "}
              {TESTS.find((t) => t.slug === activeTest)?.name}
            </CardTitle>
            {data?.test && (
              <Badge variant="secondary">
                {data.test.higherIsBetter ? "Höher = besser" : "Niedriger = besser"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse shimmer" />
              ))}
            </div>
          ) : data?.rankings?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🏁</p>
              <p className="text-white font-semibold">Noch keine Einträge</p>
              <p className="text-slate-400 text-sm mt-1">Sei der Erste!</p>
              <a href={`/tests/${activeTest}`}>
                <Button variant="gradient" size="sm" className="mt-4">Test starten</Button>
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.rankings?.map((r: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all",
                    i < 3 ? "bg-gradient-to-r from-white/5 to-transparent border border-white/10" : "hover:bg-white/3"
                  )}
                >
                  <div className="w-10 text-center">
                    {getMedalIcon(r.rank) ?? (
                      <span className="text-slate-500 text-sm font-mono">#{r.rank}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm truncate">{r.username}</span>
                      {r.country && (
                        <span className="text-xs">{FLAG_MAP[r.country] ?? "🌐"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">Lv. {r.level}</span>
                      {r.percentile != null && (
                        <span className="text-xs text-slate-500">Top {100 - Math.round(r.percentile)}%</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-white font-bold">
                      {r.bestScore.toLocaleString("de-DE")}
                    </span>
                    <span className="text-slate-400 text-xs ml-1">{data?.test?.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
