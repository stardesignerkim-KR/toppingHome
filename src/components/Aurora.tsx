/**
 * 흐르는 그라데이션 배경.
 *
 * WebGL 없이 CSS 만으로 만든다 — blur 한 원 세 개를 서로 다른 주기로 천천히 움직인다.
 * JS 0KB, 상시 렌더 없음. 애니메이션은 합성 단계에서만 돌아 CPU 를 거의 안 쓴다.
 * `prefers-reduced-motion` 이면 globals.css 가 통째로 숨긴다.
 */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aurora pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
    </div>
  );
}
