"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WeekEntry, TEAM_CONFIG, TeamKey } from "@/lib/types";
import { format, startOfWeek, getISOWeek, getYear } from "date-fns";

function getWeekId(date: Date): string {
  const week = getISOWeek(date);
  const year = getYear(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function getWeekLabel(date: Date): string {
  const week = getISOWeek(date);
  const year = getYear(date);
  return `${year}년 ${week}주차`;
}

export default function AdminPage() {
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // form state
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [selectedDate, setSelectedDate] = useState(format(monday, "yyyy-MM-dd"));
  const [counts, setCounts] = useState<Record<TeamKey, string>>({
    poi: "",
    display: "",
    dynamic: "",
  });

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/data");
    const data: WeekEntry[] = await res.json();
    setWeeks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const date = new Date(selectedDate);
    const entry: WeekEntry = {
      id: getWeekId(date),
      label: getWeekLabel(date),
      date: selectedDate,
      poi: Number(counts.poi) || 0,
      display: Number(counts.display) || 0,
      dynamic: Number(counts.dynamic) || 0,
    };

    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("저장 실패");
      setMessage({ type: "ok", text: `${entry.label} 데이터가 저장되었습니다.` });
      setCounts({ poi: "", display: "", dynamic: "" });
      fetchData();
    } catch {
      setMessage({ type: "err", text: "저장 중 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 데이터를 삭제하시겠습니까?")) return;
    await fetch("/api/data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">데이터 입력</h1>
            <p className="text-xs text-gray-400">주차별 팀 작업건수를 입력합니다</p>
          </div>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            대시보드로
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">주차 데이터 입력</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">해당 주 날짜 (월요일 기준)</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {selectedDate && (
                <p className="text-xs text-indigo-500 mt-1">
                  → {getWeekLabel(new Date(selectedDate))} ({getWeekId(new Date(selectedDate))})
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((key) => (
                <div key={key}>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: TEAM_CONFIG[key].color }}
                  >
                    {TEAM_CONFIG[key].label} 팀
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="건수"
                    value={counts[key]}
                    onChange={(e) =>
                      setCounts((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
            </div>

            {message && (
              <p
                className={`text-xs px-3 py-2 rounded-lg ${
                  message.type === "ok"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </form>
        </div>

        {/* 기존 데이터 목록 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">저장된 데이터</h2>
          {loading ? (
            <p className="text-xs text-gray-400">불러오는 중...</p>
          ) : weeks.length === 0 ? (
            <p className="text-xs text-gray-400">아직 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {[...weeks].reverse().map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{w.label}</p>
                    <p className="text-xs text-gray-400">
                      Poi {w.poi} · Display {w.display} · Dynamic {w.dynamic}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
