"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 스크롤 등장 담당. layout 에 한 번만 올린다.
 *
 * 서버 컴포넌트는 `data-reveal` 만 붙이면 된다. 지연은 `style={{ "--d": "80ms" }}`.
 *  - `data-reveal="block"` (기본) — 아래에서 떠오르며 페이드인
 *  - `data-reveal="words"`        — 글자를 단어로 쪼개 차례로 올라옴
 *
 * ⚠️ 숨기는 일(`opacity:0`)은 CSS 가 `[data-armed]` 에만 건다.
 *    그 속성을 여기서 붙이므로, JS 가 죽으면 아무것도 안 숨겨진다 — 내용은 늘 보인다.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    ).filter((el) => !el.dataset.armed);
    if (els.length === 0) return;

    for (const el of els) {
      if (el.dataset.reveal === "words") splitWords(el);
      el.dataset.armed = "";
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target); // 한 번 나타나면 끝. 오갈 때마다 깜빡이면 피곤하다
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}

/**
 * 텍스트를 단어 단위 span 으로 쪼갠다.
 * 자식이 순수 텍스트 하나일 때만 손댄다 — <strong> 같은 게 섞여 있으면
 * 쪼개다가 마크업이 깨지므로 블록 등장으로 물러선다.
 */
function splitWords(el: HTMLElement) {
  const only = el.childNodes.length === 1 ? el.firstChild : null;
  if (!only || only.nodeType !== Node.TEXT_NODE) {
    el.dataset.reveal = "block";
    return;
  }
  const text = only.textContent ?? "";
  if (!text.trim()) {
    el.dataset.reveal = "block";
    return;
  }

  const frag = document.createDocumentFragment();
  let i = 0;
  for (const piece of text.split(/(\s+)/)) {
    if (!piece) continue;
    if (!piece.trim()) {
      frag.appendChild(document.createTextNode(piece));
      continue;
    }
    const outer = document.createElement("span");
    outer.className = "rv-word";
    const inner = document.createElement("span");
    inner.className = "rv-word-in";
    inner.style.setProperty("--i", String(i++));
    inner.textContent = piece;
    outer.appendChild(inner);
    frag.appendChild(outer);
  }
  el.replaceChildren(frag);
}
