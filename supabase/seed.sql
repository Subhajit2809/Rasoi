-- =============================================================
-- Rasoi — Recipe Seed Data
-- 25 pan-Indian recipes across 5 regional cuisines
--
-- Run via Supabase CLI:  supabase db seed
-- Or directly:           psql $DATABASE_URL < supabase/seed.sql
--
-- This file is idempotent: it truncates recipes before inserting.
-- Only service-role (no RLS) can write to the recipes table.
-- =============================================================

TRUNCATE public.recipes;

INSERT INTO public.recipes
  (name, region, category, cook_time_mins, ingredients, instructions, diet_type)
VALUES

-- =============================================================
-- NORTH INDIAN  (7 recipes)
-- =============================================================

-- 1 ── Dal Makhani
(
  'Dal Makhani',
  'North Indian',
  'dal',
  45,
  '[
    {"name": "whole black urad dal",     "qty": "1 cup"},
    {"name": "rajma (kidney beans)",     "qty": "2 tbsp"},
    {"name": "butter",                   "qty": "2 tbsp"},
    {"name": "cream",                    "qty": "3 tbsp"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato puree",             "qty": "3/4 cup"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak dal and rajma overnight. Pressure cook with salt for 6-7 whistles until completely soft, then mash lightly. In a heavy pan heat oil and butter, add cumin seeds. Add chopped onion and fry until golden. Add ginger-garlic paste, cook 2 min. Add tomato puree, red chilli powder and cook until oil separates. Add cooked dal, simmer on low heat for 20-25 min stirring often. Finish with cream, a knob of butter and garam masala. Serve with naan or rice.',
  'veg'
),

-- 2 ── Rajma Masala
(
  'Rajma Masala',
  'North Indian',
  'dal',
  50,
  '[
    {"name": "kidney beans (rajma)",     "qty": "1 cup"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomatoes",                 "qty": "3 medium"},
    {"name": "ginger-garlic paste",      "qty": "1.5 tbsp"},
    {"name": "bay leaf",                 "qty": "1"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak rajma overnight, pressure cook for 5-6 whistles until tender. Heat oil, add cumin seeds and bay leaf. Add finely chopped onions, fry until deep golden. Add ginger-garlic paste, cook 2 min. Add pureed tomatoes with all dry spices, cook until oil separates (10-12 min). Add cooked rajma with 1 cup cooking water, simmer 15-20 min until thick. Garnish with coriander. Serve with steamed rice (rajma chawal).',
  'veg'
),

-- 3 ── Aloo Gobhi
(
  'Aloo Gobhi',
  'North Indian',
  'sabzi',
  30,
  '[
    {"name": "potatoes",                 "qty": "3 medium"},
    {"name": "cauliflower",              "qty": "1 small head"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "ginger",                   "qty": "1 inch piece"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "coriander powder",         "qty": "2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "amchur (dry mango powder)","qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut potatoes and cauliflower into medium florets. Heat oil in a kadhai, add cumin seeds. Add grated ginger and fry 30 sec. Add onion and cook until translucent. Add chopped tomato and all spices except garam masala and amchur, cook 3-4 min. Add potatoes, stir to coat. Cover and cook 8 min. Add cauliflower, mix well. Cover and cook on medium-low for 12-15 min, stirring occasionally, until vegetables are tender. Add garam masala and amchur. Garnish with coriander. Serve dry with roti.',
  'veg'
),

-- 4 ── Palak Paneer
(
  'Palak Paneer',
  'North Indian',
  'sabzi',
  35,
  '[
    {"name": "spinach (palak)",          "qty": "500 g"},
    {"name": "paneer",                   "qty": "250 g"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "green chilli",             "qty": "1-2"},
    {"name": "cream",                    "qty": "2 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "butter",                   "qty": "1 tbsp"},
    {"name": "oil",                      "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Blanch spinach in boiling water for 2 min, drain and blend with green chilli to a smooth paste. Cut paneer into cubes and lightly fry in butter until golden, set aside. In the same pan heat oil and butter, add cumin seeds. Add onion and cook until golden. Add ginger-garlic paste, cook 2 min. Add chopped tomato and turmeric, cook until soft. Add spinach puree, simmer 5 min. Season with salt. Add fried paneer and garam masala, cook 3 min. Finish with cream. Serve with naan or paratha.',
  'veg'
),

-- 5 ── Paneer Butter Masala
(
  'Paneer Butter Masala',
  'North Indian',
  'sabzi',
  40,
  '[
    {"name": "paneer",                   "qty": "250 g"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomatoes",                 "qty": "3 medium"},
    {"name": "cashews",                  "qty": "12-15"},
    {"name": "butter",                   "qty": "3 tbsp"},
    {"name": "cream",                    "qty": "3 tbsp"},
    {"name": "ginger-garlic paste",      "qty": "1.5 tbsp"},
    {"name": "kasuri methi",             "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "sugar",                    "qty": "1/2 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Boil onions, tomatoes and cashews together for 10 min, cool and blend to a smooth paste. Heat butter in a pan, add ginger-garlic paste, cook 2 min. Add the blended paste, red chilli powder and cook on medium for 12-15 min until the colour darkens and oil separates. Add 1/2 cup water, sugar and salt, simmer 5 min. Add paneer cubes, cream and crushed kasuri methi, cook 3-4 min. Finish with a knob of cold butter. Serve with naan or jeera rice.',
  'veg'
),

-- 6 ── Anda Bhurji  (eggetarian)
(
  'Anda Bhurji',
  'North Indian',
  'breakfast',
  15,
  '[
    {"name": "eggs",                     "qty": "3"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "green chilli",             "qty": "1"},
    {"name": "ginger",                   "qty": "1/2 inch"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "red chilli powder",        "qty": "1/4 tsp"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "butter",                   "qty": "1 tbsp"},
    {"name": "fresh coriander",          "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Heat butter in a non-stick pan. Add cumin seeds and let them splutter. Add finely chopped onion, ginger and green chilli, fry until onion is soft. Add chopped tomato, turmeric and red chilli powder, cook until tomato softens and water evaporates (3-4 min). Beat eggs with a pinch of salt and pour into the pan. Stir continuously on medium-low heat, scrambling as it cooks. Remove from heat while still slightly soft — it will carry-cook. Garnish with fresh coriander. Serve with buttered pav or toast.',
  'eggetarian'
),

-- 7 ── Butter Chicken
(
  'Butter Chicken',
  'North Indian',
  'non-veg',
  50,
  '[
    {"name": "chicken (bone-in)",        "qty": "750 g"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomatoes",                 "qty": "4 medium"},
    {"name": "butter",                   "qty": "3 tbsp"},
    {"name": "cream",                    "qty": "4 tbsp"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "kasuri methi",             "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "yoghurt",                  "qty": "3 tbsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate chicken in yoghurt, half the ginger-garlic paste, lemon juice, salt and red chilli for at least 30 min. Grill or roast in oven at 200 C for 20-25 min. For the makhani gravy: heat butter and oil in a pan, add remaining ginger-garlic paste, cook 2 min. Add chopped onions, fry golden. Add chopped tomatoes and all dry spices, cook until mashy (15 min). Cool, blend smooth and strain back into the pan. Add grilled chicken, cream and crushed kasuri methi. Simmer 10 min. Finish with a cold knob of butter. Serve with naan.',
  'nonveg'
),


-- =============================================================
-- SOUTH INDIAN  (5 recipes)
-- =============================================================

-- 8 ── Sambar
(
  'Sambar',
  'South Indian',
  'dal',
  30,
  '[
    {"name": "toor dal (split pigeon peas)", "qty": "1/2 cup"},
    {"name": "tamarind pulp",            "qty": "2 tbsp"},
    {"name": "sambar powder",            "qty": "2 tsp"},
    {"name": "drumstick (moringa)",      "qty": "1"},
    {"name": "small onions (shallots)",  "qty": "8-10"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "asafoetida (hing)",        "qty": "a pinch"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook toor dal with turmeric for 3-4 whistles until mushy, then whisk smooth. Add tamarind pulp, sambar powder, salt and 1.5 cups water, simmer 10 min. Add drumstick pieces and shallots, cook until vegetables are tender. Prepare tempering: heat oil, add mustard seeds and let them pop, add dried chillies, curry leaves and hing. Pour tempering into sambar, add chopped tomato and simmer 5 min. Adjust consistency with water. Serve hot with idli, dosa or rice.',
  'veg'
),

-- 9 ── Rasam
(
  'Rasam',
  'South Indian',
  'dal',
  20,
  '[
    {"name": "toor dal",                 "qty": "3 tbsp"},
    {"name": "tamarind pulp",            "qty": "3 tbsp"},
    {"name": "tomatoes",                 "qty": "2 medium"},
    {"name": "garlic",                   "qty": "4 cloves"},
    {"name": "rasam powder",             "qty": "2 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "ghee",                     "qty": "1 tsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook toor dal and reserve the thin cooking water. Mix tamarind pulp with 2 cups water, add crushed tomatoes, smashed garlic, rasam powder, turmeric and salt. Bring to a boil and simmer 10 min. Add the thin dal water and simmer 3-4 min until aromatic and watery. Prepare tempering: heat ghee, add mustard seeds, cumin seeds, dried chillies, curry leaves and hing. Pour over rasam. Garnish with coriander. Drink as a digestive soup or pour over rice.',
  'veg'
),

-- 10 ── Bisibelebath
(
  'Bisibelebath',
  'South Indian',
  'rice',
  45,
  '[
    {"name": "raw rice",                 "qty": "1/2 cup"},
    {"name": "toor dal",                 "qty": "1/3 cup"},
    {"name": "mixed vegetables (carrot, beans, peas)", "qty": "1 cup"},
    {"name": "tamarind pulp",            "qty": "2 tbsp"},
    {"name": "bisibelebath powder",      "qty": "3 tbsp"},
    {"name": "shallots",                 "qty": "8"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "cashews",                  "qty": "10"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook rice and toor dal together with 3 cups water for 4 whistles until very soft, then mash together. Cook vegetables in tamarind water with turmeric until tender. Combine mashed rice-dal with cooked vegetables and tamarind water. Add bisibelebath powder and salt, simmer 10 min adding water to reach a flowing porridge-like consistency. Prepare tempering: heat ghee, fry cashews until golden and remove. Add mustard seeds, dried chillies, curry leaves, halved shallots and hing. Pour tempering and cashews into the dish. Serve hot with raita and papad.',
  'veg'
),

-- 11 ── Ven Pongal
(
  'Ven Pongal',
  'South Indian',
  'breakfast',
  25,
  '[
    {"name": "raw rice",                 "qty": "1 cup"},
    {"name": "moong dal (split yellow)", "qty": "1/3 cup"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "black pepper (whole)",     "qty": "1.5 tsp"},
    {"name": "cumin seeds",              "qty": "1.5 tsp"},
    {"name": "ginger",                   "qty": "1 inch"},
    {"name": "curry leaves",             "qty": "2 sprigs"},
    {"name": "cashews",                  "qty": "10-12"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "salt",                     "qty": "to taste"},
    {"name": "water",                    "qty": "5 cups"}
  ]'::jsonb,
  'Dry roast moong dal until light golden. Pressure cook rice and roasted dal with 5 cups water for 4-5 whistles until completely mushy. Add salt and beat with a ladle until creamy. Heat ghee in a small pan, fry cashews until golden and set aside. Add cumin seeds, coarsely crushed black pepper, grated ginger, curry leaves and hing to the same ghee. Pour tempering over pongal, add cashews and mix well. Add more ghee on top. Serve hot with sambar and coconut chutney.',
  'veg'
),

-- 12 ── Avial
(
  'Avial',
  'South Indian',
  'sabzi',
  35,
  '[
    {"name": "mixed vegetables (raw banana, yam, drumstick, beans, carrot)", "qty": "500 g"},
    {"name": "fresh coconut (grated)",   "qty": "1 cup"},
    {"name": "green chilli",             "qty": "3-4"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "yoghurt",                  "qty": "3 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "curry leaves",             "qty": "2 sprigs"},
    {"name": "coconut oil",              "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut all vegetables into 2-inch sticks of similar thickness. Cook in a wide pan with turmeric, salt and minimum water until just tender — do not overcook. Grind coconut, green chillies and cumin seeds to a coarse paste with very little water. Add coconut paste to vegetables, mix gently and cook on low heat for 3-4 min until fragrant. Remove from heat and stir in yoghurt. Top with curry leaves and drizzle coconut oil. Do not return to high heat after adding yoghurt. Serve with rice.',
  'veg'
),


-- =============================================================
-- BENGALI  (5 recipes)
-- =============================================================

-- 13 ── Macher Jhol
(
  'Macher Jhol',
  'Bengali',
  'non-veg',
  30,
  '[
    {"name": "rohu or catla fish (steaks)", "qty": "500 g"},
    {"name": "potato",                   "qty": "2 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "ginger paste",             "qty": "1 tsp"},
    {"name": "mustard oil",              "qty": "3 tbsp"},
    {"name": "turmeric",                 "qty": "1 tsp"},
    {"name": "cumin powder",             "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "bay leaf",                 "qty": "1"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate fish steaks with turmeric and salt for 15 min. Heat mustard oil until smoking, reduce to medium and fry fish until golden on both sides. Set aside. In the same oil add bay leaf, slit green chillies and chopped onion, fry until golden. Add ginger paste, cook 1 min. Add chopped tomato, turmeric, cumin powder, coriander powder and red chilli, cook until oil separates. Add par-boiled potato wedges, stir to coat. Add 1.5 cups hot water, bring to boil. Add fried fish gently, simmer 8-10 min. Garnish with coriander. Serve with steamed rice.',
  'nonveg'
),

-- 14 ── Shorshe Ilish
(
  'Shorshe Ilish',
  'Bengali',
  'non-veg',
  25,
  '[
    {"name": "hilsa (ilish) fish steaks", "qty": "4 pieces"},
    {"name": "yellow mustard seeds",     "qty": "3 tbsp"},
    {"name": "black mustard seeds",      "qty": "1 tbsp"},
    {"name": "green chilli",             "qty": "3-4"},
    {"name": "turmeric",                 "qty": "1 tsp"},
    {"name": "mustard oil",              "qty": "3 tbsp"},
    {"name": "nigella seeds (kalonji)",  "qty": "1/2 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak yellow and black mustard seeds with green chillies in 3 tbsp water for 20 min. Grind to a smooth paste, strain through a fine sieve to remove bitterness. Add turmeric, salt and 1 tbsp mustard oil to the strained paste. Rub fish steaks with turmeric and salt. Heat mustard oil in a flat pan until smoking, add nigella seeds. Place fish steaks and pour mustard paste over them with 1/4 cup water. Cover and cook on medium-low for 8-10 min. Flip gently, add water if drying out, cook another 5 min. Drizzle raw mustard oil before serving. Serve with hot steamed rice.',
  'nonveg'
),

-- 15 ── Cholar Dal
(
  'Cholar Dal',
  'Bengali',
  'dal',
  40,
  '[
    {"name": "chana dal (split chickpeas)", "qty": "1 cup"},
    {"name": "fresh coconut (slivers)",  "qty": "3 tbsp"},
    {"name": "raisins",                  "qty": "2 tbsp"},
    {"name": "ginger",                   "qty": "1 inch"},
    {"name": "bay leaf",                 "qty": "2"},
    {"name": "cloves",                   "qty": "3"},
    {"name": "green cardamom",           "qty": "2"},
    {"name": "cinnamon",                 "qty": "1 inch"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak chana dal for 1 hour, drain. Pressure cook with turmeric, salt and enough water for 2-3 whistles — dal should be cooked but hold its shape, not mushy. Heat ghee in a wok, fry coconut slivers until golden and raisins until plump. Set aside. In the same ghee add cumin seeds, bay leaves, cloves, cardamom and cinnamon, let them crackle. Add dried chillies and grated ginger, fry 30 sec. Add the cooked dal, sugar and a splash of water, stir gently and simmer 8 min. Top with fried coconut and raisins. Serve with luchi (fried puri).',
  'veg'
),

-- 16 ── Aloo Posto
(
  'Aloo Posto',
  'Bengali',
  'sabzi',
  25,
  '[
    {"name": "potatoes",                 "qty": "4 medium"},
    {"name": "white poppy seeds (posto)", "qty": "4 tbsp"},
    {"name": "green chilli",             "qty": "2-3"},
    {"name": "mustard oil",              "qty": "3 tbsp"},
    {"name": "nigella seeds (kalonji)",  "qty": "1/2 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak poppy seeds with green chillies in 4 tbsp water for 20 min. Grind to a smooth thick paste. Cut potatoes into 1-inch cubes. Heat mustard oil until smoking in a kadhai, reduce heat and add nigella seeds. Add potatoes, turmeric and salt, stir fry on medium until half cooked (7-8 min). Add the posto paste, stir well to coat every piece. Cook on low-medium heat, stirring occasionally, for 10-12 min until potatoes are fully cooked and the dry paste clings to them. Add sugar and stir. There should be no gravy. Finish with a drizzle of raw mustard oil. Serve with steamed rice.',
  'veg'
),

-- 17 ── Begun Bhaja
(
  'Begun Bhaja',
  'Bengali',
  'sabzi',
  15,
  '[
    {"name": "large brinjal (eggplant)", "qty": "1 large"},
    {"name": "turmeric",                 "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "cumin powder",             "qty": "1 tsp"},
    {"name": "mustard oil",              "qty": "4 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut brinjal into 1/2-inch thick round slices. Mix turmeric, red chilli powder, cumin powder and salt. Rub the spice mix evenly on both sides of each slice and rest for 5-10 min. Heat mustard oil in a flat pan until smoking, reduce to medium. Place brinjal slices in a single layer without crowding. Fry until deep golden and crisped on one side (4-5 min), flip and fry the other side. Drain on paper. Serve immediately as a side with dal and rice — the crispness fades quickly so eat at once.',
  'veg'
),


-- =============================================================
-- GUJARATI  (4 recipes)
-- =============================================================

-- 18 ── Dhokla
(
  'Dhokla',
  'Gujarati',
  'breakfast',
  30,
  '[
    {"name": "besan (gram flour)",       "qty": "1.5 cups"},
    {"name": "yoghurt",                  "qty": "3/4 cup"},
    {"name": "water",                    "qty": "1/2 cup"},
    {"name": "ginger-green chilli paste","qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "Eno fruit salt",           "qty": "1.5 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "slit green chilli",        "qty": "2"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "sugar (for tempering)",    "qty": "1 tsp"},
    {"name": "water (for tempering)",    "qty": "1/4 cup"},
    {"name": "fresh coriander and grated coconut", "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Whisk together besan, yoghurt, water, ginger-chilli paste, turmeric, sugar, lemon juice and salt into a smooth lump-free batter. Grease a 7-inch thali and heat a steamer. When the steamer is hot, add Eno to batter, mix briskly and pour into the thali immediately. Steam for 18-20 min until a toothpick comes out clean. For tempering: heat oil, add mustard seeds, slit chillies and curry leaves. Add water and sugar, bring to a boil and pour evenly over the hot steamed dhokla. Garnish with coriander and grated coconut. Cut into squares and serve with green chutney.',
  'veg'
),

-- 19 ── Methi Thepla
(
  'Methi Thepla',
  'Gujarati',
  'roti',
  25,
  '[
    {"name": "whole wheat flour",        "qty": "1.5 cups"},
    {"name": "besan (gram flour)",       "qty": "1/4 cup"},
    {"name": "fresh methi (fenugreek leaves)", "qty": "1 cup"},
    {"name": "yoghurt",                  "qty": "3 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp (+ for frying)"},
    {"name": "ginger-green chilli paste","qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "sesame seeds",             "qty": "1 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix all dry ingredients together. Add finely chopped methi leaves, yoghurt, oil and ginger-chilli paste. Mix well and knead into a soft pliable dough using minimum water. Divide into lime-sized balls. On a floured surface, roll each ball thin (like a chapati). Cook on a hot tawa: place thepla, cook until small bubbles appear, flip, apply oil and cook until golden spots appear on both sides. Press with a spatula while cooking. Stack and serve warm with pickle and yoghurt or chai. Theplas stay fresh for 2-3 days and are great for travel.',
  'veg'
),

-- 20 ── Dal Dhokli
(
  'Dal Dhokli',
  'Gujarati',
  'dal',
  45,
  '[
    {"name": "toor dal",                 "qty": "3/4 cup"},
    {"name": "whole wheat flour",        "qty": "1 cup"},
    {"name": "tomatoes",                 "qty": "2 medium"},
    {"name": "raw peanuts",              "qty": "3 tbsp"},
    {"name": "tamarind pulp",            "qty": "2 tbsp"},
    {"name": "jaggery",                  "qty": "1 tbsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "green chilli",             "qty": "1"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook toor dal until soft, whisk smooth. Mix flour with turmeric, salt and water into a stiff dough, rest 10 min, then roll thin and cut into diamond shapes (the dhokli). For the dal: heat ghee, add mustard seeds, cumin seeds, dried chillies, curry leaves and peanuts. Add chopped tomatoes, all spices, tamarind pulp and jaggery with 3 cups water, bring to boil. Stir in cooked dal, simmer 5 min. Drop dhokli pieces one by one into the simmering dal — they will sink then float. Cover and cook for 12-15 min until the dhokli are fully cooked and soft. Adjust consistency. Garnish with coriander. Serve as a wholesome one-pot meal.',
  'veg'
),

-- 21 ── Undhiyu
(
  'Undhiyu',
  'Gujarati',
  'sabzi',
  60,
  '[
    {"name": "baby eggplants",           "qty": "8 small"},
    {"name": "raw banana",               "qty": "2"},
    {"name": "sweet potato",             "qty": "2 medium"},
    {"name": "potato",                   "qty": "2 medium"},
    {"name": "raw peanuts",              "qty": "1/4 cup"},
    {"name": "fresh green garlic",       "qty": "1/4 cup"},
    {"name": "muthiya (fenugreek-flour dumplings)", "qty": "10 pieces"},
    {"name": "fresh coriander-coconut paste", "qty": "1/2 cup"},
    {"name": "sesame seeds",             "qty": "2 tbsp"},
    {"name": "green chilli-ginger paste","qty": "1 tbsp"},
    {"name": "oil",                      "qty": "4 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix coriander-coconut paste with turmeric, red chilli, sesame seeds, green chilli-ginger paste, sugar, lemon juice and salt to make stuffing. Slit baby eggplants and raw bananas keeping stems intact, fill with stuffing. Cut remaining vegetables into large chunks and coat with the remaining stuffing. Heat oil in a heavy-bottomed pan, layer vegetables starting with the hardest (sweet potato, potato), then eggplant and banana, then muthiya on top. Scatter peanuts and green garlic. Pour any remaining water-diluted stuffing over the top. Cover tightly and cook on low heat for 35-40 min. Stir gently once or twice. All vegetables should be very tender. Serve with puri.',
  'veg'
),


-- =============================================================
-- MAHARASHTRIAN  (4 recipes)
-- =============================================================

-- 22 ── Misal Pav
(
  'Misal Pav',
  'Maharashtrian',
  'breakfast',
  35,
  '[
    {"name": "sprouted moth beans (matki)", "qty": "1.5 cups"},
    {"name": "potato",                   "qty": "1 medium"},
    {"name": "onion",                    "qty": "1 large"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "kanda lasun masala",       "qty": "2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "farsan (sev and chiwda mix)", "qty": "for topping"},
    {"name": "fresh coriander",          "qty": "for topping"},
    {"name": "lemon wedge",              "qty": "for serving"},
    {"name": "pav (dinner rolls)",       "qty": "4"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook sprouted matki with salt for 2 whistles, drain and reserve liquid. Heat oil, add mustard seeds and curry leaves. Add chopped onion, fry until golden. Add ginger-garlic paste, cook 1 min. Add tomato, kanda lasun masala, red chilli powder, turmeric and salt, cook until oil separates. Add par-boiled potato cubes and cooked matki with 1 cup of the reserved liquid plus extra water, bring to boil and simmer 10-12 min — the kat (gravy) should be thin and fiery. Serve misal in a bowl, ladle kat generously over it, top with farsan, coriander and raw onion. Accompany with buttered pav and lemon.',
  'veg'
),

-- 23 ── Puran Poli
(
  'Puran Poli',
  'Maharashtrian',
  'roti',
  45,
  '[
    {"name": "chana dal (split chickpea)", "qty": "1 cup"},
    {"name": "jaggery (grated)",         "qty": "3/4 cup"},
    {"name": "whole wheat flour",        "qty": "1.5 cups"},
    {"name": "all-purpose flour (maida)","qty": "1/2 cup"},
    {"name": "cardamom powder",          "qty": "1 tsp"},
    {"name": "nutmeg (grated)",          "qty": "a pinch"},
    {"name": "ghee",                     "qty": "3 tbsp (+ for serving)"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "turmeric",                 "qty": "a pinch"},
    {"name": "salt",                     "qty": "a pinch"},
    {"name": "water",                    "qty": "as needed"}
  ]'::jsonb,
  'Pressure cook chana dal until very soft. Drain water, mash finely and cook on medium heat, stirring, until it dries out into a thick mass. Add jaggery and cook stirring until the mixture is thick and leaves the sides (puran). Mix in cardamom and nutmeg, cool. Make a soft pliable dough with both flours, salt, turmeric, oil and water; rest 30 min covered. Divide dough and puran into equal portions (puran slightly larger). Flatten a dough portion, place puran in the centre, seal and roll out thin, handling gently so filling does not burst. Cook on a hot tawa on medium-low heat with ghee until golden spots appear on both sides. Serve hot with warm milk or aamras.',
  'veg'
),

-- 24 ── Varan Bhaat
(
  'Varan Bhaat',
  'Maharashtrian',
  'dal',
  30,
  '[
    {"name": "toor dal",                 "qty": "1 cup"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "jaggery",                  "qty": "1 tsp"},
    {"name": "lemon juice",              "qty": "1 tsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "steamed basmati rice",     "qty": "for serving"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Pressure cook toor dal with turmeric and a drop of ghee for 3-4 whistles until completely soft. Whisk until smooth and creamy, thinning with water to a flowing consistency. Heat ghee in a small pan, add mustard seeds and let them pop. Add cumin seeds, dried chillies, curry leaves and asafoetida. Pour tempering into dal, add salt and jaggery. Simmer 5 min, then add lemon juice. Adjust consistency — varan should flow easily when poured. Serve immediately over steamed rice with a generous knob of ghee on top. This is the soul of a Maharashtrian thali.',
  'veg'
),

-- 25 ── Vangi Bhaat
(
  'Vangi Bhaat',
  'Maharashtrian',
  'rice',
  35,
  '[
    {"name": "small round brinjals",     "qty": "300 g"},
    {"name": "basmati rice",             "qty": "1.5 cups"},
    {"name": "vangi bhaat masala (or goda masala)", "qty": "2 tbsp"},
    {"name": "raw peanuts",              "qty": "3 tbsp"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "tamarind pulp",            "qty": "1 tbsp"},
    {"name": "jaggery",                  "qty": "1 tsp"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cook rice until just done (slightly undercooked), spread to cool. Quarter the brinjals. Heat oil and ghee in a wide pan, fry peanuts until golden and set aside. In the same pan add mustard seeds, cumin seeds, dried chillies, curry leaves and thinly sliced onion, fry until golden. Add brinjal pieces, turmeric and salt, fry on medium until tender (7-8 min). Add vangi bhaat masala, tamarind pulp and jaggery, cook 2 min until fragrant. Add the cooled rice and fried peanuts, gently fold together without breaking the rice. Cover and cook on low for 5 min. Garnish with coriander and a drizzle of ghee. Serve with plain yoghurt.',
  'veg'
);
