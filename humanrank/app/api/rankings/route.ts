import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testSlug = searchParams.get("test") || "reaction-time";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const test = await prisma.test.findUnique({ where: { slug: testSlug } });
  if (!test) {
    return NextResponse.json({ error: "Test nicht gefunden." }, { status: 404 });
  }

  const rankings = await prisma.ranking.findMany({
    where: { testId: test.id },
    include: {
      user: {
        select: {
          username: true,
          country: true,
          level: true,
          isPrivate: true,
        },
      },
    },
    orderBy: {
      bestScore: test.higherIsBetter ? "desc" : "asc",
    },
    take: limit,
  });

  return NextResponse.json({
    test: { name: test.name, slug: test.slug, unit: test.unit, higherIsBetter: test.higherIsBetter },
    rankings: rankings
      .filter((r) => !r.user.isPrivate)
      .map((r, i) => ({
        rank: i + 1,
        username: r.user.username,
        country: r.user.country,
        level: r.user.level,
        bestScore: r.bestScore,
        percentile: r.percentileGlobal,
      })),
  });
}
