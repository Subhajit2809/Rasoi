// Auto-generate this file from your Supabase project with:
//   npx supabase gen types typescript --project-id <your-project-ref> \
//     > src/lib/supabase/types.ts
//
// Hand-written stub that mirrors the generated output format.
//
// Row/Insert/Update must be plain object literals — NOT interfaces and NOT
// intersections with Record<string,unknown>.  The Supabase SDK's internal
// `extends Record<string, unknown>` conditional type check in GenericTable
// passes for plain `{ key: Type }` object literals in TypeScript 5.x, but
// fails for named interfaces and widens to {} for intersections.

export type Database = {
  public: {
    Tables: {

      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      household_invites: {
        Row: {
          id: string;
          household_id: string;
          code: string;
          created_by: string | null;
          created_at: string;
          expires_at: string;
          used_by: string | null;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          code: string;
          created_by?: string | null;
          created_at?: string;
          expires_at?: string;
          used_by?: string | null;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          code?: string;
          created_by?: string | null;
          created_at?: string;
          expires_at?: string;
          used_by?: string | null;
          used_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "household_invites_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };

      households: {
        Row: {
          id: string;
          name: string;
          region: string;
          diet_pref: "veg" | "nonveg" | "eggetarian" | "vegan" | "jain";
          household_size: number;
          spice_level: "mild" | "medium" | "spicy";
          complexity: "quick" | "medium" | "elaborate" | "any";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          region?: string;
          diet_pref?: "veg" | "nonveg" | "eggetarian" | "vegan" | "jain";
          household_size?: number;
          spice_level?: "mild" | "medium" | "spicy";
          complexity?: "quick" | "medium" | "elaborate" | "any";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          diet_pref?: "veg" | "nonveg" | "eggetarian" | "vegan" | "jain";
          household_size?: number;
          spice_level?: "mild" | "medium" | "spicy";
          complexity?: "quick" | "medium" | "elaborate" | "any";
          created_at?: string;
        };
        Relationships: [];
      };

      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: "admin" | "member";
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          role?: "admin" | "member";
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          role?: "admin" | "member";
        };
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };

      pantry_staples: {
        Row: {
          id: string;
          household_id: string;
          item_name: string;
          category: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          item_name: string;
          category: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          item_name?: string;
          category?: string;
        };
        Relationships: [];
      };

      fridge_items: {
        Row: {
          id: string;
          household_id: string;
          item_name: string;
          category: string;
          qty: number;
          unit: string;
          added_at: string;
          estimated_expiry: string | null;
          added_by: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          item_name: string;
          category: string;
          qty?: number;
          unit?: string;
          added_at?: string;
          estimated_expiry?: string | null;
          added_by?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          item_name?: string;
          category?: string;
          qty?: number;
          unit?: string;
          added_at?: string;
          estimated_expiry?: string | null;
          added_by?: string | null;
        };
        Relationships: [];
      };

      cooked_items: {
        Row: {
          id: string;
          household_id: string;
          dish_name: string;
          cooked_at: string;
          freshness_days: number;
          status: "fresh" | "stale" | "finished";
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          dish_name: string;
          cooked_at?: string;
          freshness_days?: number;
          status?: "fresh" | "stale" | "finished";
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          dish_name?: string;
          cooked_at?: string;
          freshness_days?: number;
          status?: "fresh" | "stale" | "finished";
          finished_at?: string | null;
        };
        Relationships: [];
      };

      recipes: {
        Row: {
          id: string;
          name: string;
          region: string;
          category: string;
          cook_time_mins: number;
          ingredients: { name: string; qty: string }[];
          instructions: string;
          diet_type: "veg" | "nonveg" | "eggetarian";
          household_id: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          region: string;
          category: string;
          cook_time_mins: number;
          ingredients?: { name: string; qty: string }[];
          instructions: string;
          diet_type: "veg" | "nonveg" | "eggetarian";
          household_id?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          category?: string;
          cook_time_mins?: number;
          ingredients?: { name: string; qty: string }[];
          instructions?: string;
          diet_type?: "veg" | "nonveg" | "eggetarian";
          household_id?: string | null;
          created_by?: string | null;
        };
        Relationships: [];
      };

      meal_plans: {
        Row: {
          id: string;
          household_id: string;
          date: string;
          meal_type: string;
          recipe_id: string | null;
          dish_name: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          date: string;
          meal_type: string;
          recipe_id?: string | null;
          dish_name: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          date?: string;
          meal_type?: string;
          recipe_id?: string | null;
          dish_name?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      grocery_list: {
        Row: {
          id: string;
          household_id: string;
          item_name: string;
          category: string;
          is_purchased: boolean;
          source: "auto" | "manual";
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          item_name: string;
          category: string;
          is_purchased?: boolean;
          source?: "auto" | "manual";
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          item_name?: string;
          category?: string;
          is_purchased?: boolean;
          source?: "auto" | "manual";
          created_at?: string;
        };
        Relationships: [];
      };

      meal_log: {
        Row: {
          id: string;
          household_id: string;
          dish_name: string;
          date: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          dish_name: string;
          date?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          dish_name?: string;
          date?: string;
        };
        Relationships: [];
      };
    };

    Views:     Record<string, never>;
    // MUST NOT be Record<string, never>. `never` satisfies every `extends`
    // check, including the computed-field Args pattern, which causes the SDK
    // to treat every column as a computed field and return {} from select('*').
    // A concrete function shape with Args: Record<string,unknown> correctly
    // fails the computed-field check (requires Args: { '': Row }) so
    // GetComputedFields resolves to `never` and select('*') returns Row.
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums:     Record<string, never>;
  };
};
