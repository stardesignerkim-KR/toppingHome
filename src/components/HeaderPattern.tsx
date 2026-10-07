import { C } from "@/lib/design-tokens";

/**
 * 페이지 헤더 배경 무늬.
 *
 * 사진 대신 코드로 그린다 — 용량이 0 이고, 저작권 문제가 없고,
 * 어느 해상도에서도 선명하다. 나중에 관리자(`/admin/이미지`)에서
 * 실제 이미지를 올리면 그쪽이 우선이고 이 무늬는 물러난다.
 *
 * 규칙
 * - 제목은 왼쪽에 놓이므로, 무늬는 오른쪽에만 보이게 마스크로 왼쪽을 지운다.
 * - 선은 뉴트럴, 버건디는 한두 군데만. 배경이 본문을 이기면 안 된다.
 * - viewBox 1200×360 · `xMaxYMid slice` — 화면이 좁아져도 오른쪽 끝을 붙잡는다.
 */
export type HeaderPatternId =
  | "home"
  | "ai"
  | "work"
  | "service"
  | "solution"
  | "about"
  | "contact";

export default function HeaderPattern({ pageId }: { pageId: HeaderPatternId }) {
  const mid = `hp-mask-${pageId}`;
  const gid = `hp-fade-${pageId}`;

  return (
    <svg
      // 좁은 화면에서는 감춘다. 세로로 길어지면 slice 가 오른쪽 일부만 확대해
      // 무늬가 제목 위로 올라온다. 장식이므로 없애는 편이 낫다.
      className="hp-anim pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* 검정 = 가림, 흰색 = 보임. 왼쪽(제목 자리)을 지운다. */}
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          {/*
            ⚠️ offset 에는 CSS 변수(var())를 쓸 수 없다.
               stop-color 와 달리 offset 은 CSS 속성이 아니라 SVG 속성이라
               브라우저가 "Expected number or percentage" 오류를 내고 0 으로 떨어진다.
               어두운 헤더에서는 무늬가 배경 그 자체이므로 넓게 편 값으로 고정한다.
          */}
          <stop offset="0%" stopColor="#000000" />
          <stop offset="6%" stopColor="#000000" />
          <stop offset="40%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <mask id={mid}>
          <rect width="1200" height="360" fill={`url(#${gid})`} />
        </mask>
      </defs>

      <g mask={`url(#${mid})`}>{ART[pageId]()}</g>
    </svg>
  );
}

/* ────────────────────────────────────────────── */

/** AI — 노드가 하나의 허브로 모이는 오케스트레이션 구조 */
function AiArt() {
  const hub: [number, number] = [980, 180];
  const nodes: [number, number][] = [
    [700, 64], [822, 38], [1060, 52], [1150, 116],
    [742, 168], [860, 132], [1108, 196],
    [706, 286], [846, 268], [988, 312], [1126, 300],
  ];
  return (
    <>
      {nodes.map(([x, y], i) => (
        <line
          key={`l${i}`}
          x1={hub[0]}
          y1={hub[1]}
          x2={x}
          y2={y}
          stroke={i % 4 === 0 ? "var(--hp-accent-soft)" : "var(--hp-line)"}
          strokeWidth="1"
          className="hp-flow"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={`n${i}`}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 7 : 4.5}
          fill="var(--hp-node)"
          stroke={i % 4 === 0 ? "var(--hp-accent)" : "var(--hp-line)"}
          strokeWidth="1.5"
          className="hp-node"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      <circle cx={hub[0]} cy={hub[1]} r="26" fill="var(--hp-wash)" />
      <circle cx={hub[0]} cy={hub[1]} r="26" fill="none" stroke="var(--hp-accent-soft)" />
      <circle cx={hub[0]} cy={hub[1]} r="9" fill="var(--hp-accent)" />
    </>
  );
}

/** Work — 해마다 쌓인 실적의 리듬 */
function WorkArt() {
  // 기준선은 y=300. 헤더가 낮아도 잘리지 않는 구간(약 39~321) 안에 둔다.
  const BASE = 300;
  const heights = [36, 60, 48, 80, 68, 106, 90, 132, 118, 156, 142, 184, 168, 206, 234];
  return (
    <>
      <line x1="620" y1={BASE} x2="1180" y2={BASE} stroke="var(--hp-line-strong)" />
      {heights.map((h, i) => {
        const accent = i >= heights.length - 3;
        return (
          <rect
            key={i}
            x={648 + i * 36}
            y={BASE - h}
            width="18"
            height={h}
            rx="3"
            fill={accent ? "var(--hp-accent-soft)" : "var(--hp-fill)"}
            stroke={accent ? "var(--hp-accent)" : "var(--hp-line)"}
            className="hp-grow"
            style={{ "--i": i } as React.CSSProperties}
          />
        );
      })}
    </>
  );
}

/** Service — 한 우물을 깊게 판 동심원. 움직임을 여러 겹 포갠다 */
function ServiceArt() {
  const cx = 1060;
  const cy = 180;
  return (
    <>
      {/* 1겹 — 바깥으로 퍼지는 파장 */}
      {[300, 258, 216, 174, 132, 90, 52].map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={i >= 5 ? "var(--hp-accent-soft)" : "var(--hp-line)"}
          strokeWidth={i >= 5 ? 1.5 : 1}
          className="hp-ring"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}

      {/* 2겹 — 부풀었다 가라앉는 아우라 */}
      <circle className="hp-aura" cx={cx} cy={cy} r="52" fill="var(--hp-aura)" />
      <circle className="hp-aura" style={{ "--i": 1 } as React.CSSProperties}
        cx={cx} cy={cy} r="34" fill="var(--hp-wash)" />

      {/* 3겹 — 궤도 위를 도는 점들 */}
      <g className="hp-orbit" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx + 132} cy={cy} r="5" fill={C.sand300} />
        <circle cx={cx - 132} cy={cy} r="4" fill={C.teal300} />
        <circle cx={cx} cy={cy - 132} r="4.5" fill={C.iris300} />
      </g>
      <g className="hp-orbit hp-orbit--slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx + 212} cy={cy - 40} r="3.5" fill="var(--hp-line-strong)" />
        <circle cx={cx - 190} cy={cy + 70} r="3" fill={C.sand300} />
      </g>

      {/* 4겹 — 한가운데는 계속 뛴다 */}
      <circle className="hp-core" cx={cx} cy={cy} r="14" fill="var(--hp-accent)" />
    </>
  );
}

/** Solution — 촘촘한 구형 격자가 정돈된 선으로 바뀌는 과정 */
function SolutionArt() {
  const oldCols = Array.from({ length: 9 }, (_, i) => 636 + i * 28);
  const oldRows = Array.from({ length: 9 }, (_, i) => 76 + i * 26);
  const newRows = Array.from({ length: 5 }, (_, i) => 92 + i * 44);
  return (
    <>
      {/* 구형: 전면 격자 */}
      {oldCols.map((x) => (
        <line key={`c${x}`} x1={x} y1="76" x2={x} y2="284" stroke="var(--hp-line)" />
      ))}
      {oldRows.map((y) => (
        <line key={`r${y}`} x1="636" y1={y} x2="860" y2={y} stroke="var(--hp-line)" />
      ))}

      {/* 변환 */}
      <g className="hp-push">
        <circle cx="916" cy="180" r="18" fill="var(--hp-accent)" />
        <path d="M909 180 h12 M917 175 l6 5 -6 5" stroke="var(--hp-node)" strokeWidth="1.8" fill="none" />
      </g>

      {/* 신형: 가로선만, 넉넉한 간격 */}
      {newRows.map((y, i) => (
        <g key={y}>
          <line x1="972" y1={y} x2="1180" y2={y} stroke="var(--hp-line-strong)" />
          <rect
            x="972"
            y={y - 14}
            width={i % 2 === 0 ? 96 : 64}
            height="8"
            rx="4"
            fill={i === 0 ? "var(--hp-accent-soft)" : "var(--hp-line)"}
          />
        </g>
      ))}
    </>
  );
}

/** About — 15년치가 켜켜이 쌓인 지층 */
function AboutArt() {
  const bands = Array.from({ length: 13 }, (_, i) => i);
  return (
    <>
      {bands.map((i) => {
        const y = 72 + i * 18;
        const inset = Math.abs(6 - i) * 11;
        const accent = i === 6;
        return (
          <rect
            key={i}
            x={664 + inset}
            y={y}
            width={508 - inset}
            height="11"
            rx="5.5"
            fill={accent ? "var(--hp-accent-soft)" : "var(--hp-fill)"}
            stroke={accent ? "var(--hp-accent-soft)" : "var(--hp-line)"}
            className="hp-band"
            style={{ "--i": i } as React.CSSProperties}
          />
        );
      })}
      <circle cx="1148" cy="180" r="6" fill="var(--hp-accent)" />
    </>
  );
}

/** Contact — 도트 그리드 위의 말풍선 하나 */
function ContactArt() {
  const dots: [number, number][] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 15; c++) dots.push([648 + c * 38, 58 + r * 36]);
  }
  return (
    <>
      {dots.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.2"
          fill="var(--hp-line-strong)"
          className="hp-twinkle"
          style={{ "--i": i % 17 } as React.CSSProperties}
        />
      ))}
      <path
        d="M900 112 h228 a12 12 0 0 1 12 12 v84 a12 12 0 0 1 -12 12 h-176 l-30 28 v-28 h-22 a12 12 0 0 1 -12 -12 v-84 a12 12 0 0 1 12 -12 z"
        fill="var(--hp-node)"
        stroke="var(--hp-accent)"
        strokeWidth="1.5"
      />
      <rect x="924" y="140" width="150" height="9" rx="4.5" fill="var(--hp-accent-soft)" />
      <rect x="924" y="162" width="186" height="8" rx="4" fill="var(--hp-line)" />
      <rect x="924" y="182" width="112" height="8" rx="4" fill="var(--hp-line)" />
    </>
  );
}

/** Home — 부드러운 번짐 위에 성긴 그물망 */
function HomeArt() {
  // 히어로 제목이 길다. 노드를 x≥860 안쪽에만 둬서 글자와 겹치지 않게 한다.
  const nodes: [number, number][] = [
    [876, 92], [988, 60], [1092, 108], [1170, 62],
    [908, 186], [1030, 158], [1140, 196],
    [866, 282], [982, 262], [1096, 300], [1176, 268],
  ];
  // 가까운 점끼리만 잇는다. 멀리 건너뛰면 낙서처럼 보인다.
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      if (Math.hypot(dx, dy) < 150) edges.push([i, j]);
    }
  }
  return (
    <>
      <defs>
        <radialGradient id="hp-home-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--hp-accent-soft)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--hp-wash)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="1030" cy="180" r="250" fill="url(#hp-home-glow)" />
      <g className="hp-drift">
      {edges.map(([i, j]) => (
        <line
          key={`${i}-${j}`}
          x1={nodes[i][0]}
          y1={nodes[i][1]}
          x2={nodes[j][0]}
          y2={nodes[j][1]}
          stroke="var(--hp-line)"
          strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => {
        const accent = i === 5;
        return (
          <circle
            key={`n${i}`}
            cx={x}
            cy={y}
            r={accent ? 7 : 4}
            fill={accent ? "var(--hp-accent)" : "var(--hp-node)"}
            stroke={accent ? "var(--hp-accent)" : "var(--hp-line-strong)"}
            strokeWidth="1.5"
          />
        );
      })}
      </g>
    </>
  );
}

const ART: Record<HeaderPatternId, () => React.ReactElement> = {
  home: HomeArt,
  ai: AiArt,
  work: WorkArt,
  service: ServiceArt,
  solution: SolutionArt,
  about: AboutArt,
  contact: ContactArt,
};
