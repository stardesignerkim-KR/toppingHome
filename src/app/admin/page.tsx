"use client";

import { useCallback, useEffect, useState } from "react";

type TableHealth = {
  table: string;
  label: string;
  optional?: boolean;
  ok: boolean;
  count: number | null;
  error: string | null;
};

type Health = {
  checkedAt: string;
  summary: { total: number; missing: number; empty: number; healthy: number };
  tables: TableHealth[];
  env: Record<string, boolean>;
};

type SeedStep = { name: string; inserted: number; error: string | null };

const BTN =
  "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

export default function AdminDashboard() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "seed">("");
  const [log, setLog] = useState<string[]>([]);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setHealth(json);
    } catch (e) {
      setLog((l) => [`점검 실패 — ${(e as Error).message}`, ...l]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const handleSeed = async () => {
    setBusy("seed");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const json = await res.json();
      const lines = (json.steps as SeedStep[]).map((s) =>
        s.error ? `✕ ${s.name} — ${s.error}` : `✓ ${s.name} — ${s.inserted}건`
      );
      setLog((l) => [...lines, ...l]);
      await check();
    } catch (e) {
      setLog((l) => [`초기 데이터 실패 — ${(e as Error).message}`, ...l]);
    } finally {
      setBusy("");
    }
  };

  const s = health?.summary;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-n-900">대시보드</h1>
        <div className="flex gap-2">
          <button
            onClick={check}
            disabled={loading}
            className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
          >
            {loading ? "점검 중…" : "다시 점검"}
          </button>
          <button
            onClick={handleSeed}
            disabled={busy === "seed"}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
          >
            {busy === "seed" ? "넣는 중…" : "초기 데이터 넣기"}
          </button>
        </div>
      </div>

      {/* 요약 */}
      {s && (
        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-4">
          {[
            { label: "전체 테이블", value: s.total, tone: "text-n-900" },
            { label: "정상", value: s.healthy, tone: "text-success" },
            { label: "비어 있음", value: s.empty, tone: "text-warning" },
            { label: "없음 / 오류", value: s.missing, tone: "text-danger" },
          ].map((t) => (
            <div key={t.label} className="bg-n-0 px-5 py-4">
              <p className={`tnum text-2xl font-bold ${t.tone}`}>{t.value}</p>
              <p className="mt-1 text-sm text-n-600">{t.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* 테이블 점검 결과 */}
      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-n-900">데이터베이스 점검</h2>
        <div className="overflow-hidden rounded-lg border border-n-100">
          <table className="w-full text-sm">
            <thead className="bg-n-50 text-left text-n-600">
              <tr>
                <th className="px-4 py-2 font-medium">테이블</th>
                <th className="px-4 py-2 font-medium">행 수</th>
                <th className="px-4 py-2 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-n-100 bg-n-0">
              {(health?.tables ?? []).map((t) => (
                <tr key={t.table}>
                  <td className="px-4 py-2">
                    <span className="font-medium text-n-900">{t.label}</span>
                    <span className="ml-2 text-xs text-n-400">{t.table}</span>
                  </td>
                  <td className="tnum px-4 py-2 text-n-800">
                    {t.count === null ? "—" : t.count}
                  </td>
                  <td className="px-4 py-2">
                    {!t.ok ? (
                      <span className="text-danger">✕ {t.error}</span>
                    ) : t.count === 0 && t.optional ? (
                      <span className="text-n-400">— 비어 있음 (정상)</span>
                    ) : t.count === 0 ? (
                      <span className="text-warning">⚠ 비어 있음</span>
                    ) : (
                      <span className="text-success">✓ 정상</span>
                    )}
                  </td>
                </tr>
              ))}
              {!health && !loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-n-400">
                    점검 결과가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(health?.summary.missing ?? 0) > 0 && (
          <p className="mt-3 rounded-md border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
            없는 테이블이 있습니다. 아래 『설치 SQL 보기』를 눌러 내용을 복사한 뒤,
            Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
          </p>
        )}
        <SetupSql />
      </section>

      {/* 환경변수 */}
      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-n-900">환경변수</h2>
        <ul className="flex flex-wrap gap-2">
          {Object.entries(health?.env ?? {}).map(([k, v]) => (
            <li
              key={k}
              className={`rounded-full px-3 py-1 text-xs ${
                v ? "bg-n-50 text-n-600" : "bg-red-50 text-danger"
              }`}
            >
              {v ? "✓" : "✕"} {k}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-n-400">
          이미지는 Supabase Storage(media 버킷)에 올라갑니다. NEXT_PUBLIC_SITE_URL 은 sitemap·OG 태그에 쓰입니다.
        </p>
      </section>

      {/* 실행 로그 */}
      {log.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-n-900">실행 로그</h2>
          <pre className="max-h-64 overflow-auto rounded-lg border border-n-100 bg-n-50 p-4 text-xs leading-relaxed text-n-800">
            {log.join("\n")}
          </pre>
        </section>
      )}
    </div>
  );
}

/**
 * 설치 SQL 을 화면에서 바로 복사할 수 있게 보여 준다.
 * 개발자가 아닌 사람이 소스 파일을 열어 볼 일은 없다.
 */
function SetupSql() {
  const [sql, setSql] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const show = async () => {
    setOpen((v) => !v);
    if (sql) return;
    try {
      const res = await fetch("/api/admin/setup");
      const text = await res.text();
      // JSON 으로 감싸 오면 sql 필드를 꺼낸다
      try {
        const j = JSON.parse(text);
        setSql(typeof j?.sql === "string" ? j.sql : text);
      } catch {
        setSql(text);
      }
    } catch (e) {
      setSql(`불러오기 실패 — ${(e as Error).message}`);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={show}
        className="rounded-md border border-n-200 px-4 py-2 text-sm font-medium text-n-800 hover:border-n-400"
      >
        {open ? "설치 SQL 닫기" : "설치 SQL 보기"}
      </button>

      {open && (
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                if (!sql) return;
                await navigator.clipboard.writeText(sql);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded-md bg-accent-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-700"
            >
              {copied ? "복사됨" : "전체 복사"}
            </button>
            <span className="text-xs text-n-400">
              Supabase → SQL Editor → 붙여넣기 → Run
            </span>
          </div>
          <pre className="max-h-80 overflow-auto rounded-md border border-n-100 bg-n-25 p-4 text-xs leading-relaxed text-n-800">
            {sql ?? "불러오는 중…"}
          </pre>
        </div>
      )}
    </div>
  );
}
