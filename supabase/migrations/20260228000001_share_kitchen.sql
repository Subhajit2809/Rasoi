-- =============================================================
-- Rasoi — Share Kitchen
-- Migration: 20260228000001_share_kitchen.sql
--
-- Tables    : profiles, household_invites
-- Functions : get_invite_preview       (SECURITY DEFINER)
--             generate_household_invite (SECURITY DEFINER)
--             join_household_by_code    (SECURITY DEFINER)
-- =============================================================


-- =============================================================
-- TABLE: profiles
-- One row per auth.users row. Auto-populated by trigger.
-- Stores the display name and avatar URL from Google OAuth.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can always read their own profile.
CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Users can read profiles of people in the same household.
CREATE POLICY "profiles: household members can read"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.household_members hm1
      JOIN public.household_members hm2
        ON hm1.household_id = hm2.household_id
      WHERE hm1.user_id = auth.uid()
        AND hm2.user_id = profiles.id
    )
  );

-- Users can upsert their own profile (in case trigger missed them).
CREATE POLICY "profiles: own upsert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- =============================================================
-- TRIGGER: auto-create profile on new user signup
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- =============================================================
-- TABLE: household_invites
-- =============================================================

CREATE TABLE IF NOT EXISTS public.household_invites (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  -- 6-char uppercase hex code, e.g. "A3F9C1"
  code         TEXT        NOT NULL UNIQUE,
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  -- NULL until a partner uses the code
  used_by      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invites_code
  ON public.household_invites (code);
CREATE INDEX IF NOT EXISTS idx_invites_household_id
  ON public.household_invites (household_id);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at
  ON public.household_invites (expires_at);

ALTER TABLE public.household_invites ENABLE ROW LEVEL SECURITY;

-- Household admins can view/manage their own household's invites.
CREATE POLICY "invites: admins can select"
  ON public.household_invites FOR SELECT
  USING (public.is_household_admin(household_id));

CREATE POLICY "invites: admins can insert"
  ON public.household_invites FOR INSERT
  TO authenticated
  WITH CHECK (public.is_household_admin(household_id));

CREATE POLICY "invites: admins can delete"
  ON public.household_invites FOR DELETE
  USING (public.is_household_admin(household_id));


-- =============================================================
-- FUNCTION: get_invite_preview
--
-- Returns basic household info for a valid, unused invite code
-- WITHOUT requiring the caller to be a household member.
-- Used by /join/[code] to show "You are joining Sharma ki Rasoi".
-- =============================================================

CREATE OR REPLACE FUNCTION public.get_invite_preview(p_code TEXT)
  RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_invite    public.household_invites%ROWTYPE;
  v_household public.households%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  SELECT * INTO v_invite
  FROM public.household_invites
  WHERE code       = p_code
    AND expires_at > now()
    AND used_by    IS NULL;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'This invite code is invalid or has already been used');
  END IF;

  SELECT * INTO v_household
  FROM public.households
  WHERE id = v_invite.household_id;

  RETURN json_build_object(
    'household_id',   v_household.id,
    'household_name', v_household.name,
    'region',         v_household.region,
    'diet_pref',      v_household.diet_pref,
    'expires_at',     v_invite.expires_at
  );
END;
$$;


-- =============================================================
-- FUNCTION: generate_household_invite
--
-- Called by household admins from the settings page.
-- Re-uses an existing unexpired+unused invite if one exists,
-- otherwise generates a new 6-char code.
-- =============================================================

CREATE OR REPLACE FUNCTION public.generate_household_invite(p_household_id UUID)
  RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_code   TEXT;
  v_invite public.household_invites%ROWTYPE;
BEGIN
  IF NOT public.is_household_admin(p_household_id) THEN
    RETURN json_build_object('error', 'Only kitchen admins can generate invite codes');
  END IF;

  -- Re-use an existing active invite if available
  SELECT * INTO v_invite
  FROM public.household_invites
  WHERE household_id = p_household_id
    AND expires_at   > now()
    AND used_by      IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    RETURN json_build_object(
      'code',       v_invite.code,
      'expires_at', v_invite.expires_at
    );
  END IF;

  -- Generate a unique 6-char uppercase hex code (A-F, 0-9)
  LOOP
    v_code := upper(encode(gen_random_bytes(3), 'hex'));
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.household_invites WHERE code = v_code
    );
  END LOOP;

  INSERT INTO public.household_invites (household_id, code, created_by)
  VALUES (p_household_id, v_code, auth.uid());

  RETURN json_build_object(
    'code',       v_code,
    'expires_at', now() + INTERVAL '24 hours'
  );
END;
$$;


-- =============================================================
-- FUNCTION: join_household_by_code
--
-- Adds the calling user to the household referenced by the code.
-- SECURITY DEFINER bypasses the "admins only" INSERT policy on
-- household_members so any authenticated user can join via invite.
-- =============================================================

CREATE OR REPLACE FUNCTION public.join_household_by_code(p_code TEXT)
  RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_invite          public.household_invites%ROWTYPE;
  v_user_id         UUID := auth.uid();
  v_existing_hid    UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Validate invite
  SELECT * INTO v_invite
  FROM public.household_invites
  WHERE code       = p_code
    AND expires_at > now()
    AND used_by    IS NULL;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'This invite code is invalid or has expired');
  END IF;

  -- Check if user is already in any household
  SELECT household_id INTO v_existing_hid
  FROM public.household_members
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_existing_hid IS NOT NULL THEN
    -- Already in this household specifically → idempotent success
    IF v_existing_hid = v_invite.household_id THEN
      RETURN json_build_object(
        'household_id',  v_invite.household_id,
        'already_member', true
      );
    END IF;
    RETURN json_build_object(
      'error', 'You already belong to a kitchen. Leave it first to join a new one.'
    );
  END IF;

  -- Add user as member (bypasses RLS via SECURITY DEFINER)
  INSERT INTO public.household_members (household_id, user_id, role)
  VALUES (v_invite.household_id, v_user_id, 'member')
  ON CONFLICT (household_id, user_id) DO NOTHING;

  -- Mark invite as used (single-use codes)
  UPDATE public.household_invites
  SET used_by = v_user_id,
      used_at = now()
  WHERE id = v_invite.id;

  -- Ensure profile exists for this user (handles users who
  -- signed up before this migration added the trigger)
  INSERT INTO public.profiles (id, display_name, avatar_url)
  SELECT
    au.id,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name',
      split_part(au.email, '@', 1)
    ),
    au.raw_user_meta_data->>'avatar_url'
  FROM auth.users au
  WHERE au.id = v_user_id
  ON CONFLICT (id) DO NOTHING;

  RETURN json_build_object(
    'household_id',   v_invite.household_id,
    'already_member', false
  );
END;
$$;
