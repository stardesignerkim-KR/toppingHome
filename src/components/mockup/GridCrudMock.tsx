import { C, FONT } from "./tokens";

/**
 * 업무 그리드 / CRUD 표준 화면 목업 (B등급 — 재구성 목업)
 *
 * 금융 계정계·정보계, 정부 차세대, ERP 에서 반복되는
 * "조회 조건 → 그리드 → 상세 폼" 3단 패턴을 보여 준다.
 */
export default function GridCrudMock({
  title = "업무 그리드 표준 화면",
}: {
  title?: string;
}) {
  const rows = 8;

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      role="img"
      aria-label="업무 그리드 표준 화면 목업 — 조회 조건, 데이터 그리드, 우측 상세 입력 폼"
    >
      <rect width="800" height="500" fill={C.n25} />

      {/* Top Frame */}
      <rect x="0" y="0" width="800" height="32" fill={C.n900} />
      <circle cx="16" cy="16" r="4" fill={C.a600} />
      <text x="28" y="20" fill={C.n25} fontSize="10" fontFamily={FONT}>
        {title}
      </text>

      {/* 탭 바 — 멀티 업무 동시 열기 */}
      <rect x="0" y="32" width="800" height="24" fill={C.n50} />
      {["거래 조회", "한도 관리", "승인 대기"].map((t, i) => (
        <g key={t}>
          <rect
            x={12 + i * 86}
            y="32"
            width="82"
            height="24"
            fill={i === 1 ? C.n0 : "transparent"}
          />
          {i === 1 && <rect x={12 + i * 86} y="32" width="82" height="2" fill={C.a600} />}
          <text
            x={22 + i * 86}
            y="48"
            fontSize="9"
            fontFamily={FONT}
            fill={i === 1 ? C.a600 : C.n600}
          >
            {t}
          </text>
        </g>
      ))}

      {/* 조회 조건 영역 */}
      <rect x="0" y="56" width="800" height="52" fill={C.n0} />
      <line x1="0" y1="108" x2="800" y2="108" stroke={C.n100} />
      {[
        { l: "기준일자", w: 90 },
        { l: "거래유형", w: 78 },
        { l: "처리상태", w: 78 },
      ].map((f, i) => {
        const x = 20 + i * 132;
        return (
          <g key={f.l}>
            <text x={x} y="78" fontSize="8" fill={C.n600} fontFamily={FONT}>
              {f.l}
            </text>
            <rect x={x} y="84" width={f.w} height="18" rx="3" fill={C.n0} stroke={C.n200} />
            <rect x={x + f.w - 14} y="90" width="6" height="6" rx="1" fill={C.n200} />
          </g>
        );
      })}
      <rect x="420" y="84" width="46" height="18" rx="4" fill={C.a600} />
      <text x="432" y="97" fontSize="8" fill={C.n0} fontFamily={FONT}>
        조회
      </text>
      <rect x="472" y="84" width="46" height="18" rx="4" fill={C.n0} stroke={C.n200} />
      <text x="484" y="97" fontSize="8" fill={C.n600} fontFamily={FONT}>
        초기화
      </text>

      {/* 그리드 툴바 */}
      <text x="20" y="128" fontSize="9" fill={C.n600} fontFamily={FONT}>
        조회 결과 <tspan fill={C.a600}>1,284</tspan>건 · 선택 2건
      </text>
      {["행 추가", "선택 삭제", "엑셀"].map((t, i) => (
        <g key={t}>
          <rect
            x={300 + i * 54}
            y="116"
            width="48"
            height="18"
            rx="4"
            fill={i === 1 ? C.n0 : C.n0}
            stroke={i === 1 ? "#FCA5A5" : C.n200}
          />
          <text
            x={310 + i * 54}
            y="129"
            fontSize="8"
            fontFamily={FONT}
            fill={i === 1 ? C.danger : C.n600}
          >
            {t}
          </text>
        </g>
      ))}

      {/* 그리드 */}
      <rect x="20" y="140" width="480" height="22" fill={C.n50} />
      <rect x="28" y="147" width="8" height="8" rx="2" fill={C.n0} stroke={C.n400} />
      {[
        { l: "거래번호", x: 50 },
        { l: "거래일시", x: 128 },
        { l: "거래유형", x: 214 },
        { l: "금액", x: 300 },
        { l: "상태", x: 400 },
        { l: "처리자", x: 450 },
      ].map((h) => (
        <text key={h.l} x={h.x} y="155" fontSize="8" fill={C.n600} fontFamily={FONT}>
          {h.l}
        </text>
      ))}

      {Array.from({ length: rows }, (_, i) => i).map((i) => {
        const y = 162 + i * 26;
        const checked = i === 1 || i === 4;
        return (
          <g key={i}>
            <rect
              x="20"
              y={y}
              width="480"
              height="26"
              fill={checked ? C.a50 : i % 2 === 1 ? C.n25 : C.n0}
            />
            <line x1="20" y1={y + 26} x2="500" y2={y + 26} stroke={C.n100} />
            <rect
              x="28"
              y={y + 9}
              width="8"
              height="8"
              rx="2"
              fill={checked ? C.a600 : C.n0}
              stroke={checked ? C.a600 : C.n400}
            />
            <text x="50" y={y + 17} fontSize="8" fill={C.n800} fontFamily={FONT}>
              TX-2026{String(1024 + i)}
            </text>
            <text x="128" y={y + 17} fontSize="8" fill={C.n600} fontFamily={FONT}>
              03-1{i} 14:2{i}
            </text>
            <text x="214" y={y + 17} fontSize="8" fill={C.n600} fontFamily={FONT}>
              {i % 3 === 0 ? "입금" : i % 3 === 1 ? "출금" : "이체"}
            </text>
            {/* 금액 — 우측 정렬 tnum */}
            <text
              x="380"
              y={y + 17}
              fontSize="8"
              fill={C.n900}
              fontFamily={FONT}
              textAnchor="end"
            >
              {(12_400_000 - i * 1_130_000).toLocaleString("ko-KR")}
            </text>
            <rect
              x="398"
              y={y + 6}
              width="34"
              height="14"
              rx="7"
              fill={i % 4 === 3 ? C.warningBg : C.successBg}
            />
            <text
              x="405"
              y={y + 16}
              fontSize="7"
              fontFamily={FONT}
              fill={i % 4 === 3 ? C.warning : C.success}
            >
              {i % 4 === 3 ? "대기" : "완료"}
            </text>
            <text x="450" y={y + 17} fontSize="8" fill={C.n600} fontFamily={FONT}>
              김담당
            </text>
          </g>
        );
      })}

      {/* 페이지네이션 */}
      {["◀", "1", "2", "3", "▶"].map((t, i) => (
        <g key={t}>
          <rect
            x={210 + i * 22}
            y="378"
            width="18"
            height="16"
            rx="3"
            fill={i === 1 ? C.a600 : C.n0}
            stroke={i === 1 ? C.a600 : C.n200}
          />
          <text
            x={216 + i * 22}
            y="390"
            fontSize="7"
            fontFamily={FONT}
            fill={i === 1 ? C.n0 : C.n600}
          >
            {t}
          </text>
        </g>
      ))}

      {/* 우측 — 상세 폼 */}
      <rect x="512" y="140" width="268" height="300" rx="6" fill={C.n0} stroke={C.n100} />
      <rect x="512" y="140" width="268" height="26" rx="6" fill={C.n50} />
      <rect x="512" y="158" width="268" height="8" fill={C.n50} />
      <text x="526" y="157" fontSize="9" fill={C.n900} fontFamily={FONT}>
        상세 · TX-20261025
      </text>
      {[
        "거래번호",
        "거래일시",
        "거래유형",
        "금액",
        "적요",
      ].map((l, i) => (
        <g key={l}>
          <text x="526" y={192 + i * 36} fontSize="8" fill={C.n600} fontFamily={FONT}>
            {l}
            {i < 4 && (
              <tspan fill={C.a600} dx="3">
                *
              </tspan>
            )}
          </text>
          <rect
            x="592"
            y={180 + i * 36}
            width="174"
            height="18"
            rx="3"
            fill={i === 0 ? C.n50 : C.n0}
            stroke={C.n200}
          />
          <rect
            x="600"
            y={187 + i * 36}
            width={i === 0 ? 70 : 100 - i * 8}
            height="5"
            rx="2"
            fill={C.n200}
          />
        </g>
      ))}
      <line x1="526" y1="368" x2="766" y2="368" stroke={C.n100} />
      <text x="526" y="386" fontSize="8" fill={C.n400} fontFamily={FONT}>
        최종 수정 2026-03-18 14:22 · 김담당
      </text>
      <rect x="592" y="402" width="52" height="22" rx="5" fill={C.n0} stroke={C.n200} />
      <text x="606" y="417" fontSize="9" fill={C.n600} fontFamily={FONT}>
        취소
      </text>
      <rect x="652" y="402" width="52" height="22" rx="5" fill={C.n0} stroke="#FCA5A5" />
      <text x="666" y="417" fontSize="9" fill={C.danger} fontFamily={FONT}>
        삭제
      </text>
      <rect x="712" y="402" width="54" height="22" rx="5" fill={C.a600} />
      <text x="728" y="417" fontSize="9" fill={C.n0} fontFamily={FONT}>
        저장
      </text>

      {/* 하단 상태바 */}
      <rect x="0" y="470" width="800" height="30" fill={C.n50} />
      <line x1="0" y1="470" x2="800" y2="470" stroke={C.n100} />
      <circle cx="24" cy="485" r="4" fill={C.success} />
      <text x="36" y="489" fontSize="8" fill={C.n600} fontFamily={FONT}>
        저장되었습니다 · 응답 0.4초
      </text>
      <text x="700" y="489" fontSize="8" fill={C.n400} fontFamily={FONT}>
        F8 저장 · F9 조회
      </text>
    </svg>
  );
}
