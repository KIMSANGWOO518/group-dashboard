import Link from "next/link";
import { getAllWeeks } from "@/lib/kv";
import StatsCards from "@/components/StatsCards";
import TeamPieChart from "@/components/TeamPieChart";
import WeeklyLineChart from "@/components/WeeklyLineChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const weeks = await getAllWeeks();

  const latest = weeks[weeks.length - 1];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">공간플랫폼개발그룹</h1>
            <p className="text-xs text-gray-400">Poi · Display · Dynamic 팀 작업현황</p>
          </div>
          <div className="flex items-center gap-4">
            {latest && (
              <span className="text-xs text-gray-400">
                최근 업데이트: {latest.label}
              </span>
            )}
            <Link
              href="/admin"
              className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              데이터 입력
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* 이번 주 요약 카드 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            이번 주 요약
          </h2>
          <StatsCards data={weeks} />
        </section>

        {/* 파이차트 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            작업 비율
          </h2>
          {weeks.length > 0 ? (
            <TeamPieChart data={weeks} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
              데이터가 없습니다.{" "}
              <Link href="/admin" className="text-indigo-500 underline">
                관리자 페이지
              </Link>
              에서 입력해주세요.
            </div>
          )}
        </section>

        {/* 라인차트 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            주차별 추이
          </h2>
          <WeeklyLineChart data={weeks} />
        </section>

        {/* 데이터 테이블 */}
        {weeks.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              상세 데이터
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-6 py-3">주차</th>
                    <th className="text-center px-4 py-3 text-indigo-500">Poi</th>
                    <th className="text-center px-4 py-3 text-emerald-500">Display</th>
                    <th className="text-center px-4 py-3 text-amber-500">Dynamic</th>
                    <th className="text-center px-4 py-3 text-gray-500">합계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...weeks].reverse().map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-gray-700 font-medium">{w.label}</td>
                      <td className="px-4 py-3 text-center text-indigo-600 font-semibold">{w.poi}</td>
                      <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{w.display}</td>
                      <td className="px-4 py-3 text-center text-amber-600 font-semibold">{w.dynamic}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{w.poi + w.display + w.dynamic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
