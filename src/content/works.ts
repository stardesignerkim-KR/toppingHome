import type { Industry } from "./ai-projects";

export type Work = {
  client: string;
  system: string;
  industry: Industry;
  tags?: string[];
  thumbnail?: string;
};

export const WORKS: Work[] = [
  // 금융
  { client: "하나증권", system: "비대면 계좌개설 UIUX", industry: "finance" },
  { client: "하나은행", system: "리빌드 프로젝트 UIUX", industry: "finance" },
  { client: "NH농협은행", system: "차세대 정보계시스템 UIUX", industry: "finance" },
  { client: "국민은행", system: "실시간 FX 외환거래시스템 UIUX", industry: "finance" },
  { client: "NH투자증권", system: "통합 Admin System UIUX", industry: "finance" },
  { client: "국민연금기금운용", system: "640조 차세대 업무시스템 UIUX", industry: "finance" },
  { client: "무역예금보험공사", system: "차세대 정보계 ISP UIUX", industry: "finance" },

  // 공공
  { client: "국민건강보험", system: "빅데이터 진료지원시스템 UIUX", industry: "public" },
  { client: "K-Water 수자원공사", system: "ISP 차세대 ERP UIUX", industry: "public" },
  { client: "SH공사", system: "차세대 시스템 ISMP UIUX", industry: "public" },
  { client: "한국특허전략개발원", system: "ALTICAST 인공지능 ICP시스템 UIUX", industry: "public" },
  { client: "식품의약품안전처", system: "차세대 업무시스템 UIUX", industry: "public" },
  { client: "환경부", system: "지능형 폐기물 안전처리관리 UIUX", industry: "public" },
  { client: "한국무역협회", system: "Kstat 차세대 UIUX", industry: "public" },

  // 제조·에너지·물류
  { client: "현대모비스(Europe)", system: "PLUS MPE 시스템 UIUX", industry: "manufacturing" },
  { client: "현대모비스(Europe)", system: "업무시스템 UIUX", industry: "manufacturing" },
  { client: "현대자동차그룹", system: "EMR 시스템 X-converting UIUX", industry: "manufacturing", tags: ["X-Converting"] },
  { client: "포스코DX", system: "LMS UIUX", industry: "manufacturing" },
  { client: "LG화학", system: "생명과학 CRM 포탈 UIUX", industry: "manufacturing" },
  { client: "SK GAS", system: "마케팅 인프라 UIUX", industry: "manufacturing" },
  { client: "SK에너지", system: "차세대 시설관리 업무 UIUX", industry: "manufacturing" },
  { client: "삼성엔지니어링", system: "Smart Safety Platform UIUX", industry: "manufacturing" },
  { client: "삼성전자", system: "글로벌물류시스템 위젯 UIUX", industry: "manufacturing" },
  { client: "HONDA KOREA", system: "HID 업무시스템 UIUX", industry: "manufacturing" },

  // 기타
  { client: "클라우다이크", system: "클라우드스토리지시스템 UIUX", industry: "etc" },
  { client: "하나투어", system: "8개 시스템 차세대 통합업무 UIUX", industry: "etc" },
  { client: "신세계상품권", system: "업무시스템 UIUX", industry: "etc" },
];
