import { getList } from "@/lib/content";
import CountUp from "./CountUp";

export default async function StatTiles() {
  // 관리자 『목록 관리 → 숫자 타일』에서 고친다
  const stats = await getList("stats");

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-3">
      {stats.map((s, i) => {
        const num = Number(s.f1);
        return (
          <div
            key={`${s.f1}-${s.f3}`}
            className="bg-n-0 px-6 py-8"
            data-reveal
            style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
          >
            <dd className="flex items-baseline gap-1">
              <span className="tnum text-4xl font-bold text-accent-600">
                {Number.isFinite(num) && s.f1.trim() !== "" ? <CountUp to={num} /> : s.f1}
              </span>
              <span className="text-lg font-medium text-n-600">{s.f2}</span>
            </dd>
            <dt className="mt-2 text-sm text-n-600">{s.f3}</dt>
          </div>
        );
      })}
    </dl>
  );
}
