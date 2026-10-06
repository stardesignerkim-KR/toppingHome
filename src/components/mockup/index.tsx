import AiWorkspaceMock from "./AiWorkspaceMock";
import KmsMock from "./KmsMock";
import ReviewMock from "./ReviewMock";
import GridCrudMock from "./GridCrudMock";
import DashboardMock from "./DashboardMock";
import XConvertingMock from "./XConvertingMock";

export {
  AiWorkspaceMock,
  KmsMock,
  ReviewMock,
  GridCrudMock,
  DashboardMock,
  XConvertingMock,
};

export type MockupKey =
  | "ai-workspace"
  | "kms"
  | "review"
  | "grid-crud"
  | "dashboard"
  | "x-converting";

/** 목업은 모두 props 가 선택값이라 아무 인자 없이도 그릴 수 있다. */
type Mockup = React.ComponentType<object>;

const REGISTRY: Record<MockupKey, Mockup> = {
  "ai-workspace": AiWorkspaceMock,
  kms: KmsMock,
  review: ReviewMock,
  "grid-crud": GridCrudMock,
  dashboard: DashboardMock,
  "x-converting": XConvertingMock,
};

/**
 * AI 프로젝트 id → 대표 목업.
 * 관리자에서 실제 이미지를 올리면 그쪽이 우선이고, 목업은 비어 있을 때만 쓴다.
 */
const BY_PROJECT: Record<string, MockupKey> = {
  gyeonggi: "ai-workspace",
  daishin: "kms",
  hrdi: "review",
};

export function getMockup(key: MockupKey | undefined | null) {
  if (!key) return null;
  return REGISTRY[key] ?? null;
}

export function getMockupForProject(projectId: string) {
  const key = BY_PROJECT[projectId] ?? "ai-workspace";
  return REGISTRY[key];
}

/** 목업이 실제 발주처 화면이 아님을 밝히는 문구. 캡션에 그대로 쓴다. */
export const MOCKUP_NOTICE =
  "실제 납품 화면이 아닌 UI 패턴 재구성 목업입니다. 데이터는 모두 예시값입니다.";
