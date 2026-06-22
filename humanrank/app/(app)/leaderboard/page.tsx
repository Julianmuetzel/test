"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FLAG_MAP: Record<string, string> = {
  Deutschland: "🇩🇪", Österreich: "🇦🇹", Schweiz: "🇨🇭", USA: "🇺🇸",
  Großbritannien: "🇬🇧", Frankreich: "🇫🇷", Japan: "🇯🇵", China: "🇨🇳",
  Brasilien: "🇧🇷", Kanada: "🇨🇦", Australien: "🇦🇺",
};

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => { setData(d.leaderboard ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-purple-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 50) return "text-green-400";
    return "text-slate-400";
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-slate-400 text-sm">Die besten Human Scores weltweit</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Globales Ranking</CardTitle>
            <Badge variant="secondary">Human Score</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🌍</p>
              <p className="text-white font-semibold">Noch keine Einträge</p>
              <p className="text-slate-400 text-sm mt-1">Absolviere Tests um zu erscheinen</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((user, i) => (
                <div
                  key={user.username}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl",
                    i < 3
                      ? "bg-gradient-to-r from-white/5 to-transparent border border-white/10"
                      : "hover:bg-white/3"
                  )}
                >
                  <div className="w-10 text-center font-bold">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (
                      <span className="text-slate-500 text-sm">#{i + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{user.username}</span>
                      {user.country && <span>{FLAG_MAP[user.country] ?? "🌐"}</span>}
                      <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                        Lv. {user.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">
                        {user.testsCompleted} Tests absolviert
                      </span>
                      <span className="text-xs text-slate-500">{user.xp} XP</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={cn("text-xl font-bold", getScoreColor(user.humanScore))}>
                      {user.humanScore}
                    </p>
                    <p className="text-xs text-slate-500">Human Score</p>
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
