"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, deleteMany, INDUSTRIES } from "@/lib/admin-api";
import { useSelection } from "@/lib/use-selection";
import BulkBar from "@/components/admin/BulkBar";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type Work = {
  id: number;
  client_name: string;
  system_name: string;
  industry: string;
  tags: string[] | null;
  thumbnail_url?: string | null;
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

export default function WorksAdminPage() {
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState<number | "new" | "">("");
  const [filter, setFilter] = useState("전체");
  const [q, setQ] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const sel = useSelection();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    client_name: "",
    system_name: "",
    industry: "공공",
    tags: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Work[]>("/api/admin/works");
      setItems([...data].sort((a, b) => a.id - b.id));
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(
    () =>
      items.filter(
        (w) =>
          (filter === "전체" || w.industry === filter) &&
          (q.trim() === "" ||
            `${w.client_name} ${w.system_name}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [items, filter, q]
  );

  const patch = (id: number, field: keyof Work, value: string) =>
    setItems((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)));

  const save = async (w: Work) => {
    setBusy(w.id);
    setNotice(null);
    try {
      await api("/api/admin/works", { method: "PUT", body: JSON.stringify(w) });
      setNotice({ type: "ok", text: `${w.client_name} 저장 완료` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const remove = async (w: Work) => {
    if (!confirm(`'${w.client_name} — ${w.system_name}' 을(를) 삭제합니다.`)) return;
    setBusy(w.id);
    try {
      await api(`/api/admin/works?id=${w.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== w.id));
      setNotice({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `삭제 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const visibleIds = shown.map((w) => w.id);
  const isAllChecked = visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));

  const bulkDelete = async () => {
    const targets = shown.filter((w) => sel.has(w.id));
    if (targets.length === 0) return;
    if (!confirm(`선택한 실적 ${targets.length}건을 삭제합니다. 되돌릴 수 없습니다.`)) return;
    setBulkBusy(true);
    setNotice(null);
    try {
      const { ok, failed } = await deleteMany(
        targets.map((w) => `/api/admin/works?id=${w.id}`)
      );
      await load();
      sel.clear();
      setNotice(
        failed.length
          ? { type: "error", text: `${ok}건 삭제, ${failed.length}건 실패 — ${failed[0].error}` }
          : { type: "ok", text: `${ok}건 삭제되었습니다.` }
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const add = async () => {
    if (!draft.client_name.trim() || !draft.system_name.trim()) {
      setNotice({ type: "error", text: "발주처와 시스템명은 필수입니다." });
      return;
    }
    setBusy("new");
    try {
      await api("/api/admin/works", {
        method: "POST",
        body: JSON.stringify({
          client_name: draft.client_name,
          system_name: draft.system_name,
          industry: draft.industry,
          tags: draft.tags
            ? draft.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        }),
      });
      setDraft({ client_name: "", system_name: "", industry: "공공", tags: "" });
      setAdding(false);
      await load();
      setNotice({ type: "ok", text: "등록되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `등록 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  return (
    <div>
      <PageHead title="실적 관리" count={items.length}>
        <button
          onClick={() => setAdding((v) => !v)}
          className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
        >
          {adding ? "닫기" : "+ 등록"}
        </button>
        <button
          onClick={load}
          className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
        >
          새로고침
        </button>
      </PageHead>

      <Notice state={notice} />

      {adding && (
        <div className="mb-8 grid gap-3 rounded-lg border border-n-100 bg-n-25 p-5 sm:grid-cols-5">
          <input
            placeholder="발주처"
            value={draft.client_name}
            onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
            className={INPUT}
          />
          <input
            placeholder="시스템명"
            value={draft.system_name}
            onChange={(e) => setDraft({ ...draft, system_name: e.target.value })}
            className={`${INPUT} sm:col-span-2`}
          />
          <select
            value={draft.industry}
            onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
            className={INPUT}
          >
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
          <button
            onClick={add}
            disabled={busy === "new"}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
          >
            등록
          </button>
        </div>
      )}

      {/* 조회 영역 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["전체", ...INDUSTRIES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === f
                ? "bg-accent-100 font-medium text-accent-900"
                : "bg-n-50 text-n-600 hover:bg-n-100"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          placeholder="검색 (발주처 · 시스템명)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${INPUT} ml-auto max-w-xs`}
        />
      </div>

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="rounded-md border border-n-100 bg-n-25 px-4 py-6 text-center text-n-600">
          데이터가 없습니다. 대시보드에서 <strong>초기 데이터 넣기</strong>를 먼저 실행하세요.
        </p>
      ) : (
        <>
          <BulkBar
            visibleIds={visibleIds}
            selectedCount={sel.count}
            isAllChecked={isAllChecked}
            onToggleAll={() => sel.toggleAll(visibleIds)}
            onClear={sel.clear}
            onDelete={bulkDelete}
            busy={bulkBusy}
          />
          <p className="mb-2 text-sm text-n-400 tnum">{shown.length}건</p>
          <div className="overflow-hidden rounded-lg border border-n-100">
            <table className="w-full text-sm">
              <thead className="bg-n-50 text-left text-n-600">
                <tr>
                  <th className="w-10 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={() => sel.toggleAll(visibleIds)}
                      aria-label="전체 선택"
                      className="h-4 w-4 accent-[var(--color-accent-600)]"
                    />
                  </th>
                  <th className="w-44 px-3 py-2 font-medium">발주처</th>
                  <th className="px-3 py-2 font-medium">시스템명</th>
                  <th className="w-40 px-3 py-2 font-medium">산업</th>
                  <th className="w-36 px-3 py-2 font-medium">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-n-100 bg-n-0">
                {shown.map((w) => (
                  <tr key={w.id} className={sel.has(w.id) ? "bg-accent-50" : ""}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={sel.has(w.id)}
                        onChange={() => sel.toggle(w.id)}
                        aria-label={`${w.client_name} 선택`}
                        className="h-4 w-4 accent-[var(--color-accent-600)]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={w.client_name}
                        onChange={(e) => patch(w.id, "client_name", e.target.value)}
                        className={INPUT}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={w.system_name}
                        onChange={(e) => patch(w.id, "system_name", e.target.value)}
                        className={INPUT}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={w.industry}
                        onChange={(e) => patch(w.id, "industry", e.target.value)}
                        className={INPUT}
                      >
                        {INDUSTRIES.map((i) => (
                          <option key={i}>{i}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => save(w)}
                          disabled={busy === w.id}
                          className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
                        >
                          저장
                        </button>
                        <button
                          onClick={() => remove(w)}
                          disabled={busy === w.id}
                          className={`${BTN} border border-danger text-danger hover:bg-red-50`}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
