"use client";

import { useMemo, useState } from "react";
import { WORKS } from "@/content/works";
import { AI_PROJECTS, INDUSTRY_LABEL, type Industry } from "@/content/ai-projects";

type Filter = "all" | "ai" | Industry;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "ai", label: "AI" },
  { key: "finance", label: "금융" },
  { key: "public", label: "공공" },
  { key: "manufacturing", label: "제조·에너지·물류" },
  { key: "etc", label: "기타" },
];

export default function WorkList() {
  const [filter, setFilter] = useState<Filter>("all");

  const aiRows = useMemo(
    () =>
      AI_PROJECTS.map((p) => ({
        client: p.org,
        system: p.systems.join(" · ") + " UIUX",
        industry: p.industry,
        isAi: true,
      })),
    []
  );

  const rows = useMemo(() => {
    const all = [...aiRows, ...WORKS.map((w) => ({ ...w, isAi: false }))];
    if (filter === "all") return all;
    if (filter === "ai") return all.filter((r) => r.isAi);
    return all.filter((r) => r.industry === filter && !r.isAi);
  }, [filter, aiRows]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-accent-100 font-medium text-accent-900"
                  : "bg-n-50 text-n-600 hover:bg-n-100"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-n-400 tnum">{rows.length}건</p>

      <ul className="mt-3 divide-y divide-n-100 border-y border-n-100">
        {rows.map((r, i) => (
          <li
            key={`${r.client}-${i}`}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="w-full shrink-0 text-sm text-n-400 sm:w-44">
              {r.isAi ? (
                <span className="font-medium text-accent-600">AI</span>
              ) : (
                INDUSTRY_LABEL[r.industry]
              )}
            </span>
            <span className="w-full shrink-0 font-medium text-n-900 sm:w-52">
              {r.client}
            </span>
            <span className="text-n-600">{r.system}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-n-600">외 100여 건</p>
    </div>
  );
}
