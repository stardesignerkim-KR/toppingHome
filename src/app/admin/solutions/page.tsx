"use client";

import { useState } from "react";

type Solution = {
  solution_id: string;
  solution_title: string;
  solution_body: string;
};

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([
    {
      solution_id: "nexacro",
      solution_title: "NEXACRO",
      solution_body:
        "넥사크로 N, 넥사크로 17, 넥사크로 14 — 투비소프트의 모든 넥사크로 제품에 대한 UIUX 표준기획 · UIUX 디자인 · 퍼블리싱을 지원합니다.",
    },
    {
      solution_id: "x-converting",
      solution_title: "X-CONVERTING",
      solution_body:
        "오래된 업무시스템의 UI를 업그레이드합니다. X컨버팅 프로그램을 통해 프로그램 리소스는 그대로 사용합니다.",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Solution | null>(null);

  const handleSave = (id: string) => {
    if (editData) {
      setSolutions(
        solutions.map((s) => (s.solution_id === id ? editData : s))
      );
    }
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">솔루션 관리 (5종)</h1>

      <div className="space-y-6">
        {solutions.map((solution) => (
          <div
            key={solution.solution_id}
            className="rounded border border-n-100 bg-n-25 p-6"
          >
            {editingId === solution.solution_id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData?.solution_title || ""}
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? {
                            ...editData,
                            solution_title: e.target.value,
                          }
                        : null
                    )
                  }
                  className="w-full rounded border border-n-100 px-4 py-2 text-lg font-bold"
                />
                <textarea
                  value={editData?.solution_body || ""}
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? {
                            ...editData,
                            solution_body: e.target.value,
                          }
                        : null
                    )
                  }
                  className="w-full rounded border border-n-100 px-4 py-2"
                  rows={5}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(solution.solution_id)}
                    className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditData(null);
                    }}
                    className="rounded border border-n-200 px-4 py-2 hover:bg-n-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-xl font-bold">
                      {solution.solution_title}
                    </h2>
                    <p className="text-n-700">{solution.solution_body}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(solution.solution_id);
                      setEditData(solution);
                    }}
                    className="rounded border border-n-200 px-4 py-2 text-sm hover:bg-n-50"
                  >
                    수정
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
