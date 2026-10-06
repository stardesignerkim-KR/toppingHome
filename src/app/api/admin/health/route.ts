import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * 전수 점검 API.
 * 모든 테이블의 존재 여부와 행 수를 한 번에 확인한다.
 * /admin 대시보드가 이걸 호출해서 "무엇이 안 되는지"를 화면에 보여준다.
 */

const TABLES = [
  { table: 'content_lists',      label: '목록 콘텐츠',        optional: false },
  { table: 'site_info',          label: '사이트 정보',        optional: false },
  { table: 'ai_projects',        label: 'AI 프로젝트',        optional: false },
  { table: 'ai_capabilities',    label: 'AI 역량',            optional: false },
  { table: 'works',              label: '실적',               optional: false },
  { table: 'clients',            label: '클라이언트',          optional: false },
  { table: 'solutions',          label: '솔루션',             optional: false },
  { table: 'x_converting_steps', label: 'X-Converting 단계',  optional: false },
  { table: 'page_headers',       label: '페이지 헤더',         optional: false },
  { table: 'inquiries',          label: '문의 접수',           optional: true },
  // 아직 화면에서 쓰지 않는 테이블 — 비어 있어도 문제가 아니다
  { table: 'text_styles',        label: '텍스트 스타일',       optional: true },
] as const;

export type TableHealth = {
  table: string;
  label: string;
  optional: boolean;
  ok: boolean;
  count: number | null;
  error: string | null;
};

export async function GET() {
  const results: TableHealth[] = [];

  for (const t of TABLES) {
    // ⚠️ head:true 는 없는 테이블에도 오류를 내지 않는다(실제로 겪음).
    //    행을 한 줄 실제로 읽어야 "테이블 없음"이 error 로 올라온다.
    const probe = await supabaseAdmin.from(t.table).select('*').limit(1);
    const error = probe.error;
    const counted = error
      ? { count: null }
      : await supabaseAdmin.from(t.table).select('*', { count: 'exact', head: true });
    const count = counted.count;

    results.push({
      table: t.table,
      label: t.label,
      optional: t.optional,
      ok: !error,
      count: error ? null : (count ?? 0),
      error: error ? error.message : null,
    });
  }

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  };

  const missingTables = results.filter((r) => !r.ok).length;
  // 선택 테이블이 비어 있는 것은 경고로 세지 않는다
  const emptyTables = results.filter((r) => r.ok && r.count === 0 && !r.optional).length;

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      missing: missingTables,
      empty: emptyTables,
      healthy: results.length - missingTables - emptyTables,
    },
    tables: results,
    env,
  });
}
