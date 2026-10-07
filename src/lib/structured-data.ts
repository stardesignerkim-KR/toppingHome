import type { SiteCopy } from "./site-content";

/**
 * 구조화 데이터(JSON-LD) — 검색엔진이 읽는 회사 정보.
 *
 * 화면에는 안 보이지만 구글·네이버가 "이 회사는 무엇을 하는 곳인가"를
 * 판단할 때 쓴다. 예전에는 이 블록이 코드에 박혀 있어서,
 * 관리자에서 주소나 전화번호를 바꿔도 검색엔진에는 옛 정보가 계속 나갔다.
 * 그래서 저장된 회사 정보(SiteCopy)에서 매번 만들어 쓴다.
 */

/** "070-8875-5559" → "+82-70-8875-5559" (국제 표기) */
function toE164ish(tel: string) {
  const t = tel.trim();
  if (!t) return "";
  if (t.startsWith("+")) return t; // 이미 국가번호가 붙어 있으면 그대로
  // ⚠️ 숫자만 남기면 "+82-7088755559" 가 되어 구분이 사라진다.
  //    앞의 0 만 국가번호로 바꾸고 나머지 표기는 그대로 둔다.
  return t.startsWith("0") ? `+82-${t.slice(1)}` : `+82-${t}`;
}

/** "2010년 4월" → "2010-04" (schema.org 는 ISO 형식을 기대한다) */
function toIsoMonth(founded: string) {
  const m = founded.match(/(\d{4})\D+(\d{1,2})/);
  if (!m) {
    const y = founded.match(/(\d{4})/);
    return y ? y[1] : undefined;
  }
  return `${m[1]}-${m[2].padStart(2, "0")}`;
}

export function buildOrganizationJsonLd(copy: SiteCopy, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: copy.companyName,
    alternateName: "Topping Interactive",
    description: copy.description,
    foundingDate: toIsoMonth(copy.founded),
    founder: { "@type": "Person", name: copy.ceo },
    url: siteUrl,
    email: copy.email,
    telephone: toE164ish(copy.tel),
    // 주소는 관리자에서 한 줄로 입력받는다. 시/구를 기계적으로 쪼개면
    // 입력 형식이 조금만 달라져도 틀린 값이 나가므로 통째로 넣는다.
    address: {
      "@type": "PostalAddress",
      streetAddress: copy.address,
      addressCountry: "KR",
    },
    areaServed: "KR",
    knowsAbout: [
      "AI 업무지원시스템 UIUX",
      "업무시스템 UI 표준",
      "LLM Orchestration UX",
      "Nexacro",
      "WebSquare",
    ],
  };
}
