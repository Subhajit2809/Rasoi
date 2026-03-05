import type { CookedItem, FridgeItem } from "@/types";
import { getDaysRemaining, freshnessLevel, formatRemaining } from "@/lib/freshness";
import { isExpiringSoon } from "@/lib/matching";

const PREF_KEY = "rasoi-notif-pref";
const NOTIFIED_KEY = "rasoi-notified-items";
const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours
const CLEANUP_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Check if the Notification API is available */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/** Get current browser permission state */
export function getPermissionState(): NotificationPermission {
  return Notification.permission;
}

/** Request notification permission from the user */
export async function requestPermission(): Promise<NotificationPermission> {
  return Notification.requestPermission();
}

/** Get user preference from localStorage */
export function getUserPreference(): "enabled" | "disabled" {
  try {
    return (localStorage.getItem(PREF_KEY) as "enabled" | "disabled") ?? "disabled";
  } catch {
    return "disabled";
  }
}

/** Set user preference in localStorage */
export function setUserPreference(pref: "enabled" | "disabled"): void {
  try {
    localStorage.setItem(PREF_KEY, pref);
  } catch {
    // localStorage unavailable
  }
}

function getNotifiedMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveNotifiedMap(map: Record<string, string>): void {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable
  }
}

/** Check if an item:level was notified within the cooldown period */
function wasRecentlyNotified(itemId: string, level: string): boolean {
  const key = `${itemId}:${level}`;
  const map = getNotifiedMap();
  const ts = map[key];
  if (!ts) return false;
  return Date.now() - new Date(ts).getTime() < COOLDOWN_MS;
}

/** Mark an item:level as notified now */
function markNotified(itemId: string, level: string): void {
  const key = `${itemId}:${level}`;
  const map = getNotifiedMap();
  map[key] = new Date().toISOString();
  saveNotifiedMap(map);
}

/** Remove entries older than 7 days to prevent unbounded growth */
export function cleanupNotifiedMap(): void {
  const map = getNotifiedMap();
  const now = Date.now();
  let changed = false;
  for (const [key, ts] of Object.entries(map)) {
    if (now - new Date(ts).getTime() > CLEANUP_AGE_MS) {
      delete map[key];
      changed = true;
    }
  }
  if (changed) saveNotifiedMap(map);
}

/** Show a notification via service worker (preferred) or Notification API fallback */
async function showNotification(title: string, options: NotificationOptions): Promise<void> {
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return;
    }
  } catch {
    // SW not available, fall through to fallback
  }
  try {
    new Notification(title, options);
  } catch {
    // Notification API unavailable
  }
}

/** Core check: fire notifications for cooked items crossing freshness thresholds and expiring fridge items */
export function checkAndNotify(cookedItems: CookedItem[], fridgeItems: FridgeItem[]): void {
  cleanupNotifiedMap();

  // Cooked items
  for (const item of cookedItems) {
    if (item.status === "finished") continue;
    const daysLeft = getDaysRemaining(item);
    const level = freshnessLevel(daysLeft);

    if (level === "soon" && !wasRecentlyNotified(item.id, "soon")) {
      showNotification(`Eat Soon: ${item.dish_name}`, {
        body: `${formatRemaining(daysLeft)} remaining`,
        icon: "/icons/icon.svg",
        tag: `cooked-${item.id}-soon`,
      });
      markNotified(item.id, "soon");
    }

    if (level === "toss" && !wasRecentlyNotified(item.id, "toss")) {
      showNotification(`Time to Toss: ${item.dish_name}`, {
        body: "This dish is past its prime",
        icon: "/icons/icon.svg",
        tag: `cooked-${item.id}-toss`,
      });
      markNotified(item.id, "toss");
    }
  }

  // Fridge items
  for (const item of fridgeItems) {
    if (!item.estimated_expiry) continue;
    if (isExpiringSoon(item) && !wasRecentlyNotified(item.id, "expiring")) {
      const hoursLeft = Math.round(
        (new Date(item.estimated_expiry).getTime() - Date.now()) / 3_600_000
      );
      showNotification(`Expiring Soon: ${item.item_name}`, {
        body: `${hoursLeft}h left — use it today!`,
        icon: "/icons/icon.svg",
        tag: `fridge-${item.id}-expiring`,
      });
      markNotified(item.id, "expiring");
    }
  }
}
