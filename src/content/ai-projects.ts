export type Industry = "public" | "finance" | "manufacturing" | "etc";

export const INDUSTRY_LABEL: Record<Industry, string> = {
  public: "공공",
  finance: "금융",
  manufacturing: "제조·에너지·물류",
  etc: "기타",
};

export type AiProject = {
  id: string;
  org: string;
  systems: string[];
  industry: Industry;
  summary: string;
  thumbnail?: string;
  images?: { src: string; alt: string; caption?: string; grade: "A" | "B" | "C" }[];
};

/**
 * 3건 모두에 'AI 업무지원시스템'이 공통으로 들어간다.
 * 우연히 모인 AI 실적 3건이 아니라, 하나의 반복 가능한 제품을 세 곳에 납품한 것.
 */
export const AI_PROJECTS: AiProject[] = [
  {
    id: "gyeonggi",
    org: "경기도청",
    systems: ["AI 업무지원시스템"],
    industry: "public",
    summary: "광역자치단체 업무 흐름에 생성형 AI를 결합한 업무지원시스템 UIUX",
  },
  {
    id: "daishin",
    org: "대신증권",
    systems: ["KMS AI 시스템", "AI 업무지원시스템"],
    industry: "finance",
    summary: "지식관리(KMS)와 AI를 결합한 증권사 사내 업무지원 플랫폼 UIUX",
  },
  {
    id: "hrdi",
    org: "직업능률개발원",
    systems: ["원격훈련 AI 심사시스템", "AI 업무지원시스템"],
    industry: "public",
    summary: "원격훈련 과정 심사 업무에 AI를 적용한 심사·업무지원시스템 UIUX",
  },
];

/** AI Service UIUX 10 */
export const AI_CAPABILITIES = [
  { title: "AI UIUX Flow", desc: "Multi-turn 대화 흐름 설계" },
  { title: "AI UIUX Architecture", desc: "LLM Orchestration 구조 설계" },
  { title: "AI Navigation Bar", desc: "기본바 · 미니바" },
  { title: "AI Chatting Panel", desc: "기본모드 · 채팅모드" },
  { title: "AI Utility Bar", desc: "출처 · 인용 · 프롬프트 라이브러리 · Filter" },
  { title: "AI 폴더메인", desc: "대화·자료의 폴더 구조" },
  { title: "AI 스마트 도우미", desc: "업무 맥락 기반 보조" },
  { title: "AI Setting", desc: "모델·권한·개인화 설정" },
  { title: "AI Third party 검색 연동", desc: "외부 검색 결과 통합" },
  { title: "iRAG 데이터 표시", desc: "근거 데이터 노출 방식" },
] as const;
