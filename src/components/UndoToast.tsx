"use client";

import { useEffect, useRef } from "react";

interface UndoToastProps {
  message: string;
  visible: boolean;
  onUndo: () => void;
  onExpire: () => void;
  /** Auto-commit after this many ms (default 5000). */
  duration?: number;
}

export function UndoToast({
  message,
  visible,
  onUndo,
  onExpire,
  duration = 5000,
}: UndoToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(onExpire, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, onExpire]);

  if (!visible) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-[100] flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl bg-[#3D2010] dark:bg-dark-card dark:border dark:border-dark-border text-white animate-slide-in-right">
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button
        onClick={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          onUndo();
        }}
        className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 active:scale-95 transition-all"
      >
        Undo
      </button>
    </div>
  );
}
