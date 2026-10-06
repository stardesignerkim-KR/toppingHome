"use client";

import type { Id } from "@/lib/use-selection";

/**
 * 목록 상단 일괄 작업 바.
 * 화면에 보이는 항목만 전체선택 대상으로 삼는다 (필터 적용 시 오동작 방지).
 */
export default function BulkBar({
  visibleIds,
  selectedCount,
  isAllChecked,
  onToggleAll,
  onClear,
  onDelete,
  busy,
  unit = "건",
}: {
  visibleIds: Id[];
  selectedCount: number;
  isAllChecked: boolean;
  onToggleAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  busy: boolean;
  unit?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-n-100 bg-n-25 px-4 py-2.5">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-n-800">
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={onToggleAll}
          disabled={visibleIds.length === 0}
          className="h-4 w-4 accent-[var(--color-accent-600)]"
        />
        전체 선택
        <span className="tnum text-n-400">({visibleIds.length}{unit})</span>
      </label>

      <span className="h-4 w-px bg-n-200" />

      <span className="tnum text-sm text-n-600">
        선택 <strong className="text-accent-600">{selectedCount}</strong>{unit}
      </span>

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={selectedCount === 0 || busy}
          className="rounded-md border border-n-200 px-3 py-1.5 text-sm font-medium text-n-800 hover:border-n-400 disabled:opacity-40"
        >
          선택 해제
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={selectedCount === 0 || busy}
          className="rounded-md border border-danger px-3 py-1.5 text-sm font-medium text-danger hover:bg-red-50 disabled:opacity-40"
        >
          {busy ? "삭제 중…" : `선택 삭제 (${selectedCount})`}
        </button>
      </div>
    </div>
  );
}
