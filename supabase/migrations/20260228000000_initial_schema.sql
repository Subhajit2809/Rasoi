-- =============================================================
-- Rasoi — Initial Schema
-- Migration: 20260228000000_initial_schema.sql
--
-- Tables     : households, household_members, pantry_staples,
--              fridge_items, cooked_items, recipes,
--              grocery_list, meal_log
-- Security   : RLS on every table; SECURITY DEFINER helpers to
--              avoid policy recursion on household_members
-- Trigger    : auto-inserts the creator as admin household_member
-- =============================================================


-- =============================================================
-- TABLES
-- =============================================================

-- 1. households
CREATE TABLE IF NOT EXISTS public.households (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  region         TEXT        NOT NULL DEFAULT 'North Indian',
  diet_pref      TEXT        NOT NULL DEFAULT 'veg'
                               CHECK (diet_pref IN ('veg', 'nonveg', 'eggetarian')),
  household_size INT         NOT NULL DEFAULT 2 CHECK (household_size >= 1),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. household_members
CREATE TABLE IF NOT EXISTS public.household_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id)        ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('admin', 'member')),
  UNIQUE (household_id, user_id)
);

-- 3. pantry_staples  (items the household always keeps stocked)
CREATE TABLE IF NOT EXISTS public.pantry_staples (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  item_name     TEXT NOT NULL,
  category      TEXT NOT NULL
);

-- 4. fridge_items
CREATE TABLE IF NOT EXISTS public.fridge_items (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id     UUID        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  item_name        TEXT        NOT NULL,
  category         TEXT        NOT NULL,
  qty              NUMERIC     NOT NULL DEFAULT 1 CHECK (qty >= 0),
  unit             TEXT        NOT NULL DEFAULT 'piece',
  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estimated_expiry TIMESTAMPTZ,
  added_by         UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 5. cooked_items
CREATE TABLE IF NOT EXISTS public.cooked_items (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id   UUID        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  dish_name      TEXT        NOT NULL,
  cooked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  freshness_days INT         NOT NULL DEFAULT 2 CHECK (freshness_days >= 1),
  status         TEXT        NOT NULL DEFAULT 'fresh'
                               CHECK (status IN ('fresh', 'stale', 'finished')),
  finished_at    TIMESTAMPTZ
);

-- 6. recipes  (shared, no household scope — seeded centrally)
CREATE TABLE IF NOT EXISTS public.recipes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  region         TEXT NOT NULL,
  category       TEXT NOT NULL,
  cook_time_mins INT  NOT NULL CHECK (cook_time_mins > 0),
  ingredients    JSONB NOT NULL DEFAULT '[]',
  instructions   TEXT NOT NULL,
  diet_type      TEXT NOT NULL CHECK (diet_type IN ('veg', 'nonveg', 'eggetarian'))
);

-- 7. grocery_list
CREATE TABLE IF NOT EXISTS public.grocery_list (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  item_name     TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  is_purchased  BOOLEAN     NOT NULL DEFAULT FALSE,
  source        TEXT        NOT NULL DEFAULT 'manual'
                              CHECK (source IN ('auto', 'manual')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. meal_log
CREATE TABLE IF NOT EXISTS public.meal_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  dish_name     TEXT NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE
);


-- =============================================================
-- INDEXES
-- =============================================================

-- household_members — both join directions
CREATE INDEX IF NOT EXISTS idx_hm_household_id        ON public.household_members (household_id);
CREATE INDEX IF NOT EXISTS idx_hm_user_id             ON public.household_members (user_id);

-- pantry_staples
CREATE INDEX IF NOT EXISTS idx_pantry_household_id    ON public.pantry_staples    (household_id);

-- fridge_items — household + expiry for "use soon" queries
CREATE INDEX IF NOT EXISTS idx_fridge_household_id    ON public.fridge_items      (household_id);
CREATE INDEX IF NOT EXISTS idx_fridge_expiry          ON public.fridge_items      (estimated_expiry);

-- cooked_items — household + status for freshness queries
CREATE INDEX IF NOT EXISTS idx_cooked_household_id    ON public.cooked_items      (household_id);
CREATE INDEX IF NOT EXISTS idx_cooked_status          ON public.cooked_items      (status);
CREATE INDEX IF NOT EXISTS idx_cooked_cooked_at       ON public.cooked_items      (cooked_at);

-- grocery_list
CREATE INDEX IF NOT EXISTS idx_grocery_household_id   ON public.grocery_list      (household_id);
CREATE INDEX IF NOT EXISTS idx_grocery_is_purchased   ON public.grocery_list      (is_purchased);

-- meal_log — household + date for history queries
CREATE INDEX IF NOT EXISTS idx_meal_household_id      ON public.meal_log          (household_id);
CREATE INDEX IF NOT EXISTS idx_meal_date              ON public.meal_log          (date);

-- recipes — filter axes used by the suggestions screen
CREATE INDEX IF NOT EXISTS idx_recipes_region         ON public.recipes           (region);
CREATE INDEX IF NOT EXISTS idx_recipes_category       ON public.recipes           (category);
CREATE INDEX IF NOT EXISTS idx_recipes_diet_type      ON public.recipes           (diet_type);


-- =============================================================
-- TRIGGER: auto-create admin household_member on new household
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_household()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  -- auth.uid() is NULL when called from service-role / migrations,
  -- so guard before inserting.
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.household_members (household_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'admin')
    ON CONFLICT (household_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop first so re-running the migration is safe
DROP TRIGGER IF EXISTS on_household_created ON public.households;

CREATE TRIGGER on_household_created
  AFTER INSERT ON public.households
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_household();


-- =============================================================
-- ROW LEVEL SECURITY — helper functions
--
-- Both functions are SECURITY DEFINER so the inner query on
-- household_members bypasses RLS, preventing infinite recursion
-- when those same policies call the helpers.
-- =============================================================

-- Is the current user a member (any role) of the given household?
CREATE OR REPLACE FUNCTION public.is_household_member(hid UUID)
  RETURNS BOOLEAN
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_id = hid
      AND user_id      = auth.uid()
  );
$$;

-- Is the current user an admin of the given household?
CREATE OR REPLACE FUNCTION public.is_household_admin(hid UUID)
  RETURNS BOOLEAN
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_id = hid
      AND user_id      = auth.uid()
      AND role         = 'admin'
  );
$$;


-- =============================================================
-- ROW LEVEL SECURITY — enable + policies
-- =============================================================

ALTER TABLE public.households       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry_staples   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fridge_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooked_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_list     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_log         ENABLE ROW LEVEL SECURITY;


-- ── households ──────────────────────────────────────────────

-- Any authenticated user may create a household.
-- The trigger (SECURITY DEFINER) immediately adds them as admin.
CREATE POLICY "households: authenticated can insert"
  ON public.households FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only members can see their household's details.
CREATE POLICY "households: members can select"
  ON public.households FOR SELECT
  USING (public.is_household_member(id));

-- Only admins can change household settings (name, region, diet_pref …).
CREATE POLICY "households: admins can update"
  ON public.households FOR UPDATE
  USING (public.is_household_admin(id));


-- ── household_members ────────────────────────────────────────

-- Members can see who else shares their household.
CREATE POLICY "household_members: members can select"
  ON public.household_members FOR SELECT
  USING (public.is_household_member(household_id));

-- Admins can add new members to their household.
-- (The trigger uses SECURITY DEFINER and bypasses this policy.)
CREATE POLICY "household_members: admins can insert"
  ON public.household_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_admin(household_members.household_id));

-- Admins can update roles (e.g. promote member → admin).
CREATE POLICY "household_members: admins can update"
  ON public.household_members FOR UPDATE
  USING (public.is_household_admin(household_id));

-- Admins can remove members; members can remove themselves.
CREATE POLICY "household_members: admins can delete"
  ON public.household_members FOR DELETE
  USING (
    public.is_household_admin(household_id)
    OR user_id = auth.uid()
  );


-- ── pantry_staples ───────────────────────────────────────────

CREATE POLICY "pantry_staples: members can select"
  ON public.pantry_staples FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "pantry_staples: members can insert"
  ON public.pantry_staples FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "pantry_staples: members can update"
  ON public.pantry_staples FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "pantry_staples: members can delete"
  ON public.pantry_staples FOR DELETE
  USING (public.is_household_member(household_id));


-- ── fridge_items ─────────────────────────────────────────────

CREATE POLICY "fridge_items: members can select"
  ON public.fridge_items FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "fridge_items: members can insert"
  ON public.fridge_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "fridge_items: members can update"
  ON public.fridge_items FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "fridge_items: members can delete"
  ON public.fridge_items FOR DELETE
  USING (public.is_household_member(household_id));


-- ── cooked_items ─────────────────────────────────────────────

CREATE POLICY "cooked_items: members can select"
  ON public.cooked_items FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "cooked_items: members can insert"
  ON public.cooked_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "cooked_items: members can update"
  ON public.cooked_items FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "cooked_items: members can delete"
  ON public.cooked_items FOR DELETE
  USING (public.is_household_member(household_id));


-- ── recipes — world-readable, client-immutable ───────────────

CREATE POLICY "recipes: public read"
  ON public.recipes FOR SELECT
  USING (true);

-- No INSERT / UPDATE / DELETE policies → only service-role
-- (used by seed.sql) can write to this table.


-- ── grocery_list ─────────────────────────────────────────────

CREATE POLICY "grocery_list: members can select"
  ON public.grocery_list FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "grocery_list: members can insert"
  ON public.grocery_list FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "grocery_list: members can update"
  ON public.grocery_list FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "grocery_list: members can delete"
  ON public.grocery_list FOR DELETE
  USING (public.is_household_member(household_id));


-- ── meal_log ─────────────────────────────────────────────────

CREATE POLICY "meal_log: members can select"
  ON public.meal_log FOR SELECT
  USING (public.is_household_member(household_id));

CREATE POLICY "meal_log: members can insert"
  ON public.meal_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY "meal_log: members can update"
  ON public.meal_log FOR UPDATE
  USING (public.is_household_member(household_id));

CREATE POLICY "meal_log: members can delete"
  ON public.meal_log FOR DELETE
  USING (public.is_household_member(household_id));
