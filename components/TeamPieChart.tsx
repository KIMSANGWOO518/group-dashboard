"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WeekEntry, TEAM_CONFIG, TeamKey } from "@/lib/types";

interface Props {
  data: WeekEntry[];
}

export default function TeamPieChart({ data }: Props) {
  if (data.length === 0) return null;

  // 전체 누적 합산
  const totals = {
    poi: data.reduce((s, w) => s + w.poi, 0),
    display: data.reduce((s, w) => s + w.display, 0),
    dynamic: data.reduce((s, w) => s + w.dynamic, 0),
  };

  const pieData = (Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => ({
    name: TEAM_CONFIG[key].label,
    value: totals[key],
    color: TEAM_CONFIG[key].color,
  }));

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 mb-1">팀별 누적 작업 비율</h2>
      <p className="text-xs text-gray-400 mb-4">전체 기간 합산 · 총 {total}건</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(1)}%`
            }
            labelLine={true}
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}건`, name]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
