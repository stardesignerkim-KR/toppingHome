"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, deleteMany } from "@/lib/admin-api";
import { useSelection } from "@/lib/use-selection";
import BulkBar from "@/components/admin/BulkBar";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type Inquiry = {
  id: number;
  name: string;
  company: string | null;
  position: string | null;
  email: string;
  phone: string | null;
  inquiry_type: string | null;
  message: string;
  status: string;
  memo: string | null;
  created_at: string;
};

const STATUS = ["new", "doing", "done"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  doing: "응대중",
  done: "종결",
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

export default function InquiriesAdminPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState<number | "new" | "">("");
  const [filter, setFilter] = useState("전체");
  const [openId, setOpenId] = useState<number | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const sel = useSelection();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    name: "", company: "", email: "", phone: "", type: "전화 문의", message: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api<Inquiry[]>("/api/admin/inquiries"));
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
    () => (filter === "전체" ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );
  const newCount = items.filter((i) => i.status === "new").length;

  const patch = (id: number, field: keyof Inquiry, value: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const save = async (i: Inquiry) => {
    setBusy(i.id);
    try {
      await api("/api/admin/inquiries", {
        method: "PUT",
        body: JSON.stringify({ id: i.id, status: i.status, memo: i.memo }),
      });
      setNotice({ type: "ok", text: "저장되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const remove = async (i: Inquiry) => {
    if (
      !confirm(
        `'${i.name}' 님의 문의를 삭제합니다.\n개인정보가 함께 삭제되며 되돌릴 수 없습니다.`
      )
    )
      return;
    setBusy(i.id);
    try {
      await api(`/api/admin/inquiries?id=${i.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== i.id));
      setOpenId(null);
      setNotice({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `삭제 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const addManual = async () => {
    if (!draft.name.trim() || !draft.message.trim()) {
      setNotice({ type: "error", text: "이름과 내용은 필수입니다." });
      return;
    }
    setBusy("new");
    try {
      await api("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          email: draft.email.trim() || "no-email@internal.local",
          agree: true,
        }),
      });
      setDraft({ name: "", company: "", email: "", phone: "", type: "전화 문의", message: "" });
      setAdding(false);
      await load();
      setNotice({ type: "ok", text: "등록되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `등록 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const visibleIds = shown.map((i) => i.id);
  const isAllChecked = visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));

  const bulkDelete = async () => {
    const targets = shown.filter((i) => sel.has(i.id));
    if (targets.length === 0) return;
    if (
      !confirm(
        `선택한 문의 ${targets.length}건을 삭제합니다.\n개인정보가 함께 삭제되며 되돌릴 수 없습니다.`
      )
    )
      return;
    setBulkBusy(true);
    setNotice(null);
    try {
      const { ok, failed } = await deleteMany(
        targets.map((i) => `/api/admin/inquiries?id=${i.id}`)
      );
      await load();
      sel.clear();
      setOpenId(null);
      setNotice(
        failed.length
          ? { type: "error", text: `${ok}건 삭제, ${failed.length}건 실패 — ${failed[0].error}` }
          : { type: "ok", text: `${ok}건 삭제되었습니다.` }
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const exportCsv = () => {
    const head = ["접수일", "이름", "회사", "직책", "이메일", "연락처", "유형", "상태", "내용"];
    const rows = items.map((i) => [
      new Date(i.created_at).toLocaleString("ko-KR"),
      i.name, i.company ?? "", i.position ?? "", i.email, i.phone ?? "",
      i.inquiry_type ?? "", STATUS_LABEL[i.status] ?? i.status,
      i.message.replace(/\n/g, " "),
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `문의_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div>
      <PageHead title="문의 접수함" count={items.length}>
        <button
          onClick={() => setAdding((v) => !v)}
          className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
        >
          {adding ? "닫기" : "+ 수기 등록"}
        </button>
        <button onClick={exportCsv} className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          CSV 내보내기
        </button>
        <button onClick={load} className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          새로고침
        </button>
      </PageHead>

      <Notice state={notice} />

      {adding && (
        <div className="mb-6 grid gap-3 rounded-lg border border-n-100 bg-n-25 p-5">
          <p className="text-sm text-n-600">
            전화·메일로 받은 문의를 직접 기록합니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            <input placeholder="이름 *" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={INPUT} />
            <input placeholder="회사 / 기관" value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })} className={INPUT} />
            <input placeholder="이메일" value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={INPUT} />
            <input placeholder="연락처" value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={INPUT} />
          </div>
          <textarea placeholder="문의 내용 *" rows={3} value={draft.message}
            onChange={(e) => setDraft({ ...draft, message: e.target.value })} className={INPUT} />
          <button onClick={addManual} disabled={busy === "new"}
            className={`${BTN} justify-self-start bg-accent-600 text-white hover:bg-accent-700`}>
            등록
          </button>
        </div>
      )}

      {newCount > 0 && (
        <p className="mb-4 rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-900">
          신규 문의 <strong className="tnum">{newCount}</strong>건이 있습니다.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {["전체", ...STATUS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === f
                ? "bg-accent-100 font-medium text-accent-900"
                : "bg-n-50 text-n-600 hover:bg-n-100"
            }`}
          >
            {STATUS_LABEL[f] ?? f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-md border border-n-100 bg-n-25 px-4 py-6 text-center text-n-600">
          문의가 없습니다.
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
        <ul className="divide-y divide-n-100 overflow-hidden rounded-lg border border-n-100 bg-n-0">
          {shown.map((i) => (
            <li key={i.id} className={sel.has(i.id) ? "bg-accent-50" : ""}>
              <div className="flex items-center gap-2 px-4">
                <input
                  type="checkbox"
                  checked={sel.has(i.id)}
                  onChange={() => sel.toggle(i.id)}
                  aria-label={`${i.name} 선택`}
                  className="h-4 w-4 shrink-0 accent-[var(--color-accent-600)]"
                />
              <button
                onClick={() => setOpenId(openId === i.id ? null : i.id)}
                className="flex w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    i.status === "new"
                      ? "bg-accent-100 text-accent-900"
                      : i.status === "doing"
                        ? "bg-n-100 text-n-800"
                        : "bg-n-50 text-n-400"
                  }`}
                >
                  {STATUS_LABEL[i.status] ?? i.status}
                </span>
                <span className="tnum w-36 shrink-0 text-sm text-n-400">
                  {new Date(i.created_at).toLocaleString("ko-KR", {
                    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                <span className="w-24 shrink-0 font-medium text-n-900">{i.name}</span>
                <span className="w-40 shrink-0 truncate text-sm text-n-600">{i.company ?? "—"}</span>
                <span className="truncate text-sm text-n-600">{i.message}</span>
              </button>
              </div>

              {openId === i.id && (
                <div className="border-t border-n-100 bg-n-25 px-4 py-4">
                  <dl className="mb-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {[
                      ["이메일", i.email],
                      ["연락처", i.phone ?? "—"],
                      ["직책", i.position ?? "—"],
                      ["문의 유형", i.inquiry_type ?? "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <dt className="w-20 shrink-0 text-n-400">{k}</dt>
                        <dd className="text-n-800">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mb-4 whitespace-pre-wrap rounded-md border border-n-100 bg-n-0 p-4 text-sm text-n-800">
                    {i.message}
                  </p>

                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-n-600">상태</label>
                      <select
                        value={i.status}
                        onChange={(e) => patch(i.id, "status", e.target.value)}
                        className={INPUT}
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-n-600">내부 메모</label>
                      <input
                        value={i.memo ?? ""}
                        onChange={(e) => patch(i.id, "memo", e.target.value)}
                        className={INPUT}
                      />
                    </div>
                    <a
                      href={`mailto:${i.email}?subject=${encodeURIComponent("[토핑인터랙티브] 문의 회신")}`}
                      className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
                    >
                      메일 회신
                    </a>
                    <button
                      onClick={() => save(i)}
                      disabled={busy === i.id}
                      className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => remove(i)}
                      disabled={busy === i.id}
                      className={`${BTN} border border-danger text-danger hover:bg-red-50`}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
}
