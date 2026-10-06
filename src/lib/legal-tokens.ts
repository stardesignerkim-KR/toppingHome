import type { SiteCopy } from "./site-content";

/**
 * 약관 본문의 `{회사명}` 같은 자리표시자를 저장된 회사 정보로 바꾼다.
 *
 * 법률 문서에 회사 정보를 그대로 박아 두면, 주소나 대표자가 바뀔 때
 * 약관 본문까지 손으로 고쳐야 한다. 자리표시자로 두면 사이트 정보 한 곳만 고치면 된다.
 */
export function fillLegalTokens(copy: SiteCopy, effective: string) {
  const map: Record<string, string> = {
    "{회사명}": copy.companyName,
    "{대표자}": copy.ceo,
    "{전화}": copy.tel,
    "{이메일}": copy.email,
    "{주소}": copy.address,
    "{시행일}": effective,
  };
  return (text: string) =>
    text.replace(/\{(회사명|대표자|전화|이메일|주소|시행일)\}/g, (m) => map[m] ?? m);
}
