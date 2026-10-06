import { C } from "@/lib/design-tokens";

/**
 * 인지심리학 10법칙 미니 다이어그램.
 *
 * 각 그림은 법칙을 "설명"하지 않고 **일으킨다** — 피츠의 법칙은 커서가 실제로
 * 큰 타겟과 작은 타겟을 오가고, 힉의 법칙은 선택지가 실제로 줄어든다.
 * UIUX 회사가 법칙을 안다는 걸 글이 아니라 화면으로 증명하는 자리다.
 *
 * 규칙
 * - viewBox 160×104 고정. 목록 안에 들어가는 작은 그림이다
 * - 파스텔은 그림 안에서만. 버튼·링크에는 절대 쓰지 않는다
 * - 움직임은 `transform` / `opacity` 만. `.fig` 가 `transform-box` 를 걸어 준다
 * - `prefers-reduced-motion` 은 globals.css 가 통째로 끈다
 */
export type LawId =
  | "jakob" | "fitts" | "hick" | "miller" | "postel"
  | "peakend" | "aesthetic" | "restorff" | "tesler" | "doherty";

const W = 160;
const H = 104;

export default function LawFigure({ id, delay = 0 }: { id: LawId; delay?: number }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg
      className="fig h-auto w-full"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={LABEL[id]}
      style={{ "--fd": `${delay}ms` } as React.CSSProperties}
    >
      <rect width={W} height={H} rx="8" fill={C.n25} />
      <Art />
    </svg>
  );
}

const LABEL: Record<LawId, string> = {
  jakob: "익숙한 배치를 따르는 화면들",
  fitts: "타겟이 크고 가까울수록 빨리 닿는다",
  hick: "선택지가 줄면 고르기 쉬워진다",
  miller: "한 번에 기억하는 덩어리는 일곱 안팎",
  postel: "제각각인 입력을 하나의 형식으로 정리한다",
  peakend: "절정과 마지막이 기억을 좌우한다",
  aesthetic: "정돈된 화면이 더 잘 쓰인다고 느껴진다",
  restorff: "하나만 다르면 그것이 기억에 남는다",
  tesler: "복잡함은 사라지지 않고 옮겨진다",
  doherty: "400밀리초 안에 응답하면 몰입이 끊기지 않는다",
};

/* ── 01 제이콥 — 익숙한 멘탈모델 ───────────────── */
function Jakob() {
  return (
    <>
      {[10, 58, 106].map((x, i) => (
        <g key={x} className="fig-fade" style={{ "--i": i } as React.CSSProperties}>
          <rect x={x} y="18" width="44" height="68" rx="5" fill={C.n0} stroke={C.n200} />
          <rect x={x} y="18" width="44" height="11" rx="5" fill={C.teal100} />
          <rect x={x} y="24" width="44" height="5" fill={C.teal100} />
          <rect x={x + 6} y="36" width="14" height="42" rx="3" fill={C.n100} />
          <rect x={x + 24} y="36" width="14" height="5" rx="2" fill={C.n200} />
          <rect x={x + 24} y="45" width="14" height="5" rx="2" fill={C.n200} />
          <rect x={x + 24} y="54" width="10" height="5" rx="2" fill={C.n200} />
        </g>
      ))}
    </>
  );
}

/* ── 02 피츠 — 크기와 거리가 속도를 정한다 ───────── */
function Fitts() {
  return (
    <>
      <rect x="14" y="34" width="40" height="36" rx="6" fill={C.teal300} />
      <rect x="126" y="46" width="12" height="12" rx="3" fill={C.sand300} />
      <line x1="54" y1="52" x2="126" y2="52" stroke={C.n200} strokeDasharray="3 4" />
      <g className="fig-travel">
        <path d="M0 0 l0 11 l3 -3 l2 5 l2 -1 l-2 -5 l4 0 z" fill={C.n900} />
      </g>
      <text x="20" y="86" fontSize="7" fill={C.teal600} fontFamily="inherit">크고 가깝다</text>
      <text x="108" y="86" fontSize="7" fill={C.sand600} fontFamily="inherit">작고 멀다</text>
    </>
  );
}

/* ── 03 힉 — 선택지를 줄인다 ───────────────────── */
function Hick() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          className="fig-cull"
          style={{ "--i": i } as React.CSSProperties}
          x="16"
          y={14 + i * 12}
          width={i < 3 ? 60 : 52}
          height="8"
          rx="4"
          fill={i < 3 ? C.iris300 : C.n200}
        />
      ))}
      <path d="M92 52 h14 M101 47 l6 5 -6 5" stroke={C.n400} strokeWidth="1.4" fill="none" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="112" y={38 + i * 14} width="34" height="9" rx="4.5" fill={C.iris300} />
      ))}
    </>
  );
}

/* ── 04 밀러 — 7±2 덩어리 ─────────────────────── */
function Miller() {
  return (
    <>
      <rect x="12" y="30" width="62" height="44" rx="7" fill={C.n0} stroke={C.n200} strokeDasharray="4 4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle
          key={i}
          className="fig-pop"
          style={{ "--i": i } as React.CSSProperties}
          cx={24 + (i % 4) * 14}
          cy={44 + Math.floor(i / 4) * 18}
          r="5"
          fill={C.sand300}
        />
      ))}
      <text x="26" y="88" fontSize="8" fill={C.sand600} fontFamily="inherit">7 ± 2</text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <circle
          key={`x${i}`}
          cx={94 + (i % 4) * 12}
          cy={36 + Math.floor(i / 4) * 14}
          r="3.4"
          fill={C.n200}
        />
      ))}
      <line x1="92" y1="26" x2="146" y2="78" stroke={C.n400} strokeWidth="1.2" />
    </>
  );
}

/* ── 05 포스텔 — 입력은 관대하게, 출력은 엄격하게 ── */
function Postel() {
  const msgs = ["010-1234-5678", "01012345678", "010 1234 5678"];
  return (
    <>
      {msgs.map((t, i) => (
        <g key={t} className="fig-converge" style={{ "--i": i } as React.CSSProperties}>
          <rect x="8" y={16 + i * 22} width="62" height="15" rx="4" fill={C.n0} stroke={C.n200} />
          <text x="13" y={26 + i * 22} fontSize="6.5" fill={C.n600} fontFamily="inherit">{t}</text>
        </g>
      ))}
      <path d="M78 52 h12 M86 47 l5 5 -5 5" stroke={C.n400} strokeWidth="1.4" fill="none" />
      <rect x="92" y="42" width="60" height="20" rx="5" fill={C.teal100} stroke={C.teal300} />
      <text
        x="122"
        y="55"
        fontSize="6.4"
        fill={C.teal600}
        fontFamily="inherit"
        textAnchor="middle"
      >
        010-1234-5678
      </text>
    </>
  );
}

/* ── 06 피크엔드 — 절정과 마지막 ───────────────── */
function PeakEnd() {
  const pts = "12,74 32,60 52,66 72,24 92,52 112,46 140,70";
  return (
    <>
      <line x1="12" y1="84" x2="148" y2="84" stroke={C.n200} />
      <polyline points={pts} fill="none" stroke={C.n200} strokeWidth="2" />
      <circle className="fig-beat" cx="72" cy="24" r="6" fill={C.a600} />
      <circle className="fig-beat" style={{ "--i": 1 } as React.CSSProperties} cx="140" cy="70" r="6" fill={C.a600} />
      <text x="58" y="16" fontSize="7" fill={C.a600} fontFamily="inherit">절정</text>
      <text x="126" y="90" fontSize="7" fill={C.a600} fontFamily="inherit">마지막</text>
    </>
  );
}

/* ── 07 심미적 사용성 — 정돈된 쪽이 쉬워 보인다 ──── */
function Aesthetic() {
  return (
    <>
      <rect x="10" y="18" width="62" height="68" rx="6" fill={C.n0} stroke={C.n200} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={16 + (i % 2) * 3}
          y={26 + i * 10}
          width={38 + (i % 3) * 11}
          height="6"
          rx="2"
          fill={C.n200}
          transform={`rotate(${i % 2 ? -1.4 : 1.1} ${34} ${29 + i * 10})`}
        />
      ))}
      <rect x="88" y="18" width="62" height="68" rx="6" fill={C.n0} stroke={C.iris300} />
      <rect className="fig-sheen" x="88" y="18" width="62" height="68" rx="6" fill={C.iris100} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="96" y={26 + i * 10} width={i % 3 === 2 ? 30 : 46} height="6" rx="3" fill={C.iris300} />
      ))}
    </>
  );
}

/* ── 08 폰 레스토프 — 다른 하나가 남는다 ────────── */
function Restorff() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const odd = i === 6;
        return (
          <rect
            key={i}
            className={odd ? "fig-standout" : undefined}
            x={14 + (i % 5) * 27}
            y={i < 5 ? 26 : 58}
            width="20"
            height="20"
            rx="5"
            fill={odd ? C.a600 : C.n200}
          />
        );
      })}
    </>
  );
}

/* ── 09 테슬러 — 복잡성은 옮겨질 뿐 ─────────────── */
function Tesler() {
  return (
    <>
      <rect x="10" y="22" width="58" height="60" rx="6" fill={C.n0} stroke={C.n200} />
      <rect x="92" y="22" width="58" height="60" rx="6" fill={C.n0} stroke={C.n200} />
      <text x="20" y="16" fontSize="7" fill={C.n400} fontFamily="inherit">사용자</text>
      <text x="104" y="16" fontSize="7" fill={C.n400} fontFamily="inherit">시스템</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          className="fig-shift"
          style={{ "--i": i } as React.CSSProperties}
          x="20"
          y={32 + i * 10}
          width={38 - i * 3}
          height="6"
          rx="3"
          fill={C.sand300}
        />
      ))}
    </>
  );
}

/* ── 10 도허티 — 400ms ────────────────────────── */
function Doherty() {
  return (
    <>
      <rect x="14" y="44" width="132" height="14" rx="7" fill={C.n100} />
      <rect className="fig-fill" x="14" y="44" width="132" height="14" rx="7" fill={C.teal600} />
      <line x1="112" y1="34" x2="112" y2="68" stroke={C.a600} strokeDasharray="3 3" />
      <text x="92" y="30" fontSize="7" fill={C.a600} fontFamily="inherit">400ms</text>
      <text x="16" y="78" fontSize="7" fill={C.n400} fontFamily="inherit">이 안에 답하면 몰입이 끊기지 않는다</text>
    </>
  );
}

const ART: Record<LawId, () => React.ReactElement> = {
  jakob: Jakob,
  fitts: Fitts,
  hick: Hick,
  miller: Miller,
  postel: Postel,
  peakend: PeakEnd,
  aesthetic: Aesthetic,
  restorff: Restorff,
  tesler: Tesler,
  doherty: Doherty,
};

/** `COGNITIVE_LAWS` 의 순서와 1:1 로 맞춘다. 순서를 바꾸면 여기도 바꿀 것. */
export const LAW_ORDER: LawId[] = [
  "jakob", "fitts", "hick", "miller", "postel",
  "peakend", "aesthetic", "restorff", "tesler", "doherty",
];
