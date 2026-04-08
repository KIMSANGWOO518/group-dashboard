"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WeekEntry, TEAM_CONFIG, TeamKey, teamTotal } from "@/lib/types";

interface Props {
  data: WeekEntry[];
  teamKey: TeamKey;
}

export default function TeamDetailChart({ data, teamKey }: Props) {
  const cfg = TEAM_CONFIG[teamKey];

  const chartData = data.map((w) => {
    const row: Record<string, string | number> = { name: w.label };
    cfg.categories.forEach((cat) => {
      row[cat.label] = (w[cat.key] as number) ?? 0;
    });
    row["합계"] = teamTotal(w, teamKey);
    return row;
  });

  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300"
      style={{ borderTop: `3px solid ${cfg.color}` }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.label}
        </span>
        <h2 className="text-base font-semibold text-gray-700">
          주차별 항목 추이
        </h2>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        막대: 항목별 건수 &nbsp;·&nbsp; 선: 주간 합계
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [`${value}건`, name]}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />

          {/* 카테고리별 막대 */}
          {cfg.categories.map((cat) => (
            <Bar
              key={cat.key as string}
              dataKey={cat.label}
              fill={cat.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          ))}

          {/* 합계 꺾은선 */}
          <Line
            type="monotone"
            dataKey="합계"
            stroke={cfg.color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: cfg.color, stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            strokeDasharray="0"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
