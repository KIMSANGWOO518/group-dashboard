"use client";

import { WeekEntry, TEAM_CONFIG, TeamKey, teamTotal } from "@/lib/types";

interface Props {
  data: WeekEntry[];
}

export default function StatsCards({ data }: Props) {
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => {
        const cfg = TEAM_CONFIG[key];
        const thisWeek = latest ? teamTotal(latest, key) : 0;
        const prevWeek = prev ? teamTotal(prev, key) : 0;
        const cumulative = data.reduce((s, w) => s + teamTotal(w, key), 0);
        const diff = prev ? thisWeek - prevWeek : 0;

        return (
          <div
            key={key}
            className="bg-white rounded-2xl shadow-sm p-5 border-l-4"
            style={{ borderColor: cfg.color }}
          >
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
              {cfg.label} Team
            </p>
            <p className="text-3xl font-bold text-gray-800">{thisWeek}건</p>
            <p className="text-xs text-gray-400 mt-1">이번 주 합계</p>

            {/* 카테고리별 세부 */}
            <div className="mt-2 space-y-0.5">
              {cfg.categories.map((cat) => (
                <p key={cat.key as string} className="text-xs text-gray-400">
                  <span style={{ color: cat.color }} className="font-medium">
                    {cat.label}
                  </span>{" "}
                  {latest ? (latest[cat.key] as number) ?? 0 : 0}건
                </p>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>누적 {cumulative}건</span>
              {diff !== 0 && (
                <span
                  className={`font-semibold ${diff > 0 ? "text-emerald-500" : "text-red-400"}`}
                >
                  {diff > 0 ? `+${diff}` : diff} 전주 대비
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
