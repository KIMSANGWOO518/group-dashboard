"use client";

import { WeekEntry, TEAM_CONFIG, TeamKey } from "@/lib/types";

interface Props {
  data: WeekEntry[];
}

export default function StatsCards({ data }: Props) {
  const latest = data[data.length - 1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => {
        const cfg = TEAM_CONFIG[key];
        const total = data.reduce((s, w) => s + w[key], 0);
        const thisWeek = latest ? latest[key] : 0;
        const prev = data[data.length - 2];
        const diff = prev ? thisWeek - prev[key] : 0;

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
            <p className="text-xs text-gray-400 mt-1">이번 주</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>누적 {total}건</span>
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
