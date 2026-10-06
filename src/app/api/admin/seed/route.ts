import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { CLIENTS } from '@/content/clients';
import { WORKS } from '@/content/works';
import { SOLUTIONS, X_CONVERTING_STEPS } from '@/content/solutions';
import { AI_PROJECTS, AI_CAPABILITIES, INDUSTRY_LABEL } from '@/content/ai-projects';
import { SITE, HERO } from '@/content/site';
import { LIST_SPECS, LIST_FALLBACK } from '@/lib/lists';

/**
 * src/content/* 의 초기 데이터를 DB로 넣는다.
 * 이미 있는 행은 덮어쓰지 않고 건너뛴다(upsert, ignoreDuplicates).
 * → 여러 번 눌러도 관리자에서 수정한 내용이 날아가지 않는다.
 */

type Step = { name: string; inserted: number; error: string | null };

export async function POST() {
  const steps: Step[] = [];

  const run = async (name: string, fn: () => Promise<number>) => {
    try {
      steps.push({ name, inserted: await fn(), error: null });
    } catch (e) {
      steps.push({ name, inserted: 0, error: (e as Error).message });
    }
  };

  // 1. 사이트 정보
  await run('사이트 정보', async () => {
    const rows = [
      { config_key: 'company.name', config_value: SITE.name },
      { config_key: 'company.founded', config_value: SITE.founded },
      { config_key: 'hero.headline1', config_value: HERO.headline[0] },
      { config_key: 'hero.headline2', config_value: HERO.headline[1] },
      { config_key: 'hero.sub', config_value: HERO.sub },
    ];
    const { error } = await supabaseAdmin
      .from('site_info')
      .upsert(rows, { onConflict: 'config_key', ignoreDuplicates: true });
    if (error) throw error;
    return rows.length;
  });

  // 2. AI 프로젝트
  await run('AI 프로젝트', async () => {
    const rows = AI_PROJECTS.map((p) => ({
      project_id: p.id,
      organization: p.org,
      systems: p.systems,
      industry: INDUSTRY_LABEL[p.industry],
      summary: p.summary,
    }));
    const { error } = await supabaseAdmin
      .from('ai_projects')
      .upsert(rows, { onConflict: 'project_id', ignoreDuplicates: true });
    if (error) throw error;
    return rows.length;
  });

  // 3. AI 역량
  await run('AI 역량', async () => {
    const { count } = await supabaseAdmin
      .from('ai_capabilities')
      .select('*', { count: 'exact', head: true });
    if ((count ?? 0) > 0) return 0; // 이미 있으면 건너뜀
    const rows = AI_CAPABILITIES.map((c, i) => ({
      capability_title: c.title,
      capability_desc: c.desc,
      position_order: i + 1,
    }));
    const { error } = await supabaseAdmin.from('ai_capabilities').insert(rows);
    if (error) throw error;
    return rows.length;
  });

  // 4. 실적
  await run('실적', async () => {
    const { count } = await supabaseAdmin
      .from('works')
      .select('*', { count: 'exact', head: true });
    if ((count ?? 0) > 0) return 0;
    const rows = WORKS.map((w) => ({
      client_name: w.client,
      system_name: w.system,
      industry: INDUSTRY_LABEL[w.industry],
      tags: w.tags ?? [],
    }));
    const { error } = await supabaseAdmin.from('works').insert(rows);
    if (error) throw error;
    return rows.length;
  });

  // 5. 클라이언트
  await run('클라이언트', async () => {
    const rows = CLIENTS.map((c) => ({
      client_slug: c.slug,
      client_name: c.name,
      industry: INDUSTRY_LABEL[c.industry],
      logo_url: c.logo ?? null,
    }));
    const { error } = await supabaseAdmin
      .from('clients')
      .upsert(rows, { onConflict: 'client_slug', ignoreDuplicates: true });
    if (error) throw error;
    return rows.length;
  });

  // 6. 솔루션
  await run('솔루션', async () => {
    const rows = SOLUTIONS.map((s) => ({
      solution_id: s.id,
      solution_title: s.title,
      solution_body: s.body,
    }));
    const { error } = await supabaseAdmin
      .from('solutions')
      .upsert(rows, { onConflict: 'solution_id', ignoreDuplicates: true });
    if (error) throw error;
    return rows.length;
  });

  // 7. X-Converting 단계
  await run('X-Converting 단계', async () => {
    const { count } = await supabaseAdmin
      .from('x_converting_steps')
      .select('*', { count: 'exact', head: true });
    if ((count ?? 0) > 0) return 0;
    const rows = X_CONVERTING_STEPS.map((s, i) => ({
      step_text: s,
      position_order: i + 1,
    }));
    const { error } = await supabaseAdmin.from('x_converting_steps').insert(rows);
    if (error) throw error;
    return rows.length;
  });

  // 8. 페이지 헤더
  await run('페이지 헤더', async () => {
    const rows = [
      { page_id: 'home',     header_title: 'Home',             header_subtitle: '' },
      { page_id: 'ai',       header_title: 'AI 업무지원시스템 UIUX', header_subtitle: '공공 2곳, 금융 1곳. 업종이 다른 세 기관에 같은 시스템이 들어갔습니다.' },
      { page_id: 'work',     header_title: '15년, 130여 건',     header_subtitle: '금융 계정계·정보계, 정부 차세대, ERP, Admin, 물류까지.' },
      { page_id: 'service',  header_title: '한 우물만 팝니다',    header_subtitle: 'AI · 업무시스템 · 솔루션 UIUX.' },
      { page_id: 'solution', header_title: '국내 UI 솔루션의 기획 · 디자인 · 퍼블리싱', header_subtitle: '넥사크로, WebSquare5, Xframe, MIP 마이플랫폼.' },
      { page_id: 'about',    header_title: '업무시스템 UIUX 한 우물, 15년', header_subtitle: '' },
      { page_id: 'contact',  header_title: '문의하기',           header_subtitle: '' },
    ];
    const { error } = await supabaseAdmin
      .from('page_headers')
      .upsert(rows, { onConflict: 'page_id', ignoreDuplicates: true });
    if (error) throw error;
    return rows.length;
  });

  // 목록형 콘텐츠 9종 — 비어 있는 목록만 파일 기본값으로 채운다
  await run('목록 콘텐츠', async () => {
    let inserted = 0;
    for (const spec of LIST_SPECS) {
      const { count } = await supabaseAdmin
        .from('content_lists')
        .select('*', { count: 'exact', head: true })
        .eq('list_key', spec.key);
      if ((count ?? 0) > 0) continue;
      const rows = LIST_FALLBACK[spec.key].map((r) => ({
        ...r,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabaseAdmin.from('content_lists').insert(rows);
      if (error) throw error;
      inserted += rows.length;
    }
    return inserted;
  });

  const failed = steps.filter((s) => s.error);
  return NextResponse.json(
    { ok: failed.length === 0, steps },
    { status: failed.length ? 207 : 200 }
  );
}
