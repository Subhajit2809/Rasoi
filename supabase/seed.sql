-- =============================================================
-- Rasoi — Recipe Seed Data
-- 80+ pan-Indian recipes across 11 regional cuisines
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
),


-- =============================================================
-- NORTH INDIAN  (5 additional recipes — 12 total)
-- =============================================================

-- 26 ── Chole
(
  'Chole',
  'North Indian',
  'curry',
  40,
  '[
    {"name": "kabuli chana (chickpeas)", "qty": "1.5 cups"},
    {"name": "onion",                    "qty": "2 large"},
    {"name": "tomato",                   "qty": "3 medium"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "chole masala",             "qty": "2 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "bay leaf",                 "qty": "1"},
    {"name": "tea bag or tea leaves",    "qty": "1"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak chickpeas overnight. Boil with a tea bag until soft (pressure cook 5-6 whistles). Discard tea bag. Heat oil, add cumin and bay leaf. Add chopped onions, fry golden. Add ginger-garlic paste, cook 1 min. Add pureed tomatoes, chole masala and salt. Cook until oil separates. Add boiled chickpeas with some cooking water. Simmer 15-20 min until thick and dark. Garnish with coriander. Serve with bhatura or rice.',
  'veg'
),

-- 27 ── Kadhi Pakora
(
  'Kadhi Pakora',
  'North Indian',
  'curry',
  35,
  '[
    {"name": "besan (gram flour)",       "qty": "1/2 cup + 1 cup"},
    {"name": "dahi (yogurt)",            "qty": "1 cup"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "dried red chilli",         "qty": "2"},
    {"name": "fenugreek seeds",          "qty": "1/4 tsp"},
    {"name": "oil",                      "qty": "for frying + 2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Make pakora batter: mix 1/2 cup besan with chopped onion, salt and water. Deep fry spoonfuls until golden. For kadhi: whisk 1 cup besan with yogurt and 4 cups water until smooth. Bring to boil stirring constantly, add turmeric, chilli powder and salt. Simmer 20 min. Prepare tempering: heat oil, add mustard seeds, cumin, fenugreek seeds, dried chillies and curry leaves. Pour into kadhi. Add pakoras, simmer 5 min. Serve with steamed rice.',
  'veg'
),

-- 28 ── Shahi Paneer
(
  'Shahi Paneer',
  'North Indian',
  'curry',
  30,
  '[
    {"name": "paneer",                   "qty": "250 g"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomato",                   "qty": "2 medium"},
    {"name": "cashews",                  "qty": "10"},
    {"name": "fresh cream",              "qty": "3 tbsp"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "green cardamom",           "qty": "3"},
    {"name": "cloves",                   "qty": "3"},
    {"name": "cinnamon",                 "qty": "1 inch"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak cashews in warm water 15 min, grind to paste. Heat ghee, add whole spices. Add sliced onions, fry golden. Add ginger-garlic paste, cook 1 min. Add pureed tomatoes, turmeric, chilli powder and salt. Cook until oil separates. Add cashew paste and 1/2 cup water. Simmer 5 min. Add paneer cubes, cook 3 min. Stir in cream. Serve with naan or jeera rice.',
  'veg'
),

-- 29 ── Baingan Bharta
(
  'Baingan Bharta',
  'North Indian',
  'sabzi',
  30,
  '[
    {"name": "large brinjal (eggplant)", "qty": "1 large"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomato",                   "qty": "2 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "ginger-garlic paste",      "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "mustard oil",              "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Roast brinjal directly over flame until charred and soft. Cool, peel skin and mash roughly. Heat mustard oil, add cumin seeds. Add chopped onions, fry golden. Add ginger-garlic paste and green chillies. Add chopped tomatoes, turmeric, chilli powder and salt. Cook until oil separates. Add mashed brinjal, mix well and cook 5-7 min. Garnish with coriander. Serve with roti.',
  'veg'
),

-- 30 ── Stuffed Paratha
(
  'Stuffed Paratha',
  'North Indian',
  'roti',
  25,
  '[
    {"name": "whole wheat flour",        "qty": "2 cups"},
    {"name": "potatoes",                 "qty": "3 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "ginger (grated)",          "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "amchur (dry mango powder)","qty": "1 tsp"},
    {"name": "fresh coriander",          "qty": "2 tbsp"},
    {"name": "ghee",                     "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Knead flour with salt and water into soft dough, rest 15 min. Boil and mash potatoes. Mix with chopped chillies, ginger, cumin, chilli powder, amchur, coriander and salt. Divide dough and filling into equal portions. Roll dough ball, place filling in center, seal and roll out gently into a circle. Cook on hot tawa with ghee until golden on both sides. Serve with yogurt, pickle and butter.',
  'veg'
),


-- =============================================================
-- SOUTH INDIAN  (5 additional recipes — 12 total)
-- =============================================================

-- 31 ── Masala Dosa
(
  'Masala Dosa',
  'South Indian',
  'breakfast',
  40,
  '[
    {"name": "dosa batter (rice + urad dal)", "qty": "2 cups"},
    {"name": "potatoes",                 "qty": "3 medium"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "urad dal",                 "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Boil potatoes, peel and mash roughly. Heat oil, add mustard seeds, urad dal, curry leaves and green chillies. Add sliced onion, fry until soft. Add turmeric, salt and mashed potatoes. Mix well. Spread dosa batter thin on hot tawa in circular motion. Drizzle oil around edges. When crisp, place potato filling in center and fold. Serve with coconut chutney and sambar.',
  'veg'
),

-- 32 ── Idli
(
  'Idli',
  'South Indian',
  'breakfast',
  20,
  '[
    {"name": "idli batter (rice + urad dal)", "qty": "2 cups"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Add salt to fermented idli batter and mix gently. Grease idli moulds with oil. Pour batter into each mould, filling 3/4 full. Steam for 10-12 min until a toothpick comes out clean. Remove with a wet spoon. Serve hot with sambar and coconut chutney.',
  'veg'
),

-- 33 ── Upma
(
  'Upma',
  'South Indian',
  'breakfast',
  20,
  '[
    {"name": "suji (semolina)",          "qty": "1 cup"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "urad dal",                 "qty": "1 tsp"},
    {"name": "chana dal",                "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "ginger (grated)",          "qty": "1 tsp"},
    {"name": "ghee",                     "qty": "1 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "water",                    "qty": "2.5 cups"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Dry roast suji until light golden, set aside. Heat oil + ghee, add mustard seeds, urad dal, chana dal and let them crackle. Add curry leaves, green chillies, ginger and chopped onion. Fry until onion is soft. Add water and salt, bring to boil. Reduce heat, add roasted suji slowly while stirring to avoid lumps. Cover and cook 3-4 min. Fluff with fork. Serve with coconut chutney.',
  'veg'
),

-- 34 ── Uttapam
(
  'Uttapam',
  'South Indian',
  'breakfast',
  15,
  '[
    {"name": "dosa batter",              "qty": "2 cups"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "fresh coriander",          "qty": "2 tbsp"},
    {"name": "oil",                      "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Chop onion, tomato, chillies and coriander finely. Heat tawa, pour a thick ladle of batter and spread slightly (thicker than dosa). Immediately sprinkle chopped vegetables on top, pressing gently. Drizzle oil around edges. Cook on medium heat until bottom is golden. Flip carefully and cook other side 2 min. Serve with sambar and chutney.',
  'veg'
),

-- 35 ── Pesarattu
(
  'Pesarattu',
  'South Indian',
  'breakfast',
  25,
  '[
    {"name": "green moong dal (whole)",  "qty": "1 cup"},
    {"name": "rice",                     "qty": "2 tbsp"},
    {"name": "green chilli",             "qty": "3"},
    {"name": "ginger",                   "qty": "1 inch"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "oil",                      "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak green moong dal and rice for 4 hours. Grind with green chillies, ginger, cumin and salt to a smooth batter (no fermentation needed). Spread batter on hot tawa like a dosa. Sprinkle finely chopped onion on top. Drizzle oil, cook until crisp on bottom. Fold and serve hot with ginger chutney and upma.',
  'veg'
),


-- =============================================================
-- BENGALI  (3 additional recipes — 8 total)
-- =============================================================

-- 36 ── Kosha Mangsho
(
  'Kosha Mangsho',
  'Bengali',
  'curry',
  60,
  '[
    {"name": "mutton (bone-in)",         "qty": "500 g"},
    {"name": "onion",                    "qty": "3 large"},
    {"name": "yogurt",                   "qty": "3 tbsp"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "mustard oil",              "qty": "4 tbsp"},
    {"name": "bay leaf",                 "qty": "2"},
    {"name": "green cardamom",           "qty": "4"},
    {"name": "cinnamon",                 "qty": "1 inch"},
    {"name": "cloves",                   "qty": "4"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "ghee",                     "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate mutton with yogurt, turmeric, chilli powder and salt for 30 min. Heat mustard oil until smoking, add whole spices. Add sliced onions, fry deep golden. Add ginger-garlic paste, cook 2 min. Add marinated mutton, fry on high heat 10 min, stirring to coat. Add sugar and 1/2 cup water. Cover and cook on low for 40-45 min until meat is tender and oil separates. The gravy should be thick and clinging. Finish with ghee. Serve with luchi or steamed rice.',
  'nonveg'
),

-- 37 ── Chingri Malaikari
(
  'Chingri Malaikari',
  'Bengali',
  'curry',
  25,
  '[
    {"name": "prawns (shelled)",         "qty": "500 g"},
    {"name": "coconut milk",             "qty": "1 cup"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "ginger paste",             "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "green cardamom",           "qty": "3"},
    {"name": "bay leaf",                 "qty": "1"},
    {"name": "sugar",                    "qty": "1/2 tsp"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Clean and devein prawns, marinate with turmeric and salt. Heat ghee, fry prawns lightly for 2 min, set aside. In same pan add bay leaf, cardamom. Add sliced onion, fry until golden. Add ginger paste, cook 1 min. Pour in coconut milk, add sugar and salt. Simmer 5 min. Add prawns, cook 5-7 min until gravy thickens. Serve with steamed basmati rice.',
  'nonveg'
),

-- 38 ── Ghee Bhat
(
  'Ghee Bhat',
  'Bengali',
  'rice',
  20,
  '[
    {"name": "basmati rice",             "qty": "1.5 cups"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "bay leaf",                 "qty": "2"},
    {"name": "green cardamom",           "qty": "3"},
    {"name": "cloves",                   "qty": "3"},
    {"name": "cinnamon",                 "qty": "1 inch"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"},
    {"name": "water",                    "qty": "3 cups"}
  ]'::jsonb,
  'Wash and soak rice 20 min. Heat ghee in a heavy pot, add bay leaf, cardamom, cloves and cinnamon. Add drained rice, stir gently 2 min. Add water, sugar and salt. Bring to boil, then cover tightly and cook on lowest heat for 15 min. Do not open lid. Rest 5 min, fluff with fork. Each grain should be separate and fragrant. Serve with any curry or dal.',
  'veg'
),


-- =============================================================
-- GUJARATI  (3 additional recipes — 7 total)
-- =============================================================

-- 39 ── Khandvi
(
  'Khandvi',
  'Gujarati',
  'snack',
  30,
  '[
    {"name": "besan (gram flour)",       "qty": "1/2 cup"},
    {"name": "buttermilk",               "qty": "1.5 cups"},
    {"name": "ginger-green chilli paste","qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "sesame seeds",             "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "grated coconut",           "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Whisk besan with buttermilk, ginger-chilli paste, turmeric and salt until smooth. Cook on medium heat stirring continuously for 8-10 min until thick. Test: spread a spoonful on a greased surface — if it rolls without breaking, it is ready. Quickly spread thin on greased back of thalis. Cool 5 min. Cut into strips and roll tightly. Prepare tempering: heat oil, add mustard seeds, sesame seeds and curry leaves. Pour over rolls. Garnish with coconut and coriander.',
  'veg'
),

-- 40 ── Khakhra
(
  'Khakhra',
  'Gujarati',
  'snack',
  20,
  '[
    {"name": "whole wheat flour",        "qty": "1 cup"},
    {"name": "oil",                      "qty": "1 tbsp + for cooking"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix flour with oil, cumin, turmeric, chilli powder and salt. Knead into stiff dough with water. Divide into small balls, roll thin like a roti. Place on hot tawa, press with a cloth or spatula while rotating, applying oil. Cook on both sides pressing continuously until completely crisp and light brown. Cool completely — khakhra becomes crackling crisp. Store in airtight container for weeks. Serve with pickle or tea.',
  'veg'
),

-- 41 ── Handvo
(
  'Handvo',
  'Gujarati',
  'snack',
  40,
  '[
    {"name": "rice",                     "qty": "1 cup"},
    {"name": "chana dal",                "qty": "1/4 cup"},
    {"name": "toor dal",                 "qty": "1/4 cup"},
    {"name": "urad dal",                 "qty": "2 tbsp"},
    {"name": "bottle gourd (lauki)",     "qty": "1 cup grated"},
    {"name": "yogurt",                   "qty": "1/2 cup"},
    {"name": "ginger-green chilli paste","qty": "1 tbsp"},
    {"name": "sesame seeds",             "qty": "1 tbsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "Eno fruit salt",           "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak rice and dals together 4 hours, grind to thick batter. Mix with yogurt, grated lauki, ginger-chilli paste, salt and ferment 6 hours. Add Eno and mix gently. Heat oil in a heavy pan, add mustard seeds, sesame seeds and curry leaves. Pour batter over tempering. Cover and cook on low heat 20-25 min until set. Flip or broil top until golden. Cut into wedges. Serve with green chutney.',
  'veg'
),


-- =============================================================
-- MAHARASHTRIAN  (3 additional recipes — 7 total)
-- =============================================================

-- 42 ── Pav Bhaji
(
  'Pav Bhaji',
  'Maharashtrian',
  'snack',
  30,
  '[
    {"name": "potatoes",                 "qty": "3 medium"},
    {"name": "cauliflower",              "qty": "1/2 small"},
    {"name": "peas",                     "qty": "1/2 cup"},
    {"name": "capsicum",                 "qty": "1 medium"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomato",                   "qty": "3 medium"},
    {"name": "pav bhaji masala",         "qty": "2 tbsp"},
    {"name": "butter",                   "qty": "4 tbsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "pav (dinner rolls)",       "qty": "6"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Boil potatoes, cauliflower and peas until soft, mash roughly. Heat butter, add chopped onion and capsicum, fry until soft. Add chopped tomatoes, pav bhaji masala, chilli powder and salt. Cook until tomatoes break down. Add mashed vegetables, mix well and cook 10 min mashing continuously. Add lemon juice. Toast pav with butter on tawa. Garnish bhaji with coriander, raw onion and lemon wedge. Serve hot.',
  'veg'
),

-- 43 ── Sabudana Khichdi
(
  'Sabudana Khichdi',
  'Maharashtrian',
  'breakfast',
  20,
  '[
    {"name": "sabudana (tapioca pearls)","qty": "1 cup"},
    {"name": "potatoes",                 "qty": "2 medium"},
    {"name": "roasted peanuts",          "qty": "1/4 cup"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "ghee or oil",              "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak sabudana in water for 4-5 hours until soft and fluffy, drain completely. Crush peanuts coarsely. Dice potatoes small. Heat ghee, add cumin seeds and curry leaves. Add diced potatoes, cook until golden. Add green chillies, soaked sabudana and salt. Stir gently on medium heat 5-7 min until sabudana turns translucent. Add crushed peanuts, sugar and lemon juice. Garnish with coriander. Serve hot.',
  'veg'
),

-- 44 ── Kothimbir Vadi
(
  'Kothimbir Vadi',
  'Maharashtrian',
  'snack',
  25,
  '[
    {"name": "fresh coriander",          "qty": "2 cups chopped"},
    {"name": "besan (gram flour)",       "qty": "1 cup"},
    {"name": "sesame seeds",             "qty": "1 tbsp"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "ginger (grated)",          "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "oil",                      "qty": "for frying"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix chopped coriander, besan, sesame seeds, green chilli, ginger, turmeric, chilli powder and salt. Add just enough water to make a thick batter. Spread into a greased thali, steam for 15 min. Cool and cut into squares or diamonds. Heat oil, add mustard seeds. Shallow fry the pieces until crisp and golden on both sides. Serve hot with green chutney or ketchup.',
  'veg'
),


-- =============================================================
-- PUNJABI  (5 recipes — NEW region)
-- =============================================================

-- 45 ── Sarson Ka Saag
(
  'Sarson Ka Saag',
  'Punjabi',
  'sabzi',
  50,
  '[
    {"name": "sarson (mustard greens)",  "qty": "500 g"},
    {"name": "palak (spinach)",          "qty": "250 g"},
    {"name": "bathua leaves",            "qty": "100 g"},
    {"name": "makki ka atta (cornmeal)", "qty": "2 tbsp"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "ginger",                   "qty": "1 inch"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "garlic",                   "qty": "4 cloves"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "butter",                   "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Wash and chop all greens. Boil with ginger, green chillies and salt until very soft (30 min). Drain most water, blend or mash with a mathani (wooden churner) keeping it coarse. Add makki ka atta, cook on low 10 min stirring. Heat ghee, fry sliced garlic and chopped onion until golden. Pour into saag. Top with a knob of butter. Serve with makki ki roti and jaggery.',
  'veg'
),

-- 46 ── Makki Ki Roti
(
  'Makki Ki Roti',
  'Punjabi',
  'roti',
  20,
  '[
    {"name": "makki ka atta (cornmeal)", "qty": "2 cups"},
    {"name": "water (warm)",             "qty": "as needed"},
    {"name": "ghee or butter",           "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix cornmeal with salt and warm water. Knead into a soft dough — it will not be as pliable as wheat dough. Take a ball of dough, pat it between your palms or on a plastic sheet into a thick round disc. Place on a hot tawa, cook on medium heat. When one side is half-done, flip carefully. Apply ghee and cook until golden spots appear on both sides. Serve hot with sarson ka saag and a dollop of butter.',
  'veg'
),

-- 47 ── Amritsari Kulcha
(
  'Amritsari Kulcha',
  'Punjabi',
  'roti',
  30,
  '[
    {"name": "maida (all-purpose flour)","qty": "2 cups"},
    {"name": "yogurt",                   "qty": "3 tbsp"},
    {"name": "baking powder",            "qty": "1/2 tsp"},
    {"name": "potatoes (boiled)",        "qty": "2 medium"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "fresh coriander",          "qty": "2 tbsp"},
    {"name": "ajwain (carom seeds)",     "qty": "1 tsp"},
    {"name": "butter",                   "qty": "for cooking"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Make dough with maida, yogurt, baking powder, salt and water. Rest 2 hours covered. Make filling: mash potatoes, mix with chopped onion, chilli, coriander and salt. Divide dough and filling. Stuff dough balls with filling, roll thick. Cook on hot tawa pressing down. Apply butter generously, cook until golden brown on both sides. Serve with chole and pickle.',
  'veg'
),

-- 48 ── Butter Chicken
(
  'Butter Chicken',
  'Punjabi',
  'curry',
  40,
  '[
    {"name": "chicken",                  "qty": "500 g"},
    {"name": "yogurt",                   "qty": "1/2 cup"},
    {"name": "tomato puree",             "qty": "1 cup"},
    {"name": "butter",                   "qty": "3 tbsp"},
    {"name": "fresh cream",              "qty": "3 tbsp"},
    {"name": "cashews",                  "qty": "8"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "kasuri methi",             "qty": "1 tbsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate chicken with yogurt, ginger-garlic paste, chilli powder and salt for 2 hours. Grill or pan-fry chicken pieces until charred. Heat butter, add tomato puree, cashew paste, garam masala, sugar and salt. Cook 10 min. Add grilled chicken, simmer 10 min. Stir in cream and crushed kasuri methi. Serve with butter naan.',
  'nonveg'
),

-- 49 ── Pinni
(
  'Pinni',
  'Punjabi',
  'dessert',
  25,
  '[
    {"name": "whole wheat flour (atta)", "qty": "2 cups"},
    {"name": "ghee",                     "qty": "1 cup"},
    {"name": "sugar (powdered)",         "qty": "3/4 cup"},
    {"name": "almonds",                  "qty": "10"},
    {"name": "cashews",                  "qty": "8"},
    {"name": "green cardamom powder",    "qty": "1 tsp"},
    {"name": "desiccated coconut",       "qty": "2 tbsp"}
  ]'::jsonb,
  'Heat ghee in a heavy pan, add flour and roast on low heat stirring continuously for 15-20 min until golden brown and fragrant. Remove from heat, cool slightly. Add powdered sugar, cardamom, chopped nuts and coconut. Mix well while still warm. Shape into round balls (laddoo shape) while mixture is warm. Store in airtight container — stays fresh for weeks.',
  'veg'
),


-- =============================================================
-- HYDERABADI  (4 recipes — NEW region)
-- =============================================================

-- 50 ── Hyderabadi Biryani
(
  'Hyderabadi Biryani',
  'Hyderabadi',
  'rice',
  60,
  '[
    {"name": "basmati rice",             "qty": "2 cups"},
    {"name": "chicken or mutton",        "qty": "500 g"},
    {"name": "yogurt",                   "qty": "1/2 cup"},
    {"name": "onion",                    "qty": "3 large"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "biryani masala",           "qty": "2 tbsp"},
    {"name": "saffron",                  "qty": "a pinch"},
    {"name": "milk (warm)",              "qty": "3 tbsp"},
    {"name": "mint leaves",              "qty": "1/2 cup"},
    {"name": "fresh coriander",          "qty": "1/2 cup"},
    {"name": "green chilli",             "qty": "4"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate meat with yogurt, ginger-garlic paste, biryani masala, half the mint, coriander, chillies, lemon juice and salt for 2 hours. Slice onions thin, fry in oil until deep golden (birista). Soak rice 30 min, parboil in salted water until 70% done, drain. Soak saffron in warm milk. Layer in heavy pot: marinated meat, half the birista, then rice. Top with remaining birista, saffron milk and ghee. Seal with dough or foil. Cook on high 3 min, then lowest heat for 25 min. Rest 5 min before opening. Serve with raita.',
  'nonveg'
),

-- 51 ── Mirchi Ka Salan
(
  'Mirchi Ka Salan',
  'Hyderabadi',
  'curry',
  30,
  '[
    {"name": "large green chillies",     "qty": "8"},
    {"name": "peanuts",                  "qty": "2 tbsp"},
    {"name": "sesame seeds",             "qty": "2 tbsp"},
    {"name": "desiccated coconut",       "qty": "2 tbsp"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tamarind pulp",            "qty": "2 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Slit chillies lengthwise, fry in oil until blistered, set aside. Dry roast peanuts, sesame seeds and coconut, grind to paste with water. Fry sliced onions until golden, grind to paste. Heat oil, add mustard seeds and curry leaves. Add onion paste, cook 3 min. Add ground nut-sesame paste, turmeric, chilli powder and salt. Add tamarind with 1 cup water, simmer 10 min. Add fried chillies, cook 5 min. The gravy should be tangy and nutty. Serve alongside biryani.',
  'veg'
),

-- 52 ── Haleem
(
  'Haleem',
  'Hyderabadi',
  'curry',
  90,
  '[
    {"name": "mutton (boneless)",        "qty": "500 g"},
    {"name": "wheat (broken/daliya)",    "qty": "1/2 cup"},
    {"name": "chana dal",                "qty": "1/4 cup"},
    {"name": "moong dal",                "qty": "2 tbsp"},
    {"name": "masoor dal",               "qty": "2 tbsp"},
    {"name": "onion",                    "qty": "3 large"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "lemon wedges",             "qty": "for serving"},
    {"name": "fried onions",             "qty": "for garnish"},
    {"name": "mint and coriander",       "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak wheat and dals 2 hours. Pressure cook mutton with ginger-garlic paste, turmeric, chilli powder and salt until very tender (10 whistles). In separate pot, cook soaked wheat and dals until mushy. Shred the cooked meat finely. Combine meat, lentils and wheat. Cook on low heat stirring vigorously for 30 min until everything melds into a thick porridge. Add garam masala and ghee. Garnish with fried onions, mint, coriander and lemon. Serve with naan.',
  'nonveg'
),

-- 53 ── Double Ka Meetha
(
  'Double Ka Meetha',
  'Hyderabadi',
  'dessert',
  30,
  '[
    {"name": "bread slices",             "qty": "6"},
    {"name": "milk",                     "qty": "2 cups"},
    {"name": "sugar",                    "qty": "1 cup"},
    {"name": "saffron",                  "qty": "a pinch"},
    {"name": "green cardamom powder",    "qty": "1/2 tsp"},
    {"name": "almonds (sliced)",         "qty": "2 tbsp"},
    {"name": "ghee",                     "qty": "for frying"},
    {"name": "rose water",              "qty": "1 tsp"}
  ]'::jsonb,
  'Cut bread into triangles, remove crusts. Deep fry in ghee until golden brown. Make sugar syrup with sugar and 1/2 cup water until one-string consistency. Dip fried bread pieces in syrup. Reduce milk to half with saffron and cardamom. Arrange soaked bread in a dish, pour reduced milk over it. Garnish with sliced almonds and rose water. Serve warm or chilled.',
  'veg'
),


-- =============================================================
-- KERALA  (4 recipes — NEW region)
-- =============================================================

-- 54 ── Appam with Stew
(
  'Appam with Stew',
  'Kerala',
  'breakfast',
  35,
  '[
    {"name": "raw rice",                 "qty": "1 cup"},
    {"name": "coconut (grated)",         "qty": "1/2 cup"},
    {"name": "yeast or toddy",           "qty": "1/2 tsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "potatoes",                 "qty": "2 medium"},
    {"name": "carrots",                  "qty": "1 medium"},
    {"name": "green peas",               "qty": "1/4 cup"},
    {"name": "coconut milk",             "qty": "2 cups"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "whole spices (cinnamon, cardamom, cloves)", "qty": "2 each"},
    {"name": "coconut oil",              "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'For appam: soak rice 4 hours, grind with coconut and water to smooth batter. Add yeast, sugar and salt, ferment 8 hours. Pour in heated appachatti (appam pan), swirl to make thin edges and thick center. Cover and cook until edges are lacy and center is fluffy. For stew: heat coconut oil, add whole spices, curry leaves, sliced onion and green chillies. Add cubed vegetables, cook 5 min. Add thin coconut milk, cook until vegetables are tender. Add thick coconut milk and salt, simmer 2 min. Serve appam with stew.',
  'veg'
),

-- 55 ── Puttu
(
  'Puttu',
  'Kerala',
  'breakfast',
  20,
  '[
    {"name": "puttu podi (rice flour)",  "qty": "2 cups"},
    {"name": "grated coconut",           "qty": "1 cup"},
    {"name": "water",                    "qty": "as needed"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Sprinkle water gradually over rice flour with salt, mixing with fingers until it forms moist crumbs (not a dough). Fill puttu maker alternating layers of rice flour and grated coconut. Attach to a kettle of boiling water and steam for 5-7 min until steam comes through the top. Push out the puttu. Serve with banana and sugar, or kadala curry (black chickpea curry), or just with a ripe banana.',
  'veg'
),

-- 56 ── Kerala Fish Curry
(
  'Kerala Fish Curry',
  'Kerala',
  'curry',
  25,
  '[
    {"name": "fish steaks (seer or kingfish)", "qty": "500 g"},
    {"name": "coconut oil",              "qty": "3 tbsp"},
    {"name": "shallots",                 "qty": "8"},
    {"name": "tomato",                   "qty": "2 medium"},
    {"name": "kodampuli (fish tamarind)","qty": "3 pieces"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1.5 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "fenugreek seeds",          "qty": "1/4 tsp"},
    {"name": "curry leaves",             "qty": "2 sprigs"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak kodampuli in warm water. Heat coconut oil in a clay pot, add fenugreek seeds, sliced shallots and curry leaves. Add sliced tomatoes, turmeric, chilli powder and coriander powder. Cook 5 min. Add 1.5 cups water, kodampuli and salt. Bring to boil and simmer 5 min. Gently slide in fish steaks. Cook on low heat 10-12 min without stirring — only swirl the pot. The gravy should be sour-spicy. Rest 2 hours for best flavor. Serve with rice.',
  'nonveg'
),

-- 57 ── Avial (Kerala Style)
(
  'Kerala Avial',
  'Kerala',
  'sabzi',
  30,
  '[
    {"name": "drumstick",                "qty": "1"},
    {"name": "raw banana",               "qty": "1"},
    {"name": "yam",                      "qty": "100 g"},
    {"name": "carrot",                   "qty": "1"},
    {"name": "beans",                    "qty": "10"},
    {"name": "coconut (grated)",         "qty": "1 cup"},
    {"name": "green chilli",             "qty": "3"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "yogurt",                   "qty": "2 tbsp"},
    {"name": "curry leaves",             "qty": "2 sprigs"},
    {"name": "coconut oil",              "qty": "2 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut all vegetables into long thin pieces. Cook in a pan with turmeric, salt and minimal water until just tender. Grind coconut, green chillies and cumin to a coarse paste. Add paste to vegetables, mix gently and cook 3-4 min on low heat. Remove from heat, stir in yogurt. Add curry leaves and drizzle coconut oil on top. Do not boil after adding yogurt. Serve with rice.',
  'veg'
),


-- =============================================================
-- INDO-CHINESE  (4 recipes — NEW region)
-- =============================================================

-- 58 ── Veg Hakka Noodles
(
  'Veg Hakka Noodles',
  'Indo-Chinese',
  'snack',
  20,
  '[
    {"name": "noodles (hakka)",          "qty": "200 g"},
    {"name": "cabbage (shredded)",       "qty": "1 cup"},
    {"name": "carrot (julienned)",       "qty": "1 medium"},
    {"name": "capsicum",                 "qty": "1 medium"},
    {"name": "spring onion",             "qty": "3 stalks"},
    {"name": "garlic (chopped)",         "qty": "1 tbsp"},
    {"name": "soy sauce",                "qty": "2 tbsp"},
    {"name": "vinegar",                  "qty": "1 tsp"},
    {"name": "chilli sauce",             "qty": "1 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Boil noodles until just cooked, drain and toss with a little oil. Heat oil in a wok on high flame. Add garlic, stir 30 sec. Add all vegetables except spring onion greens. Toss on high heat 2 min — vegetables should stay crunchy. Add noodles, soy sauce, vinegar, chilli sauce and salt. Toss vigorously for 2 min. Add spring onion greens. Serve immediately.',
  'veg'
),

-- 59 ── Veg Manchurian
(
  'Veg Manchurian',
  'Indo-Chinese',
  'snack',
  30,
  '[
    {"name": "cabbage (grated)",         "qty": "2 cups"},
    {"name": "carrot (grated)",          "qty": "1/2 cup"},
    {"name": "capsicum (chopped)",       "qty": "1/4 cup"},
    {"name": "corn flour",               "qty": "3 tbsp"},
    {"name": "maida (flour)",            "qty": "2 tbsp"},
    {"name": "garlic (chopped)",         "qty": "1 tbsp"},
    {"name": "ginger (chopped)",         "qty": "1 tsp"},
    {"name": "spring onion",             "qty": "3 stalks"},
    {"name": "soy sauce",                "qty": "2 tbsp"},
    {"name": "chilli sauce",             "qty": "1 tbsp"},
    {"name": "vinegar",                  "qty": "1 tsp"},
    {"name": "oil",                      "qty": "for frying + 2 tbsp"},
    {"name": "salt and pepper",          "qty": "to taste"}
  ]'::jsonb,
  'Mix grated cabbage, carrot, corn flour, maida and salt. Shape into small balls. Deep fry until golden and crisp. For gravy: heat oil, add garlic and ginger, fry 30 sec. Add spring onion whites and capsicum. Add soy sauce, chilli sauce, vinegar, salt and pepper with 1/2 cup water. Mix 1 tbsp corn flour in water, add to thicken. Drop fried balls into gravy, toss to coat. Garnish with spring onion greens. Serve hot.',
  'veg'
),

-- 60 ── Fried Rice
(
  'Fried Rice',
  'Indo-Chinese',
  'rice',
  20,
  '[
    {"name": "cooked rice (cold)",       "qty": "3 cups"},
    {"name": "eggs",                     "qty": "2"},
    {"name": "carrot (diced)",           "qty": "1 medium"},
    {"name": "beans (chopped)",          "qty": "1/4 cup"},
    {"name": "capsicum (diced)",         "qty": "1 medium"},
    {"name": "spring onion",             "qty": "3 stalks"},
    {"name": "garlic (chopped)",         "qty": "1 tbsp"},
    {"name": "soy sauce",                "qty": "2 tbsp"},
    {"name": "vinegar",                  "qty": "1 tsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "salt and pepper",          "qty": "to taste"}
  ]'::jsonb,
  'Heat oil in wok on high flame. Scramble eggs quickly, break into bits, set aside. Add garlic, fry 30 sec. Add all vegetables except spring onion greens, toss 2 min on high heat. Add cold rice, break up lumps. Add soy sauce, vinegar, salt and pepper. Toss vigorously 3 min. Add scrambled eggs and spring onion greens. Serve with manchurian or chilli paneer.',
  'eggetarian'
),

-- 61 ── Chilli Paneer
(
  'Chilli Paneer',
  'Indo-Chinese',
  'snack',
  25,
  '[
    {"name": "paneer",                   "qty": "250 g"},
    {"name": "capsicum",                 "qty": "1 medium"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "garlic (chopped)",         "qty": "1 tbsp"},
    {"name": "ginger (chopped)",         "qty": "1 tsp"},
    {"name": "green chilli",             "qty": "3"},
    {"name": "soy sauce",                "qty": "2 tbsp"},
    {"name": "chilli sauce",             "qty": "1 tbsp"},
    {"name": "vinegar",                  "qty": "1 tsp"},
    {"name": "corn flour",               "qty": "2 tbsp"},
    {"name": "spring onion",             "qty": "2 stalks"},
    {"name": "oil",                      "qty": "for frying + 2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut paneer into cubes, coat with corn flour and salt. Shallow fry until golden, set aside. Cut vegetables into squares. Heat oil in wok, add garlic, ginger and slit green chillies. Add onion and capsicum, toss on high heat 1 min. Add soy sauce, chilli sauce, vinegar and salt. Add fried paneer, toss to coat. Garnish with spring onion greens. Serve hot as a starter or with fried rice.',
  'veg'
),


-- =============================================================
-- PAN-INDIAN  (5 recipes — NEW region)
-- =============================================================

-- 62 ── Poha
(
  'Poha',
  'Pan-Indian',
  'breakfast',
  15,
  '[
    {"name": "poha (flattened rice)",    "qty": "2 cups"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "potato",                   "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "mustard seeds",            "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "1 sprig"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "peanuts",                  "qty": "2 tbsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "sugar",                    "qty": "1 tsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Wash poha in water, drain and let it soften 5 min. Add turmeric and salt, mix gently. Heat oil, add mustard seeds, peanuts and curry leaves. Add chopped onion and diced potato, cook until potato is done. Add green chillies and softened poha. Toss on medium heat 3 min. Add sugar and lemon juice. Garnish with coriander and serve with sev on top.',
  'veg'
),

-- 63 ── Khichdi
(
  'Khichdi',
  'Pan-Indian',
  'rice',
  25,
  '[
    {"name": "rice",                     "qty": "1 cup"},
    {"name": "moong dal",                "qty": "1/2 cup"},
    {"name": "ghee",                     "qty": "2 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "ginger (grated)",          "qty": "1 tsp"},
    {"name": "green chilli",             "qty": "1"},
    {"name": "water",                    "qty": "4 cups"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Wash rice and dal together. Heat ghee in a pressure cooker, add cumin seeds, ginger and green chilli. Add rice-dal, turmeric and salt. Add water. Pressure cook for 3 whistles. Open when cooled, stir well — consistency should be porridge-like. Add more ghee on top. Serve with pickle, papad and yogurt. The ultimate comfort food.',
  'veg'
),

-- 64 ── Maggi Masala
(
  'Maggi Masala',
  'Pan-Indian',
  'snack',
  10,
  '[
    {"name": "maggi noodles",            "qty": "2 packets"},
    {"name": "onion",                    "qty": "1 small"},
    {"name": "tomato",                   "qty": "1 small"},
    {"name": "green chilli",             "qty": "1"},
    {"name": "peas",                     "qty": "2 tbsp"},
    {"name": "butter",                   "qty": "1 tbsp"},
    {"name": "maggi masala (included)",  "qty": "2 packets"},
    {"name": "water",                    "qty": "2.5 cups"}
  ]'::jsonb,
  'Heat butter, add chopped onion and green chilli. Add chopped tomato and peas. Add water and bring to boil. Add maggi masala, stir. Add noodle cakes, cook 2-3 min stirring occasionally. The consistency should be slightly soupy. Serve immediately in the pan for best experience.',
  'veg'
),

-- 65 ── Sandwich (Indian Style)
(
  'Indian Sandwich',
  'Pan-Indian',
  'snack',
  10,
  '[
    {"name": "bread slices",             "qty": "4"},
    {"name": "potatoes (boiled)",        "qty": "2 medium"},
    {"name": "onion (sliced)",           "qty": "1 medium"},
    {"name": "tomato (sliced)",          "qty": "1 medium"},
    {"name": "cucumber (sliced)",        "qty": "1/2"},
    {"name": "green chutney",            "qty": "2 tbsp"},
    {"name": "butter",                   "qty": "2 tbsp"},
    {"name": "chaat masala",             "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Spread green chutney on bread slices. Layer with sliced boiled potato, onion, tomato and cucumber. Sprinkle chaat masala and salt. Close sandwich. Toast on tawa with butter on both sides until golden and crisp. Cut diagonally. Serve hot with ketchup.',
  'veg'
),

-- 66 ── Egg Bhurji
(
  'Egg Bhurji',
  'Pan-Indian',
  'breakfast',
  10,
  '[
    {"name": "eggs",                     "qty": "4"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "turmeric",                 "qty": "1/4 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "butter or oil",            "qty": "1 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Heat butter, add cumin seeds. Add chopped onion, fry until soft. Add green chillies and chopped tomato. Add turmeric, chilli powder and salt. Cook until tomato softens. Beat eggs and pour in. Stir continuously on medium heat, breaking eggs into small curds. Cook until eggs are just set (do not overcook). Garnish with coriander. Serve with pav or roti.',
  'eggetarian'
),


-- =============================================================
-- RAJASTHANI  (4 recipes — NEW region)
-- =============================================================

-- 67 ── Dal Baati Churma
(
  'Dal Baati Churma',
  'Rajasthani',
  'dal',
  60,
  '[
    {"name": "whole wheat flour",        "qty": "2 cups"},
    {"name": "ghee",                     "qty": "1/2 cup + for soaking"},
    {"name": "toor dal",                 "qty": "1/2 cup"},
    {"name": "chana dal",                "qty": "1/4 cup"},
    {"name": "moong dal",                "qty": "1/4 cup"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "ginger-garlic paste",      "qty": "1 tsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "sugar or jaggery",         "qty": "2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Baati: Mix flour with 2 tbsp ghee and salt, knead stiff dough with water. Shape into round balls. Bake at 180C for 25-30 min until golden and hard. Dip hot baatis in melted ghee. Dal: Pressure cook all dals together. Make tadka with ghee, cumin, onion, tomato, ginger-garlic paste and spices. Add cooked dals, simmer 10 min. Churma: Crush leftover baati, mix with ghee, sugar and cardamom. Serve dal poured over broken baati with churma on the side.',
  'veg'
),

-- 68 ── Gatte Ki Sabzi
(
  'Gatte Ki Sabzi',
  'Rajasthani',
  'curry',
  35,
  '[
    {"name": "besan (gram flour)",       "qty": "1 cup"},
    {"name": "yogurt",                   "qty": "1 cup"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "mustard seeds",            "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "ajwain (carom seeds)",     "qty": "1/2 tsp"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Mix besan with ajwain, turmeric, chilli powder, 1 tbsp oil and salt. Knead with water into stiff dough. Roll into thin logs. Boil in water for 15 min, remove and cut into 1-inch pieces. Reserve the boiling water. Heat oil, add cumin, mustard seeds and hing. Whisk yogurt with besan water, turmeric, chilli and coriander powder. Add to pan, cook stirring until it thickens. Add gatte pieces, simmer 10 min. Serve with roti or rice.',
  'veg'
),

-- 69 ── Ker Sangri
(
  'Ker Sangri',
  'Rajasthani',
  'sabzi',
  30,
  '[
    {"name": "dried ker berries",        "qty": "1/4 cup"},
    {"name": "dried sangri beans",       "qty": "1/2 cup"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "amchur (dry mango powder)","qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "mustard oil",              "qty": "3 tbsp"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "asafoetida",               "qty": "a pinch"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak ker and sangri separately overnight. Boil sangri until tender, drain. Heat mustard oil, add cumin seeds and hing. Add drained ker and sangri. Add all spice powders and salt. Cook on low heat 15-20 min stirring occasionally. Add amchur at the end. The dish should be dry. This is a signature desert dish — earthy and tangy. Serve with bajra roti and buttermilk.',
  'veg'
),

-- 70 ── Pyaaz Ki Kachori
(
  'Pyaaz Ki Kachori',
  'Rajasthani',
  'snack',
  35,
  '[
    {"name": "maida (all-purpose flour)","qty": "2 cups"},
    {"name": "onion",                    "qty": "3 large"},
    {"name": "green chilli",             "qty": "3"},
    {"name": "coriander seeds (crushed)","qty": "1 tbsp"},
    {"name": "fennel seeds",             "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "amchur",                   "qty": "1 tsp"},
    {"name": "oil or ghee",              "qty": "for frying + 2 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Make dough with maida, 2 tbsp oil, salt and water. Rest 30 min. For filling: heat oil, add crushed coriander seeds and fennel. Add finely chopped onion, fry until golden. Add chilli powder, amchur and salt. Cool. Divide dough and filling. Stuff dough balls with filling, seal and flatten slightly. Deep fry on medium-low heat until golden and flaky. Serve hot with tamarind chutney and green chutney.',
  'veg'
),


-- =============================================================
-- ADDITIONAL RECIPES  (10 more across various regions)
-- =============================================================

-- 71 ── Paneer Tikka
(
  'Paneer Tikka',
  'North Indian',
  'snack',
  25,
  '[
    {"name": "paneer",                   "qty": "250 g"},
    {"name": "capsicum",                 "qty": "1 medium"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "yogurt",                   "qty": "3 tbsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "lemon juice",              "qty": "1 tbsp"},
    {"name": "oil",                      "qty": "2 tbsp"},
    {"name": "chaat masala",             "qty": "1 tsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut paneer, capsicum and onion into cubes. Marinate with yogurt, all spices, ginger-garlic paste, lemon juice, oil and salt for 30 min. Thread onto skewers alternating paneer and vegetables. Grill in oven at 220C for 12-15 min or cook on tawa turning until charred spots appear. Sprinkle chaat masala and lemon juice. Serve hot with mint chutney.',
  'veg'
),

-- 72 ── Chicken Biryani (Lucknowi)
(
  'Lucknowi Biryani',
  'North Indian',
  'rice',
  50,
  '[
    {"name": "basmati rice",             "qty": "2 cups"},
    {"name": "chicken",                  "qty": "500 g"},
    {"name": "yogurt",                   "qty": "1/2 cup"},
    {"name": "onion (fried)",            "qty": "2 large"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "whole spices (bay leaf, cardamom, cinnamon, cloves)", "qty": "2 each"},
    {"name": "saffron in milk",          "qty": "2 tbsp"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "mint leaves",              "qty": "1/4 cup"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Marinate chicken with yogurt, ginger-garlic paste, half the fried onions, mint and salt for 1 hour. Cook marinated chicken until 3/4 done. Parboil rice with whole spices until 70% cooked. Layer: chicken, then rice, then remaining fried onions and saffron milk. Seal pot with dough. Cook on high 3 min, then lowest heat 25 min. Rest before opening. Serve with raita.',
  'nonveg'
),

-- 73 ── Medu Vada
(
  'Medu Vada',
  'South Indian',
  'breakfast',
  25,
  '[
    {"name": "urad dal (whole)",         "qty": "1 cup"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "ginger (chopped)",         "qty": "1 tsp"},
    {"name": "curry leaves",             "qty": "8"},
    {"name": "peppercorns",              "qty": "1/2 tsp"},
    {"name": "cumin seeds",              "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "for frying"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Soak urad dal 4 hours, grind to thick fluffy batter without water. Add chopped chillies, ginger, curry leaves, pepper, cumin and salt. Wet hands, take a portion of batter, shape into a ball and make a hole in center (doughnut shape). Slide into hot oil (medium heat). Fry until deep golden on both sides. Drain well. Serve hot with sambar and coconut chutney.',
  'veg'
),

-- 74 ── Egg Curry
(
  'Egg Curry',
  'Pan-Indian',
  'curry',
  25,
  '[
    {"name": "eggs",                     "qty": "6"},
    {"name": "onion",                    "qty": "2 medium"},
    {"name": "tomato",                   "qty": "2 medium"},
    {"name": "ginger-garlic paste",      "qty": "1 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Hard boil eggs, peel and make small slits. Heat oil, fry eggs until golden, set aside. Add chopped onions, fry golden. Add ginger-garlic paste, cook 1 min. Add pureed tomatoes, all spice powders and salt. Cook until oil separates. Add 1 cup water, simmer 5 min. Add fried eggs, cook 5 min in the gravy. Add garam masala. Garnish with coriander. Serve with rice or roti.',
  'eggetarian'
),

-- 75 ── Gajar Ka Halwa
(
  'Gajar Ka Halwa',
  'North Indian',
  'dessert',
  40,
  '[
    {"name": "carrots (grated)",         "qty": "500 g"},
    {"name": "full fat milk",            "qty": "500 ml"},
    {"name": "sugar",                    "qty": "3/4 cup"},
    {"name": "ghee",                     "qty": "3 tbsp"},
    {"name": "green cardamom powder",    "qty": "1 tsp"},
    {"name": "almonds (sliced)",         "qty": "2 tbsp"},
    {"name": "cashews",                  "qty": "2 tbsp"},
    {"name": "raisins",                  "qty": "2 tbsp"},
    {"name": "khoya (optional)",         "qty": "50 g"}
  ]'::jsonb,
  'Cook grated carrots in milk on medium heat stirring often. Cook 25-30 min until milk is fully absorbed. Add ghee and fry 5 min. Add sugar, cook until the moisture from sugar evaporates. Add crumbled khoya if using. Add cardamom and fried nuts and raisins. The halwa should be moist but not wet. Serve warm or cold, garnished with almonds.',
  'veg'
),

-- 76 ── Aloo Gobi
(
  'Aloo Gobi',
  'North Indian',
  'sabzi',
  25,
  '[
    {"name": "potatoes",                 "qty": "2 medium"},
    {"name": "cauliflower",              "qty": "1 small"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "coriander powder",         "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Cut potatoes and cauliflower into medium pieces. Heat oil, add cumin seeds. Add chopped onion, fry until soft. Add turmeric, chilli and coriander powder. Add chopped tomato, cook until soft. Add potatoes and cauliflower, stir to coat with masala. Add salt, cover and cook on low heat 15 min until vegetables are tender. Add garam masala. Garnish with coriander. Serve with roti.',
  'veg'
),

-- 77 ── Masoor Dal
(
  'Masoor Dal',
  'Pan-Indian',
  'dal',
  20,
  '[
    {"name": "masoor dal (red lentils)", "qty": "1 cup"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "garlic",                   "qty": "4 cloves"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1/2 tsp"},
    {"name": "ghee",                     "qty": "1 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Wash masoor dal and pressure cook with turmeric and 3 cups water for 3 whistles. Heat ghee, add cumin seeds and sliced garlic. Add chopped onion, fry golden. Add chopped tomato, chilli powder and salt. Cook until tomato breaks down. Add cooked dal, mix well and simmer 5 min. Adjust consistency with water. Garnish with coriander. Serve with rice or roti.',
  'veg'
),

-- 78 ── Chicken Curry
(
  'Chicken Curry',
  'Pan-Indian',
  'curry',
  35,
  '[
    {"name": "chicken",                  "qty": "500 g"},
    {"name": "onion",                    "qty": "2 large"},
    {"name": "tomato",                   "qty": "2 medium"},
    {"name": "ginger-garlic paste",      "qty": "2 tbsp"},
    {"name": "turmeric",                 "qty": "1/2 tsp"},
    {"name": "red chilli powder",        "qty": "1 tsp"},
    {"name": "coriander powder",         "qty": "1.5 tsp"},
    {"name": "garam masala",             "qty": "1 tsp"},
    {"name": "oil",                      "qty": "3 tbsp"},
    {"name": "fresh coriander",          "qty": "for garnish"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Heat oil, add chopped onions and fry golden. Add ginger-garlic paste, cook 2 min. Add chopped tomatoes, turmeric, chilli and coriander powder, salt. Cook until oil separates. Add chicken pieces, fry 5 min to seal. Add 1 cup water, cover and cook 20 min until chicken is tender. Add garam masala. Garnish with coriander. Serve with rice or naan.',
  'nonveg'
),

-- 79 ── Palak Paneer
(
  'Palak Paneer',
  'North Indian',
  'sabzi',
  25,
  '[
    {"name": "paneer",                   "qty": "200 g"},
    {"name": "palak (spinach)",          "qty": "500 g"},
    {"name": "onion",                    "qty": "1 medium"},
    {"name": "tomato",                   "qty": "1 medium"},
    {"name": "green chilli",             "qty": "2"},
    {"name": "garlic",                   "qty": "4 cloves"},
    {"name": "cumin seeds",              "qty": "1 tsp"},
    {"name": "garam masala",             "qty": "1/2 tsp"},
    {"name": "fresh cream",              "qty": "2 tbsp"},
    {"name": "butter",                   "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Blanch spinach 2 min, transfer to ice water. Blend to smooth puree with green chillies. Heat butter, add cumin seeds and garlic. Add chopped onion, fry soft. Add chopped tomato, cook until soft. Add spinach puree and salt, cook 5 min. Add paneer cubes, simmer 3 min. Add garam masala and cream. Serve with naan or roti.',
  'veg'
),

-- 80 ── Raita
(
  'Raita',
  'Pan-Indian',
  'side',
  5,
  '[
    {"name": "yogurt",                   "qty": "2 cups"},
    {"name": "cucumber",                 "qty": "1 medium"},
    {"name": "onion",                    "qty": "1 small"},
    {"name": "tomato",                   "qty": "1 small"},
    {"name": "cumin powder (roasted)",   "qty": "1 tsp"},
    {"name": "red chilli powder",        "qty": "1/4 tsp"},
    {"name": "fresh coriander",          "qty": "1 tbsp"},
    {"name": "salt",                     "qty": "to taste"}
  ]'::jsonb,
  'Whisk yogurt until smooth. Finely dice cucumber, onion and tomato. Mix into yogurt. Add roasted cumin powder, chilli powder, salt and chopped coriander. Mix well. Chill before serving. Serve alongside biryani, pulao or any spicy dish.',
  'veg'
);
