import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TESTS = [
  {
    slug: "reaction-time",
    name: "Reaktionszeit",
    description: "Miss deine Reaktionszeit in Millisekunden",
    category: "coordination",
    unit: "ms",
    higherIsBetter: false,
    xpReward: 15,
  },
  {
    slug: "memory",
    name: "Gedächtnis",
    description: "Wie lang kannst du dir Zahlenfolgen merken?",
    category: "cognition",
    unit: "Level",
    higherIsBetter: true,
    xpReward: 15,
  },
  {
    slug: "typing",
    name: "Tippgeschwindigkeit",
    description: "Tippe so schnell und akkurat wie möglich",
    category: "motor",
    unit: "WPM",
    higherIsBetter: true,
    xpReward: 15,
  },
  {
    slug: "math",
    name: "Kopfrechnen",
    description: "Löse Rechenaufgaben in 60 Sekunden",
    category: "numeric",
    unit: "Richtig",
    higherIsBetter: true,
    xpReward: 15,
  },
  {
    slug: "logic",
    name: "Logiktest",
    description: "Muster, Reihen und Schlussfolgerungen",
    category: "logic",
    unit: "%",
    higherIsBetter: true,
    xpReward: 20,
  },
  {
    slug: "general-knowledge",
    name: "Allgemeinwissen",
    description: "Geschichte, Wissenschaft, Geografie & Technik",
    category: "knowledge",
    unit: "%",
    higherIsBetter: true,
    xpReward: 10,
  },
];

const ACHIEVEMENTS = [
  { slug: "first-test", name: "Erster Test", description: "Ersten Test abgeschlossen", icon: "🎯", condition: { type: "tests", count: 1 } },
  { slug: "all-tests", name: "Allrounder", description: "Alle 6 Tests abgeschlossen", icon: "🌟", condition: { type: "tests", count: 6 } },
  { slug: "top-50", name: "Top 50%", description: "In Top 50% in einem Test", icon: "📈", condition: { type: "percentile", value: 50 } },
  { slug: "top-25", name: "Top 25%", description: "In Top 25% in einem Test", icon: "⭐", condition: { type: "percentile", value: 75 } },
  { slug: "top-10", name: "Top 10%", description: "In Top 10% in einem Test", icon: "💫", condition: { type: "percentile", value: 90 } },
  { slug: "top-1", name: "Elite", description: "In Top 1% in einem Test", icon: "👑", condition: { type: "percentile", value: 99 } },
  { slug: "streak-3", name: "Gewohnheit", description: "3 Tage in Folge getestet", icon: "🔥", condition: { type: "streak", days: 3 } },
  { slug: "streak-7", name: "Wochenkrieger", description: "7 Tage in Folge getestet", icon: "⚡", condition: { type: "streak", days: 7 } },
  { slug: "streak-30", name: "Monatsmeister", description: "30 Tage in Folge getestet", icon: "💎", condition: { type: "streak", days: 30 } },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create tests
  for (const test of TESTS) {
    await prisma.test.upsert({
      where: { slug: test.slug },
      update: test,
      create: test,
    });
    console.log(`✓ Test: ${test.name}`);
  }

  // Create achievements
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    });
    console.log(`✓ Achievement: ${ach.name}`);
  }

  // Demo user
  const hash = await bcrypt.hash("demo1234", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@humanrank.app" },
    update: {},
    create: {
      email: "demo@humanrank.app",
      username: "demo_user",
      passwordHash: hash,
      age: 28,
      country: "Deutschland",
      xp: 150,
      level: 4,
      streak: 7,
    },
  });

  // Demo results
  const tests = await prisma.test.findMany();
  const demoScores: Record<string, number> = {
    "reaction-time": 210,
    memory: 7,
    typing: 72,
    math: 23,
    logic: 70,
    "general-knowledge": 75,
  };

  for (const test of tests) {
    const score = demoScores[test.slug] ?? 50;
    await prisma.testResult.upsert({
      where: { id: `seed-${demoUser.id}-${test.id}` },
      update: {},
      create: {
        id: `seed-${demoUser.id}-${test.id}`,
        userId: demoUser.id,
        testId: test.id,
        score,
      },
    }).catch(() => {
      // ignore if already exists
    });

    await prisma.ranking.upsert({
      where: { userId_testId: { userId: demoUser.id, testId: test.id } },
      update: { bestScore: score, percentileGlobal: 65 },
      create: {
        userId: demoUser.id,
        testId: test.id,
        bestScore: score,
        percentileGlobal: 65,
      },
    });
  }

  console.log("✅ Seeding complete!");
  console.log("   Demo Login: demo@humanrank.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
