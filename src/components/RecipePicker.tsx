"use client";

import { useState, useMemo } from "react";
import type { Recipe } from "@/types";
import { dietCompatible } from "@/lib/matching";

interface RecipePickerProps {
  recipes: Recipe[];
  householdDiet: string;
  onSelect: (recipe: Recipe | null, customName: string | null) => void;
  onClose: () => void;
}

export function RecipePicker({
  recipes,
  householdDiet,
  onSelect,
  onClose,
}: RecipePickerProps) {
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return recipes
      .filter((r) => dietCompatible(r.diet_type, householdDiet))
      .filter((r) => !q || r.name.toLowerCase().includes(q));
  }, [recipes, householdDiet, search]);

  function handleCustomSubmit() {
    const name = customName.trim();
    if (!name) return;
    onSelect(null, name);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#FFF8F0] dark:bg-dark-bg rounded-t-3xl max-h-[80vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 rounded-full bg-[#E8C9A0] dark:bg-dark-border" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#3D2010] dark:text-gray-100">
            Pick a Dish
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F5E6D3] dark:bg-dark-border text-[#5C3A1E] dark:text-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm focus:outline-none focus:border-[#D2691E]"
          />
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {/* Custom dish option */}
          <div className="mb-3 bg-white dark:bg-dark-surface rounded-xl border border-dashed border-[#E8C9A0] dark:border-dark-border p-3">
            <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mb-2">
              Or type a custom dish name:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Maa Ki Dal"
                className="flex-1 px-3 py-2 rounded-lg border border-[#E8C9A0] dark:border-dark-border bg-[#FFF8F0] dark:bg-dark-bg text-[#3D2010] dark:text-gray-100 placeholder-[#C4A882] dark:placeholder-gray-600 text-sm focus:outline-none focus:border-[#D2691E]"
                onKeyDown={(e) => { if (e.key === "Enter") handleCustomSubmit(); }}
              />
              <button
                type="button"
                onClick={handleCustomSubmit}
                disabled={!customName.trim()}
                className="px-4 py-2 rounded-lg bg-[#D2691E] text-white text-sm font-medium disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>

          {/* Recipes */}
          <div className="space-y-1">
            {filtered.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => onSelect(recipe, null)}
                className="w-full text-left px-3 py-3 rounded-xl hover:bg-white dark:hover:bg-dark-surface transition-colors flex items-center gap-3"
              >
                <span className="text-lg">
                  {recipe.diet_type === "veg" ? "🥦" : recipe.diet_type === "eggetarian" ? "🥚" : "🍗"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#3D2010] dark:text-gray-100 truncate">
                    {recipe.name}
                    {recipe.household_id && (
                      <span className="ml-1.5 text-xs font-normal text-[#D2691E]">yours</span>
                    )}
                  </p>
                  <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
                    {recipe.region} · {recipe.cook_time_mins}min · {recipe.ingredients.length} ingredients
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-[#8B5E3C] dark:text-gray-400 py-8">
                No recipes found. Try a custom dish name above.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
