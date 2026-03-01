import type { FridgeItem } from "@/types";

/**
 * True if ingredient name plausibly refers to the same thing as a fridge/pantry
 * item name. Handles "onion" <-> "Pyaz (Onion)", "ginger-garlic paste" <-> "Adrak
 * (Ginger)", "tomatoes" <-> "Tamatar (Tomato)", etc.
 */
export function nameMatches(ingredientRaw: string, itemName: string): boolean {
  const a = ingredientRaw.toLowerCase();
  const b = itemName.toLowerCase();

  // Direct containment
  if (b.includes(a) || a.includes(b)) return true;

  // Word-level: any >=4-char word from ingredient appears in item name
  const words = a.split(/[\s\-,()]+/).filter((w) => w.length >= 4);
  return words.some((w) => b.includes(w));
}

export function dietCompatible(recipeDiet: string, householdDiet: string): boolean {
  if (householdDiet === "nonveg") return true;
  if (householdDiet === "eggetarian") return recipeDiet === "veg" || recipeDiet === "eggetarian";
  return recipeDiet === "veg";
}

export function isExpiringSoon(item: FridgeItem): boolean {
  if (!item.estimated_expiry) return false;
  const diff = (new Date(item.estimated_expiry).getTime() - Date.now()) / 86_400_000;
  return diff >= 0 && diff <= 2;
}
