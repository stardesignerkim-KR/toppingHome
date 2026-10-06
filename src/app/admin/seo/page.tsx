"use client";

import { useCallback, useEffect, useState } from "react";
import Notice, { type NoticeState } from "@/components/admin/Notice";
import { uploadImage } from "@/lib/admin-api";
import { SEO_PAGES as PAGES } from "@/lib/seo-pages";

type Row = { seo_title: string; seo_description: string; og_image_url: string };

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

/** 검색 결과에서 잘리는 길이 — 넘으면 경고만 하고 막지는 않는다 */
const LIMIT = { title: 60, desc: 120 };

/**
 * 검색엔진 소유확인 코드.
 * site_info 에 저장하므로 페이지별 메타(page_headers)와는 저장소가 다르다.
 * 화면은 하나로 합쳐 둔다 — 쓰는 사람에게는 둘 다 "검색엔진" 일이다.
 */
const VERIFY = [
  {
    name: "google" as const,
    key: "search.googleVerification",
    label: "구글 서치콘솔 소유확인 코드",
    hint: 'search.google.com/search-console → 소유권 확인 → HTML 태그 → content="여기" 안의 값만',
  },
  {
    name: "naver" as const,
    key: "search.naverVerification",
    label: "네이버 서치어드바이저 소유확인 코드",
    hint: 'searchadvisor.naver.com → 사이트 등록 → HTML 태그 → content="여기" 안의 값만',
  },
];

export default function SeoAdminPage() {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [verify, setVerify] = useState({ google: "", naver: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<NoticeState>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      const next: Record<string, Row> = {};
      for (const p of PAGES) next[p.id] = { seo_title: "", seo_description: "", og_image_url: "" };
      for (const r of json as Record<string, string | null>[]) {
        const id = String(r.page_id);
        if (!next[id]) continue;
        next[id] = {
          seo_title: r.seo_title ?? "",
          seo_description: r.seo_description ?? "",
          og_image_url: r.og_image_url ?? "",
        };
      }
      setRows(next);

      const sres = await fetch("/api/admin/site");
      const site = (await sres.json()) as Record<string, string | null>;
      setVerify({
        google: site["search.googleVerification"] ?? "",
        naver: site["search.naverVerification"] ?? "",
      });
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (id: string, field: keyof Row, value: string) =>
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const pickOg = (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(id);
      setNotice(null);
      try {
        const url = await uploadImage(file);
        patch(id, "og_image_url", url);
        setNotice({ type: "ok", text: "이미지를 올렸습니다. 『저장』을 눌러야 반영됩니다." });
      } catch (e) {
        setNotice({ type: "error", text: `업로드 실패 — ${(e as Error).message}` });
      } finally {
        setBusy("");
      }
    };
    input.click();
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: PAGES.map((p) => ({ page_id: p.id, ...rows[p.id] })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);

      // 소유확인 코드는 site_info 쪽에 따로 저장한다
      const vres = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: VERIFY.map((v) => ({ key: v.key, value: verify[v.name].trim() })),
        }),
      });
      const vjson = await vres.json();
      if (!vres.ok) throw new Error(vjson?.error ?? `HTTP ${vres.status}`);

      setNotice({ type: "ok", text: `저장 완료 — ${json.saved}개 페이지, 소유확인 코드 포함` });
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-n-900">검색엔진 (SEO)</h1>
          <p className="mt-1 text-sm text-n-600">
            구글·네이버 검색 결과와 카카오톡·슬랙 링크 미리보기에 나오는 문구입니다.
            비워 두면 페이지 기본값이 쓰입니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            type="button"
            onClick={load}
            disabled={saving}
            className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
          >
            다시 불러오기
          </button>
        </div>
      </div>

      <Notice state={notice} />

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-n-100 bg-n-25 p-5">
            <p className="font-medium text-n-900">검색엔진 소유확인</p>
            <p className="mt-1 text-sm text-n-600">
              구글·네이버에 사이트를 등록할 때 &ldquo;이 사이트가 내 것임&rdquo;을 증명하는
              코드입니다. 배포 후 한 번만 넣으면 됩니다.
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {VERIFY.map((v) => (
                <div key={v.name}>
                  <label className="mb-1 block text-xs text-n-600">{v.label}</label>
                  <input
                    type="text"
                    value={verify[v.name]}
                    onChange={(e) =>
                      setVerify((prev) => ({ ...prev, [v.name]: e.target.value }))
                    }
                    placeholder="등록 전에는 비워 두세요"
                    className={INPUT}
                  />
                  <p className="mt-1 text-[11px] leading-snug text-n-400">{v.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {PAGES.map((p) => {
            const r = rows[p.id] ?? { seo_title: "", seo_description: "", og_image_url: "" };
            return (
              <div key={p.id} className="rounded-lg border border-n-100 bg-n-0 p-5">
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="font-medium text-n-900">{p.label}</span>
                  <span className="text-xs text-n-400">{p.path}</span>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                  <Field
                    label="검색 제목"
                    value={r.seo_title}
                    limit={LIMIT.title}
                    onChange={(v) => patch(p.id, "seo_title", v)}
                  />
                  <Field
                    label="검색 설명"
                    value={r.seo_description}
                    limit={LIMIT.desc}
                    onChange={(v) => patch(p.id, "seo_description", v)}
                  />
                  <div>
                    <label className="mb-1 block text-xs text-n-600">공유 이미지</label>
                    <div className="flex items-center gap-2">
                      {r.og_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.og_image_url}
                          alt=""
                          className="h-10 w-16 rounded border border-n-100 object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-16 items-center justify-center rounded border border-dashed border-n-200 text-[10px] text-n-400">
                          없음
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => pickOg(p.id)}
                        disabled={busy === p.id}
                        className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
                      >
                        {busy === p.id ? "올리는 중…" : "변경"}
                      </button>
                      {r.og_image_url && (
                        <button
                          type="button"
                          onClick={() => patch(p.id, "og_image_url", "")}
                          className={`${BTN} border border-danger/40 text-danger`}
                        >
                          비움
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 검색 결과가 어떻게 보이는지 그대로 보여 준다 */}
                <div className="mt-4 rounded-md border border-n-100 bg-n-25 p-3">
                  <p className="text-[11px] text-n-400">검색 결과 미리보기</p>
                  <p className="mt-1 text-[15px] text-iris-600" style={{ color: "#1a0dab" }}>
                    {r.seo_title || `(${p.label} 페이지 기본 제목)`}
                  </p>
                  <p className="text-xs" style={{ color: "#006621" }}>
                    topping7.com{p.path}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-n-600">
                    {r.seo_description || "(설명을 비우면 페이지 기본 설명이 나옵니다)"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  limit,
  onChange,
}: {
  label: string;
  value: string;
  limit: number;
  onChange: (v: string) => void;
}) {
  const over = value.length > limit;
  return (
    <div>
      <label className="mb-1 flex items-baseline justify-between text-xs text-n-600">
        <span>{label}</span>
        <span className={over ? "text-warning" : "text-n-400"}>
          {value.length} / {limit}
        </span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      {over && (
        <p className="mt-1 text-[11px] text-warning">
          검색 결과에서 뒤가 잘릴 수 있습니다.
        </p>
      )}
    </div>
  );
}
