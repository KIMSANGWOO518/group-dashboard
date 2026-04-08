export interface WeekEntry {
  id: string;       // "2024-W15"
  label: string;    // "2024년 15주차"
  date: string;     // "2024-04-08" (해당 주 월요일)
  poi: number;
  display: number;
  dynamic: number;
}

export type TeamKey = "poi" | "display" | "dynamic";

export const TEAM_CONFIG: Record<TeamKey, { label: string; color: string }> = {
  poi: { label: "Poi", color: "#6366f1" },
  display: { label: "Display", color: "#10b981" },
  dynamic: { label: "Dynamic", color: "#f59e0b" },
};
