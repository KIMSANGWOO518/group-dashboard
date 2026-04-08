import { Redis } from "@upstash/redis";
import { WeekEntry } from "./types";

const KV_KEY = "dashboard:weeks";

function getRedis(): Redis | null {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return null;
}

// 로컬 개발용 메모리 폴백
const memStore: WeekEntry[] = [];

export async function getAllWeeks(): Promise<WeekEntry[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<WeekEntry[]>(KV_KEY);
    return data ?? [];
  }
  return [...memStore];
}

export async function addOrUpdateWeek(entry: WeekEntry): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const current = (await redis.get<WeekEntry[]>(KV_KEY)) ?? [];
    const idx = current.findIndex((w) => w.id === entry.id);
    if (idx >= 0) current[idx] = entry;
    else current.push(entry);
    current.sort((a, b) => a.date.localeCompare(b.date));
    await redis.set(KV_KEY, current);
    return;
  }
  const idx = memStore.findIndex((w) => w.id === entry.id);
  if (idx >= 0) memStore[idx] = entry;
  else memStore.push(entry);
  memStore.sort((a, b) => a.date.localeCompare(b.date));
}

export async function deleteWeek(id: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const current = (await redis.get<WeekEntry[]>(KV_KEY)) ?? [];
    await redis.set(KV_KEY, current.filter((w) => w.id !== id));
    return;
  }
  const idx = memStore.findIndex((w) => w.id === id);
  if (idx >= 0) memStore.splice(idx, 1);
}
