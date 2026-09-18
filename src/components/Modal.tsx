"use client";

import { useRef } from "react";

/**
 * 참고자료 뷰어.
 * 37단계 FLOW · 업무표준 정의서 목차처럼 본문에서 강조하지 않을 내용을
 * 작은 링크 → 팝업으로 연다. <dialog>라 포커스 트랩·ESC가 기본 제공된다.
 */
export default function Modal({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="text-[15px] font-medium text-accent-600 underline underline-offset-4 hover:text-accent-700"
      >
        {label} →
      </button>

      <dialog
        ref={ref}
        className="m-auto w-[min(720px,calc(100vw-32px))] max-h-[85vh]"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex max-h-[85vh] flex-col rounded-lg border border-n-100 bg-n-0">
          <div className="flex items-center justify-between border-b border-n-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-n-900">{title}</h3>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="닫기"
              className="text-n-400 hover:text-n-800"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-6 text-[15px] leading-relaxed text-n-800">
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
