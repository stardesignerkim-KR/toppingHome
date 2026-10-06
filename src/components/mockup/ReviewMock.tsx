import { C, FONT } from "./tokens";

/**
 * 원격훈련 AI 심사시스템 UI 목업 (B등급 — 재구성 목업)
 *
 * 실제 발주처 화면이 아니다. 실데이터·기관 로고 없이 UI 패턴만 재현한다.
 * 핵심은 "AI 가 판정하고 사람이 확정한다" 는 흐름을 화면으로 보여 주는 것.
 */
export default function ReviewMock({
  title = "원격훈련 AI 심사시스템",
}: {
  title?: string;
}) {
  const items: { no: string; t: string; state: "pass" | "warn" | "fail"; conf: string }[] = [
    { no: "01", t: "훈련시간 충족 여부", state: "pass", conf: "99%" },
    { no: "02", t: "평가문항 난이도 분포", state: "warn", conf: "72%" },
    { no: "03", t: "콘텐츠 중복률", state: "fail", conf: "95%" },
    { no: "04", t: "교·강사 자격 요건", state: "pass", conf: "97%" },
  ];
  const stateColor = { pass: C.success, warn: C.warning, fail: C.danger };
  const stateBg = { pass: C.successBg, warn: C.warningBg, fail: "#FEE2E2" };
  const stateLabel = { pass: "적합", warn: "확인", fail: "부적합" };

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      role="img"
      aria-label="원격훈련 AI 심사시스템 화면 목업 — 심사 항목별 AI 판정과 신뢰도, 담당자 확정 영역"
    >
      <rect width="800" height="500" fill={C.n25} />

      {/* Top Frame */}
      <rect x="0" y="0" width="800" height="36" fill={C.n900} />
      <circle cx="18" cy="18" r="5" fill={C.a600} />
      <text x="32" y="22" fill={C.n25} fontSize="11" fontFamily={FONT}>
        {title}
      </text>
      <rect x="660" y="10" width="74" height="16" rx="8" fill={C.n800} />
      <text x="668" y="22" fill={C.n400} fontSize="9" fontFamily={FONT}>
        심사 2026-03
      </text>

      {/* 좌측 — 심사 대상 목록 */}
      <rect x="0" y="36" width="170" height="464" fill={C.n50} />
      <text x="14" y="60" fill={C.n400} fontSize="9" fontFamily={FONT}>
        심사 대기 24건
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x="8"
            y={70 + i * 44}
            width="154"
            height="36"
            rx="5"
            fill={i === 1 ? C.n0 : "transparent"}
            stroke={i === 1 ? C.a200 : "transparent"}
          />
          <rect x="18" y={80 + i * 44} width={96 - i * 8} height="6" rx="3" fill={C.n200} />
          <rect x="18" y={92 + i * 44} width="62" height="5" rx="2" fill={C.n100} />
          <circle
            cx="150"
            cy={88 + i * 44}
            r="4"
            fill={i < 2 ? C.warning : C.n200}
          />
        </g>
      ))}

      {/* 중앙 — 심사 항목 */}
      <rect x="170" y="36" width="400" height="464" fill={C.n0} />
      <line x1="170" y1="36" x2="170" y2="500" stroke={C.n100} />

      <text x="190" y="64" fontSize="12" fill={C.n900} fontFamily={FONT} fontWeight="600">
        AI 사전 판정 결과
      </text>
      <text x="190" y="82" fontSize="9" fill={C.n400} fontFamily={FONT}>
        90개 항목 중 확인이 필요한 4건
      </text>

      {/* 표 헤더 */}
      <rect x="190" y="94" width="360" height="22" fill={C.n50} />
      <text x="202" y="109" fontSize="8" fill={C.n600} fontFamily={FONT}>
        번호
      </text>
      <text x="234" y="109" fontSize="8" fill={C.n600} fontFamily={FONT}>
        심사 항목
      </text>
      <text x="418" y="109" fontSize="8" fill={C.n600} fontFamily={FONT}>
        AI 판정
      </text>
      <text x="482" y="109" fontSize="8" fill={C.n600} fontFamily={FONT}>
        신뢰도
      </text>
      <text x="522" y="109" fontSize="8" fill={C.n600} fontFamily={FONT}>
        근거
      </text>

      {items.map((it, i) => (
        <g key={it.no}>
          <rect
            x="190"
            y={116 + i * 34}
            width="360"
            height="34"
            fill={i === 2 ? C.a50 : C.n0}
          />
          <line
            x1="190"
            y1={150 + i * 34}
            x2="550"
            y2={150 + i * 34}
            stroke={C.n100}
          />
          <text x="202" y={137 + i * 34} fontSize="9" fill={C.n400} fontFamily={FONT}>
            {it.no}
          </text>
          <text x="234" y={137 + i * 34} fontSize="10" fill={C.n900} fontFamily={FONT}>
            {it.t}
          </text>
          <rect
            x="414"
            y={126 + i * 34}
            width="40"
            height="16"
            rx="8"
            fill={stateBg[it.state]}
          />
          <text
            x="423"
            y={137 + i * 34}
            fontSize="8"
            fill={stateColor[it.state]}
            fontFamily={FONT}
          >
            {stateLabel[it.state]}
          </text>
          {/* 신뢰도 바 */}
          <rect x="478" y={132 + i * 34} width="34" height="5" rx="2" fill={C.n100} />
          <rect
            x="478"
            y={132 + i * 34}
            width={(parseInt(it.conf, 10) / 100) * 34}
            height="5"
            rx="2"
            fill={C.a600}
          />
          <text x="478" y={128 + i * 34} fontSize="7" fill={C.n400} fontFamily={FONT}>
            {it.conf}
          </text>
          <rect
            x="520"
            y={126 + i * 34}
            width="22"
            height="16"
            rx="4"
            fill={C.n0}
            stroke={C.n200}
          />
          <text x="526" y={137 + i * 34} fontSize="8" fill={C.n600} fontFamily={FONT}>
            열람
          </text>
        </g>
      ))}

      {/* 담당자 확정 영역 */}
      <rect x="190" y="276" width="360" height="86" rx="6" fill={C.n25} stroke={C.n100} />
      <text x="204" y="296" fontSize="9" fill={C.a600} fontFamily={FONT}>
        담당자 확정
      </text>
      <text x="204" y="314" fontSize="9" fill={C.n600} fontFamily={FONT}>
        AI 판정은 참고 자료입니다. 최종 결정은 심사위원이 합니다.
      </text>
      <rect x="204" y="324" width="332" height="22" rx="4" fill={C.n0} stroke={C.n200} />
      <text x="214" y="339" fontSize="8" fill={C.n400} fontFamily={FONT}>
        의견을 입력하세요
      </text>
      <rect x="440" y="366" width="52" height="22" rx="5" fill={C.n0} stroke={C.n200} />
      <text x="452" y="381" fontSize="9" fill={C.n600} fontFamily={FONT}>
        보류
      </text>
      <rect x="498" y="366" width="52" height="22" rx="5" fill={C.a600} />
      <text x="510" y="381" fontSize="9" fill={C.n0} fontFamily={FONT}>
        확정
      </text>

      {/* 우측 — 근거 원문 */}
      <rect x="570" y="36" width="230" height="464" fill={C.n25} />
      <line x1="570" y1="36" x2="570" y2="500" stroke={C.n100} />
      <text x="584" y="60" fontSize="9" fill={C.n400} fontFamily={FONT}>
        근거 원문 · 03 콘텐츠 중복률
      </text>
      <rect x="584" y="72" width="202" height="150" rx="6" fill={C.n0} stroke={C.n100} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x="596"
          y={90 + i * 16}
          width={178 - (i % 3) * 36}
          height="5"
          rx="2"
          fill={i === 3 ? C.a200 : C.n100}
        />
      ))}
      <rect x="596" y="196" width="100" height="14" rx="4" fill={C.a50} />
      <text x="602" y="206" fontSize="7" fill={C.a800} fontFamily={FONT}>
        중복 구간 하이라이트
      </text>

      <text x="584" y="252" fontSize="9" fill={C.n400} fontFamily={FONT}>
        비교 대상
      </text>
      {["2025년 승인 과정 A", "2024년 승인 과정 B"].map((t, i) => (
        <g key={t}>
          <rect x="584" y={264 + i * 30} width="202" height="22" rx="6" fill={C.n50} />
          <text x="594" y={278 + i * 30} fontSize="8" fill={C.n600} fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}

      <text x="584" y="348" fontSize="9" fill={C.n400} fontFamily={FONT}>
        처리 이력
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx="590" cy={364 + i * 22} r="3" fill={i === 0 ? C.a600 : C.n200} />
          <line
            x1="590"
            y1={367 + i * 22}
            x2="590"
            y2={383 + i * 22}
            stroke={C.n100}
          />
          <rect x="602" y={360 + i * 22} width={120 - i * 24} height="5" rx="2" fill={C.n100} />
        </g>
      ))}
    </svg>
  );
}
