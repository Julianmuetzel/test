import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  const { data: users } = await supabase
    .from("users")
    .select("id, username, country, level, xp, rankings(percentileGlobal)")
    .eq("isPrivate", false)
    .order("xp", { ascending: false })
    .limit(100);

  type UserRow = {
    id: string;
    username: string;
    country: string | null;
    level: number;
    xp: number;
    rankings: { percentileGlobal: number | null }[];
  };

  const board = ((users as unknown as UserRow[]) ?? []).map((u) => {
    const avgPercentile =
      u.rankings.length > 0
        ? Math.round(
            u.rankings.reduce((a, r) => a + (r.percentileGlobal ?? 50), 0) / u.rankings.length
          )
        : 0;
    return {
      username: u.username,
      country: u.country,
      level: u.level,
      xp: u.xp,
      humanScore: avgPercentile,
      testsCompleted: u.rankings.length,
    };
  });

  board.sort((a, b) => b.humanScore - a.humanScore);

  return NextResponse.json({ leaderboard: board });
}
