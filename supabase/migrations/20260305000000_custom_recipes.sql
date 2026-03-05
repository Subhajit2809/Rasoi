-- Add household_id and created_by to recipes for custom (household-scoped) recipes.
-- Seeded recipes keep household_id = NULL (global/public).

ALTER TABLE public.recipes
  ADD COLUMN household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
  ADD COLUMN created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_recipes_household_id ON public.recipes (household_id);

-- Replace the single public-read policy with separate global + household policies
DROP POLICY IF EXISTS "recipes: public read" ON public.recipes;

-- Global (seeded) recipes are readable by any authenticated user
CREATE POLICY "recipes: global read"
  ON public.recipes FOR SELECT
  USING (household_id IS NULL);

-- Custom recipes are only visible to household members
CREATE POLICY "recipes: household read"
  ON public.recipes FOR SELECT
  USING (household_id IS NOT NULL AND public.is_household_member(household_id));

-- Household members can create custom recipes for their household
CREATE POLICY "recipes: members can insert"
  ON public.recipes FOR INSERT
  TO authenticated
  WITH CHECK (household_id IS NOT NULL AND public.is_household_member(household_id));

-- Household members can update their household's custom recipes
CREATE POLICY "recipes: members can update"
  ON public.recipes FOR UPDATE
  USING (household_id IS NOT NULL AND public.is_household_member(household_id));

-- Household members can delete their household's custom recipes
CREATE POLICY "recipes: members can delete"
  ON public.recipes FOR DELETE
  USING (household_id IS NOT NULL AND public.is_household_member(household_id));
