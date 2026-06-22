"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HumanScore } from "@/components/dashboard/human-score";
import { SkillCard } from "@/components/dashboard/skill-card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Flame, Zap, Trophy, ChevronRight, Brain } from "lucide-react";
import { xpForLevel } from "@/lib/utils";

const TEST_META: Record<string, { icon: string; color: string }> = {
  "reaction-time": { icon: "⚡", color: "#eab308" },
  memory: { icon: "🧠", color: "#a855f7" },
  typing: { icon: "⌨️", color: "#3b82f6" },
  math: { icon: "🧮", color: "#22c55e" },
  logic: { icon: "🧩", color: "#f97316" },
  "general-knowledge": { icon: "🌍", color: "#06b6d4" },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-400">Laden...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { humanScore, rankings, recentResults, streak, xp, level } = data;
  const xpNeeded = xpForLevel(level + 1);
  const xpCurrent = xp % xpNeeded;

  const radarData = rankings.map((r: any) => ({
    skill: TEST_META[r.testSlug]?.icon + " " + r.testName.split(" ")[0],
    value: r.percentileGlobal ?? 0,
  }));

  const strengths = [...rankings]
    .sort((a: any, b: any) => (b.percentileGlobal ?? 0) - (a.percentileGlobal ?? 0))
    .slice(0, 2);

  const weaknesses = [...rankings]
    .sort((a: any, b: any) => (a.percentileGlobal ?? 0) - (b.percentileGlobal ?? 0))
    .slice(0, 2);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-400 text-sm">Willkommen zurück,</p>
        <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <HumanScore score={humanScore} />
          </CardContent>
        </Card>

        <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Streak</p>
                  <p className="text-2xl font-bold text-white">{streak}</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">
                {streak >= 7 ? "🔥 Auf Feuer!" : streak >= 3 ? "💪 Stark!" : "Start heute!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Level</p>
                  <p className="text-2xl font-bold text-white">{level}</p>
                </div>
              </div>
              <Progress value={(xpCurrent / xpNeeded) * 100} className="h-1.5" />
              <p className="text-slate-500 text-xs mt-1">{xp} XP gesamt</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Top Fähigkeit</p>
                  <p className="text-lg font-bold text-white">
                    {strengths[0] ? `${strengths[0].percentileGlobal ?? 0}%` : "—"}
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs truncate">
                {strengths[0]?.testName ?? "Noch kein Test"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Tests gesamt</p>
                  <p className="text-2xl font-bold text-white">{rankings.length}</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">von 6 Kategorien</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills Grid */}
      {rankings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Deine Fähigkeiten</h2>
            <Link href="/rankings">
              <Button variant="ghost" size="sm">
                Alle Rankings <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {rankings.map((r: any) => (
              <SkillCard
                key={r.testId}
                name={r.testName}
                icon={TEST_META[r.testSlug]?.icon ?? "🎯"}
                score={r.bestScore}
                unit={r.testUnit}
                percentile={r.percentileGlobal}
                color={TEST_META[r.testSlug]?.color ?? "#3b82f6"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Radar Chart */}
      {radarData.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Fähigkeitsprofil</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Radar
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(v: any) => [`${v}%`, "Perzentile"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Strengths / Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">💪 Stärken</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {strengths.map((r: any) => (
                <div key={r.testId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{TEST_META[r.testSlug]?.icon}</span>
                    <span className="text-sm text-slate-300">{r.testName}</span>
                  </div>
                  <Badge variant="success">Top {100 - (r.percentileGlobal ?? 50)}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">📈 Verbesserungspotential</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {weaknesses.filter((w: any) => w.percentileGlobal < 70).map((r: any) => (
                <div key={r.testId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{TEST_META[r.testSlug]?.icon}</span>
                    <span className="text-sm text-slate-300">{r.testName}</span>
                  </div>
                  <Link href={`/tests/${r.testSlug}`}>
                    <Button variant="ghost" size="sm" className="text-xs">Üben</Button>
                  </Link>
                </div>
              ))}
              {weaknesses.filter((w: any) => w.percentileGlobal >= 70).length === weaknesses.length && (
                <p className="text-slate-400 text-sm">Starkes Profil! Weiter so. 🎉</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* No tests CTA */}
      {rankings.length === 0 && (
        <Card className="border-blue-500/20 bg-blue-950/10">
          <CardContent className="p-8 text-center">
            <p className="text-3xl mb-3">🚀</p>
            <p className="text-white font-semibold text-lg mb-2">Starte deinen ersten Test!</p>
            <p className="text-slate-400 text-sm mb-6">
              Absolviere Tests um deinen Human Score zu berechnen und herauszufinden wo du stehst.
            </p>
            <Link href="/tests">
              <Button size="lg" variant="gradient">Zu den Tests</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Letzte Ergebnisse</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentResults.slice(0, 5).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white">{r.test.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{r.score} {r.test.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
