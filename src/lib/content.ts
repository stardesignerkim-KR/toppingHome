import { supabaseAdmin } from "./supabase";
import { CLIENTS } from "@/content/clients";
import { WORKS } from "@/content/works";
import { SOLUTIONS, X_CONVERTING_STEPS } from "@/content/solutions";
import { AI_PROJECTS, AI_CAPABILITIES, INDUSTRY_LABEL } from "@/content/ai-projects";
import { LIST_FALLBACK, type ListKey, type ListRow } from "./lists";

/**
 * 공개 사이트가 쓰는 콘텐츠 레이어.
 *
 * 규칙 (topping7-build-log.md 의 3원칙)
 * 1. DB 조회 실패·빈 결과 → src/content/* 기본값으로 폴백. DB 가 죽어도 사이트는 뜬다
 * 2. 호출하는 페이지는 export const dynamic = "force-dynamic" 를 둔다
 * 3. 서버 컴포넌트에서만 호출 (supabaseAdmin 사용)
 */

async function safeSelect<T>(table: string, fallback: T[]): Promise<{ rows: T[]; fromDb: boolean }> {
  try {
    const { data, error } = await supabaseAdmin.from(table).select("*");
    if (error) throw error;
    if (!data || data.length === 0) return { rows: fallback, fromDb: false };
    return { rows: data as T[], fromDb: true };
  } catch (e) {
    console.warn(`[content] ${table} 조회 실패 — 기본값 사용:`, (e as Error).message);
    return { rows: fallback, fromDb: false };
  }
}

/* ── 클라이언트 로고 ─────────────────────────── */
export type ClientItem = {
  /** 로고 대체텍스트. 비우면 이름이 쓰인다 */
  alt?: string; slug: string; name: string; industry: string; logo: string | null };

export async function getClients(): Promise<ClientItem[]> {
  const fallback: ClientItem[] = CLIENTS.map((c) => ({
    slug: c.slug,
    name: c.name,
    industry: INDUSTRY_LABEL[c.industry],
    logo: c.logo ?? null,
  }));
  const { rows, fromDb } = await safeSelect<Record<string, unknown>>("clients", []);
  if (!fromDb) return fallback;
  return rows
    .map((r) => ({
      slug: String(r.client_slug),
      alt: typeof r.logo_alt === "string" ? r.logo_alt : undefined,
      name: String(r.client_name),
      industry: String(r.industry ?? "기타"),
      logo: (r.logo_url as string | null) ?? null,
    }))
    // 이름이 비었거나 "(미식별)" 같은 플레이스홀더는 공개 사이트에 노출하지 않는다
    // (관리자 화면에는 그대로 보이므로 확인 후 수정하면 바로 노출된다)
    .filter((c) => c.name.trim() !== "" && !/^\(/.test(c.name.trim()))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

/* ── 실적 ───────────────────────────────────── */
export type WorkItem = {
  id: string | number;
  client: string;
  system: string;
  industry: string;
  isAi?: boolean;
};

export async function getWorks(): Promise<WorkItem[]> {
  const fallback: WorkItem[] = WORKS.map((w, i) => ({
    id: i,
    client: w.client,
    system: w.system,
    industry: INDUSTRY_LABEL[w.industry],
  }));
  const { rows, fromDb } = await safeSelect<Record<string, unknown>>("works", []);
  if (!fromDb) return fallback;
  return rows
    .map((r) => ({
      id: r.id as number,
      client: String(r.client_name),
      system: String(r.system_name),
      industry: String(r.industry ?? "기타"),
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

/* ── AI 프로젝트 ────────────────────────────── */
export type AiProjectItem = {
  /** 썸네일 대체텍스트. 비우면 기관명이 쓰인다 */
  alt?: string;
  id: string;
  org: string;
  systems: string[];
  industry: string;
  summary: string;
  thumbnail: string | null;
};

export async function getAiProjects(): Promise<AiProjectItem[]> {
  const fallback: AiProjectItem[] = AI_PROJECTS.map((p) => ({
    id: p.id,
    org: p.org,
    systems: p.systems,
    industry: INDUSTRY_LABEL[p.industry],
    summary: p.summary,
    thumbnail: null,
  }));
  const { rows, fromDb } = await safeSelect<Record<string, unknown>>("ai_projects", []);
  if (!fromDb) return fallback;
  const order = ["gyeonggi", "daishin", "hrdi"];
  return rows
    .map((r) => ({
      id: String(r.project_id),
      alt: typeof r.thumbnail_alt === "string" ? r.thumbnail_alt : undefined,
      org: String(r.organization),
      systems: (r.systems as string[]) ?? [],
      industry: String(r.industry ?? "기타"),
      summary: String(r.summary ?? ""),
      thumbnail: (r.thumbnail_url as string | null) ?? null,
    }))
    .sort((a, b) => {
      const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
}

/* ── AI 역량 ────────────────────────────────── */
export type CapabilityItem = { title: string; desc: string };

export async function getAiCapabilities(): Promise<{ title: string; desc: string }[]> {
  // 관리자 『목록 관리 → AI 역량 10』에서 고친다
  const rows = await getList("capabilities");
  return rows.map((r) => ({ title: r.f1, desc: r.f2 }));
}

/* ── 솔루션 ─────────────────────────────────── */
export type SolutionItem = { id: string; title: string; body: string };

export async function getSolutions(): Promise<SolutionItem[]> {
  const fallback: SolutionItem[] = SOLUTIONS.map((s) => ({ id: s.id, title: s.title, body: s.body }));
  const { rows, fromDb } = await safeSelect<Record<string, unknown>>("solutions", []);
  if (!fromDb) return fallback;
  const order: string[] = SOLUTIONS.map((s) => s.id);
  return rows
    .map((r) => ({
      id: String(r.solution_id),
      title: String(r.solution_title),
      body: String(r.solution_body ?? ""),
    }))
    .sort((a, b) => {
      const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
}

/* ── X-Converting 단계 ──────────────────────── */
export async function getXSteps(): Promise<string[]> {
  const fallback = [...X_CONVERTING_STEPS];
  const { rows, fromDb } = await safeSelect<Record<string, unknown>>("x_converting_steps", []);
  if (!fromDb) return fallback;
  return rows
    .map((r) => ({ text: String(r.step_text), order: Number(r.position_order ?? 0) }))
    .sort((a, b) => a.order - b.order)
    .map((s) => s.text);
}

/* ── 페이지 헤더 ────────────────────────────── */
export type PageHeaderItem = {
  title: string;
  subtitle: string;
  bgImage: string | null;
  titleSize: number;
  titleColor: string;
  subtitleSize: number;
  subtitleColor: string;
};

export async function getPageHeader(
  pageId: string,
  fallback: { title: string; subtitle?: string }
): Promise<PageHeaderItem> {
  const base: PageHeaderItem = {
    title: fallback.title,
    subtitle: fallback.subtitle ?? "",
    bgImage: null,
    titleSize: 48,
    titleColor: "#1C1917",
    subtitleSize: 16,
    subtitleColor: "#57534E",
  };
  try {
    const { data, error } = await supabaseAdmin
      .from("page_headers")
      .select("*")
      .eq("page_id", pageId)
      .maybeSingle();
    if (error || !data) return base;
    return {
      title: data.header_title?.trim() ? data.header_title : base.title,
      subtitle: data.header_subtitle ?? base.subtitle,
      bgImage: data.bg_image_url ?? null,
      titleSize: data.title_font_size ?? base.titleSize,
      titleColor: data.title_text_color ?? base.titleColor,
      subtitleSize: data.subtitle_font_size ?? base.subtitleSize,
      subtitleColor: data.subtitle_text_color ?? base.subtitleColor,
    };
  } catch {
    return base;
  }
}

/* ── 목록형 콘텐츠 (content_lists) ─────────────────────────
   관리자 `/admin/lists` 에서 고친다. DB 가 비면 파일 기본값을 쓴다. */

export async function getList(key: ListKey): Promise<ListRow[]> {
  const fallback = LIST_FALLBACK[key] ?? [];
  try {
    const { data, error } = await supabaseAdmin
      .from("content_lists")
      .select("*")
      .eq("list_key", key)
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fallback;
    return data.map((r) => ({
      id: r.id as number,
      list_key: key,
      sort: (r.sort as number) ?? 0,
      f1: (r.f1 as string) ?? "",
      f2: (r.f2 as string) ?? "",
      f3: (r.f3 as string) ?? "",
      items: (r.items as string[]) ?? [],
    }));
  } catch (e) {
    console.warn(`[content] ${key} 조회 실패 — 기본값 사용:`, (e as Error).message);
    return fallback;
  }
}

/* ── 페이지별 SEO 메타 ─────────────────────────────────
   관리자 `/admin/seo` 에서 고친다. 비어 있으면 코드 기본값을 쓴다. */

export type PageMeta = {
  title: string;
  description: string;
  ogImage: string | null;
};

export async function getPageMeta(
  pageId: string,
  fallback: { title: string; description: string }
): Promise<PageMeta> {
  const base: PageMeta = { ...fallback, ogImage: null };
  try {
    const { data, error } = await supabaseAdmin
      .from("page_headers")
      .select("seo_title, seo_description, og_image_url")
      .eq("page_id", pageId)
      .maybeSingle();
    if (error || !data) return base;
    const pick = (v: unknown, d: string) =>
      typeof v === "string" && v.trim() ? v.trim() : d;
    return {
      title: pick(data.seo_title, base.title),
      description: pick(data.seo_description, base.description),
      ogImage:
        typeof data.og_image_url === "string" && data.og_image_url.trim()
          ? data.og_image_url
          : null,
    };
  } catch {
    return base;
  }
}
