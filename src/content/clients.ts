import type { Industry } from "./ai-projects";

export type Client = {
  slug: string;
  name: string;
  industry: Industry;
  /** public/logos/<slug>.svg — 수집 후 배치 */
  logo?: string;
  logoDark?: string;
};

/** 21개. 로고 파일은 public/logos/ 에 추가 (topping7-client-logos.md 참조) */
export const CLIENTS: Client[] = [
  { slug: "sk-innovation", name: "SK이노베이션", industry: "manufacturing" },
  { slug: "emart", name: "이마트", industry: "etc" },
  { slug: "herald", name: "헤럴드", industry: "etc" },
  { slug: "seoulmilk", name: "서울우유", industry: "etc" },
  { slug: "chevrolet", name: "쉐보레", industry: "manufacturing" },
  { slug: "nhis", name: "국민건강보험공단", industry: "public" },
  { slug: "lg-chem", name: "LG화학", industry: "manufacturing" },
  { slug: "korean-air", name: "대한항공", industry: "manufacturing" },
  { slug: "kt", name: "kt", industry: "etc" },
  { slug: "hana-bank", name: "하나은행", industry: "finance" },
  { slug: "knoc", name: "한국석유공사", industry: "public" },
  { slug: "btv", name: "B tv", industry: "etc" },
  { slug: "nh-bank", name: "NH농협은행", industry: "finance" },
  { slug: "seoul", name: "서울특별시", industry: "public" },
  { slug: "jtbc", name: "JTBC", industry: "etc" },
  { slug: "tbd", name: "(미식별)", industry: "etc" }, // TODO: 원본 이미지 확인
  { slug: "cj", name: "CJ", industry: "etc" },
  { slug: "uplus-tv", name: "U+ tv", industry: "etc" },
  { slug: "nissan", name: "NISSAN", industry: "manufacturing" },
  { slug: "kita", name: "한국무역협회", industry: "public" },
  { slug: "hana-securities", name: "하나증권", industry: "finance" },
];
