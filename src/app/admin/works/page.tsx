"use client";

import { useState } from "react";

type Work = {
  id: string;
  client_name: string;
  system_name: string;
  industry: string;
  tags?: string[];
  thumbnail_url?: string;
};

const INDUSTRIES = ["공공", "금융", "제조·에너지·물류", "기타"];

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([
    {
      id: "1",
      client_name: "하나증권",
      system_name: "비대면 계좌개설 UIUX",
      industry: "금융",
    },
    {
      id: "2",
      client_name: "하나은행",
      system_name: "리빌드 프로젝트 UIUX",
      industry: "금융",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWork, setNewWork] = useState<Partial<Work>>({
    client_name: "",
    system_name: "",
    industry: "공공",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddWork = () => {
    if (newWork.client_name && newWork.system_name) {
      setWorks([
        ...works,
        {
          id: String(Date.now()),
          client_name: newWork.client_name || "",
          system_name: newWork.system_name || "",
          industry: newWork.industry || "공공",
          tags: newWork.tags,
          thumbnail_url: newWork.thumbnail_url,
        },
      ]);
      setNewWork({ client_name: "", system_name: "", industry: "공공" });
      setShowAddForm(false);
    }
  };

  const handleDeleteWork = (id: string) => {
    setWorks(works.filter((w) => w.id !== id));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">실적 관리</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
        >
          + 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="mb-8 rounded border border-accent-600 bg-accent-50 p-6">
          <h2 className="mb-4 font-bold">새로운 실적 추가</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="클라이언트명"
              value={newWork.client_name || ""}
              onChange={(e) =>
                setNewWork({ ...newWork, client_name: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            />
            <input
              type="text"
              placeholder="시스템명"
              value={newWork.system_name || ""}
              onChange={(e) =>
                setNewWork({ ...newWork, system_name: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            />
            <select
              value={newWork.industry || "공공"}
              onChange={(e) =>
                setNewWork({ ...newWork, industry: e.target.value })
              }
              className="rounded border border-n-100 px-4 py-2"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddWork}
                className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded border border-n-200 px-4 py-2 hover:bg-n-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 실적 목록 */}
      <div className="space-y-3">
        {works.map((work) => (
          <div
            key={work.id}
            className="flex items-center justify-between rounded border border-n-100 bg-n-25 p-4"
          >
            <div className="flex-1">
              <h3 className="font-bold">{work.client_name}</h3>
              <p className="mb-2 text-sm text-n-600">{work.system_name}</p>
              <div className="flex items-center gap-3">
                <span className="inline-block rounded bg-n-100 px-2 py-1 text-xs">
                  {work.industry}
                </span>
                {work.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded bg-accent-100 px-2 py-1 text-xs text-accent-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="rounded border border-n-200 px-3 py-1 text-sm hover:bg-n-50">
                수정
              </button>
              <button
                onClick={() => handleDeleteWork(work.id)}
                className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
