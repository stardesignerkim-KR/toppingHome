/**
 * SEO 를 고칠 수 있는 페이지 목록. `page_headers.page_id` 와 같은 값이다.
 *
 * ⚠️ 라우트 파일(`app/api/**\/route.ts`)에서는 HTTP 메서드 말고는 export 할 수 없다.
 *    그래서 관리자 화면과 API 가 함께 쓰는 이 목록을 lib 으로 뺐다.
 */
export const SEO_PAGES = [
  { id: "home", label: "메인", path: "/" },
  { id: "ai", label: "AI", path: "/ai" },
  { id: "work", label: "실적", path: "/work" },
  { id: "service", label: "서비스", path: "/service" },
  { id: "solution", label: "솔루션", path: "/solution" },
  { id: "about", label: "회사 소개", path: "/about" },
  { id: "contact", label: "문의", path: "/contact" },
  { id: "terms", label: "이용약관", path: "/terms" },
  { id: "privacy", label: "개인정보처리방침", path: "/privacy" },
] as const;

export const SEO_PAGE_IDS: readonly string[] = SEO_PAGES.map((p) => p.id);
