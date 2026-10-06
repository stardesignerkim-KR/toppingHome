"use client";

import { useCallback, useEffect, useState } from "react";
import { api, deleteMany, uploadImage, INDUSTRIES } from "@/lib/admin-api";
import { useSelection } from "@/lib/use-selection";
import BulkBar from "@/components/admin/BulkBar";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type AiProject = {
  project_id: string;
  organization: string;
  systems: string[];
  industry: string;
  summary: string;
  thumbnail_url?: string | null;
  /** 대표 이미지의 대체텍스트. 비우면 기관명이 자동으로 쓰인다. */
  thumbnail_alt?: string | null;
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

const EMPTY = { project_id: "", organization: "", systems: "", industry: "공공", summary: "" };

export default function AiProjectsAdminPage() {
  const [items, setItems] = useState<AiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const sel = useSelection();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<AiProject[]>("/api/admin/ai-projects");
      setItems(data.map((p) => ({ ...p, systems: p.systems ?? [] })));
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (id: string, field: keyof AiProject, value: string | string[]) =>
    setItems((prev) =>
      prev.map((p) => (p.project_id === id ? { ...p, [field]: value } : p))
    );

  const save = async (p: AiProject) => {
    setBusy(p.project_id);
    setNotice(null);
    try {
      // 빈 칸은 null 로 넣는다(빈 문자열이면 "대체텍스트가 있다"고 오해할 수 있다).
      const payload = {
        ...p,
        thumbnail_alt: p.thumbnail_alt?.trim() ? p.thumbnail_alt.trim() : null,
      };
      await api("/api/admin/ai-projects", { method: "PUT", body: JSON.stringify(payload) });
      setNotice({ type: "ok", text: `${p.organization} 저장 완료` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const remove = async (p: AiProject) => {
    if (!confirm(`'${p.organization}' 을(를) 삭제합니다.`)) return;
    setBusy(p.project_id);
    try {
      await api(`/api/admin/ai-projects?id=${encodeURIComponent(p.project_id)}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((x) => x.project_id !== p.project_id));
      setNotice({ type: "ok", text: "삭제되었습니다." });
    } catch (e) {
      setNotice({ type: "error", text: `삭제 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const pickThumb = (p: AiProject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(p.project_id);
      try {
        const url = await uploadImage(file);
        const updated = { ...p, thumbnail_url: url };
        await api("/api/admin/ai-projects", { method: "PUT", body: JSON.stringify(updated) });
        patch(p.project_id, "thumbnail_url" as keyof AiProject, url);
        setNotice({ type: "ok", text: "이미지 등록 완료" });
      } catch (e) {
        setNotice({ type: "error", text: `업로드 실패 — ${(e as Error).message}` });
      } finally {
        setBusy("");
      }
    };
    input.click();
  };

  const visibleIds = items.map((p) => p.project_id);
  const isAllChecked = visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));

  const bulkDelete = async () => {
    const targets = items.filter((p) => sel.has(p.project_id));
    if (targets.length === 0) return;
    if (!confirm(`선택한 AI 프로젝트 ${targets.length}건을 삭제합니다. 되돌릴 수 없습니다.`)) return;
    setBulkBusy(true);
    setNotice(null);
    try {
      const { ok, failed } = await deleteMany(
        targets.map((p) => `/api/admin/ai-projects?id=${encodeURIComponent(p.project_id)}`)
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
    if (!draft.project_id.trim() || !draft.organization.trim()) {
      setNotice({ type: "error", text: "id 와 기관명은 필수입니다." });
      return;
    }
    setBusy("__new");
    try {
      await api("/api/admin/ai-projects", {
        method: "POST",
        body: JSON.stringify({
          project_id: draft.project_id,
          organization: draft.organization,
          systems: draft.systems.split(",").map((s) => s.trim()).filter(Boolean),
          industry: draft.industry,
          summary: draft.summary,
        }),
      });
      setDraft(EMPTY);
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
      <PageHead title="AI 프로젝트 관리" count={items.length}>
        <button
          onClick={() => setAdding((v) => !v)}
          className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
        >
          {adding ? "닫기" : "+ 등록"}
        </button>
        <button onClick={load} className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          새로고침
        </button>
      </PageHead>

      <Notice state={notice} />

      {adding && (
        <div className="mb-8 grid gap-3 rounded-lg border border-n-100 bg-n-25 p-5 sm:grid-cols-2">
          <input placeholder="id (영문, 예: gyeonggi)" value={draft.project_id}
            onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className={INPUT} />
          <input placeholder="기관명" value={draft.organization}
            onChange={(e) => setDraft({ ...draft, organization: e.target.value })} className={INPUT} />
          <input placeholder="시스템명 (쉼표로 구분)" value={draft.systems}
            onChange={(e) => setDraft({ ...draft, systems: e.target.value })} className={INPUT} />
          <select value={draft.industry}
            onChange={(e) => setDraft({ ...draft, industry: e.target.value })} className={INPUT}>
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </select>
          <textarea placeholder="한 줄 요약" value={draft.summary} rows={2}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            className={`${INPUT} sm:col-span-2`} />
          <button onClick={add} disabled={busy === "__new"}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700 sm:col-span-2`}>
            등록
          </button>
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
          {items.map((p) => (
            <li
              key={p.project_id}
              className={`rounded-lg border bg-n-0 p-5 ${
                sel.has(p.project_id) ? "border-accent-400 ring-1 ring-accent-200" : "border-n-100"
              }`}
            >
              <label className="mb-3 flex cursor-pointer items-center gap-2 text-xs text-n-600">
                <input
                  type="checkbox"
                  checked={sel.has(p.project_id)}
                  onChange={() => sel.toggle(p.project_id)}
                  className="h-4 w-4 accent-[var(--color-accent-600)]"
                />
                선택
              </label>
              <div className="grid gap-3 sm:grid-cols-[180px_1fr_160px]">
                <div>
                  <label className="mb-1 block text-xs text-n-600">기관명</label>
                  <input value={p.organization}
                    onChange={(e) => patch(p.project_id, "organization", e.target.value)}
                    className={INPUT} />
                  <p className="mt-1 text-xs text-n-400">{p.project_id}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-n-600">
                    시스템명 (쉼표로 구분)
                  </label>
                  <input
                    value={(p.systems ?? []).join(", ")}
                    onChange={(e) =>
                      patch(
                        p.project_id,
                        "systems",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-n-600">산업</label>
                  <select value={p.industry}
                    onChange={(e) => patch(p.project_id, "industry", e.target.value)}
                    className={INPUT}>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <label className="mt-3 mb-1 block text-xs text-n-600">한 줄 요약</label>
              <textarea value={p.summary} rows={2}
                onChange={(e) => patch(p.project_id, "summary", e.target.value)}
                className={INPUT} />

              {/*
                대체텍스트는 대표 이미지를 올렸을 때만 의미가 있다.
                (이미지가 없으면 코드로 그린 UI 목업이 대신 나온다.)
              */}
              {p.thumbnail_url && (
                <>
                  <label className="mt-3 mb-1 block text-xs text-n-600">
                    대표 이미지 대체텍스트
                  </label>
                  <input
                    value={p.thumbnail_alt ?? ""}
                    onChange={(e) => patch(p.project_id, "thumbnail_alt", e.target.value)}
                    placeholder={`비우면 "${p.organization}"`}
                    className={`${INPUT} text-xs`}
                  />
                </>
              )}

              <div className="mt-3 flex items-center gap-2">
                {p.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail_url} alt="" className="h-12 w-20 rounded border border-n-100 object-cover" />
                )}
                <button onClick={() => pickThumb(p)} disabled={busy === p.project_id}
                  className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
                  대표 이미지
                </button>
                <button onClick={() => save(p)} disabled={busy === p.project_id}
                  className={`${BTN} ml-auto bg-accent-600 text-white hover:bg-accent-700`}>
                  저장
                </button>
                <button onClick={() => remove(p)} disabled={busy === p.project_id}
                  className={`${BTN} border border-danger text-danger hover:bg-red-50`}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
}
