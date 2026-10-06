import { FONT } from "./tokens";

/**
 * AI 업무지원시스템 UI 목업 (B등급 — 재구성 목업)
 *
 * 실제 발주처 화면이 아니다. 실데이터·기관 로고 없이 UI 패턴만 재현한다.
 * SVG 로 그리므로 이미지 파일이 필요 없고, 어느 해상도에서도 선명하다.
 */
export default function AiWorkspaceMock({
  title = "AI 업무지원시스템",
}: {
  title?: string;
}) {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" role="img"
      aria-label="AI 업무지원시스템 화면 목업 — 좌측 메뉴, 중앙 채팅 패널, 우측 근거 패널">
      <rect width="800" height="500" fill="#FAFAF9" />

      {/* Top Frame */}
      <rect x="0" y="0" width="800" height="36" fill="#1C1917" />
      <circle cx="18" cy="18" r="5" fill="#8B2035" />
      <text x="32" y="22" fill="#FAFAF9" fontSize="11" fontFamily={FONT}>{title}</text>
      <rect x="690" y="10" width="44" height="16" rx="8" fill="#292524" />
      <text x="700" y="22" fill="#A8A29E" fontSize="9" fontFamily={FONT}>담당자</text>

      {/* Left Frame — 메뉴 */}
      <rect x="0" y="36" width="150" height="464" fill="#F5F5F4" />
      <text x="14" y="60" fill="#A8A29E" fontSize="9" fontFamily={FONT}>업무</text>
      {["결재 문서", "민원 처리", "예산 집행", "통계 조회"].map((t, i) => (
        <g key={t}>
          <rect x="8" y={70 + i * 26} width="134" height="22" rx="4"
            fill={i === 1 ? "#FBF3F5" : "transparent"} />
          <text x="18" y={85 + i * 26} fontSize="10" fontFamily={FONT}
            fill={i === 1 ? "#8B2035" : "#57534E"}>{t}</text>
        </g>
      ))}
      <text x="14" y="200" fill="#A8A29E" fontSize="9" fontFamily={FONT}>AI 도우미</text>
      {["대화 기록", "프롬프트함", "업무 규정"].map((t, i) => (
        <text key={t} x="18" y={218 + i * 22} fontSize="10" fill="#57534E" fontFamily={FONT}>{t}</text>
      ))}

      {/* 중앙 — 채팅 패널 */}
      <rect x="150" y="36" width="440" height="464" fill="#FFFFFF" />
      <line x1="150" y1="36" x2="150" y2="500" stroke="#EAE9E7" />

      {/* 사용자 메시지 */}
      <rect x="300" y="60" width="270" height="34" rx="8" fill="#F5F5F4" />
      <text x="314" y="81" fontSize="10" fill="#292524" fontFamily={FONT}>
        작년 4분기 예산 집행 잔액 알려줘
      </text>

      {/* AI 응답 */}
      <rect x="170" y="110" width="330" height="96" rx="8" fill="#FBF3F5" />
      <text x="184" y="132" fontSize="10" fill="#1C1917" fontFamily={FONT}>
        4분기 집행 잔액은 1,284,000,000원입니다.
      </text>
      <text x="184" y="150" fontSize="10" fill="#57534E" fontFamily={FONT}>
        전 분기 대비 12.4% 감소했습니다.
      </text>
      <line x1="184" y1="162" x2="486" y2="162" stroke="#E8BFC9" />
      <text x="184" y="178" fontSize="8" fill="#8B2035" fontFamily={FONT}>근거</text>
      <rect x="208" y="169" width="88" height="13" rx="6" fill="#FFFFFF" stroke="#E8BFC9" />
      <text x="214" y="179" fontSize="8" fill="#6E1829" fontFamily={FONT}>예산집행내역.xlsx</text>
      <rect x="302" y="169" width="70" height="13" rx="6" fill="#FFFFFF" stroke="#E8BFC9" />
      <text x="308" y="179" fontSize="8" fill="#6E1829" fontFamily={FONT}>결산보고 4Q</text>
      <text x="184" y="197" fontSize="8" fill="#A8A29E" fontFamily={FONT}>
        출처 2건 · 생성 1.2초
      </text>

      {/* 입력창 */}
      <rect x="170" y="446" width="400" height="34" rx="8" fill="#FFFFFF" stroke="#D6D3D1" />
      <text x="184" y="467" fontSize="10" fill="#A8A29E" fontFamily={FONT}>
        업무에 대해 물어보세요
      </text>
      <rect x="536" y="452" width="26" height="22" rx="6" fill="#8B2035" />

      {/* Utility Bar */}
      <g>
        {["출처", "인용", "프롬프트", "필터"].map((t, i) => (
          <g key={t}>
            <rect x={170 + i * 62} y="418" width="56" height="18" rx="9"
              fill={i === 0 ? "#F5E1E6" : "#F5F5F4"} />
            <text x={180 + i * 62} y="430" fontSize="8" fontFamily={FONT}
              fill={i === 0 ? "#3F0D18" : "#57534E"}>{t}</text>
          </g>
        ))}
      </g>

      {/* 우측 — 근거 패널 */}
      <rect x="590" y="36" width="210" height="464" fill="#FAFAF9" />
      <line x1="590" y1="36" x2="590" y2="500" stroke="#EAE9E7" />
      <text x="604" y="60" fontSize="9" fill="#A8A29E" fontFamily={FONT}>근거 문서</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="602" y={72 + i * 62} width="186" height="52" rx="6"
            fill="#FFFFFF" stroke="#EAE9E7" />
          <rect x="612" y={84 + i * 62} width="60" height="7" rx="3" fill="#D6D3D1" />
          <rect x="612" y={97 + i * 62} width="140" height="5" rx="2" fill="#EAE9E7" />
          <rect x="612" y={107 + i * 62} width="110" height="5" rx="2" fill="#EAE9E7" />
        </g>
      ))}
      <text x="604" y="278" fontSize="9" fill="#A8A29E" fontFamily={FONT}>관련 업무</text>
      {[0, 1].map((i) => (
        <rect key={i} x="602" y={290 + i * 30} width="186" height="22" rx="6"
          fill="#F5F5F4" />
      ))}
    </svg>
  );
}
