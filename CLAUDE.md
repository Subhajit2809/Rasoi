# Rasoi — Smart Kitchen Assistant for Indian Households

## What is this?
A PWA (Progressive Web App) for Indian working couples to manage their kitchen —
track fridge inventory, log cooked food with freshness timers, get meal suggestions,
and auto-generate grocery lists.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Auth**: Supabase Auth with Google OAuth
- **PWA**: next-pwa

## Key Design Principles
1. MINIMAL EFFORT — Every interaction should take <5 seconds
2. INDIAN-FIRST — Recipes, ingredients, grocery patterns are all Indian
3. SHARED HOUSEHOLD — Two partners share one kitchen state in real-time
4. FRESHNESS TRACKING — Cooked food has shelf life (dal=2 days, sabzi=2 days, etc.)

## Data Model (Supabase)
- households: id, name, region, diet_pref, household_size, created_at
- household_members: id, household_id, user_id(FK auth.users), role
- pantry_staples: id, household_id, item_name, category (always-have items)
- fridge_items: id, household_id, item_name, category, qty, unit, added_at, estimated_expiry, added_by
- cooked_items: id, household_id, dish_name, cooked_at, freshness_days, status, finished_at
- recipes: id, name, region, category, cook_time_mins, ingredients(JSONB), instructions, diet_type
- grocery_list: id, household_id, item_name, category, is_purchased, source, created_at
- meal_log: id, household_id, dish_name, date

## Screens
1. Onboarding (household setup + preferences + pantry staples)
2. Mera Fridge (home — cooked food with freshness + raw ingredients + use-soon alerts)
3. Add Items (tap-to-add chips by category)
4. I Cooked (one-tap dish logging)
5. Aaj Kya Banaye? (meal suggestions ranked by ingredient match + freshness urgency)
6. Grocery List (auto + manual items, shareable)

## Coding Conventions
- Use TypeScript
- Use Supabase client-side SDK (@supabase/supabase-js)
- Use Tailwind for all styling (no CSS modules)
- Components in src/components/, pages in src/app/
- Use server components where possible, client components only when needed
- All Supabase queries go through src/lib/supabase/ helpers