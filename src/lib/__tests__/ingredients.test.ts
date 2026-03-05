import { describe, it, expect, vi, afterEach } from "vitest";
import { inferCategory, calcExpiry } from "../ingredients";

describe("inferCategory", () => {
  it("infers Vegetables for known veggies", () => {
    expect(inferCategory("onion")).toBe("Vegetables");
    expect(inferCategory("tomato")).toBe("Vegetables");
    expect(inferCategory("spinach")).toBe("Vegetables");
  });

  it("infers Dairy & Protein for known items", () => {
    expect(inferCategory("paneer")).toBe("Dairy & Protein");
    expect(inferCategory("chicken")).toBe("Dairy & Protein");
    expect(inferCategory("eggs")).toBe("Dairy & Protein");
  });

  it("infers Pantry for known staples", () => {
    expect(inferCategory("rice")).toBe("Pantry");
    expect(inferCategory("atta")).toBe("Pantry");
  });

  it("defaults to Pantry for unknown items", () => {
    expect(inferCategory("saffron")).toBe("Pantry");
    expect(inferCategory("unknown item")).toBe("Pantry");
  });

  it("matches via alias (Hindi name against English preset)", () => {
    expect(inferCategory("pyaz")).toBe("Vegetables");
    expect(inferCategory("dahi")).toBe("Dairy & Protein");
    expect(inferCategory("chawal")).toBe("Pantry");
  });
});

describe("calcExpiry", () => {
  it("returns an ISO date string in the future", () => {
    const result = calcExpiry(7);
    const expiryDate = new Date(result);
    expect(expiryDate.getTime()).toBeGreaterThan(Date.now());
  });

  it("adds correct number of days", () => {
    const before = Date.now();
    const result = calcExpiry(5);
    const expiryDate = new Date(result).getTime();
    const expectedMin = before + 5 * 86_400_000 - 1000;
    const expectedMax = before + 5 * 86_400_000 + 1000;
    expect(expiryDate).toBeGreaterThanOrEqual(expectedMin);
    expect(expiryDate).toBeLessThanOrEqual(expectedMax);
  });
});
