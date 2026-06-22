import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";
import { computeHumanScore } from "@/lib/ranking";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const userId = session.user.id;

  const [userRes, rankingsRes, recentResultsRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("rankings")
      .select("testId, bestScore, percentileGlobal, globalRank, tests(id, slug, name, unit, category)")
      .eq("userId", userId)
      .order("updatedAt", { ascending: false }),
    supabase
      .from("test_results")
      .select("id, score, createdAt, tests(name, slug, unit)")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })
      .limit(10),
  ]);

  const user = userRes.data;
  type RankingRow = {
    testId: string;
    bestScore: number;
    percentileGlobal: number | null;
    globalRank: number | null;
    tests: { id: string; slug: string; name: string; unit: string; category: string } | null;
  };
  type ResultRow = {
    id: string;
    score: number;
    createdAt: string;
    tests: { name: string; slug: string; unit: string } | null;
  };
  const rankings = (rankingsRes.data ?? []) as unknown as RankingRow[];
  const recentResults = (recentResultsRes.data ?? []) as unknown as ResultRow[];

  const humanScore = await computeHumanScore(userId);

  return NextResponse.json({
    user,
    humanScore,
    rankings: rankings.map((r) => ({
      testId: r.testId,
      testSlug: r.tests?.slug ?? "",
      testName: r.tests?.name ?? "",
      testUnit: r.tests?.unit ?? "",
      testIcon: r.tests?.category ?? "",
      bestScore: r.bestScore,
      percentileGlobal: r.percentileGlobal,
      globalRank: r.globalRank,
    })),
    recentResults: recentResults.map((r) => ({
      id: r.id,
      score: r.score,
      createdAt: r.createdAt,
      test: { name: r.tests?.name ?? "", slug: r.tests?.slug ?? "", unit: r.tests?.unit ?? "" },
    })),
    streak: user?.streak ?? 0,
    xp: user?.xp ?? 0,
    level: user?.level ?? 1,
  });
}
