import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeHumanScore } from "@/lib/ranking";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isPrivate: false },
    select: {
      id: true,
      username: true,
      country: true,
      level: true,
      xp: true,
      rankings: {
        select: { percentileGlobal: true },
      },
    },
    orderBy: { xp: "desc" },
    take: 100,
  });

  const board = users.map((u) => {
    const avgPercentile = u.rankings.length > 0
      ? Math.round(u.rankings.reduce((a, r) => a + (r.percentileGlobal ?? 50), 0) / u.rankings.length)
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
