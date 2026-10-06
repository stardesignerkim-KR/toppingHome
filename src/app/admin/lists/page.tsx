"use client";

import { useCallback, useEffect, useState } from "react";
import { LIST_SPECS, type ListKey, type ListSpec } from "@/lib/lists";
import Notice, { type NoticeState } from "@/components/admin/Notice";

type Row = { f1: string; f2: string; f3: string; items: string[] };

const INPUT =
  "w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-sm outline-none focus:border-accent-600";
const BTN = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

const empty = (): Row => ({ f1: "", f2: "", f3: "", items: [] });

export default function ListsAdminPage() {
  const [key, setKey] = useState<ListKey>("stats");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [dirty, setDirty] = useState(false);

  const spec: ListSpec = LIST_SPECS.find((s) => s.key === key)!;

  const load = useCallback(async (k: ListKey) => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/lists?key=${k}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setRows(
        (json as Record<string, unknown>[]).map((r) => ({
          f1: String(r.f1 ?? ""),
          f2: String(r.f2 ?? ""),
          f3: String(r.f3 ?? ""),
          items: Array.isArray(r.items) ? (r.items as string[]) : [],
        }))
      );
      setDirty(false);
      if ((json as unknown[]).length === 0) {
        setNotice({
          type: "ok",
          text: "아직 저장된 값이 없습니다. 지금은 사이트가 기본값을 쓰고 있습니다 — 『기본값 불러오기』를 누르면 고칠 수 있는 줄로 채워집니다.",
        });
      }
    } catch (e) {
      setNotice({ type: "error", text: `불러오기 실패 — ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(key);
  }, [key, load]);

  const patch = (i: number, field: keyof Row, value: string | string[]) => {
    setRows((prev) => prev.map((r, n) => (n === i ? { ...r, [field]: value } : r)));
    setDirty(true);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  };

  const remove = (i: number) => {
    setRows((prev) => prev.filter((_, n) => n !== i));
    setDirty(true);
  };

  const add = () => {
    setRows((prev) => [...prev, empty()]);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/lists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setNotice({ type: "ok", text: `저장 완료 — ${spec.label} ${json.length}줄` });
      setDirty(false);
    } catch (e) {
      setNotice({ type: "error", text: `저장 실패 — ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  const restore = async () => {
    if (!confirm(`${spec.label}을(를) 기본값으로 되돌립니다. 지금 내용은 사라집니다.`)) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      await load(key);
      setNotice({ type: "ok", text: `기본값으로 되돌렸습니다 (${json.length}줄)` });
    } catch (e) {
      setNotice({ type: "error", text: `되돌리기 실패 — ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-n-900">목록 관리</h1>
          <p className="mt-1 text-sm text-n-600">
            사이트에 줄줄이 나오는 항목들을 고칩니다. 위 · 아래 버튼으로 순서를 바꿀 수 있습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className={`${BTN} bg-accent-600 text-white hover:bg-accent-700`}
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            type="button"
            onClick={() => load(key)}
            disabled={saving}
            className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
          >
            다시 불러오기
          </button>
          <button
            type="button"
            onClick={restore}
            disabled={saving}
            className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
          >
            기본값 불러오기
          </button>
        </div>
      </div>

      {/* 목록 고르기 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {LIST_SPECS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => {
              if (dirty && !confirm("저장하지 않은 수정이 있습니다. 버리고 옮길까요?")) return;
              setKey(s.key);
            }}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              s.key === key
                ? "bg-accent-100 font-medium text-accent-900"
                : "bg-n-50 text-n-600 hover:bg-n-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-4 rounded-md border border-n-100 bg-n-25 px-4 py-3 text-sm">
        <span className="font-medium text-n-900">{spec.label}</span>
        <span className="text-n-400"> · 나오는 곳: </span>
        <span className="text-n-600">{spec.where}</span>
        {spec.note && <p className="mt-1 text-[13px] text-n-600">{spec.note}</p>}
      </div>

      <Notice state={notice} />

      {loading ? (
        <p className="text-n-400">불러오는 중…</p>
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div
                key={i}
                className="rounded-lg border border-n-100 bg-n-0 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="tnum mt-2 w-6 shrink-0 text-sm text-n-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field
                      label={spec.f1}
                      value={r.f1}
                      onChange={(v) => patch(i, "f1", v)}
                    />
                    {spec.f2 && (
                      <Field
                        label={spec.f2}
                        value={r.f2}
                        onChange={(v) => patch(i, "f2", v)}
                      />
                    )}
                    {spec.f3 && (
                      <Field
                        label={spec.f3}
                        value={r.f3}
                        onChange={(v) => patch(i, "f3", v)}
                      />
                    )}
                    {spec.items && (
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-n-600">
                          {spec.items} — 한 줄에 하나씩
                        </label>
                        <textarea
                          rows={Math.max(3, r.items.length + 1)}
                          value={r.items.join("\n")}
                          onChange={(e) =>
                            patch(i, "items", e.target.value.split("\n"))
                          }
                          className={INPUT}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="위로"
                      className="rounded border border-n-200 px-2 py-0.5 text-xs text-n-600 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      aria-label="아래로"
                      className="rounded border border-n-200 px-2 py-0.5 text-xs text-n-600 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      aria-label="삭제"
                      className="rounded border border-danger/40 px-2 py-0.5 text-xs text-danger"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={add}
              className={`${BTN} border border-n-200 text-n-800 hover:border-n-400`}
            >
              + 줄 추가
            </button>
            <span className="text-sm text-n-400">{rows.length}줄</span>
            {dirty && (
              <span className="text-sm text-warning">저장하지 않은 수정이 있습니다</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-n-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </div>
  );
}
