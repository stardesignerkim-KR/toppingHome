require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
DROP TABLE IF EXISTS text_styles CASCADE;
DROP TABLE IF EXISTS page_headers CASCADE;
DROP TABLE IF EXISTS x_converting_steps CASCADE;
DROP TABLE IF EXISTS solutions CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS ai_capabilities CASCADE;
DROP TABLE IF EXISTS ai_projects CASCADE;
DROP TABLE IF EXISTS site_info CASCADE;

CREATE TABLE site_info (
  id BIGSERIAL PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_projects (
  project_id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  systems TEXT[] NOT NULL,
  industry TEXT NOT NULL,
  summary TEXT NOT NULL,
  thumbnail_url TEXT,
  images JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_capabilities (
  id BIGSERIAL PRIMARY KEY,
  capability_title TEXT NOT NULL,
  capability_desc TEXT NOT NULL,
  position_order INT
);

CREATE TABLE works (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  system_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  tags TEXT[],
  thumbnail_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clients (
  client_slug TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  logo_url TEXT,
  logo_dark_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE solutions (
  solution_id TEXT PRIMARY KEY,
  solution_title TEXT NOT NULL,
  solution_body TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE x_converting_steps (
  id BIGSERIAL PRIMARY KEY,
  step_text TEXT NOT NULL,
  position_order INT
);

CREATE TABLE page_headers (
  page_id TEXT PRIMARY KEY,
  header_title TEXT,
  header_subtitle TEXT,
  bg_image_url TEXT,
  title_font_size INT DEFAULT 48,
  title_text_color TEXT DEFAULT '#000000',
  subtitle_font_size INT DEFAULT 16,
  subtitle_text_color TEXT DEFAULT '#666666',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE text_styles (
  style_id TEXT PRIMARY KEY,
  element_name TEXT NOT NULL,
  font_size INT,
  text_color TEXT,
  font_weight INT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI 프로젝트 초기 데이터
INSERT INTO ai_projects (project_id, organization, systems, industry, summary) VALUES
('gyeonggi', '경기도청', ARRAY['AI 업무지원시스템'], '공공', '광역자치단체 업무 흐름에 생성형 AI를 결합한 업무지원시스템 UIUX'),
('daishin', '대신증권', ARRAY['KMS AI 시스템', 'AI 업무지원시스템'], '금융', '지식관리(KMS)와 AI를 결합한 증권사 사내 업무지원 플랫폼 UIUX'),
('hrdi', '직업능률개발원', ARRAY['원격훈련 AI 심사시스템', 'AI 업무지원시스템'], '공공', '원격훈련 과정 심사 업무에 AI를 적용한 심사·업무지원시스템 UIUX');

-- AI 역량 초기 데이터
INSERT INTO ai_capabilities (capability_title, capability_desc, position_order) VALUES
('AI UIUX Flow', 'Multi-turn 대화 흐름 설계', 1),
('AI UIUX Architecture', 'LLM Orchestration 구조 설계', 2),
('AI Navigation Bar', '기본바 · 미니바', 3),
('AI Chatting Panel', '기본모드 · 채팅모드', 4),
('AI Utility Bar', '출처 · 인용 · 프롬프트 라이브러리 · Filter', 5),
('AI 폴더메인', '대화·자료의 폴더 구조', 6),
('AI 스마트 도우미', '업무 맥락 기반 보조', 7),
('AI Setting', '모델·권한·개인화 설정', 8),
('AI Third party 검색 연동', '외부 검색 결과 통합', 9),
('iRAG 데이터 표시', '근거 데이터 노출 방식', 10);
`;

async function createTables() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('🔗 Connecting to Supabase...');
    await client.connect();

    console.log('📝 Creating tables...');
    await client.query(sql);

    console.log('✅ Database setup complete!');
    console.log('✓ site_info');
    console.log('✓ ai_projects');
    console.log('✓ ai_capabilities');
    console.log('✓ works');
    console.log('✓ clients');
    console.log('✓ solutions');
    console.log('✓ x_converting_steps');
    console.log('✓ page_headers');
    console.log('✓ text_styles');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTables();
