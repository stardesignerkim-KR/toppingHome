"use client";

import { useCallback, useEffect, useState } from "react";
import { api, uploadImage } from "@/lib/admin-api";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import PageHead from "@/components/admin/PageHead";

type PageHeader = {
  page_id: string;
  header_title: string | null;
  header_subtitle: string | null;
  bg_image_url: string | null;
  title_font_size: number | null;
  title_text_color: string | null;
  subtitle_font_size: number | null;
  subtitle_text_color: string | null;
};

const PAGE_LABEL: Record<string, string> = {
  home: "메인",
  ai: "AI",
  work: "실적",
  service: "서비스",
  solution: "솔루션",
  about: "회사 소개",
  contact: "문의",
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

export default function MediaAdminPage() {
  const [items, setItems] = useState<PageHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<PageHeader[]>("/api/admin/media");
      const order = Object.keys(PAGE_LABEL);
      setItems(
        [...data].sort((a, b) => order.indexOf(a.page_id) - order.indexOf(b.page_id))
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

  const patch = (id: string, field: keyof PageHeader, value: string | number | null) =>
    setItems((prev) => prev.map((p) => (p.page_id === id ? { ...p, [field]: value } : p)));

  const save = async (p: PageHeader) => {
    setBusy(p.page_id);
    setNotice(null);
    try {
      await api("/api/admin/media", { method: "PUT", body: JSON.stringify(p) });
      setNotice({ type: "ok", text: `${PAGE_LABEL[p.page_id] ?? p.page_id} 저장 완료` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setBusy("");
    }
  };

  const pickBg = (p: PageHeader) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(p.page_id);
      try {
        const url = await uploadImage(file);
        const updated = { ...p, bg_image_url: url };
        await api("/api/admin/media", { method: "PUT", body: JSON.stringify(updated) });
        patch(p.page_id, "bg_image_url", url);
        setNotice({ type: "ok", text: "배경 이미지 등록 완료" });
      } catch (e) {
        setNotice({ type: "error", text: `업로드 실패 — ${(e as Error).message}` });
      } finally {
        setBusy("");
      }
    };
    input.click();
  };

  return (
    <div>
      <PageHead title="페이지 헤더 · 이미지" count={items.length}>
        <button onClick={load} className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}>
          새로고침
        </button>
      </PageHead>

      <Notice state={notice} />

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="rounded-md border border-n-100 bg-n-25 px-4 py-6 text-center text-n-600">
          데이터가 없습니다. 대시보드에서 <strong>초기 데이터 넣기</strong>를 먼저 실행하세요.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((p) => (
            <li key={p.page_id} className="rounded-lg border border-n-100 bg-n-0 p-5">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-semibold text-n-900">
                  {PAGE_LABEL[p.page_id] ?? p.page_id}
                </h2>
                <span className="text-xs text-n-400">/{p.page_id === "home" ? "" : p.page_id}</span>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-n-600">제목</label>
                    <input value={p.header_title ?? ""}
                      onChange={(e) => patch(p.page_id, "header_title", e.target.value)}
                      className={INPUT} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-n-600">부제</label>
                    <input value={p.header_subtitle ?? ""}
                      onChange={(e) => patch(p.page_id, "header_subtitle", e.target.value)}
                      className={INPUT} />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-n-600">제목 크기</label>
                      <input type="number" value={p.title_font_size ?? 48}
                        onChange={(e) => patch(p.page_id, "title_font_size", Number(e.target.value))}
                        className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-n-600">제목 색</label>
                      <input type="color" value={p.title_text_color ?? "#000000"}
                        onChange={(e) => patch(p.page_id, "title_text_color", e.target.value)}
                        className="h-[38px] w-full rounded-md border border-n-200" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-n-600">부제 크기</label>
                      <input type="number" value={p.subtitle_font_size ?? 16}
                        onChange={(e) => patch(p.page_id, "subtitle_font_size", Number(e.target.value))}
                        className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-n-600">부제 색</label>
                      <input type="color" value={p.subtitle_text_color ?? "#666666"}
                        onChange={(e) => patch(p.page_id, "subtitle_text_color", e.target.value)}
                        className="h-[38px] w-full rounded-md border border-n-200" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-n-600">배경 이미지</label>
                  <div className="mb-2 flex h-24 items-center justify-center overflow-hidden rounded border border-n-100 bg-n-25">
                    {p.bg_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.bg_image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-n-400">없음</span>
                    )}
                  </div>
                  <button onClick={() => pickBg(p)} disabled={busy === p.page_id}
                    className={`${BTN} w-full border border-n-200 text-n-800 hover:border-n-400`}>
                    이미지 선택
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={() => save(p)} disabled={busy === p.page_id}
                  className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}>저장</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
