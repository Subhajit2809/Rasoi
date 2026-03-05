import { describe, it, expect, vi } from "vitest";
import {
  getDaysRemaining,
  freshnessLevel,
  formatRemaining,
  getFreshnessDays,
  getFreshnessForCategory,
} from "../freshness";
import type { CookedItem } from "@/types";

function makeCookedItem(hoursAgo: number, freshnessDays: number): CookedItem {
  const cookedAt = new Date(Date.now() - hoursAgo * 3_600_000).toISOString();
  return {
    id: "test",
    household_id: "h1",
    dish_name: "Test Dish",
    cooked_at: cookedAt,
    freshness_days: freshnessDays,
    status: "fresh",
    finished_at: null,
  };
}

describe("getDaysRemaining", () => {
  it("returns correct remaining days", () => {
    const item = makeCookedItem(24, 2); // cooked 24h ago, 2-day shelf life
    const remaining = getDaysRemaining(item);
    expect(remaining).toBeCloseTo(1, 0);
  });

  it("returns negative when expired", () => {
    const item = makeCookedItem(72, 2); // cooked 3 days ago, 2-day shelf life
    expect(getDaysRemaining(item)).toBeLessThan(0);
  });

  it("returns full freshness when just cooked", () => {
    const item = makeCookedItem(0, 2);
    expect(getDaysRemaining(item)).toBeCloseTo(2, 0);
  });
});

describe("freshnessLevel", () => {
  it("returns 'fresh' when > 1.5 days remaining", () => {
    expect(freshnessLevel(2)).toBe("fresh");
    expect(freshnessLevel(1.6)).toBe("fresh");
  });

  it("returns 'soon' when between 0.5 and 1.5 days", () => {
    expect(freshnessLevel(1.5)).toBe("soon");
    expect(freshnessLevel(1)).toBe("soon");
    expect(freshnessLevel(0.6)).toBe("soon");
  });

  it("returns 'toss' when <= 0.5 days", () => {
    expect(freshnessLevel(0.5)).toBe("toss");
    expect(freshnessLevel(0)).toBe("toss");
    expect(freshnessLevel(-1)).toBe("toss");
  });
});

describe("formatRemaining", () => {
  it("shows 'Expired' when <= 0", () => {
    expect(formatRemaining(0)).toBe("Expired");
    expect(formatRemaining(-1)).toBe("Expired");
  });

  it("shows '<1h left' for very short times", () => {
    expect(formatRemaining(0.01)).toBe("<1h left");
  });

  it("shows hours when < 1 day", () => {
    expect(formatRemaining(0.5)).toBe("12h left");
  });

  it("shows days and hours", () => {
    expect(formatRemaining(1.5)).toBe("1d 12h left");
  });

  it("shows just days when whole number", () => {
    expect(formatRemaining(2)).toBe("2d left");
  });
});

describe("getFreshnessDays", () => {
  it("returns 1 for fish dishes", () => {
    expect(getFreshnessDays("Fish Curry")).toBe(1);
    expect(getFreshnessDays("Ilish Bhapa")).toBe(1);
    expect(getFreshnessDays("Macher Jhol")).toBe(1);
  });

  it("returns 2 for non-fish dishes", () => {
    expect(getFreshnessDays("Dal Makhani")).toBe(2);
    expect(getFreshnessDays("Aloo Gobi")).toBe(2);
  });
});

describe("getFreshnessForCategory", () => {
  it("returns known category values", () => {
    expect(getFreshnessForCategory("dal")).toBe(2);
    expect(getFreshnessForCategory("roti")).toBe(1);
    expect(getFreshnessForCategory("rice")).toBe(3);
  });

  it("defaults to 2 for unknown categories", () => {
    expect(getFreshnessForCategory("unknown")).toBe(2);
  });
});
