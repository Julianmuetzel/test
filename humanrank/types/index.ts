export interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number | null;
  gender?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  isPremium: boolean;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
}

export interface TestDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  higherIsBetter: boolean;
  xpReward: number;
  icon: string;
  color: string;
}

export interface TestResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  test: TestDefinition;
}

export interface RankingEntry {
  testId: string;
  testSlug: string;
  testName: string;
  bestScore: number;
  percentileGlobal?: number | null;
  globalRank?: number | null;
}

export interface DashboardData {
  humanScore: number;
  rankings: RankingEntry[];
  recentResults: TestResult[];
  achievements: Achievement[];
  streak: number;
  xp: number;
  level: number;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
