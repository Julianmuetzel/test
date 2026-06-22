import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testSlug = searchParams.get("test") || "reaction-time";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const { data: test } = await supabase
    .from("tests")
    .select("id, name, slug, unit, higherIsBetter")
    .eq("slug", testSlug)
    .maybeSingle();
  if (!test) {
    return NextResponse.json({ error: "Test nicht gefunden." }, { status: 404 });
  }

  const { data: rankings } = await supabase
    .from("rankings")
    .select("bestScore, percentileGlobal, users(username, country, level, isPrivate)")
    .eq("testId", test.id)
    .order("bestScore", { ascending: !test.higherIsBetter })
    .limit(limit);

  type RankingRow = {
    bestScore: number;
    percentileGlobal: number | null;
    users: { username: string; country: string | null; level: number; isPrivate: boolean } | null;
  };

  return NextResponse.json({
    test: { name: test.name, slug: test.slug, unit: test.unit, higherIsBetter: test.higherIsBetter },
    rankings: ((rankings as unknown as RankingRow[]) ?? [])
      .filter((r) => !r.users?.isPrivate)
      .map((r, i) => ({
        rank: i + 1,
        username: r.users?.username ?? "Anonym",
        country: r.users?.country ?? null,
        level: r.users?.level ?? 1,
        bestScore: r.bestScore,
        percentile: r.percentileGlobal,
      })),
  });
}
