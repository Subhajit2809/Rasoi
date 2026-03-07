import { nameMatches } from "./matching";

export type Category = "Vegetables" | "Dairy & Protein" | "Pantry";

export interface PresetItem {
  name: string;
  category: Category;
  unit: string;
  defaultQty: number;
  shelfLife: number; // days until estimated_expiry
}

export const PRESET_ITEMS: PresetItem[] = [
  // Vegetables
  { name: "Pyaz (Onion)",         category: "Vegetables",      unit: "pcs",   defaultQty: 6,   shelfLife: 14  },
  { name: "Tamatar (Tomato)",     category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 5   },
  { name: "Aloo (Potato)",        category: "Vegetables",      unit: "kg",    defaultQty: 1,   shelfLife: 21  },
  { name: "Palak (Spinach)",      category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 2   },
  { name: "Gobi (Cauliflower)",   category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 4   },
  { name: "Capsicum",             category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 7   },
  { name: "Baingan (Brinjal)",    category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 4   },
  { name: "Gajar (Carrot)",       category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 10  },
  { name: "Bhindi (Okra)",        category: "Vegetables",      unit: "g",     defaultQty: 250, shelfLife: 3   },
  { name: "Hari Mirch",           category: "Vegetables",      unit: "pcs",   defaultQty: 8,   shelfLife: 7   },
  { name: "Adrak (Ginger)",       category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 14  },
  { name: "Lahsun (Garlic)",      category: "Vegetables",      unit: "bulb",  defaultQty: 2,   shelfLife: 30  },
  { name: "Lauki (Bottle Gourd)", category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 7   },
  { name: "Dhaniya (Coriander)",  category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Methi Leaves",         category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Pudina (Mint)",        category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Nimbu (Lemon)",        category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 14  },
  { name: "Matar (Peas)",         category: "Vegetables",      unit: "g",     defaultQty: 250, shelfLife: 3   },
  // Dairy & Protein
  { name: "Paneer",               category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 4   },
  { name: "Dahi (Yogurt)",        category: "Dairy & Protein", unit: "ml",    defaultQty: 500, shelfLife: 5   },
  { name: "Doodh (Milk)",         category: "Dairy & Protein", unit: "L",     defaultQty: 1,   shelfLife: 3   },
  { name: "Eggs",                 category: "Dairy & Protein", unit: "pcs",   defaultQty: 6,   shelfLife: 21  },
  { name: "Chicken",              category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 2   },
  { name: "Fish",                 category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 1   },
  { name: "Mutton",               category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 2   },
  { name: "Butter",               category: "Dairy & Protein", unit: "g",     defaultQty: 100, shelfLife: 30  },
  { name: "Fresh Cream",          category: "Dairy & Protein", unit: "ml",    defaultQty: 200, shelfLife: 5   },
  { name: "Cheese",               category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 14  },
  { name: "Tofu",                 category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 4   },
  // Pantry
  { name: "Chawal (Rice)",        category: "Pantry",          unit: "kg",    defaultQty: 1,   shelfLife: 365 },
  { name: "Atta",                 category: "Pantry",          unit: "kg",    defaultQty: 1,   shelfLife: 60  },
  { name: "Maida",                category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 90  },
  { name: "Toor Dal",             category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Moong Dal",            category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Chana Dal",            category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Rajma",                category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Kabuli Chana",         category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Cooking Oil",          category: "Pantry",          unit: "L",     defaultQty: 1,   shelfLife: 180 },
  { name: "Ghee",                 category: "Pantry",          unit: "g",     defaultQty: 200, shelfLife: 180 },
  { name: "Tomato Puree",         category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 5   },
  { name: "Bread",                category: "Pantry",          unit: "pcs",   defaultQty: 1,   shelfLife: 7   },
  { name: "Poha",                 category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 180 },
  { name: "Besan",                category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 180 },
  { name: "Coconut Milk",         category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 3   },
  // Additional Vegetables
  { name: "Karela (Bitter Gourd)",category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 4   },
  { name: "Turai (Ridge Gourd)", category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 4   },
  { name: "Parwal",              category: "Vegetables",      unit: "pcs",   defaultQty: 6,   shelfLife: 3   },
  { name: "Drumstick",           category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 5   },
  { name: "Raw Banana",          category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 5   },
  { name: "Sweet Potato",        category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 14  },
  { name: "Cabbage",             category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 7   },
  { name: "Spring Onion",        category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 5   },
  { name: "Mushroom",            category: "Vegetables",      unit: "g",     defaultQty: 200, shelfLife: 3   },
  // Additional Dairy & Protein
  { name: "Prawns",              category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 1   },
  { name: "Chhena / Cottage Cheese",category: "Dairy & Protein",unit: "g",  defaultQty: 200, shelfLife: 2   },
  { name: "Buttermilk",          category: "Dairy & Protein", unit: "ml",    defaultQty: 500, shelfLife: 3   },
  // Additional Pantry
  { name: "Masoor Dal",          category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Urad Dal",            category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Suji (Semolina)",     category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 180 },
  { name: "Sabudana",            category: "Pantry",          unit: "g",     defaultQty: 250, shelfLife: 365 },
  { name: "Makki Atta (Cornmeal)",category: "Pantry",         unit: "g",     defaultQty: 500, shelfLife: 90  },
  { name: "Noodles",             category: "Pantry",          unit: "pcs",   defaultQty: 2,   shelfLife: 180 },
  { name: "Peanuts",             category: "Pantry",          unit: "g",     defaultQty: 250, shelfLife: 90  },
  { name: "Badam (Almonds)",     category: "Pantry",          unit: "g",     defaultQty: 100, shelfLife: 180 },
  { name: "Kaju (Cashews)",      category: "Pantry",          unit: "g",     defaultQty: 100, shelfLife: 180 },
  { name: "Kishmish (Raisins)",  category: "Pantry",          unit: "g",     defaultQty: 100, shelfLife: 180 },
  { name: "Desiccated Coconut",  category: "Pantry",          unit: "g",     defaultQty: 100, shelfLife: 180 },
  { name: "Soy Sauce",           category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 365 },
  { name: "Vinegar",             category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 365 },
  { name: "Pav (Bread Rolls)",   category: "Pantry",          unit: "pcs",   defaultQty: 6,   shelfLife: 3   },
  { name: "Maggi",               category: "Pantry",          unit: "pcs",   defaultQty: 4,   shelfLife: 180 },
];

export const CATEGORIES: Category[] = ["Vegetables", "Dairy & Protein", "Pantry"];

export const CATEGORY_EMOJI: Record<Category, string> = {
  "Vegetables":      "🥦",
  "Dairy & Protein": "🥛",
  "Pantry":          "🫙",
};

export function inferCategory(itemName: string): Category {
  const match = PRESET_ITEMS.find((p) => nameMatches(itemName, p.name));
  return match?.category ?? "Pantry";
}

export function calcExpiry(shelfLife: number): string {
  const d = new Date();
  d.setDate(d.getDate() + shelfLife);
  return d.toISOString();
}
