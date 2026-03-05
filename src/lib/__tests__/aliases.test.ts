import { describe, it, expect } from "vitest";
import { resolveAliases } from "../aliases";

describe("resolveAliases", () => {
  it("returns aliases for known Hindi names", () => {
    const result = resolveAliases("jeera");
    expect(result).toContain("jeera");
    expect(result).toContain("cumin");
    expect(result).toContain("cumin seeds");
  });

  it("returns aliases for known English names", () => {
    const result = resolveAliases("turmeric");
    expect(result).toContain("turmeric");
    expect(result).toContain("haldi");
  });

  it("is case insensitive", () => {
    const result = resolveAliases("PANEER");
    expect(result).toContain("paneer");
    expect(result).toContain("cottage cheese");
  });

  it("trims whitespace", () => {
    const result = resolveAliases("  ghee  ");
    expect(result).toContain("ghee");
    expect(result).toContain("clarified butter");
  });

  it("returns single-element array for unknown names", () => {
    const result = resolveAliases("quinoa");
    expect(result).toEqual(["quinoa"]);
  });

  it("handles bidirectional lookups for vegetables", () => {
    expect(resolveAliases("aloo")).toContain("potato");
    expect(resolveAliases("potato")).toContain("aloo");
  });

  it("handles multi-word aliases", () => {
    const result = resolveAliases("tej patta");
    expect(result).toContain("bay leaf");
    expect(result).toContain("bay leaves");
  });

  it("handles dairy aliases", () => {
    const result = resolveAliases("dahi");
    expect(result).toContain("yogurt");
    expect(result).toContain("curd");
  });
});
