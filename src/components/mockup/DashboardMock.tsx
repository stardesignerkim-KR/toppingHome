import { C, FONT } from "./tokens";

/**
 * 업무 통계 대시보드 목업 (B등급 — 재구성 목업)
 *
 * 실데이터가 아니다. 숫자는 모두 예시값이다.
 * KPI → 추이 → 구성 → 처리 대기 순으로 읽히는 정보 위계를 보여 준다.
 */
export default function DashboardMock({
  title = "업무 통계 대시보드",
}: {
  title?: string;
}) {
  const kpis = [
    { l: "금일 처리", v: "1,284", d: "+12.4%", up: true },
    { l: "처리 대기", v: "38", d: "-6건", up: false },
    { l: "평균 처리시간", v: "4.2분", d: "-0.8분", up: false },
    { l: "AI 자동처리율", v: "62%", d: "+9%p", up: true },
  ];

  // 추이 꺾은선 — 12개 지점
  const series = [38, 44, 41, 52, 49, 61, 58, 70, 66, 78, 74, 86];
  const x0 = 44;
  const x1 = 420;
  const yTop = 214;
  const yBot = 314;
  const max = 100;
  const pts = series
    .map((v, i) => {
      const x = x0 + (i * (x1 - x0)) / (series.length - 1);
      const y = yBot - (v / max) * (yBot - yTop);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${x0},${yBot} ${pts} ${x1},${yBot}`;

  // 도넛 — 구성비
  const donut = [
    { l: "자동", v: 62, c: C.a600 },
    { l: "반자동", v: 23, c: C.a200 },
    { l: "수기", v: 15, c: C.n200 },
  ];
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  let acc = 0;

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      role="img"
      aria-label="업무 통계 대시보드 목업 — 상단 KPI 4개, 처리량 추이 그래프, 처리 방식 구성비, 처리 대기 목록"
    >
      <rect width="800" height="500" fill={C.n25} />

      {/* Top Frame */}
      <rect x="0" y="0" width="800" height="36" fill={C.n900} />
      <circle cx="18" cy="18" r="5" fill={C.a600} />
      <text x="32" y="22" fill={C.n25} fontSize="11" fontFamily={FONT}>
        {title}
      </text>
      {["일간", "주간", "월간"].map((t, i) => (
        <g key={t}>
          <rect
            x={620 + i * 56}
            y="10"
            width="50"
            height="16"
            rx="8"
            fill={i === 0 ? C.a600 : C.n800}
          />
          <text
            x={636 + i * 56}
            y="22"
            fontSize="8"
            fontFamily={FONT}
            fill={i === 0 ? C.n0 : C.n400}
          >
            {t}
          </text>
        </g>
      ))}

      {/* KPI 카드 */}
      {kpis.map((k, i) => (
        <g key={k.l}>
          <rect
            x={24 + i * 190}
            y="60"
            width="174"
            height="84"
            rx="8"
            fill={C.n0}
            stroke={C.n100}
          />
          <text x={42 + i * 190} y="84" fontSize="9" fill={C.n400} fontFamily={FONT}>
            {k.l}
          </text>
          <text
            x={42 + i * 190}
            y="116"
            fontSize="26"
            fill={C.n900}
            fontFamily={FONT}
            fontWeight="600"
          >
            {k.v}
          </text>
          <text
            x={42 + i * 190}
            y="134"
            fontSize="9"
            fontFamily={FONT}
            fill={k.up ? C.success : C.a600}
          >
            {k.up ? "▲" : "▼"} {k.d}
          </text>
        </g>
      ))}

      {/* 추이 카드 */}
      <rect x="24" y="160" width="424" height="184" rx="8" fill={C.n0} stroke={C.n100} />
      <text x="42" y="184" fontSize="10" fill={C.n900} fontFamily={FONT} fontWeight="600">
        처리량 추이
      </text>
      <text x="42" y="200" fontSize="8" fill={C.n400} fontFamily={FONT}>
        최근 12개월 · 단위 건
      </text>
      {/* 가로 기준선 */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={x0}
          y1={yTop + i * ((yBot - yTop) / 3)}
          x2={x1}
          y2={yTop + i * ((yBot - yTop) / 3)}
          stroke={C.n100}
        />
      ))}
      <polygon points={area} fill={C.a50} />
      <polyline points={pts} fill="none" stroke={C.a600} strokeWidth="2" />
      {series.map((v, i) => {
        const x = x0 + (i * (x1 - x0)) / (series.length - 1);
        const y = yBot - (v / max) * (yBot - yTop);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === series.length - 1 ? 3.5 : 2}
            fill={i === series.length - 1 ? C.a600 : C.n0}
            stroke={C.a600}
          />
        );
      })}
      {["1월", "4월", "7월", "10월", "12월"].map((t, i) => (
        <text
          key={t}
          x={x0 + (i * (x1 - x0)) / 4}
          y="330"
          fontSize="7"
          fill={C.n400}
          fontFamily={FONT}
          textAnchor="middle"
        >
          {t}
        </text>
      ))}

      {/* 구성비 도넛 */}
      <rect x="464" y="160" width="312" height="184" rx="8" fill={C.n0} stroke={C.n100} />
      <text x="482" y="184" fontSize="10" fill={C.n900} fontFamily={FONT} fontWeight="600">
        처리 방식 구성
      </text>
      <g transform="translate(556, 264) rotate(-90)">
        {donut.map((d) => {
          const len = (d.v / 100) * CIRC;
          const el = (
            <circle
              key={d.l}
              r={R}
              fill="none"
              stroke={d.c}
              strokeWidth="18"
              strokeDasharray={`${len} ${CIRC - len}`}
              strokeDashoffset={-acc}
            />
          );
          acc += len;
          return el;
        })}
      </g>
      <text
        x="556"
        y="262"
        fontSize="18"
        fill={C.n900}
        fontFamily={FONT}
        fontWeight="600"
        textAnchor="middle"
      >
        62%
      </text>
      <text x="556" y="278" fontSize="8" fill={C.n400} fontFamily={FONT} textAnchor="middle">
        AI 자동
      </text>
      {donut.map((d, i) => (
        <g key={d.l}>
          <rect x="640" y={222 + i * 26} width="10" height="10" rx="2" fill={d.c} />
          <text x="658" y={231 + i * 26} fontSize="9" fill={C.n600} fontFamily={FONT}>
            {d.l}
          </text>
          <text
            x="756"
            y={231 + i * 26}
            fontSize="9"
            fill={C.n900}
            fontFamily={FONT}
            textAnchor="end"
          >
            {d.v}%
          </text>
        </g>
      ))}

      {/* 처리 대기 목록 */}
      <rect x="24" y="360" width="752" height="120" rx="8" fill={C.n0} stroke={C.n100} />
      <text x="42" y="384" fontSize="10" fill={C.n900} fontFamily={FONT} fontWeight="600">
        처리 대기
      </text>
      <text x="108" y="384" fontSize="9" fill={C.a600} fontFamily={FONT}>
        38건
      </text>
      <text x="720" y="384" fontSize="8" fill={C.n400} fontFamily={FONT}>
        전체 보기
      </text>
      <line x1="42" y1="394" x2="758" y2="394" stroke={C.n100} />
      {[
        { t: "예산 집행 승인 요청", w: "재무팀", d: "2시간 경과", lv: "높음" },
        { t: "민원 회신 검토", w: "민원실", d: "40분 경과", lv: "보통" },
        { t: "월간 통계 확정", w: "기획팀", d: "10분 경과", lv: "보통" },
      ].map((r, i) => (
        <g key={r.t}>
          <circle cx="50" cy={412 + i * 24} r="3" fill={i === 0 ? C.warning : C.n200} />
          <text x="64" y={416 + i * 24} fontSize="9" fill={C.n900} fontFamily={FONT}>
            {r.t}
          </text>
          <text x="280" y={416 + i * 24} fontSize="9" fill={C.n600} fontFamily={FONT}>
            {r.w}
          </text>
          <text x="380" y={416 + i * 24} fontSize="9" fill={C.n400} fontFamily={FONT}>
            {r.d}
          </text>
          <rect
            x="470"
            y={404 + i * 24}
            width="38"
            height="15"
            rx="7"
            fill={i === 0 ? C.warningBg : C.n50}
          />
          <text
            x="478"
            y={415 + i * 24}
            fontSize="7"
            fontFamily={FONT}
            fill={i === 0 ? C.warning : C.n600}
          >
            {r.lv}
          </text>
          <rect
            x="694"
            y={404 + i * 24}
            width="42"
            height="16"
            rx="5"
            fill={i === 0 ? C.a600 : C.n0}
            stroke={i === 0 ? C.a600 : C.n200}
          />
          <text
            x="704"
            y={415 + i * 24}
            fontSize="8"
            fontFamily={FONT}
            fill={i === 0 ? C.n0 : C.n600}
          >
            처리
          </text>
        </g>
      ))}
    </svg>
  );
}
