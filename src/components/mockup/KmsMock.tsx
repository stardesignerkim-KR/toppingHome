import { C, FONT } from "./tokens";

/**
 * KMS AI 시스템 UI 목업 (B등급 — 재구성 목업)
 *
 * 실제 발주처 화면이 아니다. 실데이터·기관 로고 없이 UI 패턴만 재현한다.
 */
export default function KmsMock({ title = "KMS AI 시스템" }: { title?: string }) {
  const docs = [
    { t: "2024 리서치 리포트 · 반도체", meta: "리서치본부 · 2024.11", score: "98%" },
    { t: "상품 가입 절차 안내서 v4", meta: "상품기획팀 · 2024.09", score: "91%" },
    { t: "내부통제 기준 개정 공지", meta: "준법감시부 · 2024.08", score: "84%" },
  ];

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      role="img"
      aria-label="KMS AI 시스템 화면 목업 — 좌측 지식 분류 트리, 중앙 검색 결과, 우측 AI 요약"
    >
      <rect width="800" height="500" fill={C.n25} />

      {/* Top Frame */}
      <rect x="0" y="0" width="800" height="36" fill={C.n900} />
      <circle cx="18" cy="18" r="5" fill={C.a600} />
      <text x="32" y="22" fill={C.n25} fontSize="11" fontFamily={FONT}>
        {title}
      </text>

      {/* 좌측 — 지식 분류 트리 */}
      <rect x="0" y="36" width="160" height="464" fill={C.n50} />
      <text x="14" y="60" fill={C.n400} fontSize="9" fontFamily={FONT}>
        지식 분류
      </text>
      {["리서치", "상품", "규정·준법", "영업지원"].map((t, i) => (
        <g key={t}>
          <rect
            x="8"
            y={70 + i * 46}
            width="144"
            height="20"
            rx="4"
            fill={i === 0 ? C.a50 : "transparent"}
          />
          <text
            x="18"
            y={84 + i * 46}
            fontSize="10"
            fontFamily={FONT}
            fill={i === 0 ? C.a600 : C.n600}
          >
            {t}
          </text>
          <text x="30" y={102 + i * 46} fontSize="9" fill={C.n400} fontFamily={FONT}>
            하위 분류 3
          </text>
        </g>
      ))}
      <text x="14" y="290" fill={C.n400} fontSize="9" fontFamily={FONT}>
        최근 본 문서
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x="14" y={302 + i * 16} width={116 - i * 18} height="6" rx="3" fill={C.n200} />
      ))}

      {/* 중앙 — 검색 + 결과 */}
      <rect x="160" y="36" width="400" height="464" fill={C.n0} />
      <line x1="160" y1="36" x2="160" y2="500" stroke={C.n100} />

      <rect x="180" y="56" width="360" height="32" rx="8" fill={C.n0} stroke={C.n200} />
      <circle cx="198" cy="72" r="5" fill="none" stroke={C.n400} strokeWidth="1.5" />
      <line x1="202" y1="76" x2="206" y2="80" stroke={C.n400} strokeWidth="1.5" />
      <text x="216" y="76" fontSize="10" fill={C.n800} fontFamily={FONT}>
        반도체 업황 전망 관련 내부 자료
      </text>
      <rect x="498" y="62" width="34" height="20" rx="6" fill={C.a600} />
      <text x="506" y="76" fontSize="9" fill={C.n0} fontFamily={FONT}>
        검색
      </text>

      {/* 필터 칩 */}
      {["전체", "리서치", "2024년", "PDF"].map((t, i) => (
        <g key={t}>
          <rect
            x={180 + i * 54}
            y="100"
            width="48"
            height="18"
            rx="9"
            fill={i === 0 ? C.a100 : C.n50}
          />
          <text
            x={190 + i * 54}
            y="112"
            fontSize="8"
            fontFamily={FONT}
            fill={i === 0 ? C.a900 : C.n600}
          >
            {t}
          </text>
        </g>
      ))}
      <text x="480" y="113" fontSize="8" fill={C.n400} fontFamily={FONT}>
        검색 결과 128건
      </text>

      {/* 결과 카드 */}
      {docs.map((d, i) => (
        <g key={d.t}>
          <rect
            x="180"
            y={132 + i * 76}
            width="360"
            height="64"
            rx="6"
            fill={i === 0 ? C.a50 : C.n0}
            stroke={i === 0 ? C.a200 : C.n100}
          />
          <rect x="192" y={144 + i * 76} width="22" height="14" rx="3" fill={C.n100} />
          <text x="196" y={155 + i * 76} fontSize="7" fill={C.n600} fontFamily={FONT}>
            PDF
          </text>
          <text x="222" y={155 + i * 76} fontSize="10" fill={C.n900} fontFamily={FONT}>
            {d.t}
          </text>
          <text x="192" y={173 + i * 76} fontSize="8" fill={C.n400} fontFamily={FONT}>
            {d.meta}
          </text>
          <rect x="192" y={180 + i * 76} width="300" height="5" rx="2" fill={C.n100} />
          <rect x="484" y={142 + i * 76} width="44" height="16" rx="8" fill={C.n0} stroke={C.a200} />
          <text x="492" y={153 + i * 76} fontSize="8" fill={C.a800} fontFamily={FONT}>
            {d.score}
          </text>
        </g>
      ))}

      {/* 우측 — AI 요약 */}
      <rect x="560" y="36" width="240" height="464" fill={C.n25} />
      <line x1="560" y1="36" x2="560" y2="500" stroke={C.n100} />
      <rect x="574" y="56" width="58" height="16" rx="8" fill={C.a600} />
      <text x="582" y="68" fontSize="8" fill={C.n0} fontFamily={FONT}>
        AI 요약
      </text>

      <rect x="574" y="84" width="212" height="120" rx="6" fill={C.n0} stroke={C.n100} />
      <text x="586" y="104" fontSize="9" fill={C.n900} fontFamily={FONT}>
        검색된 3개 문서의 공통 결론
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="586"
          y={116 + i * 14}
          width={188 - (i % 2) * 40}
          height="5"
          rx="2"
          fill={C.n100}
        />
      ))}
      <line x1="586" y1="178" x2="774" y2="178" stroke={C.n100} />
      <text x="586" y="194" fontSize="8" fill={C.a600} fontFamily={FONT}>
        인용 3건 · 원문 보기
      </text>

      <text x="574" y="230" fontSize="9" fill={C.n400} fontFamily={FONT}>
        연관 지식
      </text>
      {["2023 반도체 리포트", "업황 지표 대시보드", "애널리스트 코멘트"].map((t, i) => (
        <g key={t}>
          <rect x="574" y={242 + i * 28} width="212" height="22" rx="6" fill={C.n50} />
          <text x="584" y={256 + i * 28} fontSize="8" fill={C.n600} fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}

      <text x="574" y="356" fontSize="9" fill={C.n400} fontFamily={FONT}>
        권한
      </text>
      <rect x="574" y="366" width="212" height="34" rx="6" fill={C.n0} stroke={C.n100} />
      <circle cx="588" cy="383" r="5" fill={C.successBg} />
      <text x="600" y="386" fontSize="8" fill={C.n600} fontFamily={FONT}>
        열람 가능 · 대외비 제외
      </text>
    </svg>
  );
}
