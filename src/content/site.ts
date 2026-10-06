export const SITE = {
  name: "주식회사 토핑인터랙티브",
  shortName: "TOPPING",
  // 배포 환경에서는 Vercel 환경변수 NEXT_PUBLIC_SITE_URL 로 덮어쓴다
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "AI 업무지원시스템 UIUX. 업무시스템 UIUX 15년, 공공·금융 3개 기관 구축.",
  founded: "2010년 4월",
  ceo: "김원근",
  address: "경기도 성남시 분당구 서현로 170 풍림아이원플러스 D-1907",
  tel: "070-8875-5559",
  direct: "010-3356-5773",
  email: "mswk777@naver.com",
} as const;

/** 히어로 카피 (확정) */
export const HERO = {
  headline: ["업무시스템 15년,", "그래서 우리가 만든 AI는 현업이 씁니다"],
  sub: "AI 업무지원시스템 · 공공·금융 3개 기관 구축",
  tagline: "Designing Intelligent Workflows that Think, Learn, and Perform",
} as const;

export const STATS = [
  { value: "15", unit: "년", label: "업무시스템 UIUX" },
  { value: "130", unit: "여 건", label: "수행 프로젝트" },
  { value: "3", unit: "개 기관", label: "AI 업무지원시스템 구축" },
] as const;

/** 서비스 분야 10종 */
export const SERVICE_FIELDS = [
  "AI Platform UIUX",
  "금융권 계정계 UIUX",
  "정보계 업무 표준 UIUX",
  "정부 업무 표준 UIUX",
  "기업 차세대 시스템 통합 표준 UIUX",
  "글로벌 물류시스템 위젯 UIUX",
  "기업 상품권시스템 UIUX",
  "시설관리 표준 UIUX",
  "Mobile-PC-TV 연동 디바이스 UIUX",
  "NEXACRO, X-PLATFORM 표준 UIUX",
] as const;

export const NAV = [
  { href: "/ai", label: "AI" },
  { href: "/work", label: "Work" },
  { href: "/service", label: "Service" },
  { href: "/solution", label: "Solution" },
  { href: "/about", label: "About" },
] as const;
