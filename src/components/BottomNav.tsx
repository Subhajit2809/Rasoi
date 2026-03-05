"use client";

import Link from "next/link";

export type NavTab = "fridge" | "cook" | "grocery";

const TABS: { id: NavTab; label: string; icon: string; href: string }[] = [
  { id: "fridge",  label: "Fridge",  icon: "🧊", href: "/"         },
  { id: "cook",    label: "Cook",    icon: "🍳", href: "/i-cooked" },
  { id: "grocery", label: "Grocery", icon: "🛒", href: "/grocery"  },
];

interface BottomNavProps {
  active: NavTab;
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-[#E8C9A0] dark:border-dark-border pb-safe z-20">
      <div className="flex max-w-lg mx-auto">
        {TABS.map(({ id, label, icon, href }) => {
          const isActive = id === active;
          return (
            <Link
              key={id}
              href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors relative ${
                isActive ? "text-[#D2691E]" : "text-[#8B5E3C] dark:text-gray-400 hover:text-[#D2691E]"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-[#D2691E]" : "text-[#8B5E3C] dark:text-gray-400"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#D2691E] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
