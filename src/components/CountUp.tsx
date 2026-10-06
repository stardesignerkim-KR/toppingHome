"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어오면 0 에서 목표 숫자까지 센다.
 *
 * - 서버 렌더 결과는 처음부터 목표값이다. JS 가 없어도 숫자가 0 으로 남지 않는다.
 * - `tabular-nums` 가 걸려 있어야 세는 동안 폭이 안 흔들린다 (`.tnum`).
 */
export default function CountUp({
  to,
  duration = 1400,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          // easeOutExpo — 빠르게 올라갔다 부드럽게 멈춘다
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setN(Math.round(eased * to));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("ko-KR")}
    </span>
  );
}
