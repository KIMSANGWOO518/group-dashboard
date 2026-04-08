/**
 * Vercel KV 래퍼 — 로컬 개발 시 메모리 폴백 사용
 */
import { WeekEntry } from "./types";

const KV_KEY = "dashboard:weeks";

// ---------- Vercel KV ----------
async function getKv() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv");
    return kv;
  }
  return null;
}

// ---------- in-memory fallback (dev) ----------
const memStore: WeekEntry[] = [
  {
    id: "2025-W01",
    label: "2025년 1주차",
    date: "2025-01-06",
    poi: 12,
    display: 18,
    dynamic: 9,
  },
  {
    id: "2025-W02",
    label: "2025년 2주차",
    date: "2025-01-13",
    poi: 15,
    display: 14,
    dynamic: 11,
  },
  {
    id: "2025-W03",
    label: "2025년 3주차",
    date: "2025-01-20",
    poi: 10,
    display: 20,
    dynamic: 13,
  },
  {
    id: "2025-W04",
    label: "2025년 4주차",
    date: "2025-01-27",
    poi: 17,
    display: 16,
    dynamic: 8,
  },
];

export async function getAllWeeks(): Promise<WeekEntry[]> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get<WeekEntry[]>(KV_KEY);
    return data ?? [];
  }
  return [...memStore];
}

export async function addOrUpdateWeek(entry: WeekEntry): Promise<void> {
  const kv = await getKv();
  if (kv) {
    const current = (await kv.get<WeekEntry[]>(KV_KEY)) ?? [];
    const idx = current.findIndex((w) => w.id === entry.id);
    if (idx >= 0) current[idx] = entry;
    else current.push(entry);
    current.sort((a, b) => a.date.localeCompare(b.date));
    await kv.set(KV_KEY, current);
    return;
  }
  // fallback
  const idx = memStore.findIndex((w) => w.id === entry.id);
  if (idx >= 0) memStore[idx] = entry;
  else memStore.push(entry);
  memStore.sort((a, b) => a.date.localeCompare(b.date));
}

export async function deleteWeek(id: string): Promise<void> {
  const kv = await getKv();
  if (kv) {
    const current = (await kv.get<WeekEntry[]>(KV_KEY)) ?? [];
    const next = current.filter((w) => w.id !== id);
    await kv.set(KV_KEY, next);
    return;
  }
  const idx = memStore.findIndex((w) => w.id === id);
  if (idx >= 0) memStore.splice(idx, 1);
}
