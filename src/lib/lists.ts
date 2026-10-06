import {
  STATS,
  SERVICE_FIELDS,
  NAV,
} from "@/content/site";
import {
  COGNITIVE_LAWS,
  UIUX_FLOW,
  UI_STANDARD_TOC,
} from "@/content/methodology";
import { X_CONVERTING_STEPS, EASY_GUIDE } from "@/content/solutions";
import { AI_CAPABILITIES } from "@/content/ai-projects";
import { LAW_ORDER } from "@/components/figures/LawFigure";
import { TERMS_DEFAULT, PRIVACY_DEFAULT } from "./legal-content";

/**
 * 목록형 콘텐츠를 한 테이블(`content_lists`)에 모아 한 화면에서 고친다.
 *
 * 왜 테이블을 아홉 개 만들지 않았나 — 모양이 거의 같다(순서 + 칸 두세 개).
 * 하나로 묶으면 관리자 화면도 하나면 되고, 쓰는 사람이 배울 것도 하나다.
 *
 * 칸은 f1 / f2 / f3 세 개와 하위 목록(items) 하나로 충분하다.
 * 목록마다 그 칸을 뭐라고 부를지는 아래 LIST_SPECS 가 정한다.
 */

export type ListKey =
  | "stats"
  | "service_fields"
  | "nav"
  | "capabilities"
  | "cognitive_laws"
  | "uiux_flow"
  | "standard_toc"
  | "x_steps"
  | "easy_guide"
  | "terms"
  | "privacy";

export type ListRow = {
  id?: number;
  list_key: ListKey;
  sort: number;
  f1: string;
  f2: string;
  f3: string;
  items: string[];
};

export type ListSpec = {
  key: ListKey;
  label: string;
  /** 이 목록이 화면 어디에 나오는지 — 관리자에서 그대로 보여 준다 */
  where: string;
  /** 쓰는 칸만 라벨을 준다. 빈 칸은 화면에 안 나온다 */
  f1: string;
  f2?: string;
  f3?: string;
  /** 하위 목록을 쓰는가 (표준 정의서 목차 전용) */
  items?: string;
  /** 줄 수를 고정해야 하는 목록은 추가/삭제를 막는다 */
  fixed?: boolean;
  note?: string;
};

export const LIST_SPECS: ListSpec[] = [
  {
    key: "stats",
    label: "숫자 타일",
    where: "홈 · 회사 소개",
    f1: "숫자",
    f2: "단위",
    f3: "설명",
    note: "숫자 칸에 숫자만 넣으면 0부터 세는 효과가 걸립니다.",
  },
  {
    key: "capabilities",
    label: "AI 역량 10",
    where: "홈 · AI",
    f1: "제목",
    f2: "설명",
  },
  {
    key: "service_fields",
    label: "서비스 분야",
    where: "회사 소개",
    f1: "분야명",
  },
  {
    key: "cognitive_laws",
    label: "인지심리학 법칙",
    where: "서비스",
    f1: "법칙 이름",
    f2: "설명",
    f3: "그림",
    note: "그림 칸은 아래 목록 중 하나를 골라 적습니다: " + LAW_ORDER.join(", "),
  },
  {
    key: "uiux_flow",
    label: "UIUX FLOW 단계",
    where: "서비스 (모달)",
    f1: "단계명",
  },
  {
    key: "standard_toc",
    label: "표준 정의서 목차",
    where: "서비스 (모달)",
    f1: "장 번호",
    f2: "장 제목",
    items: "세부 항목",
  },
  {
    key: "x_steps",
    label: "X-Converting 단계",
    where: "홈 · 솔루션",
    f1: "단계명",
  },
  {
    key: "easy_guide",
    label: "EASY GUIDE 항목",
    where: "솔루션",
    f1: "항목명",
  },
  {
    key: "terms",
    label: "이용약관",
    where: "/terms",
    f1: "조 번호",
    f2: "조 제목",
    items: "본문",
    note:
      "본문은 한 줄에 하나씩. 줄 앞에 - 를 붙이면 번호 목록, | 로 나누면 표(첫 줄이 머리글), # 은 회색 보조문단. " +
      "{회사명} {대표자} {전화} {이메일} {주소} {시행일} 은 저장된 회사 정보로 자동 치환됩니다.",
  },
  {
    key: "privacy",
    label: "개인정보처리방침",
    where: "/privacy",
    f1: "조 번호",
    f2: "조 제목",
    items: "본문",
    note:
      "본문 기호는 이용약관과 같습니다. 법정 고지 문서이므로 고치기 전 내용을 확인하세요.",
  },
  {
    key: "nav",
    label: "상단 메뉴",
    where: "모든 페이지",
    f1: "메뉴 이름",
    f2: "주소",
    note: "주소는 /ai 처럼 슬래시로 시작합니다. 잘못 넣으면 메뉴가 깨지니 주의하세요.",
  },
];

export const LIST_SPEC_MAP = Object.fromEntries(
  LIST_SPECS.map((s) => [s.key, s])
) as Record<ListKey, ListSpec>;

const row = (
  list_key: ListKey,
  sort: number,
  f1: string,
  f2 = "",
  f3 = "",
  items: string[] = []
): ListRow => ({ list_key, sort, f1, f2, f3, items });

/** DB 가 비었을 때 쓰는 기본값 — `src/content/*` 가 원본이다 */
export const LIST_FALLBACK: Record<ListKey, ListRow[]> = {
  stats: STATS.map((s, i) => row("stats", i, s.value, s.unit, s.label)),
  capabilities: AI_CAPABILITIES.map((c, i) => row("capabilities", i, c.title, c.desc)),
  service_fields: SERVICE_FIELDS.map((f, i) => row("service_fields", i, f)),
  cognitive_laws: COGNITIVE_LAWS.map((l, i) =>
    row("cognitive_laws", i, l.name, l.desc, LAW_ORDER[i] ?? "")
  ),
  uiux_flow: UIUX_FLOW.map((s, i) => row("uiux_flow", i, s)),
  standard_toc: UI_STANDARD_TOC.map((c, i) =>
    row("standard_toc", i, String(c.no), c.title, "", [...c.items])
  ),
  x_steps: X_CONVERTING_STEPS.map((s, i) => row("x_steps", i, s)),
  easy_guide: EASY_GUIDE.map((g, i) => row("easy_guide", i, g)),
  nav: NAV.map((n, i) => row("nav", i, n.label, n.href)),
  terms: TERMS_DEFAULT,
  privacy: PRIVACY_DEFAULT,
};
