-- =============================================================
-- Rasoi — Enable Realtime
-- Migration: 20260228000002_enable_realtime.sql
--
-- Adds the two most frequently-polled tables to the
-- supabase_realtime publication so both partners receive
-- live updates without polling.
--
-- Note: supabase_realtime is created automatically by Supabase
-- for managed projects and `supabase start` in local dev.
-- =============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.cooked_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fridge_items;
