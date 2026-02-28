"use client";

import { useEffect } from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms (default 2800). Pass 0 to disable. */
  duration?: number;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "bg-green-700 text-white",
  error:   "bg-red-600 text-white",
  info:    "bg-[#3D2010] text-white",
};

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
};

export function Toast({
  message,
  visible,
  onHide,
  variant = "success",
  duration = 2800,
}: ToastProps) {
  useEffect(() => {
    if (!visible || duration === 0) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onHide]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-14 left-4 right-4 z-[100]
        flex items-center gap-3
        px-4 py-3.5 rounded-2xl shadow-2xl
        animate-slide-in-right
        ${VARIANT_STYLES[variant]}
      `}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {VARIANT_ICON[variant]}
      </span>
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button
        onClick={onHide}
        className="text-white/70 hover:text-white text-lg leading-none flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}
