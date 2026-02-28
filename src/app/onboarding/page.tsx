"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, createClientWithToken } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIET_OPTIONS = [
  { value: "veg" as const,        label: "Vegetarian",  emoji: "🥦", desc: "No meat or eggs" },
  { value: "eggetarian" as const, label: "Eggetarian",  emoji: "🥚", desc: "Veg + eggs OK" },
  { value: "nonveg" as const,     label: "Non-Veg",     emoji: "🍗", desc: "All foods" },
];

const REGIONS = [
  "North Indian",
  "South Indian",
  "Bengali",
  "Gujarati",
  "Maharashtrian",
  "Pan-Indian",
];

const PANTRY: { category: string; emoji: string; items: string[] }[] = [
  {
    category: "Grains & Flours",
    emoji: "🌾",
    items: ["Atta", "Chawal (Rice)", "Maida", "Besan", "Suji (Semolina)", "Poha", "Sabudana"],
  },
  {
    category: "Dals & Legumes",
    emoji: "🫘",
    items: [
      "Toor Dal", "Moong Dal", "Chana Dal", "Masoor Dal",
      "Urad Dal", "Rajma", "Kala Chana", "Kabuli Chana",
    ],
  },
  {
    category: "Spices & Masalas",
    emoji: "🌶️",
    items: [
      "Haldi", "Lal Mirch", "Jeera", "Dhania Powder",
      "Garam Masala", "Hing", "Sarso", "Amchur",
      "Kasuri Methi", "Kali Mirch",
    ],
  },
  {
    category: "Oils & Fats",
    emoji: "🫙",
    items: ["Mustard Oil", "Refined Oil", "Ghee", "Coconut Oil"],
  },
  {
    category: "Essentials",
    emoji: "🧂",
    items: [
      "Namak (Salt)", "Cheeni (Sugar)", "Jaggery (Gur)",
      "Chai Patti", "Tomato Puree", "Imli (Tamarind)",
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            s <= step ? "bg-[#D2691E]" : "bg-[#E8C9A0]"
          }`}
        />
      ))}
    </div>
  );
}

function StepLabel({ step }: { step: number }) {
  const labels = [
    { title: "Your Household",  sub: "Let's set up your kitchen" },
    { title: "Preferences",     sub: "Tailor it to your taste" },
    { title: "Stock Your Pantry", sub: "What's always at home?" },
  ];
  const { title, sub } = labels[step - 1];
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-widest text-[#D2691E] uppercase mb-1">
        Step {step} of 3
      </p>
      <h2 className="text-2xl font-bold text-[#3D2010]">{title}</h2>
      <p className="text-sm text-[#8B5E3C] mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router  = useRouter();
  const { user, loading: userLoading } = useUser();

  // navigation
  const [step,      setStep]      = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // step 1
  const [householdName, setHouseholdName] = useState("");
  const [householdSize, setHouseholdSize] = useState(2);

  // step 2
  const [dietPref, setDietPref] = useState<"veg" | "eggetarian" | "nonveg">("veg");
  const [region,   setRegion]   = useState("");

  // step 3
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // db id preserved across steps so back-nav updates instead of re-inserts
  const [householdId, setHouseholdId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // ── navigation helpers ──

  function go(next: 1 | 2 | 3, dir: "forward" | "back") {
    setDirection(dir);
    setStep(next);
    setError("");
  }

  function toggleItem(item: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  function toggleCategory(items: string[]) {
    setChecked((prev) => {
      const next    = new Set(prev);
      const allOn   = items.every((i) => prev.has(i));
      items.forEach((i) => (allOn ? next.delete(i) : next.add(i)));
      return next;
    });
  }

  // ── helpers ──

  // Gets an authenticated DB client with the JWT explicitly pinned in headers.
  // Works around @supabase/ssr not injecting the session into PostgREST calls
  // after a server-side OAuth callback.
  async function getDb() {
    const { data: { session } } = await createClient().auth.getSession();
    if (!session) return null;
    return createClientWithToken(session.access_token);
  }

  // ── step handlers ──

  async function handleStep1Next() {
    if (!user || !householdName.trim()) return;
    setLoading(true);
    setError("");

    // ── DEBUG (remove before merge) ──────────────────────────────────────
    const _supa = createClient();
    const { data: _sd, error: _se } = await _supa.auth.getSession();
    console.log("[DEBUG] getSession result:", {
      session: _sd?.session
        ? {
            access_token: _sd.session.access_token?.slice(0, 40) + "…",
            expires_at: _sd.session.expires_at,
            user_id: _sd.session.user?.id,
          }
        : null,
      error: _se?.message ?? null,
    });
    console.log("[DEBUG] createClient() instance:", _supa);
    // ─────────────────────────────────────────────────────────────────────

    const db = await getDb();
    console.log("[DEBUG] getDb() returned:", db ? "authenticated client ✓" : "null — no session");
    if (!db) {
      setError("Session expired. Please sign in again.");
      setLoading(false);
      router.replace("/login");
      return;
    }

    if (householdId) {
      // User went back — update existing row
      const { error: upErr } = await db
        .from("households")
        .update({ name: householdName.trim(), household_size: householdSize })
        .eq("id", householdId);
      if (upErr) { setError("Couldn't save. Please try again."); setLoading(false); return; }
    } else {
      // First time — insert; DB trigger auto-inserts household_members row
      const { data, error: insErr } = await db
        .from("households")
        .insert({ name: householdName.trim(), household_size: householdSize })
        .select("id")
        .single();
      if (insErr || !data) { setError(`Couldn't create household: ${insErr?.message ?? "no data returned"}`); setLoading(false); return; }
      setHouseholdId(data.id);
    }

    setLoading(false);
    go(2, "forward");
  }

  async function handleStep2Next() {
    if (!householdId || !region) return;
    setLoading(true);
    setError("");

    const db = await getDb();
    if (!db) { setError("Session expired. Please sign in again."); setLoading(false); return; }

    const { error: upErr } = await db
      .from("households")
      .update({ diet_pref: dietPref, region })
      .eq("id", householdId);

    if (upErr) { setError("Couldn't save preferences. Please try again."); setLoading(false); return; }

    setLoading(false);
    go(3, "forward");
  }

  async function handleStep3Submit() {
    if (!householdId) return;
    setLoading(true);
    setError("");

    if (checked.size > 0) {
      const db = await getDb();
      if (db) {
        const rows = Array.from(checked).map((item_name) => ({
          household_id: householdId,
          item_name,
          category: PANTRY.find((c) => c.items.includes(item_name))?.category ?? "Other",
        }));
        const { error: staplesErr } = await db.from("pantry_staples").insert(rows);
        if (staplesErr) console.error("[onboarding] pantry_staples:", staplesErr.message);
      }
    }

    router.replace("/");
  }

  // ── loading guard ──

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const animClass =
    direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* top accent stripe */}
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      <div className="flex-1 flex flex-col px-5 py-8 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🍳</span>
          <span className="text-lg font-bold text-[#D2691E]">Rasoi</span>
        </div>

        <ProgressBar step={step} />

        {/* Animated step container — key forces remount for animation */}
        <div key={step} className={`flex-1 flex flex-col ${animClass}`}>
          <StepLabel step={step} />

          {/* ══ Step 1 ══ */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] mb-2">
                  Kitchen name
                </label>
                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && householdName.trim() && handleStep1Next()}
                  placeholder="e.g. Sharma ki Rasoi, Our Home"
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E8C9A0] bg-white text-[#3D2010] placeholder-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#D2691E]/40 focus:border-[#D2691E] text-sm transition-all"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] mb-3">
                  Household size
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setHouseholdSize(n)}
                      className={`w-12 h-12 rounded-2xl text-base font-bold border-2 transition-all ${
                        householdSize === n
                          ? "bg-[#D2691E] border-[#D2691E] text-white shadow-md scale-105"
                          : "bg-white border-[#E8C9A0] text-[#5C3A1E] hover:border-[#D2691E]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#8B5E3C] mt-2">
                  {householdSize === 1 ? "Just you" : `${householdSize} people share this kitchen`}
                </p>
              </div>

              {error && <ErrorBox msg={error} />}

              <PrimaryBtn
                label="Next →"
                onClick={handleStep1Next}
                loading={loading}
                disabled={!householdName.trim()}
              />
            </div>
          )}

          {/* ══ Step 2 ══ */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {/* Diet */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] mb-3">
                  Diet preference
                </label>
                <div className="flex flex-col gap-2">
                  {DIET_OPTIONS.map(({ value, label, emoji, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDietPref(value)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${
                        dietPref === value
                          ? "bg-[#FFF0E0] border-[#D2691E]"
                          : "bg-white border-[#E8C9A0] hover:border-[#D2691E]/50"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#3D2010] text-sm">{label}</p>
                        <p className="text-xs text-[#8B5E3C]">{desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          dietPref === value
                            ? "border-[#D2691E] bg-[#D2691E]"
                            : "border-[#C4A882]"
                        }`}
                      >
                        {dietPref === value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] mb-3">
                  Your cuisine region
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        region === r
                          ? "bg-[#D2691E] border-[#D2691E] text-white"
                          : "bg-white border-[#E8C9A0] text-[#5C3A1E] hover:border-[#D2691E]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && <ErrorBox msg={error} />}

              <div className="flex gap-3 mt-auto">
                <SecondaryBtn label="← Back" onClick={() => go(1, "back")} />
                <PrimaryBtn
                  label="Next →"
                  onClick={handleStep2Next}
                  loading={loading}
                  disabled={!region}
                />
              </div>
            </div>
          )}

          {/* ══ Step 3 ══ */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#8B5E3C]">
                Tap items you always keep stocked. These are your kitchen backbone — they won&apos;t trigger grocery alerts.
                <span className="font-semibold text-[#D2691E]"> {checked.size} selected</span>
              </p>

              {/* Categories */}
              <div className="space-y-5 overflow-y-auto">
                {PANTRY.map(({ category, emoji, items }) => {
                  const allOn = items.every((i) => checked.has(i));
                  const someOn = items.some((i) => checked.has(i));
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-semibold text-[#3D2010]">
                          {emoji} {category}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCategory(items)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                            allOn
                              ? "bg-[#D2691E] text-white"
                              : someOn
                              ? "bg-[#FFE8CC] text-[#D2691E]"
                              : "text-[#D2691E] hover:bg-[#FFE8CC]"
                          }`}
                        >
                          {allOn ? "Deselect all" : "Select all"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => {
                          const on = checked.has(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleItem(item)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                                on
                                  ? "bg-[#D2691E] border-[#D2691E] text-white"
                                  : "bg-white border-[#E8C9A0] text-[#5C3A1E] hover:border-[#D2691E]/60"
                              }`}
                            >
                              {on && <span className="text-xs">✓</span>}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && <ErrorBox msg={error} />}

              <div className="flex gap-3 pt-2">
                <SecondaryBtn
                  label="← Back"
                  onClick={() => go(2, "back")}
                  disabled={loading}
                />
                <PrimaryBtn
                  label={loading ? "Setting up…" : "Let's cook! 🍳"}
                  onClick={handleStep3Submit}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Small shared components ───────────────────────────────────────────────────

function PrimaryBtn({
  label, onClick, loading = false, disabled = false,
}: {
  label: string; onClick: () => void; loading?: boolean; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex-1 py-3.5 rounded-2xl bg-[#D2691E] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {label}
    </button>
  );
}

function SecondaryBtn({
  label, onClick, disabled = false,
}: {
  label: string; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="py-3.5 px-5 rounded-2xl border-2 border-[#E8C9A0] text-[#8B5E3C] font-semibold text-sm hover:border-[#D2691E] active:scale-95 transition-all disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      {msg}
    </div>
  );
}
