-- Phase 8: Expanded preferences — new diet types, spice level, complexity
-- Adds vegan + jain diet options, spice level and complexity preferences

-- 1. Drop existing CHECK constraint on diet_pref, add expanded one
ALTER TABLE public.households
  DROP CONSTRAINT IF EXISTS households_diet_pref_check;

ALTER TABLE public.households
  ADD CONSTRAINT households_diet_pref_check
  CHECK (diet_pref IN ('veg', 'nonveg', 'eggetarian', 'vegan', 'jain'));

-- 2. Add spice_level column
ALTER TABLE public.households
  ADD COLUMN IF NOT EXISTS spice_level TEXT DEFAULT 'medium'
  CHECK (spice_level IN ('mild', 'medium', 'spicy'));

-- 3. Add complexity column
ALTER TABLE public.households
  ADD COLUMN IF NOT EXISTS complexity TEXT DEFAULT 'any'
  CHECK (complexity IN ('quick', 'medium', 'elaborate', 'any'));
