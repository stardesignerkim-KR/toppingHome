"use client";

import { useCallback, useMemo, useState } from "react";

export type Id = string | number;

/** 목록 화면 공용 다중 선택 상태 */
export function useSelection() {
  const [selected, setSelected] = useState<Set<Id>>(new Set());

  const toggle = useCallback((id: Id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** 현재 화면에 보이는 것들만 전체선택/해제 (필터가 걸려 있어도 안전) */
  const toggleAll = useCallback((ids: Id[]) => {
    setSelected((prev) => {
      const allOn = ids.length > 0 && ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allOn) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const has = useCallback((id: Id) => selected.has(id), [selected]);

  const count = selected.size;

  return useMemo(
    () => ({ selected, toggle, toggleAll, clear, has, count }),
    [selected, toggle, toggleAll, clear, has, count]
  );
}
