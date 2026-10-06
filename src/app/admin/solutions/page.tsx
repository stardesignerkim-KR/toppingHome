"use client";

import { useCallback, useEffect, useState } from "react";
import { api, deleteMany } from "@/lib/admin-api";
import { useSelection } from "@/lib/use-selection";
import BulkBar from "@/components/admin/BulkBar";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type Solution = {
  solution_id: string;
  solution_title: string;
  solution_body: string;
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

export default function SolutionsAdminPage() {
  const [items, setItems] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const sel = useSelection();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Solution>({
    solution_id: "",
    solution_title: "",
    solution_body: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api<Solution[]>("/api/admin/solutions"));
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (id: string, field: keyof Solution, value: string) =>
    setItems((prev) => prev.map((s) => (s.solution_id === id ? { ...s, [field]: value } : s)));

  const save = async (s: Solution) => {
    setBusy(s.solution_id);
    setNotice(null);
    try {
      await api("/api/admin/solutions", { method: "PUT", body: JSON.stringify(s) });
      setNotice({ type: "ok", text: `${s.solution_title} 저장 완료` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const remove = async (s: Solution) => {
    if (!confirm(`'${s.solution_title}' 을(를) 삭제합니다.`)) return;
    setBusy(s.solution_id);
    try {
      await api(`/api/admin/solutions?id=${encodeURIComponent(s.solution_id)}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((x) => x.solution_id !== s.solution_id));
      setNotice({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `삭제 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const visibleIds = items.map((s) => s.solution_id);
  const isAllChecked = visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));

  const bulkDelete = async () => {
    const targets = items.filter((s) => sel.has(s.solution_id));
    if (targets.length === 0) return;
    if (!confirm(`선택한 솔루션 ${targets.length}건을 삭제합니다. 되돌릴 수 없습니다.`)) return;
    setBulkBusy(true);
    setNotice(null);
    try {
      const { ok, failed } = await deleteMany(
        targets.map((s) => `/api/admin/solutions?id=${encodeURIComponent(s.solution_id)}`)
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
    if (!draft.solution_id.trim() || !draft.solution_title.trim()) {
      setNotice({ type: "error", text: "id 와 제목은 필수입니다." });
      return;
    }
    setBusy("__new");
    try {
      await api("/api/admin/solutions", { method: "POST", body: JSON.stringify(draft) });
      setDraft({ solution_id: "", solution_title: "", solution_body: "" });
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
      <PageHead title="솔루션 관리" count={items.length}>
        <button onClick={() => setAdding((v) => !v)}
          className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          {adding ? "닫기" : "+ 등록"}
        </button>
        <button onClick={load} className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          새로고침
        </button>
      </PageHead>

      <Notice state={notice} />

      {adding && (
        <div className="mb-8 grid gap-3 rounded-lg border border-n-100 bg-n-25 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="id (영문, 예: nexacro)" value={draft.solution_id}
              onChange={(e) => setDraft({ ...draft, solution_id: e.target.value })} className={INPUT} />
            <input placeholder="제목" value={draft.solution_title}
              onChange={(e) => setDraft({ ...draft, solution_title: e.target.value })} className={INPUT} />
          </div>
          <textarea placeholder="설명" rows={3} value={draft.solution_body}
            onChange={(e) => setDraft({ ...draft, solution_body: e.target.value })} className={INPUT} />
          <button onClick={add} disabled={busy === "__new"}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}>등록</button>
        </div>
      )}

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
        <ul className="space-y-4">
          {items.map((s) => (
            <li
              key={s.solution_id}
              className={`rounded-lg border bg-n-0 p-5 ${
                sel.has(s.solution_id) ? "border-accent-400 ring-1 ring-accent-200" : "border-n-100"
              }`}
            >
              <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-n-600">
                <input
                  type="checkbox"
                  checked={sel.has(s.solution_id)}
                  onChange={() => sel.toggle(s.solution_id)}
                  className="h-4 w-4 accent-[var(--color-accent-600)]"
                />
                선택
              </label>
              <input value={s.solution_title}
                onChange={(e) => patch(s.solution_id, "solution_title", e.target.value)}
                className={`${INPUT} mb-2 font-semibold`} />
              <textarea value={s.solution_body} rows={4}
                onChange={(e) => patch(s.solution_id, "solution_body", e.target.value)}
                className={INPUT} />
              <div className="mt-3 flex items-center gap-2">
                <p className="text-xs text-n-400">{s.solution_id}</p>
                <button onClick={() => save(s)} disabled={busy === s.solution_id}
                  className={`${BTN} ml-auto bg-accent-600 text-white hover:bg-accent-700`}>저장</button>
                <button onClick={() => remove(s)} disabled={busy === s.solution_id}
                  className={`${BTN} border border-danger text-danger hover:bg-red-50`}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
}
