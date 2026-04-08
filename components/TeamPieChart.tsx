"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { WeekEntry, TEAM_CONFIG, TeamKey } from "@/lib/types";

interface Props {
  data: WeekEntry[];
  selectedTeam: TeamKey | null;
  onTeamClick: (team: TeamKey) => void;
}

function CenterLabel({ total, color }: { total: number; color: string }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.3em" fontSize="22" fontWeight="700" fill={color}>
        {total}
      </tspan>
      <tspan x="50%" dy="1.4em" fontSize="11" fill="#94a3b8">
        건
      </tspan>
    </text>
  );
}

function SingleTeamPie({
  teamKey,
  data,
  isSelected,
  onClick,
}: {
  teamKey: TeamKey;
  data: WeekEntry[];
  isSelected: boolean;
  onClick: () => void;
}) {
  const cfg = TEAM_CONFIG[teamKey];

  const pieData = cfg.categories.map((cat) => ({
    name: cat.label,
    value: data.reduce((s, w) => s + ((w[cat.key] as number) ?? 0), 0),
    color: cat.color,
  }));

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div
      onClick={onClick}
      className={[
        "bg-white rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200",
        isSelected
          ? "ring-2 shadow-md"
          : "shadow-sm hover:shadow-md hover:-translate-y-0.5",
      ].join(" ")}
      style={isSelected ? { boxShadow: `0 0 0 2px ${cfg.color}` } : {}}
    >
      {/* 팀 뱃지 + 클릭 힌트 */}
      <div className="mb-1 flex items-center justify-between">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.label}
        </span>
        <span className="text-xs text-gray-300">
          {isSelected ? "▲ 닫기" : "클릭 → 상세"}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">누적 총 {total}건</p>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={true}
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value}건 (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              fontSize: "12px",
            }}
          />
          <CenterLabel total={total} color={cfg.color} />
        </PieChart>
      </ResponsiveContainer>

      {/* 카테고리별 범례 */}
      <div className="mt-4 space-y-2">
        {pieData.map((d) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-gray-600 font-medium">{d.name}</span>
                </span>
                <span className="text-gray-700 font-semibold">
                  {d.value}건
                  <span className="text-gray-400 font-normal ml-1">({pct}%)</span>
                </span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamPieCharts({ data, selectedTeam, onTeamClick }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => (
        <SingleTeamPie
          key={key}
          teamKey={key}
          data={data}
          isSelected={selectedTeam === key}
          onClick={() => onTeamClick(key)}
        />
      ))}
    </div>
  );
}
