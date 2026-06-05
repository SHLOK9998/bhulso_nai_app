// Lightweight offline cache: snapshot critical dashboard data to localStorage
// so the UI can render last-known values when the device is offline.
const KEY = "hm-offline-v1";

export type OfflineSnapshot = {
  savedAt: string;
  date: string;
  meds: unknown;
  members: unknown;
  todayLog: unknown;
  todayTaken: Record<string, boolean>;
};

export function saveSnapshot(s: Omit<OfflineSnapshot, "savedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...s, savedAt: new Date().toISOString() }));
  } catch {}
}

export function loadSnapshot(): OfflineSnapshot | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OfflineSnapshot) : null;
  } catch {
    return null;
  }
}

export function isOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}
