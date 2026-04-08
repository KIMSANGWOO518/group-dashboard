import Link from "next/link";
import { getAllWeeks } from "@/lib/kv";
import StatsCards from "@/components/StatsCards";
import DashboardCharts from "@/components/DashboardCharts";
import { TEAM_CONFIG, TeamKey, teamTotal } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const weeks = await getAllWeeks();
  const latest = weeks[weeks.length - 1];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/inavi_logo2.png"
              alt="iNavi 로고"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">공간플랫폼개발그룹</h1>
              <p className="text-xs text-gray-400">Poi · Display · Dynamic 팀 작업현황</p>
            </div>
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

        {/* 팀별 파이차트 + 클릭 시 상세 혼합 차트 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            팀별 작업 비율
          </h2>
          {weeks.length > 0 ? (
            <DashboardCharts data={weeks} />
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

        {/* 상세 데이터 테이블 */}
        {weeks.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              상세 데이터
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3" rowSpan={2}>주차</th>
                    {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((tk) => (
                      <th
                        key={tk}
                        colSpan={TEAM_CONFIG[tk].categories.length + 1}
                        className="text-center px-3 py-2 border-l border-slate-200"
                        style={{ color: TEAM_CONFIG[tk].color }}
                      >
                        {TEAM_CONFIG[tk].label}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 border-l border-slate-200 text-gray-400">
                      총합
                    </th>
                  </tr>
                  <tr className="border-t border-slate-100">
                    {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((tk) => (
                      <>
                        {TEAM_CONFIG[tk].categories.map((cat) => (
                          <th
                            key={cat.key as string}
                            className="text-center px-3 py-2 border-l border-slate-100 font-normal text-gray-400"
                          >
                            {cat.label}
                          </th>
                        ))}
                        <th
                          className="text-center px-3 py-2 border-l border-slate-100 font-semibold"
                          style={{ color: TEAM_CONFIG[tk].color }}
                        >
                          소계
                        </th>
                      </>
                    ))}
                    <th className="border-l border-slate-200" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...weeks].reverse().map((w) => {
                    const grandTotal = (Object.keys(TEAM_CONFIG) as TeamKey[]).reduce(
                      (s, tk) => s + teamTotal(w, tk),
                      0
                    );
                    return (
                      <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 text-gray-700 font-medium whitespace-nowrap">
                          {w.label}
                        </td>
                        {(Object.keys(TEAM_CONFIG) as TeamKey[]).map((tk) => (
                          <>
                            {TEAM_CONFIG[tk].categories.map((cat) => (
                              <td
                                key={cat.key as string}
                                className="px-3 py-3 text-center text-gray-500 border-l border-slate-50"
                              >
                                {(w[cat.key] as number) ?? 0}
                              </td>
                            ))}
                            <td
                              className="px-3 py-3 text-center font-semibold border-l border-slate-100"
                              style={{ color: TEAM_CONFIG[tk].color }}
                            >
                              {teamTotal(w, tk)}
                            </td>
                          </>
                        ))}
                        <td className="px-4 py-3 text-center font-bold text-gray-700 border-l border-slate-200">
                          {grandTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
