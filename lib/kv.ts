/**
 * Vercel KV 래퍼 — 로컬 개발 시 메모리 폴백 사용
 */
import { WeekEntry } from "./types";

const KV_KEY = "dashboard:weeks";

async function getKv() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv");
    return kv;
  }
  return null;
}

const memStore: WeekEntry[] = [
  {
    id: "2025-W01",
    label: "2025년 1주차",
    date: "2025-01-06",
    poi_poi: 8, poi_voc: 4,
    display_roadwidth: 11, display_outerline: 7,
    dynamic_road: 5, dynamic_traffic: 4,
  },
  {
    id: "2025-W02",
    label: "2025년 2주차",
    date: "2025-01-13",
    poi_poi: 10, poi_voc: 5,
    display_roadwidth: 9, display_outerline: 5,
    dynamic_road: 7, dynamic_traffic: 4,
  },
  {
    id: "2025-W03",
    label: "2025년 3주차",
    date: "2025-01-20",
    poi_poi: 7, poi_voc: 3,
    display_roadwidth: 13, display_outerline: 7,
    dynamic_road: 6, dynamic_traffic: 7,
  },
  {
    id: "2025-W04",
    label: "2025년 4주차",
    date: "2025-01-27",
    poi_poi: 12, poi_voc: 5,
    display_roadwidth: 10, display_outerline: 6,
    dynamic_road: 5, dynamic_traffic: 3,
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
  const idx = memStore.findIndex((w) => w.id === entry.id);
  if (idx >= 0) memStore[idx] = entry;
  else memStore.push(entry);
  memStore.sort((a, b) => a.date.localeCompare(b.date));
}

export async function deleteWeek(id: string): Promise<void> {
  const kv = await getKv();
  if (kv) {
    const current = (await kv.get<WeekEntry[]>(KV_KEY)) ?? [];
    await kv.set(KV_KEY, current.filter((w) => w.id !== id));
    return;
  }
  const idx = memStore.findIndex((w) => w.id === id);
  if (idx >= 0) memStore.splice(idx, 1);
}
