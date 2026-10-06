import { supabaseAdmin } from "./supabase";
import { SITE, HERO } from "@/content/site";

/**
 * 사이트 전역 텍스트를 DB(site_info)에서 읽어온다.
 *
 * 관리자(/admin/site)에서 저장한 값이 여기로 들어온다.
 * DB에 값이 없거나 연결이 실패하면 src/content/site.ts 의 기본값을 쓴다.
 * → DB가 죽어도 사이트는 계속 뜬다.
 *
 * 서버 컴포넌트에서만 호출할 것 (supabaseAdmin 사용).
 *
 * ⚠️ 필드를 추가할 때는 세 곳을 같이 고친다:
 *    1) SiteCopy 타입  2) DEFAULTS  3) KEY_MAP
 *    그리고 `/admin/site` 화면의 FIELDS 에도 넣어야 사람이 고칠 수 있다.
 */

export type SiteCopy = {
  /* 회사 */
  companyName: string;
  shortName: string;
  founded: string;
  ceo: string;
  address: string;
  tel: string;
  direct: string;
  email: string;
  description: string;
  /* 히어로 */
  heroHeadline1: string;
  heroHeadline2: string;
  heroSub: string;
  heroTagline: string;
  /* 법률 문서 시행일 */
  termsEffective: string;
  privacyEffective: string;
  /* 검색엔진 소유확인 코드 (등록 전에는 빈 값) */
  googleVerification: string;
  naverVerification: string;
};

const DEFAULTS: SiteCopy = {
  companyName: SITE.name,
  shortName: SITE.shortName,
  founded: SITE.founded,
  ceo: SITE.ceo,
  address: SITE.address,
  tel: SITE.tel,
  direct: SITE.direct,
  email: SITE.email,
  description: SITE.description,
  heroHeadline1: HERO.headline[0],
  heroHeadline2: HERO.headline[1],
  heroSub: HERO.sub,
  heroTagline: HERO.tagline,
  termsEffective: "2026년 9월 21일",
  privacyEffective: "2026년 9월 21일",
  googleVerification: "",
  naverVerification: "",
};

/** site_info.config_key ↔ SiteCopy 필드 */
export const KEY_MAP: Record<string, keyof SiteCopy> = {
  "company.name": "companyName",
  "company.shortName": "shortName",
  "company.founded": "founded",
  "company.ceo": "ceo",
  "company.address": "address",
  "company.tel": "tel",
  "company.direct": "direct",
  "company.email": "email",
  "company.description": "description",
  "hero.headline1": "heroHeadline1",
  "hero.headline2": "heroHeadline2",
  "hero.sub": "heroSub",
  "hero.tagline": "heroTagline",
  "legal.termsEffective": "termsEffective",
  "legal.privacyEffective": "privacyEffective",
  "search.googleVerification": "googleVerification",
  "search.naverVerification": "naverVerification",
};

export async function getSiteCopy(): Promise<SiteCopy> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_info")
      .select("config_key, config_value");

    if (error) throw error;

    const result = { ...DEFAULTS };
    (data ?? []).forEach((row) => {
      const field = KEY_MAP[row.config_key];
      if (field && typeof row.config_value === "string" && row.config_value.trim()) {
        result[field] = row.config_value;
      }
    });
    return result;
  } catch (e) {
    console.warn("[site-content] DB 조회 실패 — 기본값 사용:", (e as Error).message);
    return DEFAULTS;
  }
}

export { DEFAULTS as SITE_COPY_DEFAULTS };
