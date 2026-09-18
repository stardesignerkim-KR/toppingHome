"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");

  const handleDatabaseSetup = async () => {
    if (!confirm("데이터베이스를 초기화하시겠습니까? 이 작업은 테이블을 생성합니다.")) {
      return;
    }

    setSetupLoading(true);
    setSetupMessage("");

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setSetupMessage("✅ " + data.message);
        alert("데이터베이스 초기화 완료!\n\nSupabase SQL Editor에서 다음 SQL을 실행해주세요:\n" + data.sql);
      } else {
        setSetupMessage("❌ 오류: " + data.error);
      }
    } catch (error) {
      setSetupMessage("❌ 오류 발생");
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">관리자 대시보드</h1>

      {/* 데이터베이스 초기화 */}
      <div className="mb-8 rounded border-2 border-accent-600 bg-accent-50 p-6">
        <h2 className="mb-2 font-bold text-accent-900">⚙️ 첫 실행 가이드</h2>
        <p className="mb-4 text-sm text-accent-800">
          처음 사용하시나요? 아래 버튼을 클릭하면 데이터베이스가 초기화됩니다.
        </p>
        <button
          onClick={handleDatabaseSetup}
          disabled={setupLoading}
          className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700 disabled:opacity-50"
        >
          {setupLoading ? "초기화 중..." : "데이터베이스 초기화"}
        </button>
        {setupMessage && (
          <p className="mt-4 text-sm font-medium">{setupMessage}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 사이트 정보 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">사이트 정보</h2>
          <p className="mb-4 text-sm text-n-600">
            회사명, 히어로 카피, 통계 수정
          </p>
          <a
            href="/admin/site"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            수정하기
          </a>
        </div>

        {/* AI 프로젝트 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">AI 프로젝트</h2>
          <p className="mb-4 text-sm text-n-600">
            AI 프로젝트 3건 · 역량 10개
          </p>
          <a
            href="/admin/ai-projects"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            수정하기
          </a>
        </div>

        {/* 실적 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">실적</h2>
          <p className="mb-4 text-sm text-n-600">
            27건 추가 · 수정 · 삭제
          </p>
          <a
            href="/admin/works"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            수정하기
          </a>
        </div>

        {/* 클라이언트 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">클라이언트</h2>
          <p className="mb-4 text-sm text-n-600">
            21개 로고 · 산업군
          </p>
          <a
            href="/admin/clients"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            수정하기
          </a>
        </div>

        {/* 솔루션 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">솔루션</h2>
          <p className="mb-4 text-sm text-n-600">
            5종 추가 · 수정
          </p>
          <a
            href="/admin/solutions"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            수정하기
          </a>
        </div>

        {/* 이미지 */}
        <div className="rounded border border-n-100 bg-n-25 p-6">
          <h2 className="mb-2 font-bold">이미지</h2>
          <p className="mb-4 text-sm text-n-600">
            배경 · 프로젝트 이미지
          </p>
          <a
            href="/admin/media"
            className="inline-block rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
          >
            관리하기
          </a>
        </div>
      </div>
    </div>
  );
}
