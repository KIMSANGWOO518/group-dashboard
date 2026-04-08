"use client";

import { useState } from "react";
import { WeekEntry, TeamKey } from "@/lib/types";
import TeamPieCharts from "./TeamPieChart";
import TeamDetailChart from "./TeamDetailChart";

interface Props {
  data: WeekEntry[];
}

export default function DashboardCharts({ data }: Props) {
  const [selectedTeam, setSelectedTeam] = useState<TeamKey | null>(null);

  function handleTeamClick(team: TeamKey) {
    setSelectedTeam((prev) => (prev === team ? null : team));
  }

  return (
    <>
      {/* 파이차트 3개 */}
      <TeamPieCharts
        data={data}
        selectedTeam={selectedTeam}
        onTeamClick={handleTeamClick}
      />

      {/* 선택된 팀 상세 차트 */}
      {selectedTeam && (
        <div className="mt-4 animate-fade-in">
          <TeamDetailChart data={data} teamKey={selectedTeam} />
        </div>
      )}

      {/* 선택 안 됐을 때 안내 */}
      {!selectedTeam && data.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-3">
          파이차트를 클릭하면 팀별 항목 추이를 확인할 수 있습니다.
        </p>
      )}
    </>
  );
}
