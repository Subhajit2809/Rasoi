-- Meal planning table: users can plan dishes for each day/meal slot.

CREATE TABLE IF NOT EXISTS public.meal_plans (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  date          DATE        NOT NULL,
  meal_type     TEXT        NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id     UUID        REFERENCES public.recipes(id) ON DELETE SET NULL,
  dish_name     TEXT        NOT NULL,
  created_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (household_id, date, meal_type, dish_name)
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_household ON public.meal_plans (household_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date ON public.meal_plans (date);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_plans: members can select"
  ON public.meal_plans FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "meal_plans: members can insert"
  ON public.meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "meal_plans: members can update"
  ON public.meal_plans FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "meal_plans: members can delete"
  ON public.meal_plans FOR DELETE
  USING (public.is_household_member(household_id));

-- Enable realtime so both partners see plan updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_plans;
