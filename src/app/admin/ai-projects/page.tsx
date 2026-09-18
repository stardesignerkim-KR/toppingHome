"use client";

import { useState } from "react";

type AiProject = {
  id: string;
  org: string;
  systems: string[];
  industry: string;
  summary: string;
  thumbnail?: string;
};

export default function AiProjectsPage() {
  const [projects, setProjects] = useState<AiProject[]>([
    {
      id: "gyeonggi",
      org: "경기도청",
      systems: ["AI 업무지원시스템"],
      industry: "공공",
      summary:
        "광역자치단체 업무 흐름에 생성형 AI를 결합한 업무지원시스템 UIUX",
    },
    {
      id: "daishin",
      org: "대신증권",
      systems: ["KMS AI 시스템", "AI 업무지원시스템"],
      industry: "금융",
      summary: "지식관리(KMS)와 AI를 결합한 증권사 사내 업무지원 플랫폼 UIUX",
    },
    {
      id: "hrdi",
      org: "직업능률개발원",
      systems: ["원격훈련 AI 심사시스템", "AI 업무지원시스템"],
      industry: "공공",
      summary:
        "원격훈련 과정 심사 업무에 AI를 적용한 심사·업무지원시스템 UIUX",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditProject = (id: string) => {
    setEditingId(id);
  };

  const handleSaveProject = (id: string) => {
    setEditingId(null);
    // TODO: Supabase에 저장
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI 프로젝트</h1>
        <button className="rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700">
          + 추가
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded border border-n-100 bg-n-25 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold">{project.org}</h3>
                <p className="mb-3 text-sm text-n-600">{project.summary}</p>
                <div className="mb-3 flex gap-2">
                  {project.systems.map((sys) => (
                    <span
                      key={sys}
                      className="inline-block rounded bg-n-100 px-3 py-1 text-sm"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-n-600">산업: {project.industry}</p>
              </div>

              {editingId === project.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveProject(project.id)}
                    className="rounded bg-accent-600 px-3 py-1 text-sm text-white"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded border border-n-200 px-3 py-1 text-sm"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditProject(project.id)}
                  className="rounded border border-n-200 px-3 py-1 text-sm hover:bg-n-50"
                >
                  수정
                </button>
              )}
            </div>

            {editingId === project.id && (
              <div className="border-t border-n-100 pt-4">
                <textarea
                  defaultValue={project.summary}
                  className="mb-3 w-full rounded border border-n-100 px-3 py-2"
                  rows={3}
                  placeholder="설명을 입력하세요"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
