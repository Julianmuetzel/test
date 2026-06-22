import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeHumanScore } from "@/lib/ranking";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, rankings, recentResults] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.ranking.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.testResult.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const humanScore = await computeHumanScore(userId);

  return NextResponse.json({
    user,
    humanScore,
    rankings: rankings.map((r) => ({
      testId: r.testId,
      testSlug: r.test.slug,
      testName: r.test.name,
      testUnit: r.test.unit,
      testIcon: r.test.category,
      bestScore: r.bestScore,
      percentileGlobal: r.percentileGlobal,
      globalRank: r.globalRank,
    })),
    recentResults: recentResults.map((r) => ({
      id: r.id,
      score: r.score,
      createdAt: r.createdAt,
      test: { name: r.test.name, slug: r.test.slug, unit: r.test.unit },
    })),
    streak: user?.streak ?? 0,
    xp: user?.xp ?? 0,
    level: user?.level ?? 1,
  });
}
