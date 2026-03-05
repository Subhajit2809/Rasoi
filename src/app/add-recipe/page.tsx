"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { insertRecipe } from "@/lib/services/recipes";

const REGIONS = ["North Indian", "South Indian", "Bengali", "Gujarati", "Maharashtrian", "Other"];
const CATEGORIES = ["dal", "sabzi", "curry", "rice", "roti", "snack", "dessert", "other"];
const DIET_TYPES = [
  { value: "veg" as const, label: "Veg", emoji: "🥦" },
  { value: "eggetarian" as const, label: "Egg", emoji: "🥚" },
  { value: "nonveg" as const, label: "Non-Veg", emoji: "🍗" },
];

interface IngredientRow {
  name: string;
  qty: string;
}

export default function AddRecipePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: hhLoading } = useHousehold();

  const [name, setName] = useState("");
  const [region, setRegion] = useState("North Indian");
  const [category, setCategory] = useState("sabzi");
  const [cookTime, setCookTime] = useState(30);
  const [dietType, setDietType] = useState<"veg" | "nonveg" | "eggetarian">("veg");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: "", qty: "" },
    { name: "", qty: "" },
    { name: "", qty: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  function updateIngredient(idx: number, field: "name" | "qty", value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing))
    );
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, { name: "", qty: "" }]);
  }

  function removeIngredientRow(idx: number) {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    setError("");
    if (!name.trim()) { setError("Recipe name is required."); return; }
    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length < 1) { setError("Add at least one ingredient."); return; }
    if (!household || !user) return;

    setSaving(true);
    const { error: dbErr } = await insertRecipe({
      name: name.trim(),
      region,
      category,
      cook_time_mins: cookTime,
      diet_type: dietType,
      ingredients: validIngredients.map((i) => ({
        name: i.name.trim(),
        qty: i.qty.trim() || "as needed",
      })),
      instructions: instructions.trim(),
      household_id: household.id,
      created_by: user.id,
    });

    setSaving(false);
    if (dbErr) {
      setError("Failed to save recipe. Please try again.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/suggestions"), 1200);
    }
  }

  if (userLoading || hhLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex flex-col items-center justify-center px-6 text-center gap-4">
        <span className="text-5xl animate-bounce">🎉</span>
        <h2 className="text-xl font-bold text-[#3D2010] dark:text-gray-100">Recipe Added!</h2>
        <p className="text-sm text-[#8B5E3C] dark:text-gray-400">
          Taking you to suggestions…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border">
        <Link
          href="/suggestions"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#3D2010] dark:text-gray-100 text-base">Add Your Recipe</h1>
          <p className="text-xs text-[#8B5E3C] dark:text-gray-400">Share with your household</p>
        </div>
        <span className="text-lg">📝</span>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-5 pb-32">
        {/* Recipe Name */}
        <div>
          <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
            Recipe Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Maa Ki Dal"
            className="w-full px-4 py-3 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm focus:outline-none focus:border-[#D2691E]"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
            Region
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  region === r
                    ? "bg-[#D2691E] text-white"
                    : "bg-white dark:bg-dark-surface border border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Category + Cook Time */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 text-sm focus:outline-none focus:border-[#D2691E]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
              Time (min)
            </label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(Math.max(1, Number(e.target.value)))}
              min={1}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 text-sm text-center focus:outline-none focus:border-[#D2691E]"
            />
          </div>
        </div>

        {/* Diet Type */}
        <div>
          <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
            Diet Type
          </label>
          <div className="flex gap-2">
            {DIET_TYPES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDietType(d.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  dietType === d.value
                    ? "bg-[#D2691E] text-white"
                    : "border border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-200"
                }`}
              >
                <span>{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
            Ingredients *
          </label>
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                  placeholder="Ingredient name"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm focus:outline-none focus:border-[#D2691E]"
                />
                <input
                  type="text"
                  value={ing.qty}
                  onChange={(e) => updateIngredient(idx, "qty", e.target.value)}
                  placeholder="Qty"
                  className="w-24 px-3 py-2.5 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm text-center focus:outline-none focus:border-[#D2691E]"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredientRow}
            className="mt-2 text-xs text-[#D2691E] font-medium hover:underline"
          >
            + Add ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-xs font-medium text-[#5C3A1E] dark:text-gray-200 mb-1.5">
            Instructions (optional)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            placeholder="How do you make this dish? (optional)"
            className="w-full px-4 py-3 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-[#D2691E]"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Sticky submit button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-dark-surface border-t border-[#E8C9A0] dark:border-dark-border">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full max-w-lg mx-auto block py-3.5 rounded-2xl bg-[#D2691E] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#B85C18] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            "Save Recipe"
          )}
        </button>
      </div>
    </div>
  );
}
