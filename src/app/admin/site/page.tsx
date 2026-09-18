"use client";

import { useState } from "react";

export default function SiteInfoPage() {
  const [formData, setFormData] = useState({
    companyName: "주식회사 토핑인터랙티브",
    founded: "2010년 4월",
    heroHeadline1: "업무시스템 15년,",
    heroHeadline2: "그래서 우리가 만든 AI는 현업이 씁니다",
    heroSub: "AI 업무지원시스템 · 공공·금융 3개 기관 구축",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving:", formData);
    // TODO: Supabase에 저장
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">사이트 정보</h1>

      <div className="max-w-2xl space-y-6">
        {/* 회사명 */}
        <div>
          <label className="mb-2 block font-medium">회사명</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full rounded border border-n-100 px-4 py-2"
          />
        </div>

        {/* 설립연도 */}
        <div>
          <label className="mb-2 block font-medium">설립연도</label>
          <input
            type="text"
            name="founded"
            value={formData.founded}
            onChange={handleChange}
            className="w-full rounded border border-n-100 px-4 py-2"
          />
        </div>

        {/* 히어로 카피 */}
        <div className="rounded-lg border border-n-100 bg-n-25 p-6">
          <h2 className="mb-4 font-bold">히어로 카피</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                헤드라인 1줄
              </label>
              <input
                type="text"
                name="heroHeadline1"
                value={formData.heroHeadline1}
                onChange={handleChange}
                className="w-full rounded border border-n-100 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                헤드라인 2줄
              </label>
              <input
                type="text"
                name="heroHeadline2"
                value={formData.heroHeadline2}
                onChange={handleChange}
                className="w-full rounded border border-n-100 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">부제</label>
              <input
                type="text"
                name="heroSub"
                value={formData.heroSub}
                onChange={handleChange}
                className="w-full rounded border border-n-100 px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="rounded bg-accent-600 px-6 py-2 text-white hover:bg-accent-700"
          >
            저장
          </button>
          <button className="rounded border border-n-200 px-6 py-2 hover:bg-n-50">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
