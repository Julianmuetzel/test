import { supabase } from "./db";

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
  const { data: all } = await supabase
    .from("rankings")
    .select("bestScore")
    .eq("testId", testId);

  if (!all || all.length === 0) return 50;

  const scores = all.map((r: { bestScore: number }) => r.bestScore);
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
  const { data: test } = await supabase
    .from("tests")
    .select("higherIsBetter")
    .eq("id", testId)
    .maybeSingle();
  if (!test) return;

  const { data: existing } = await supabase
    .from("rankings")
    .select("id, bestScore")
    .eq("userId", userId)
    .eq("testId", testId)
    .maybeSingle();

  const isBetter = existing
    ? test.higherIsBetter
      ? score > existing.bestScore
      : score < existing.bestScore
    : true;

  if (!isBetter) return;

  const percentileGlobal = await calculatePercentile(testId, score, test.higherIsBetter);
  const now = new Date().toISOString();

  if (existing) {
    await supabase
      .from("rankings")
      .update({ bestScore: score, percentileGlobal, updatedAt: now })
      .eq("id", existing.id);
  } else {
    await supabase.from("rankings").insert({
      id: crypto.randomUUID(),
      userId,
      testId,
      bestScore: score,
      percentileGlobal,
      updatedAt: now,
    });
  }
}

export async function computeHumanScore(userId: string): Promise<number> {
  const { data: rankings } = await supabase
    .from("rankings")
    .select("percentileGlobal, testId")
    .eq("userId", userId);

  if (!rankings || rankings.length === 0) return 0;

  const testIds = rankings.map((r: { testId: string }) => r.testId);
  const { data: tests } = await supabase
    .from("tests")
    .select("id, slug")
    .in("id", testIds);

  const slugMap: Record<string, string> = {};
  for (const t of tests ?? []) {
    slugMap[t.id] = t.slug;
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const r of rankings as { testId: string; percentileGlobal: number | null }[]) {
    const slug = slugMap[r.testId] ?? "";
    const weight = TEST_WEIGHTS[slug] ?? 0.1;
    const percentile = r.percentileGlobal ?? 50;
    weightedSum += percentile * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
