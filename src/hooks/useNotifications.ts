"use client";

import { useEffect, useCallback, useRef } from "react";
import type { CookedItem, FridgeItem } from "@/types";
import {
  isNotificationSupported,
  getPermissionState,
  getUserPreference,
  checkAndNotify,
} from "@/lib/notifications";

const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Runs freshness checks and fires local notifications.
 * Piggybacks on already-fetched items from useCookedItems/useFridgeItems.
 */
export function useNotifications(
  cookedItems: CookedItem[],
  fridgeItems: FridgeItem[]
): void {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const runCheck = useCallback(() => {
    if (!isNotificationSupported()) return;
    if (getPermissionState() !== "granted") return;
    if (getUserPreference() !== "enabled") return;
    checkAndNotify(cookedItems, fridgeItems);
  }, [cookedItems, fridgeItems]);

  // Run on mount and whenever items change
  useEffect(() => {
    runCheck();
  }, [runCheck]);

  // Run periodically every 30 minutes
  useEffect(() => {
    if (!isNotificationSupported()) return;
    intervalRef.current = setInterval(runCheck, CHECK_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runCheck]);
}
