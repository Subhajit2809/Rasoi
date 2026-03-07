import type { FridgeItem } from "@/types";
import { resolveAliases } from "@/lib/aliases";

/**
 * True if ingredient name plausibly refers to the same thing as a fridge/pantry
 * item name. Uses an alias map for Hindi ↔ English matching (jeera↔cumin,
 * haldi↔turmeric, etc.) and checks containment across all alias variants.
 */
export function nameMatches(ingredientRaw: string, itemName: string): boolean {
  const aVariants = resolveAliases(ingredientRaw);
  const bVariants = resolveAliases(itemName);

  // Containment check across all alias combinations
  for (const a of aVariants) {
    for (const b of bVariants) {
      if (b.includes(a) || a.includes(b)) return true;
    }
  }

  // Word-level: any >=3-char word from ingredient aliases found in item aliases
  const words = aVariants.flatMap((v) =>
    v.split(/[\s\-,()]+/).filter((w) => w.length >= 3)
  );
  return words.some((w) => bVariants.some((b) => b.includes(w)));
}

export function dietCompatible(recipeDiet: string, householdDiet: string): boolean {
  if (householdDiet === "nonveg") return true;
  if (householdDiet === "eggetarian") return recipeDiet === "veg" || recipeDiet === "eggetarian";
  if (householdDiet === "vegan") return recipeDiet === "veg"; // vegan excludes eggetarian too
  if (householdDiet === "jain") return recipeDiet === "veg"; // jain is a subset of veg
  return recipeDiet === "veg";
}

/**
 * Returns true if recipe cook_time_mins fits the household complexity preference.
 * quick = under 20 min, medium = 20-40 min, elaborate = over 40 min.
 */
export function complexityCompatible(cookTimeMins: number, preference: string): boolean {
  if (preference === "any") return true;
  if (preference === "quick") return cookTimeMins <= 20;
  if (preference === "medium") return cookTimeMins > 20 && cookTimeMins <= 40;
  if (preference === "elaborate") return cookTimeMins > 40;
  return true;
}

export function isExpiringSoon(item: FridgeItem): boolean {
  if (!item.estimated_expiry) return false;
  const diff = (new Date(item.estimated_expiry).getTime() - Date.now()) / 86_400_000;
  return diff >= 0 && diff <= 2;
}
