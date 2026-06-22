import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";
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

  const { data: test } = await supabase
    .from("tests")
    .select("id")
    .eq("slug", testSlug)
    .maybeSingle();
  if (!test) {
    return NextResponse.json({ error: "Test nicht gefunden." }, { status: 404 });
  }

  const userId = session.user.id;
  const now = new Date();

  await supabase.from("test_results").insert({
    id: crypto.randomUUID(),
    userId,
    testId: test.id,
    score,
    metadata: metadata ?? null,
    createdAt: now.toISOString(),
  });

  await updateUserRanking(userId, test.id, score);

  const { data: user } = await supabase
    .from("users")
    .select("streak, lastTestDate, xp")
    .eq("id", userId)
    .maybeSingle();

  let newStreak = user?.streak ?? 0;

  if (user?.lastTestDate) {
    const lastDate = new Date(user.lastTestDate);
    const diff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
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

  await supabase
    .from("users")
    .update({
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastTestDate: now.toISOString(),
      updatedAt: now.toISOString(),
    })
    .eq("id", userId);

  const humanScore = await computeHumanScore(userId);

  const { data: ranking } = await supabase
    .from("rankings")
    .select("percentileGlobal")
    .eq("userId", userId)
    .eq("testId", test.id)
    .maybeSingle();

  return NextResponse.json({
    success: true,
    percentile: ranking?.percentileGlobal ?? null,
    humanScore,
    xpGained: XP_PER_TEST,
    newLevel,
    streak: newStreak,
  });
}
