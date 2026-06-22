import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateUserRanking, computeHumanScore } from "@/lib/ranking";

const XP_PER_TEST = 15;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { testSlug, score, metadata } = await req.json();
  if (!testSlug || score === undefined) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  const test = await prisma.test.findUnique({ where: { slug: testSlug } });
  if (!test) {
    return NextResponse.json({ error: "Test nicht gefunden." }, { status: 404 });
  }

  const userId = session.user.id;

  await prisma.testResult.create({
    data: { userId, testId: test.id, score, metadata },
  });

  await updateUserRanking(userId, test.id, score);

  const today = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  let newStreak = user?.streak ?? 0;

  if (user?.lastTestDate) {
    const lastDate = new Date(user.lastTestDate);
    const diff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      newStreak += 1;
    } else if (diff > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const newXp = (user?.xp ?? 0) + XP_PER_TEST;
  const newLevel = Math.floor(1 + Math.sqrt(newXp / 50));

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel, streak: newStreak, lastTestDate: today },
  });

  const humanScore = await computeHumanScore(userId);
  const ranking = await prisma.ranking.findUnique({
    where: { userId_testId: { userId, testId: test.id } },
  });

  return NextResponse.json({
    success: true,
    percentile: ranking?.percentileGlobal ?? null,
    humanScore,
    xpGained: XP_PER_TEST,
    newLevel,
    streak: newStreak,
  });
}
