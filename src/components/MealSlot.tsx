"use client";

import type { MealPlan } from "@/types";

const MEAL_EMOJI: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍪",
};

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

interface MealSlotProps {
  mealType: string;
  plans: MealPlan[];
  logged: boolean;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function MealSlot({ mealType, plans, logged, onAdd, onRemove }: MealSlotProps) {
  const emoji = MEAL_EMOJI[mealType] ?? "🍽️";
  const label = MEAL_LABEL[mealType] ?? mealType;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-[#E8C9A0] dark:border-dark-border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h3 className="text-sm font-semibold text-[#3D2010] dark:text-gray-100">
            {label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#D2691E] bg-[#FFF0E0] dark:bg-dark-card text-sm font-bold hover:bg-[#FFE0C0] dark:hover:bg-dark-border transition-colors"
        >
          +
        </button>
      </div>

      {plans.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[#E8C9A0] dark:border-dark-border text-[#8B5E3C] dark:text-gray-400 text-xs hover:border-[#D2691E] transition-colors"
        >
          Tap to plan {label.toLowerCase()}
        </button>
      ) : (
        <div className="space-y-1.5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center gap-2 bg-[#FFF8F0] dark:bg-dark-bg rounded-xl px-3 py-2"
            >
              {logged && (
                <span className="text-green-500 text-xs" title="Cooked!">✓</span>
              )}
              <span className="flex-1 text-sm text-[#3D2010] dark:text-gray-100 truncate">
                {plan.dish_name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(plan.id)}
                className="text-[#C4A882] dark:text-gray-500 hover:text-red-400 text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
