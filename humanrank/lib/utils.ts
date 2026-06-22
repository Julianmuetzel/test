import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("de-DE", { maximumFractionDigits: decimals });
}

export function getPercentileLabel(percentile: number): string {
  if (percentile >= 99) return "Top 1%";
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Top 50%";
  return "Unter Durchschnitt";
}

export function getPercentileColor(percentile: number): string {
  if (percentile >= 99) return "text-yellow-400";
  if (percentile >= 90) return "text-purple-400";
  if (percentile >= 75) return "text-blue-400";
  if (percentile >= 50) return "text-green-400";
  return "text-slate-400";
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let required = 100;
  while (xp >= required) {
    xp -= required;
    level++;
    required = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  return level;
}
