"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Check = {
  label: string;
  status: "pending" | "ok" | "fail";
  detail: string;
};

export default function TestPage() {
  const [checks, setChecks] = useState<Check[]>([
    { label: "Env vars present", status: "pending", detail: "" },
    { label: "Supabase reachable", status: "pending", detail: "" },
    { label: "recipes table readable", status: "pending", detail: "" },
    { label: "Auth service alive", status: "pending", detail: "" },
  ]);

  function update(index: number, status: Check["status"], detail: string) {
    setChecks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, status, detail } : c))
    );
  }

  useEffect(() => {
    async function run() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // 1. Env vars
      if (url && key) {
        update(0, "ok", url.replace(/^https:\/\//, "").split(".")[0] + ".supabase.co");
      } else {
        update(0, "fail", "One or more env vars are missing");
        return;
      }

      const supabase = createClient();

      // 2. Basic reachability — HEAD request to the REST endpoint
      const t0 = Date.now();
      try {
        const res = await fetch(`${url}/rest/v1/`, {
          headers: { apikey: key },
          method: "HEAD",
        });
        const ms = Date.now() - t0;
        if (res.ok || res.status === 400) {
          update(1, "ok", `${ms} ms`);
        } else {
          update(1, "fail", `HTTP ${res.status}`);
          return;
        }
      } catch (e) {
        update(1, "fail", String(e));
        return;
      }

      // 3. Query recipes table
      const t1 = Date.now();
      const { data, error } = await supabase
        .from("recipes")
        .select("id")
        .limit(1);
      const ms2 = Date.now() - t1;
      if (error) {
        update(2, "fail", error.message);
      } else {
        update(2, "ok", `${data.length} row returned in ${ms2} ms`);
      }

      // 4. Auth service
      const t2 = Date.now();
      const { error: authErr } = await supabase.auth.getSession();
      const ms3 = Date.now() - t2;
      if (authErr) {
        update(3, "fail", authErr.message);
      } else {
        update(3, "ok", `${ms3} ms`);
      }
    }

    run();
  }, []);

  const allDone = checks.every((c) => c.status !== "pending");
  const allOk = checks.every((c) => c.status === "ok");

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          🔌 Supabase Connection
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Checking your environment and backend…
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 divide-y divide-gray-100">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg w-6 text-center">
                {c.status === "pending" && (
                  <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#D2691E] rounded-full animate-spin" />
                )}
                {c.status === "ok" && "✅"}
                {c.status === "fail" && "❌"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">
                  {c.label}
                </div>
                {c.detail && (
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      c.status === "fail"
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {c.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {allDone && (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium text-center ${
              allOk
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {allOk
              ? "All checks passed — Supabase is connected 🎉"
              : "One or more checks failed. Check your .env.local values."}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          Remove <code className="font-mono">/test</code> from the URL when done.
        </p>
      </div>
    </div>
  );
}
