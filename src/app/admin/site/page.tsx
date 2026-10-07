"use client";

import { useEffect, useState } from "react";

/** 화면 필드 ↔ site_info.config_key 매핑.
 *  ⚠️ 여기에 줄을 더하면 `src/lib/site-content.ts` 의 SiteCopy·DEFAULTS·KEY_MAP 도 같이 고친다. */
const FIELDS = [
  { group: "회사", name: "companyName",  key: "company.name",        label: "상호" },
  { group: "회사", name: "shortName",    key: "company.shortName",   label: "약칭 (상단 로고 글자)" },
  { group: "회사", name: "founded",      key: "company.founded",     label: "설립" },
  { group: "회사", name: "ceo",          key: "company.ceo",         label: "대표자" },
  { group: "회사", name: "address",      key: "company.address",     label: "주소" },
  { group: "회사", name: "tel",          key: "company.tel",         label: "전화" },
  { group: "회사", name: "direct",       key: "company.direct",      label: "직통" },
  { group: "회사", name: "email",        key: "company.email",       label: "이메일" },
  { group: "회사", name: "description",  key: "company.description", label: "사이트 설명 (검색 결과에 나오는 문구)" },
  { group: "히어로", name: "heroHeadline1", key: "hero.headline1",   label: "헤드라인 1줄" },
  { group: "히어로", name: "heroHeadline2", key: "hero.headline2",   label: "헤드라인 2줄" },
  { group: "히어로", name: "heroSub",       key: "hero.sub",         label: "부제" },
  { group: "히어로", name: "heroTagline",   key: "hero.tagline",     label: "영문 태그라인" },
  { group: "약관", name: "termsEffective",   key: "legal.termsEffective",   label: "이용약관 시행일" },
  { group: "약관", name: "privacyEffective", key: "legal.privacyEffective", label: "개인정보처리방침 시행일" },
] as const;

type FormState = Record<(typeof FIELDS)[number]["name"], string>;

const DEFAULTS: FormState = {
  companyName: "주식회사 토핑인터랙티브",
  shortName: "TOPPING",
  founded: "2006년",
  ceo: "김원근",
  address: "경기도 성남시 분당구 서현로 170 풍림아이원플러스 D-1907",
  tel: "070-8875-5559",
  direct: "010-3356-5773",
  email: "mswk777@naver.com",
  description: "AI 업무지원시스템 UIUX. 업무시스템 UIUX 15년, 공공·금융 3개 기관 구축.",
  heroHeadline1: "업무시스템 15년,",
  heroHeadline2: "그래서 우리가 만든 AI는 현업이 씁니다",
  heroSub: "AI 업무지원시스템 · 공공·금융 3개 기관 구축",
  heroTagline: "Designing Intelligent Workflows that Think, Learn, and Perform",
  termsEffective: "2026년 9월 21일",
  privacyEffective: "2026년 9월 21일",
};

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-4 py-2 outline-none focus:border-accent-600";

export default function SiteInfoPage() {
  const [formData, setFormData] = useState<FormState>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<
    { type: "ok" | "error"; text: string } | null
  >(null);

  // 저장된 값 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/site");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "불러오기 실패");

        setFormData((prev) => {
          const next = { ...prev };
          FIELDS.forEach((f) => {
            const v = json?.[f.key];
            if (typeof v === "string") next[f.name] = v;
          });
          return next;
        });
      } catch (err) {
        setMessage({
          type: "error",
          text: `저장된 값을 불러오지 못했습니다 — ${(err as Error).message}`,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: FIELDS.map((f) => ({ key: f.key, value: formData[f.name] })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);

      setMessage({ type: "ok", text: `저장되었습니다 (${json.saved}개 항목)` });
    } catch (err) {
      setMessage({ type: "error", text: `저장 실패 — ${(err as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULTS);
    setMessage(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-n-900">사이트 정보</h1>
          <p className="mt-1 text-sm text-n-600">
            상호 · 대표자 · 주소 · 연락처와 첫 화면 문구를 고칩니다.
          </p>
        </div>

        {/* 타이틀 영역 우측에 업무 처리 버튼 고정 — 폼이 길어져도 찾아 헤매지 않음 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="rounded-md bg-accent-600 px-5 py-2 font-medium text-white hover:bg-accent-700 disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={saving}
            className="rounded-md border border-n-200 px-5 py-2 font-medium text-n-800 hover:border-n-400 disabled:opacity-50"
          >
            다시 불러오기
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-md border border-n-200 px-5 py-2 font-medium text-n-800 hover:border-n-400 disabled:opacity-50"
          >
            기본값
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 max-w-2xl rounded-md px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-accent-50 text-accent-900"
              : "border border-danger/30 bg-red-50 text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : (
        <div className="max-w-2xl space-y-8">
          {["회사", "히어로", "약관"].map((group) => (
            <div key={group} className="rounded-lg border border-n-100 bg-n-25 p-6">
              <h2 className="mb-4 font-bold text-n-900">
                {group === "회사"
                  ? "회사 정보"
                  : group === "히어로"
                    ? "히어로 카피"
                    : "약관 시행일"}
              </h2>
              <div className="space-y-4">
                {FIELDS.filter((f) => f.group === group).map((f) => (
                  <div key={f.name}>
                    <label
                      htmlFor={f.name}
                      className="mb-2 block text-sm font-medium text-n-800"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.name}
                      type="text"
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className={INPUT}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
