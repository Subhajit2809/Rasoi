"use client";

import Link from "next/link";

const features = [
  {
    emoji: "🧊",
    title: "Track Your Fridge",
    desc: "Know exactly what's in your kitchen. Get alerts before things go bad.",
  },
  {
    emoji: "🍳",
    title: "Aaj Kya Banaye?",
    desc: "Smart meal suggestions ranked by what you have and what needs using up.",
  },
  {
    emoji: "🛒",
    title: "Grocery List",
    desc: "Auto-generated from missing ingredients. Share instantly on WhatsApp.",
  },
  {
    emoji: "👫",
    title: "Shared Household",
    desc: "Both partners see the same kitchen in real-time. Always in sync.",
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-2xl font-bold text-[#D2691E]">🍲 Rasoi</span>
        <Link
          href="/login"
          className="text-sm font-medium text-[#D2691E] border border-[#D2691E] px-4 py-2 rounded-full hover:bg-[#D2691E] hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">🍲</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Your Smart
          <br />
          <span className="text-[#D2691E]">Indian Kitchen</span>
          <br />
          Assistant
        </h1>
        <p className="text-lg text-gray-500 max-w-sm mb-8">
          Manage your fridge, get meal ideas, and sync your grocery list — all in
          one app built for Indian households.
        </p>

        <Link
          href="/login"
          className="bg-[#D2691E] text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-[#B8540A] active:scale-95 transition-all"
        >
          Get Started with Google →
        </Link>

        <p className="mt-3 text-xs text-gray-400">Free • No credit card required</p>
      </main>

      {/* Feature cards */}
      <section className="px-5 pb-12 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-3 mt-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100"
            >
              <div className="text-3xl mb-2">{f.emoji}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1">
                {f.title}
              </div>
              <div className="text-xs text-gray-500 leading-snug">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-xs text-gray-400">
        Made with ❤️ for Indian kitchens
      </footer>
    </div>
  );
}
