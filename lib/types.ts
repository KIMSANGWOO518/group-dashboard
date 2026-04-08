export interface WeekEntry {
  id: string;     // "2025-W15"
  label: string;  // "2025년 15주차"
  date: string;   // "2025-04-07" (해당 주 월요일)
  // Poi 팀
  poi_poi: number;   // Poi
  poi_voc: number;   // Voc
  // Display 팀
  display_roadwidth: number;  // 도로폭
  display_outerline: number;  // 외곽차선
  // Dynamic 팀
  dynamic_road: number;    // 도로
  dynamic_traffic: number; // 교통
}

export interface CategoryConfig {
  key: keyof WeekEntry;
  label: string;
  color: string;
}

export interface TeamConfig {
  label: string;
  color: string;
  categories: CategoryConfig[];
}

export type TeamKey = "poi" | "display" | "dynamic";

export const TEAM_CONFIG: Record<TeamKey, TeamConfig> = {
  poi: {
    label: "Poi",
    color: "#6366f1",
    categories: [
      { key: "poi_poi", label: "Poi", color: "#6366f1" },
      { key: "poi_voc", label: "Voc", color: "#a5b4fc" },
    ],
  },
  display: {
    label: "Display",
    color: "#10b981",
    categories: [
      { key: "display_roadwidth", label: "도로폭", color: "#10b981" },
      { key: "display_outerline", label: "외곽차선", color: "#6ee7b7" },
    ],
  },
  dynamic: {
    label: "Dynamic",
    color: "#f59e0b",
    categories: [
      { key: "dynamic_road", label: "도로", color: "#f59e0b" },
      { key: "dynamic_traffic", label: "교통", color: "#fcd34d" },
    ],
  },
};

/** 팀의 이번 주 합계 */
export function teamTotal(entry: WeekEntry, team: TeamKey): number {
  return TEAM_CONFIG[team].categories.reduce(
    (s, c) => s + ((entry[c.key] as number) ?? 0),
    0
  );
}
