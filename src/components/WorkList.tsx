"use client";

import { useMemo, useState } from "react";
import type { AiProjectItem, WorkItem } from "@/lib/content";

const FILTERS = ["전체", "AI", "금융", "공공", "제조·에너지·물류", "기타"] as const;

export default function WorkList({
  works,
  aiProjects,
}: {
  works: WorkItem[];
  aiProjects: AiProjectItem[];
}) {
  const [filter, setFilter] = useState<string>("전체");

  const all: WorkItem[] = useMemo(
    () => [
      ...aiProjects.map((p) => ({
        id: `ai-${p.id}`,
        client: p.org,
        system: `${p.systems.join(" · ")} UIUX`,
        industry: p.industry,
        isAi: true,
      })),
      ...works.map((w) => ({ ...w, isAi: false })),
    ],
    [works, aiProjects]
  );

  const rows = useMemo(() => {
    if (filter === "전체") return all;
    if (filter === "AI") return all.filter((r) => r.isAi);
    return all.filter((r) => r.industry === filter && !r.isAi);
  }, [all, filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "bg-accent-100 font-medium text-accent-900"
                : "bg-n-50 text-n-600 hover:bg-n-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="tnum mt-6 text-sm text-n-400">{rows.length}건</p>

      <ul className="mt-3 divide-y divide-n-100 border-y border-n-100">
        {rows.map((r) => (
          <li
            key={String(r.id)}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="w-full shrink-0 text-sm text-n-400 sm:w-44">
              {r.isAi ? <span className="font-medium text-accent-600">AI</span> : r.industry}
            </span>
            <span className="w-full shrink-0 font-medium text-n-900 sm:w-52">{r.client}</span>
            <span className="text-n-600">{r.system}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-n-600">외 100여 건</p>
    </div>
  );
}
