import { C, FONT } from "./tokens";

/**
 * X-Converting Before / After 목업 (B등급 — 재구성 목업)
 *
 * 좌측은 CS 기반 구형 MIP 화면(회색·고밀도·작은 타겟),
 * 우측은 브라우저 기반 NX 화면(여백·계층·명확한 타겟).
 * 리소스는 그대로 두고 UI 만 현대화한다는 점을 한 장으로 보여 준다.
 */
export default function XConvertingMock({
  beforeLabel = "Before · CS 기반 MIP",
  afterLabel = "After · 브라우저 기반 NX",
}: {
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const OLD = { chrome: "#C9CDD2", panel: "#E4E7EA", line: "#9BA1A8", text: "#4A4F55" };

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      role="img"
      aria-label="X-Converting Before After 목업 — 좌측 구형 CS 화면, 우측 현대화한 브라우저 화면"
    >
      <rect width="800" height="500" fill={C.n25} />

      {/* ───── Before ───── */}
      <text x="24" y="28" fontSize="10" fill={C.n400} fontFamily={FONT}>
        {beforeLabel}
      </text>
      <rect x="24" y="40" width="348" height="420" rx="4" fill={OLD.panel} stroke={OLD.line} />

      {/* 구형 타이틀바 + 메뉴 */}
      <rect x="24" y="40" width="348" height="18" fill={OLD.chrome} />
      <text x="32" y="53" fontSize="8" fill={OLD.text} fontFamily={FONT}>
        업무시스템 [거래조회]
      </text>
      <rect x="24" y="58" width="348" height="14" fill={OLD.panel} />
      {["파일", "편집", "조회", "도구", "창", "도움말"].map((t, i) => (
        <text key={t} x={32 + i * 32} y="68" fontSize="7" fill={OLD.text} fontFamily={FONT}>
          {t}
        </text>
      ))}
      {/* 아이콘 툴바 — 작고 빽빽한 타겟 */}
      <rect x="24" y="72" width="348" height="16" fill={OLD.chrome} />
      {Array.from({ length: 14 }, (_, i) => i).map((i) => (
        <rect
          key={i}
          x={30 + i * 15}
          y="76"
          width="11"
          height="9"
          fill={OLD.panel}
          stroke={OLD.line}
        />
      ))}

      {/* 조회 조건 — 라벨과 입력이 붙어 있음 */}
      {Array.from({ length: 2 }, (_, r) => r).map((r) =>
        Array.from({ length: 4 }, (_, c) => c).map((c) => (
          <g key={`${r}-${c}`}>
            <text
              x={32 + c * 86}
              y={104 + r * 16}
              fontSize="6"
              fill={OLD.text}
              fontFamily={FONT}
            >
              항목{r * 4 + c + 1}
            </text>
            <rect
              x={58 + c * 86}
              y={96 + r * 16}
              width="52"
              height="11"
              fill="#FFFFFF"
              stroke={OLD.line}
            />
          </g>
        )),
      )}

      {/* 구형 그리드 — 촘촘한 행, 전면 격자 */}
      <rect x="32" y="132" width="332" height="12" fill={OLD.chrome} stroke={OLD.line} />
      {Array.from({ length: 7 }, (_, i) => i).map((i) => (
        <line
          key={`vh-${i}`}
          x1={32 + (i + 1) * 47}
          y1="132"
          x2={32 + (i + 1) * 47}
          y2="380"
          stroke={OLD.line}
        />
      ))}
      {Array.from({ length: 18 }, (_, i) => i).map((i) => (
        <g key={i}>
          <line
            x1="32"
            y1={144 + i * 13}
            x2="364"
            y2={144 + i * 13}
            stroke={OLD.line}
          />
          {Array.from({ length: 6 }, (_, c) => c).map((c) => (
            <rect
              key={c}
              x={38 + c * 47}
              y={136 + i * 13}
              width={34 - (c % 3) * 6}
              height="4"
              fill={OLD.line}
              opacity="0.5"
            />
          ))}
        </g>
      ))}
      <rect x="32" y="132" width="332" height="248" fill="none" stroke={OLD.line} />

      {/* 구형 버튼 — 작고 같은 무게 */}
      {["조회", "저장", "삭제", "출력", "닫기"].map((t, i) => (
        <g key={t}>
          <rect
            x={248 + i * 24}
            y="392"
            width="22"
            height="13"
            fill={OLD.chrome}
            stroke={OLD.line}
          />
          <text x={252 + i * 24} y="401" fontSize="6" fill={OLD.text} fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}
      <rect x="24" y="446" width="348" height="14" fill={OLD.chrome} />
      <text x="32" y="456" fontSize="6" fill={OLD.text} fontFamily={FONT}>
        Ready · 1284 rows
      </text>

      {/* ───── 변환 화살표 ───── */}
      {/* 두 패널 사이 간격이 56px 뿐이라, 가로로 쓰면 패널을 침범한다. 세로로 세운다. */}
      <g>
        <circle cx="400" cy="214" r="22" fill={C.a600} />
        <path d="M392 214 h14 M401 208 l7 6 -7 6" stroke={C.n0} strokeWidth="2" fill="none" />
        <g transform="translate(400, 248) rotate(90)">
          <text x="0" y="3" fontSize="9" fill={C.a600} fontFamily={FONT}>
            X-CONVERTING
          </text>
          <text x="92" y="3" fontSize="9" fill={C.n400} fontFamily={FONT}>
            · 리소스 유지
          </text>
        </g>
      </g>

      {/* ───── After ───── */}
      <text x="428" y="28" fontSize="10" fill={C.a600} fontFamily={FONT}>
        {afterLabel}
      </text>
      <rect x="428" y="40" width="348" height="420" rx="6" fill={C.n0} stroke={C.n100} />

      {/* 새 헤더 */}
      <rect x="428" y="40" width="348" height="30" rx="6" fill={C.n900} />
      <rect x="428" y="58" width="348" height="12" fill={C.n900} />
      <circle cx="444" cy="55" r="4" fill={C.a600} />
      <text x="456" y="59" fontSize="9" fill={C.n25} fontFamily={FONT}>
        거래 조회
      </text>
      <rect x="716" y="48" width="46" height="14" rx="7" fill={C.n800} />
      <text x="724" y="59" fontSize="7" fill={C.n400} fontFamily={FONT}>
        김담당
      </text>

      {/* 조회 조건 — 라벨 위, 여백 확보 */}
      {[
        { l: "기준일자", x: 448 },
        { l: "거래유형", x: 556 },
        { l: "처리상태", x: 664 },
      ].map((f) => (
        <g key={f.l}>
          <text x={f.x} y="92" fontSize="7" fill={C.n600} fontFamily={FONT}>
            {f.l}
          </text>
          <rect x={f.x} y="98" width="92" height="20" rx="4" fill={C.n0} stroke={C.n200} />
        </g>
      ))}
      <rect x="448" y="128" width="54" height="20" rx="5" fill={C.a600} />
      <text x="462" y="142" fontSize="8" fill={C.n0} fontFamily={FONT}>
        조회
      </text>
      <rect x="510" y="128" width="54" height="20" rx="5" fill={C.n0} stroke={C.n200} />
      <text x="524" y="142" fontSize="8" fill={C.n600} fontFamily={FONT}>
        초기화
      </text>

      {/* 새 그리드 — 가로줄만, 넉넉한 행높이 */}
      <line x1="448" y1="166" x2="756" y2="166" stroke={C.n100} />
      {["거래번호", "거래일시", "거래유형", "금액", "상태"].map((h, i) => (
        <text
          key={h}
          x={[448, 526, 602, 690, 722][i]}
          y="180"
          fontSize="7"
          fill={C.n400}
          fontFamily={FONT}
          textAnchor={i === 3 ? "end" : "start"}
        >
          {h}
        </text>
      ))}
      <line x1="448" y1="188" x2="756" y2="188" stroke={C.n100} />
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <g key={i}>
          <text x="448" y={206 + i * 26} fontSize="8" fill={C.n800} fontFamily={FONT}>
            TX-2026{1024 + i}
          </text>
          <text x="526" y={206 + i * 26} fontSize="8" fill={C.n600} fontFamily={FONT}>
            03-1{i} 14:2{i}
          </text>
          <text x="602" y={206 + i * 26} fontSize="8" fill={C.n600} fontFamily={FONT}>
            {i % 3 === 0 ? "입금" : i % 3 === 1 ? "출금" : "이체"}
          </text>
          <text
            x="690"
            y={206 + i * 26}
            fontSize="8"
            fill={C.n900}
            fontFamily={FONT}
            textAnchor="end"
          >
            {(12_400_000 - i * 1_130_000).toLocaleString("ko-KR")}
          </text>
          <rect
            x="712"
            y={196 + i * 26}
            width="32"
            height="13"
            rx="6"
            fill={i % 4 === 3 ? C.warningBg : C.successBg}
          />
          <text
            x="718"
            y={205 + i * 26}
            fontSize="6"
            fontFamily={FONT}
            fill={i % 4 === 3 ? C.warning : C.success}
          >
            {i % 4 === 3 ? "대기" : "완료"}
          </text>
          <line
            x1="448"
            y1={214 + i * 26}
            x2="756"
            y2={214 + i * 26}
            stroke={C.n100}
          />
        </g>
      ))}

      {/* 주 동작 하나만 강조 */}
      <rect x="626" y="424" width="58" height="24" rx="5" fill={C.n0} stroke={C.n200} />
      <text x="642" y="440" fontSize="8" fill={C.n600} fontFamily={FONT}>
        엑셀
      </text>
      <rect x="692" y="424" width="64" height="24" rx="5" fill={C.a600} />
      <text x="712" y="440" fontSize="8" fill={C.n0} fontFamily={FONT}>
        저장
      </text>

      {/* 하단 비교 라벨 */}
      <text x="24" y="482" fontSize="8" fill={C.n400} fontFamily={FONT}>
        클릭 타겟 11px · 전면 격자 · 동일 무게 버튼 5개
      </text>
      <text x="428" y="482" fontSize="8" fill={C.a600} fontFamily={FONT}>
        클릭 타겟 24px · 가로줄만 · 주 동작 1개
      </text>
    </svg>
  );
}
