"use client";

import { useCallback, useEffect, useState } from "react";
import { api, deleteMany, uploadImage, INDUSTRIES } from "@/lib/admin-api";
import { useSelection } from "@/lib/use-selection";
import BulkBar from "@/components/admin/BulkBar";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type Client = {
  client_slug: string;
  client_name: string;
  industry: string;
  logo_url: string | null;
  logo_dark_url?: string | null;
  /** 이미지 대체텍스트. 비우면 회사명이 자동으로 쓰인다. */
  logo_alt?: string | null;
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

const EMPTY: Client = { client_slug: "", client_name: "", industry: "기타", logo_url: null };

export default function ClientsAdminPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState<string>("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const sel = useSelection();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Client>(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Client[]>("/api/admin/clients");
      setItems(
        [...data].sort((a, b) => a.client_name.localeCompare(b.client_name, "ko"))
      );
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (slug: string, field: keyof Client, value: string | null) =>
    setItems((prev) =>
      prev.map((c) => (c.client_slug === slug ? { ...c, [field]: value } : c))
    );

  const save = async (c: Client) => {
    setBusy(c.client_slug);
    setNotice(null);
    try {
      // 빈 칸은 null 로 넣는다. 빈 문자열을 넣으면 "대체텍스트가 있다"고 오해할 수 있다.
      const payload = { ...c, logo_alt: c.logo_alt?.trim() ? c.logo_alt.trim() : null };
      await api("/api/admin/clients", { method: "PUT", body: JSON.stringify(payload) });
      setNotice({ type: "ok", text: `${c.client_name} 저장 완료` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const remove = async (c: Client) => {
    if (!confirm(`'${c.client_name}' 를 삭제합니다. 되돌릴 수 없습니다.`)) return;
    setBusy(c.client_slug);
    try {
      await api(`/api/admin/clients?slug=${encodeURIComponent(c.client_slug)}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((x) => x.client_slug !== c.client_slug));
      setNotice({ type: "ok", text: `${c.client_name} 삭제됨` });
    } catch (e) {
      setNotice({ type: "error", text: `삭제 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const pickLogo = async (c: Client, dark = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(c.client_slug);
      setNotice(null);
      try {
        const url = await uploadImage(file);
        const field = dark ? "logo_dark_url" : "logo_url";
        const updated = { ...c, [field]: url };
        await api("/api/admin/clients", { method: "PUT", body: JSON.stringify(updated) });
        patch(c.client_slug, field, url);
        setNotice({ type: "ok", text: `${c.client_name} 로고 등록 완료` });
      } catch (e) {
        setNotice({ type: "error", text: `업로드 실패 — ${(e as Error).message}` });
      } finally {
        setBusy("");
      }
    };
    input.click();
  };

  const visibleIds = items.map((c) => c.client_slug);
  const isAllChecked = visibleIds.length > 0 && visibleIds.every((id) => sel.has(id));

  const bulkDelete = async () => {
    const targets = items.filter((c) => sel.has(c.client_slug));
    if (targets.length === 0) return;
    if (!confirm(`선택한 클라이언트 ${targets.length}건을 삭제합니다. 되돌릴 수 없습니다.`)) return;
    setBulkBusy(true);
    setNotice(null);
    try {
      const { ok, failed } = await deleteMany(
        targets.map((c) => `/api/admin/clients?slug=${encodeURIComponent(c.client_slug)}`)
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
    if (!draft.client_slug.trim() || !draft.client_name.trim()) {
      setNotice({ type: "error", text: "slug 와 회사명은 필수입니다." });
      return;
    }
    setBusy("__new");
    try {
      await api("/api/admin/clients", { method: "POST", body: JSON.stringify(draft) });
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
      <PageHead title="클라이언트 관리" count={items.length}>
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
        <div className="mb-8 grid gap-3 rounded-lg border border-n-100 bg-n-25 p-5 sm:grid-cols-4">
          <input
            placeholder="slug (영문, 예: hana-bank)"
            value={draft.client_slug}
            onChange={(e) => setDraft({ ...draft, client_slug: e.target.value })}
            className={INPUT}
          />
          <input
            placeholder="회사명"
            value={draft.client_name}
            onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
            className={INPUT}
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
            disabled={busy === "__new"}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
          >
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
          unit="개"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li
              key={c.client_slug}
              className={`flex flex-col rounded-lg border bg-n-0 p-4 ${
                sel.has(c.client_slug) ? "border-accent-400 ring-1 ring-accent-200" : "border-n-100"
              }`}
            >
              <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-n-600">
                <input
                  type="checkbox"
                  checked={sel.has(c.client_slug)}
                  onChange={() => sel.toggle(c.client_slug)}
                  className="h-4 w-4 accent-[var(--color-accent-600)]"
                />
                선택
              </label>
              <div className="mb-3 flex h-24 items-center justify-center rounded border border-n-100 bg-n-25">
                {c.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo_url} alt={c.client_name} className="max-h-16 w-auto" />
                ) : (
                  <span className="text-xs text-n-400">로고 없음</span>
                )}
              </div>

              <input
                value={c.client_name}
                onChange={(e) => patch(c.client_slug, "client_name", e.target.value)}
                className={`${INPUT} mb-2 font-medium`}
              />
              <select
                value={c.industry}
                onChange={(e) => patch(c.client_slug, "industry", e.target.value)}
                className={`${INPUT} mb-3`}
              >
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>

              {/*
                대체텍스트: 눈으로는 안 보이지만 화면낭독기와 검색엔진이 읽는 글이다.
                비워 두면 회사명이 그대로 쓰이므로 대부분은 손댈 필요가 없다.
              */}
              <input
                value={c.logo_alt ?? ""}
                onChange={(e) => patch(c.client_slug, "logo_alt", e.target.value)}
                placeholder={`대체텍스트 (비우면 "${c.client_name}")`}
                className={`${INPUT} mb-3 text-xs`}
              />

              <div className="mt-auto grid grid-cols-3 gap-2">
                <button
                  onClick={() => pickLogo(c)}
                  disabled={busy === c.client_slug}
                  className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
                >
                  로고
                </button>
                <button
                  onClick={() => save(c)}
                  disabled={busy === c.client_slug}
                  className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
                >
                  저장
                </button>
                <button
                  onClick={() => remove(c)}
                  disabled={busy === c.client_slug}
                  className={`${BTN} border border-danger text-danger hover:bg-red-50`}
                >
                  삭제
                </button>
              </div>
              <p className="mt-2 text-xs text-n-400">{c.client_slug}</p>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
}
