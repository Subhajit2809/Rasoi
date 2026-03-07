import type { CookedItem } from "@/types";

export type FreshnessLevel = "fresh" | "soon" | "toss";

export function getDaysRemaining(item: CookedItem): number {
  const elapsed =
    (Date.now() - new Date(item.cooked_at).getTime()) / 86_400_000;
  return item.freshness_days - elapsed;
}

export function freshnessLevel(daysRemaining: number): FreshnessLevel {
  if (daysRemaining > 1.5) return "fresh";
  if (daysRemaining > 0.5) return "soon";
  return "toss";
}

export const FRESHNESS_CONFIG: Record<
  FreshnessLevel,
  { dot: string; label: string; bar: string; border: string; badge: string }
> = {
  fresh: {
    dot: "bg-green-500",
    label: "Fresh",
    bar: "bg-green-400",
    border: "border-l-green-400",
    badge: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  soon: {
    dot: "bg-yellow-400",
    label: "Eat Soon",
    bar: "bg-yellow-400",
    border: "border-l-yellow-400",
    badge: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  toss: {
    dot: "bg-red-500",
    label: "Toss It",
    bar: "bg-red-400",
    border: "border-l-red-400",
    badge: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export function formatRemaining(days: number): string {
  if (days <= 0) return "Expired";
  const totalHours = days * 24;
  if (totalHours < 1) return "<1h left";
  if (totalHours < 24) return `${Math.floor(totalHours)}h left`;
  const d = Math.floor(days);
  const h = Math.floor((days - d) * 24);
  return h === 0 ? `${d}d left` : `${d}d ${h}h left`;
}

/** Freshness days for recipe based on name heuristics. */
export function getFreshnessDays(recipeName: string): number {
  const n = recipeName.toLowerCase();
  if (n.includes("fish") || n.includes("ilish") || n.includes("macher")) return 1;
  return 2;
}

/** Category-based freshness mapping for suggestions page. */
export const FRESHNESS_DAYS_BY_CATEGORY: Record<string, number> = {
  dal: 2,
  sabzi: 2,
  rice: 3,
  roti: 1,
  curry: 2,
  snack: 1,
  dessert: 2,
  breakfast: 1,
  "non-veg": 1,
  side: 1,
};

export function getFreshnessForCategory(category: string): number {
  return FRESHNESS_DAYS_BY_CATEGORY[category] ?? 2;
}
