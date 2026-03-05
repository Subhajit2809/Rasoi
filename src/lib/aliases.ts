/**
 * Bidirectional ingredient alias map for Hindi ↔ English matching.
 * Each key maps to an array of alternative names.
 */
const INGREDIENT_ALIASES: Record<string, string[]> = {
  // Spices
  jeera:            ["cumin", "cumin seeds"],
  cumin:            ["jeera", "cumin seeds"],
  "cumin seeds":    ["jeera", "cumin"],
  haldi:            ["turmeric", "turmeric powder"],
  turmeric:         ["haldi", "turmeric powder"],
  "turmeric powder":["haldi", "turmeric"],
  rai:              ["mustard seeds", "mustard"],
  "mustard seeds":  ["rai", "mustard"],
  elaichi:          ["cardamom"],
  cardamom:         ["elaichi"],
  dalchini:         ["cinnamon", "cinnamon stick"],
  cinnamon:         ["dalchini", "cinnamon stick"],
  laung:            ["cloves"],
  cloves:           ["laung"],
  "tej patta":      ["bay leaf", "bay leaves"],
  "bay leaf":       ["tej patta", "bay leaves"],
  ajwain:           ["carom seeds"],
  "carom seeds":    ["ajwain"],
  heeng:            ["asafoetida", "hing"],
  hing:             ["asafoetida", "heeng"],
  asafoetida:       ["heeng", "hing"],

  // Vegetables
  pyaz:             ["onion", "onions"],
  onion:            ["pyaz", "onions"],
  onions:           ["pyaz", "onion"],
  tamatar:          ["tomato", "tomatoes"],
  tomato:           ["tamatar", "tomatoes"],
  tomatoes:         ["tamatar", "tomato"],
  aloo:             ["potato", "potatoes"],
  potato:           ["aloo", "potatoes"],
  potatoes:         ["aloo", "potato"],
  palak:            ["spinach"],
  spinach:          ["palak"],
  gobi:             ["cauliflower"],
  cauliflower:      ["gobi"],
  baingan:          ["brinjal", "eggplant", "aubergine"],
  brinjal:          ["baingan", "eggplant", "aubergine"],
  eggplant:         ["baingan", "brinjal", "aubergine"],
  bhindi:           ["okra", "ladyfinger", "lady finger"],
  okra:             ["bhindi", "ladyfinger"],
  gajar:            ["carrot", "carrots"],
  carrot:           ["gajar", "carrots"],
  carrots:          ["gajar", "carrot"],
  matar:            ["peas", "green peas"],
  peas:             ["matar", "green peas"],
  "green peas":     ["matar", "peas"],
  shimla:           ["capsicum", "bell pepper"],
  capsicum:         ["shimla", "bell pepper"],
  lauki:            ["bottle gourd"],
  "bottle gourd":   ["lauki"],
  turai:            ["ridge gourd"],
  "ridge gourd":    ["turai"],
  sarson:           ["mustard greens"],
  "mustard greens": ["sarson"],
  karela:           ["bitter gourd"],
  "bitter gourd":   ["karela"],

  // Herbs
  adrak:            ["ginger"],
  ginger:           ["adrak"],
  lahsun:           ["garlic"],
  garlic:           ["lahsun"],
  dhaniya:          ["coriander", "coriander leaves", "cilantro"],
  coriander:        ["dhaniya", "coriander leaves", "cilantro"],
  cilantro:         ["dhaniya", "coriander", "coriander leaves"],
  pudina:           ["mint", "mint leaves"],
  mint:             ["pudina", "mint leaves"],
  mirch:            ["chilli", "chili", "green chilli", "green chili"],
  chilli:           ["mirch", "green chilli", "green chili"],
  nimbu:            ["lemon", "lime"],
  lemon:            ["nimbu", "lime"],
  lime:             ["nimbu", "lemon"],

  // Dairy & Protein
  dahi:             ["yogurt", "curd"],
  yogurt:           ["dahi", "curd"],
  curd:             ["dahi", "yogurt"],
  paneer:           ["cottage cheese"],
  "cottage cheese": ["paneer"],
  ghee:             ["clarified butter"],
  "clarified butter": ["ghee"],

  // Staples & Flours
  chawal:           ["rice"],
  rice:             ["chawal"],
  atta:             ["wheat flour", "whole wheat flour"],
  "wheat flour":    ["atta", "whole wheat flour"],
  maida:            ["all purpose flour", "refined flour", "plain flour"],
  "all purpose flour": ["maida", "refined flour"],
  besan:            ["gram flour", "chickpea flour"],
  "gram flour":     ["besan", "chickpea flour"],
  "chickpea flour": ["besan", "gram flour"],
  rajma:            ["kidney beans"],
  "kidney beans":   ["rajma"],
  chana:            ["chickpeas"],
  chickpeas:        ["chana"],
  urad:             ["black gram", "urad dal"],
  "urad dal":       ["black gram", "urad"],
  moong:            ["mung", "moong dal"],
  "moong dal":      ["mung", "moong"],
  toor:             ["toor dal", "arhar dal", "pigeon pea"],
  "toor dal":       ["toor", "arhar dal", "pigeon pea"],
  "arhar dal":      ["toor", "toor dal", "pigeon pea"],
};

/**
 * Returns the input name plus all known aliases.
 * If no aliases found, returns a single-element array with the input.
 */
export function resolveAliases(name: string): string[] {
  const lower = name.toLowerCase().trim();
  const aliases = INGREDIENT_ALIASES[lower];
  return aliases ? [lower, ...aliases] : [lower];
}
