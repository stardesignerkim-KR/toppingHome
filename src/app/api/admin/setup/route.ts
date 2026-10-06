import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const setupSQL = `
-- 1. 사이트 정보
create table if not exists site_info (
  id bigint primary key generated always as identity,
  config_key text unique not null,
  config_value jsonb not null,
  updated_at timestamp default now()
);

-- 2. AI 프로젝트
create table if not exists ai_projects (
  project_id text primary key,
  organization text not null,
  systems text[] not null,
  industry text not null,
  summary text not null,
  thumbnail_url text,
  images jsonb,
  updated_at timestamp default now()
);

-- 3. AI 역량
create table if not exists ai_capabilities (
  id bigint primary key generated always as identity,
  capability_title text not null,
  capability_desc text not null,
  position_order int
);

-- 4. 실적
create table if not exists works (
  id bigint primary key generated always as identity,
  client_name text not null,
  system_name text not null,
  industry text not null,
  tags text[],
  thumbnail_url text,
  updated_at timestamp default now()
);

-- 5. 클라이언트
create table if not exists clients (
  client_slug text primary key,
  client_name text not null,
  industry text not null,
  logo_url text,
  logo_dark_url text,
  updated_at timestamp default now()
);

-- 6. 솔루션
create table if not exists solutions (
  solution_id text primary key,
  solution_title text not null,
  solution_body text not null,
  updated_at timestamp default now()
);

-- 7. X-Converting 8단계
create table if not exists x_converting_steps (
  id bigint primary key generated always as identity,
  step_text text not null,
  position_order int
);

-- 8. 페이지 헤더
create table if not exists page_headers (
  page_id text primary key,
  header_title text,
  header_subtitle text,
  bg_image_url text,
  title_font_size int default 48,
  title_text_color text default '#000000',
  subtitle_font_size int default 16,
  subtitle_text_color text default '#666666',
  seo_title text,
  seo_description text,
  og_image_url text,
  updated_at timestamp default now()
);

-- 이미 만들어진 DB 에도 SEO 칸을 더한다
alter table page_headers add column if not exists seo_title text;
alter table page_headers add column if not exists seo_description text;
alter table page_headers add column if not exists og_image_url text;

-- 로고·썸네일의 대체텍스트(비우면 이름이 자동으로 쓰인다)
alter table clients add column if not exists logo_alt text;
alter table ai_projects add column if not exists thumbnail_alt text;


-- 10. 목록형 콘텐츠 (숫자 타일, 서비스 분야, 메뉴, 인지심리학, FLOW, 표준 목차,
--     AI 역량, X-Converting 단계, EASY GUIDE 를 한 테이블에 모은다)
create table if not exists content_lists (
  id bigint primary key generated always as identity,
  list_key text not null,
  sort int not null default 0,
  f1 text,
  f2 text,
  f3 text,
  items text[] default '{}',
  updated_at timestamp default now()
);
create index if not exists content_lists_key_sort on content_lists (list_key, sort);

-- 9. 텍스트 스타일
create table if not exists text_styles (
  style_id text primary key,
  element_name text not null,
  font_size int,
  text_color text,
  font_weight int,
  updated_at timestamp default now()
);

-- AI 프로젝트 초기 데이터
insert into ai_projects (project_id, organization, systems, industry, summary)
select 'gyeonggi', '경기도청', array['AI 업무지원시스템'], '공공', '광역자치단체 업무 흐름에 생성형 AI를 결합한 업무지원시스템 UIUX'
where not exists (select 1 from ai_projects where project_id = 'gyeonggi');

insert into ai_projects (project_id, organization, systems, industry, summary)
select 'daishin', '대신증권', array['KMS AI 시스템', 'AI 업무지원시스템'], '금융', '지식관리(KMS)와 AI를 결합한 증권사 사내 업무지원 플랫폼 UIUX'
where not exists (select 1 from ai_projects where project_id = 'daishin');

insert into ai_projects (project_id, organization, systems, industry, summary)
select 'hrdi', '직업능률개발원', array['원격훈련 AI 심사시스템', 'AI 업무지원시스템'], '공공', '원격훈련 과정 심사 업무에 AI를 적용한 심사·업무지원시스템 UIUX'
where not exists (select 1 from ai_projects where project_id = 'hrdi');

-- AI 역량 초기 데이터
insert into ai_capabilities (capability_title, capability_desc, position_order)
values
  ('AI UIUX Flow', 'Multi-turn 대화 흐름 설계', 1),
  ('AI UIUX Architecture', 'LLM Orchestration 구조 설계', 2),
  ('AI Navigation Bar', '기본바 · 미니바', 3),
  ('AI Chatting Panel', '기본모드 · 채팅모드', 4),
  ('AI Utility Bar', '출처 · 인용 · 프롬프트 라이브러리 · Filter', 5),
  ('AI 폴더메인', '대화·자료의 폴더 구조', 6),
  ('AI 스마트 도우미', '업무 맥락 기반 보조', 7),
  ('AI Setting', '모델·권한·개인화 설정', 8),
  ('AI Third party 검색 연동', '외부 검색 결과 통합', 9),
  ('iRAG 데이터 표시', '근거 데이터 노출 방식', 10)
on conflict do nothing;
`;

/** GET — 설치 SQL 만 돌려준다. 아무것도 쓰지 않는다(대시보드의 『설치 SQL 보기』). */
export async function GET() {
  return NextResponse.json({ sql: setupSQL });
}

export async function POST() {
  try {
    // Note: Supabase JS 클라이언트는 직접 SQL 실행을 지원하지 않습니다.
    // 대신, 각 테이블을 프로그래밍 방식으로 확인하고 필요한 데이터를 삽입합니다.

    console.log('Setting up database...');

    // AI 프로젝트 초기 데이터 삽입
    const { error: aiError } = await supabaseAdmin
      .from('ai_projects')
      .insert([
        {
          project_id: 'gyeonggi',
          organization: '경기도청',
          systems: ['AI 업무지원시스템'],
          industry: '공공',
          summary: '광역자치단체 업무 흐름에 생성형 AI를 결합한 업무지원시스템 UIUX',
        },
        {
          project_id: 'daishin',
          organization: '대신증권',
          systems: ['KMS AI 시스템', 'AI 업무지원시스템'],
          industry: '금융',
          summary: '지식관리(KMS)와 AI를 결합한 증권사 사내 업무지원 플랫폼 UIUX',
        },
        {
          project_id: 'hrdi',
          organization: '직업능률개발원',
          systems: ['원격훈련 AI 심사시스템', 'AI 업무지원시스템'],
          industry: '공공',
          summary: '원격훈련 과정 심사 업무에 AI를 적용한 심사·업무지원시스템 UIUX',
        },
      ])
      .select();

    if (aiError && aiError.code !== 'PGRST116') {
      console.error('AI Projects error:', aiError);
    }

    // AI 역량 초기 데이터 삽입
    const { error: capError } = await supabaseAdmin
      .from('ai_capabilities')
      .insert([
        { capability_title: 'AI UIUX Flow', capability_desc: 'Multi-turn 대화 흐름 설계', position_order: 1 },
        { capability_title: 'AI UIUX Architecture', capability_desc: 'LLM Orchestration 구조 설계', position_order: 2 },
        { capability_title: 'AI Navigation Bar', capability_desc: '기본바 · 미니바', position_order: 3 },
        { capability_title: 'AI Chatting Panel', capability_desc: '기본모드 · 채팅모드', position_order: 4 },
        { capability_title: 'AI Utility Bar', capability_desc: '출처 · 인용 · 프롬프트 라이브러리 · Filter', position_order: 5 },
        { capability_title: 'AI 폴더메인', capability_desc: '대화·자료의 폴더 구조', position_order: 6 },
        { capability_title: 'AI 스마트 도우미', capability_desc: '업무 맥락 기반 보조', position_order: 7 },
        { capability_title: 'AI Setting', capability_desc: '모델·권한·개인화 설정', position_order: 8 },
        { capability_title: 'AI Third party 검색 연동', capability_desc: '외부 검색 결과 통합', position_order: 9 },
        { capability_title: 'iRAG 데이터 표시', capability_desc: '근거 데이터 노출 방식', position_order: 10 },
      ])
      .select();

    if (capError && capError.code !== 'PGRST116') {
      console.error('Capabilities error:', capError);
    }

    return NextResponse.json({
      success: true,
      message: '데이터베이스 초기화 완료!',
      note: 'Supabase SQL Editor에서 다음 SQL을 실행해야 테이블이 생성됩니다.',
      sql: setupSQL,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
