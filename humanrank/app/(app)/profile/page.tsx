"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HumanScore } from "@/components/dashboard/human-score";
import { LogOut, Shield, Download, Trash2 } from "lucide-react";
import { xpForLevel } from "@/lib/utils";

const STREAK_BADGES = [
  { days: 3, icon: "🔥", label: "3-Tage Streak" },
  { days: 7, icon: "⚡", label: "7-Tage Streak" },
  { days: 30, icon: "💎", label: "30-Tage Streak" },
  { days: 100, icon: "🏆", label: "100-Tage Streak" },
];

const PERCENTILE_BADGES = [
  { pct: 50, icon: "🌟", label: "Top 50%", variant: "secondary" as const },
  { pct: 75, icon: "⭐", label: "Top 25%", variant: "default" as const },
  { pct: 90, icon: "💫", label: "Top 10%", variant: "purple" as const },
  { pct: 99, icon: "👑", label: "Top 1%", variant: "gold" as const },
];

export default function ProfilePage() {
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

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Laden...</div>
      </div>
    );
  }

  const { user, humanScore, rankings, streak, xp, level } = data;
  const xpNeeded = xpForLevel(level + 1);
  const xpProgress = xp % xpNeeded;

  const bestPercentile = rankings.length > 0
    ? Math.max(...rankings.map((r: any) => r.percentileGlobal ?? 0))
    : 0;

  const unlockedStreakBadges = STREAK_BADGES.filter((b) => streak >= b.days);
  const unlockedPercentileBadges = PERCENTILE_BADGES.filter((b) => bestPercentile >= b.pct);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
              {(user?.username?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                {user?.isPremium && <Badge variant="gold">Premium</Badge>}
              </div>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start flex-wrap">
                {user?.country && (
                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                    🌍 {user.country}
                  </span>
                )}
                {user?.age && (
                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                    👤 {user.age} Jahre
                  </span>
                )}
                <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                  Seit {new Date(user?.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Human Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <HumanScore score={humanScore} />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">Level {level}</span>
                  <span className="text-xs text-slate-500">{xpProgress} / {xpNeeded} XP</span>
                </div>
                <Progress value={(xpProgress / xpNeeded) * 100} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xl font-bold text-white">{xp}</p>
                  <p className="text-xs text-slate-400">Gesamt XP</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xl font-bold text-orange-400">{streak} 🔥</p>
                  <p className="text-xs text-slate-400">Tage Streak</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Errungenschaften</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {unlockedPercentileBadges.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Ranking Badges</p>
                <div className="flex flex-wrap gap-2">
                  {unlockedPercentileBadges.map((b) => (
                    <Badge key={b.pct} variant={b.variant} className="text-sm py-1 px-3">
                      {b.icon} {b.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {unlockedStreakBadges.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Streak Badges</p>
                <div className="flex flex-wrap gap-2">
                  {unlockedStreakBadges.map((b) => (
                    <Badge key={b.days} variant="warning" className="text-sm py-1 px-3">
                      {b.icon} {b.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {unlockedPercentileBadges.length === 0 && unlockedStreakBadges.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">
                Absolviere Tests und halte deinen Streak aufrecht, um Badges freizuschalten.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader><CardTitle>Teststatistiken</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{rankings.length}</p>
              <p className="text-xs text-slate-400 mt-1">Kategorien abgeschlossen</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {rankings.length > 0
                  ? Math.round(rankings.reduce((a: number, r: any) => a + (r.percentileGlobal ?? 0), 0) / rankings.length)
                  : 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Ø Perzentile</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <CardTitle>Datenschutz</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Download className="w-4 h-4" />
            Meine Daten exportieren
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-red-400 border-red-500/20 hover:border-red-500/40 hover:text-red-300">
            <Trash2 className="w-4 h-4" />
            Account löschen
          </Button>
          <p className="text-xs text-slate-500 mt-2">
            DSGVO-konform. Alle Daten können jederzeit exportiert oder gelöscht werden.
          </p>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="ghost"
        className="w-full text-slate-400 hover:text-white"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Abmelden
      </Button>
    </div>
  );
}
