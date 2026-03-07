"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { insertFridgeItems } from "@/lib/services/fridge";
import { inferCategory, calcExpiry } from "@/lib/ingredients";
import { PRESET_ITEMS } from "@/lib/ingredients";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DetectedItem {
  name: string;
  qty: number;
  unit: string;
  category: string;
}

type PageState = "capture" | "analyzing" | "review" | "submitting" | "done";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getShelfLife(itemName: string): number {
  const preset = PRESET_ITEMS.find(
    (p) => p.name.toLowerCase().includes(itemName.toLowerCase()) ||
           itemName.toLowerCase().includes(p.name.toLowerCase().split(" (")[0].toLowerCase())
  );
  return preset?.shelfLife ?? 7;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PhotoToFridgePage() {
  const router = useRouter();
  const { user } = useUser();
  const { household } = useHousehold();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<PageState>("capture");
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<DetectedItem[]>([]);
  const [error, setError] = useState("");

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");
    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setState("analyzing");

      const res = await fetch("/api/photo-to-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze image");
        setState("capture");
        return;
      }

      if (!data.items || data.items.length === 0) {
        setError("No grocery items detected. Try a clearer photo with items visible.");
        setState("capture");
        return;
      }

      setItems(data.items);
      setState("review");
    } catch {
      setError("Failed to process image. Please try again.");
      setState("capture");
    }
  }, []);

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQty(index: number, delta: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = Math.max(0.5, +(item.qty + delta).toFixed(1));
        return { ...item, qty: newQty };
      })
    );
  }

  async function handleSubmit() {
    if (!household || !user || items.length === 0) return;
    setState("submitting");
    setError("");

    const rows = items.map((item) => {
      const category = inferCategory(item.name) || item.category || "Pantry";
      const shelfLife = getShelfLife(item.name);
      return {
        household_id: household.id,
        item_name: item.name,
        category,
        qty: item.qty,
        unit: item.unit,
        added_by: user.id,
        estimated_expiry: calcExpiry(shelfLife),
      };
    });

    const { error: insErr } = await insertFridgeItems(rows);

    if (insErr) {
      setError("Couldn't add items. Please try again.");
      setState("review");
      return;
    }

    try {
      sessionStorage.setItem(
        "rasoi_added_toast",
        `${items.length} item${items.length !== 1 ? "s" : ""} scanned & added 📷`
      );
    } catch {
      // sessionStorage unavailable
    }

    setState("done");
    setTimeout(() => router.replace("/"), 1200);
  }

  function resetCapture() {
    setState("capture");
    setPreview(null);
    setItems([]);
    setError("");
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex flex-col">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border">
        <Link
          href="/add-items"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#3D2010] dark:text-gray-100 text-base">Scan Groceries</h1>
          <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
            Take a photo to auto-detect items
          </p>
        </div>
        <span className="text-lg">📷</span>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full">
        {/* ── Capture state ── */}
        {state === "capture" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {preview && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#E8C9A0] dark:border-dark-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full object-cover" />
              </div>
            )}

            {!preview && (
              <div className="w-full max-w-sm aspect-[4/3] rounded-2xl border-2 border-dashed border-[#E8C9A0] dark:border-dark-border flex flex-col items-center justify-center gap-3 bg-white dark:bg-dark-surface">
                <span className="text-5xl">📸</span>
                <p className="text-sm text-[#8B5E3C] dark:text-gray-400 text-center px-6">
                  Take a photo of your groceries or select from gallery
                </p>
              </div>
            )}

            {error && (
              <div className="w-full max-w-sm text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            <div className="flex gap-3 w-full max-w-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-4 rounded-2xl bg-[#D2691E] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-[0.98] transition-all shadow-lg shadow-[#D2691E]/25 dark:shadow-none"
              >
                📷 Take Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  // Open file picker without camera
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFileSelect(file);
                  };
                  input.click();
                }}
                className="py-4 px-5 rounded-2xl border-2 border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-200 font-semibold text-base hover:border-[#D2691E] transition-colors"
              >
                Gallery
              </button>
            </div>
          </div>
        )}

        {/* ── Analyzing state ── */}
        {state === "analyzing" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {preview && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#E8C9A0] dark:border-dark-border opacity-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Analyzing" className="w-full object-cover" />
              </div>
            )}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#3D2010] dark:text-gray-100">
                Identifying groceries...
              </p>
              <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
                This may take a few seconds
              </p>
            </div>
          </div>
        )}

        {/* ── Review state ── */}
        {(state === "review" || state === "submitting") && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#3D2010] dark:text-gray-100">
                  Found {items.length} item{items.length !== 1 ? "s" : ""}
                </h2>
                <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
                  Review and adjust before adding
                </p>
              </div>
              <button
                type="button"
                onClick={resetCapture}
                className="text-xs text-[#D2691E] font-semibold hover:underline"
              >
                Retake
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1">
              {items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center gap-3 bg-white dark:bg-dark-surface rounded-xl px-4 py-3 border border-[#E8C9A0] dark:border-dark-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#3D2010] dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
                      {item.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(idx, -1)}
                      className="w-7 h-7 rounded-lg bg-[#FFF0E0] dark:bg-dark-card text-[#D2691E] font-bold text-sm flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-[#3D2010] dark:text-gray-100 min-w-[3rem] text-center">
                      {item.qty} {item.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(idx, 1)}
                      className="w-7 h-7 rounded-lg bg-[#FFF0E0] dark:bg-dark-card text-[#D2691E] font-bold text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={items.length === 0 || state === "submitting"}
              className="w-full py-4 rounded-2xl bg-[#D2691E] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg shadow-[#D2691E]/25 dark:shadow-none"
            >
              {state === "submitting" ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${items.length} item${items.length !== 1 ? "s" : ""} to Fridge 🧊`
              )}
            </button>
          </div>
        )}

        {/* ── Done state ── */}
        {state === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <p className="font-bold text-[#3D2010] dark:text-gray-100 text-lg">
              Items added!
            </p>
            <p className="text-sm text-[#8B5E3C] dark:text-gray-400">
              Redirecting to fridge...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
