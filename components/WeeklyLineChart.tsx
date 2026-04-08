"use client";

import {
  LineChart,
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
}

export default function WeeklyLineChart({ data }: Props) {
  if (data.length === 0)
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-72 text-gray-400 text-sm">
        데이터가 없습니다. 관리자 페이지에서 입력해주세요.
      </div>
    );

  const chartData = data.map((w) => ({
    name: w.label,
    Poi: teamTotal(w, "poi"),
    Display: teamTotal(w, "display"),
    Dynamic: teamTotal(w, "dynamic"),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 mb-1">주차별 작업건수 추이</h2>
      <p className="text-xs text-gray-400 mb-4">팀별 주간 작업건수 합계 비교</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            formatter={(value: number, name: string) => [`${value}건`, name]}
          />
          <Legend />
          {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={TEAM_CONFIG[key].label}
              stroke={TEAM_CONFIG[key].color}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
