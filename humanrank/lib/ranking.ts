import { prisma } from "./db";

export const TEST_WEIGHTS: Record<string, number> = {
  "reaction-time": 0.20,
  memory: 0.20,
  typing: 0.15,
  math: 0.20,
  logic: 0.15,
  "general-knowledge": 0.10,
};

export async function calculatePercentile(
  testId: string,
  score: number,
  higherIsBetter: boolean
): Promise<number> {
  const all = await prisma.ranking.findMany({
    where: { testId },
    select: { bestScore: true },
  });

  if (all.length === 0) return 50;

  const scores = all.map((r) => r.bestScore);
  const below = higherIsBetter
    ? scores.filter((s) => s < score).length
    : scores.filter((s) => s > score).length;

  return Math.round((below / scores.length) * 100);
}

export async function updateUserRanking(
  userId: string,
  testId: string,
  score: number
): Promise<void> {
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) return;

  const existing = await prisma.ranking.findUnique({
    where: { userId_testId: { userId, testId } },
  });

  const isBetter = existing
    ? test.higherIsBetter
      ? score > existing.bestScore
      : score < existing.bestScore
    : true;

  if (!isBetter) return;

  const percentileGlobal = await calculatePercentile(testId, score, test.higherIsBetter);

  await prisma.ranking.upsert({
    where: { userId_testId: { userId, testId } },
    update: { bestScore: score, percentileGlobal, updatedAt: new Date() },
    create: { userId, testId, bestScore: score, percentileGlobal },
  });
}

export async function computeHumanScore(userId: string): Promise<number> {
  const rankings = await prisma.ranking.findMany({
    where: { userId },
    include: { test: true },
  });

  if (rankings.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const r of rankings) {
    const weight = TEST_WEIGHTS[r.test.slug] ?? 0.1;
    const percentile = r.percentileGlobal ?? 50;
    weightedSum += percentile * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
