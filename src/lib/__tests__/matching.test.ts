import { describe, it, expect } from "vitest";
import { nameMatches, dietCompatible, isExpiringSoon } from "../matching";
import type { FridgeItem } from "@/types";

describe("nameMatches", () => {
  it("matches exact names", () => {
    expect(nameMatches("onion", "onion")).toBe(true);
  });

  it("matches Hindi to English aliases", () => {
    expect(nameMatches("jeera", "cumin")).toBe(true);
    expect(nameMatches("haldi", "turmeric")).toBe(true);
    expect(nameMatches("pyaz", "onion")).toBe(true);
    expect(nameMatches("tamatar", "tomato")).toBe(true);
    expect(nameMatches("dahi", "yogurt")).toBe(true);
  });

  it("matches English to Hindi aliases", () => {
    expect(nameMatches("cumin", "jeera")).toBe(true);
    expect(nameMatches("turmeric", "haldi")).toBe(true);
    expect(nameMatches("potato", "aloo")).toBe(true);
  });

  it("matches substring containment", () => {
    expect(nameMatches("tomato", "Tamatar (Tomato)")).toBe(true);
    expect(nameMatches("onion", "Pyaz (Onion)")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(nameMatches("CUMIN", "Jeera")).toBe(true);
    expect(nameMatches("Haldi", "TURMERIC")).toBe(true);
  });

  it("does not match unrelated items", () => {
    expect(nameMatches("chicken", "paneer")).toBe(false);
    expect(nameMatches("rice", "dal")).toBe(false);
  });
});

describe("dietCompatible", () => {
  it("nonveg household accepts everything", () => {
    expect(dietCompatible("veg", "nonveg")).toBe(true);
    expect(dietCompatible("eggetarian", "nonveg")).toBe(true);
    expect(dietCompatible("nonveg", "nonveg")).toBe(true);
  });

  it("eggetarian household accepts veg and eggetarian", () => {
    expect(dietCompatible("veg", "eggetarian")).toBe(true);
    expect(dietCompatible("eggetarian", "eggetarian")).toBe(true);
    expect(dietCompatible("nonveg", "eggetarian")).toBe(false);
  });

  it("veg household accepts only veg", () => {
    expect(dietCompatible("veg", "veg")).toBe(true);
    expect(dietCompatible("eggetarian", "veg")).toBe(false);
    expect(dietCompatible("nonveg", "veg")).toBe(false);
  });
});

describe("isExpiringSoon", () => {
  function makeFridgeItem(expiryDaysFromNow: number | null): FridgeItem {
    return {
      id: "test",
      household_id: "h1",
      item_name: "Test",
      category: "Vegetables",
      qty: 1,
      unit: "pcs",
      added_at: new Date().toISOString(),
      estimated_expiry: expiryDaysFromNow !== null
        ? new Date(Date.now() + expiryDaysFromNow * 86_400_000).toISOString()
        : null,
      added_by: null,
    };
  }

  it("returns true when expiring within 2 days", () => {
    expect(isExpiringSoon(makeFridgeItem(1))).toBe(true);
    expect(isExpiringSoon(makeFridgeItem(0.5))).toBe(true);
  });

  it("returns false when expiring in > 2 days", () => {
    expect(isExpiringSoon(makeFridgeItem(3))).toBe(false);
    expect(isExpiringSoon(makeFridgeItem(7))).toBe(false);
  });

  it("returns false when already expired", () => {
    expect(isExpiringSoon(makeFridgeItem(-1))).toBe(false);
  });

  it("returns false when no expiry date", () => {
    expect(isExpiringSoon(makeFridgeItem(null))).toBe(false);
  });
});
