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

function SingleTeamPie({ teamKey, data }: { teamKey: TeamKey; data: WeekEntry[] }) {
  const cfg = TEAM_CONFIG[teamKey];

  const pieData = cfg.categories.map((cat) => ({
    name: cat.label,
    value: data.reduce((s, w) => s + ((w[cat.key] as number) ?? 0), 0),
    color: cat.color,
  }));

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
      <div className="mb-1">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-2">누적 총 {total}건</p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(1)}%`
            }
            labelLine={true}
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}건`, name]}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* 카테고리별 수치 */}
      <div className="mt-2 space-y-1">
        {pieData.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-gray-600">{d.name}</span>
            </span>
            <span className="font-semibold text-gray-700">{d.value}건</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamPieCharts({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => (
        <SingleTeamPie key={key} teamKey={key} data={data} />
      ))}
    </div>
  );
}
