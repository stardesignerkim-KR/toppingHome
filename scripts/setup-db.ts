import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
create table if not exists site_info (
  id bigint primary key generated always as identity,
  config_key text unique not null,
  config_value jsonb not null,
  updated_at timestamp default now()
);

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

create table if not exists ai_capabilities (
  id bigint primary key generated always as identity,
  capability_title text not null,
  capability_desc text not null,
  position_order int
);

create table if not exists works (
  id bigint primary key generated always as identity,
  client_name text not null,
  system_name text not null,
  industry text not null,
  tags text[],
  thumbnail_url text,
  updated_at timestamp default now()
);

create table if not exists clients (
  client_slug text primary key,
  client_name text not null,
  industry text not null,
  logo_url text,
  logo_dark_url text,
  updated_at timestamp default now()
);

create table if not exists solutions (
  solution_id text primary key,
  solution_title text not null,
  solution_body text not null,
  updated_at timestamp default now()
);

create table if not exists x_converting_steps (
  id bigint primary key generated always as identity,
  step_text text not null,
  position_order int
);

create table if not exists page_headers (
  page_id text primary key,
  header_title text,
  header_subtitle text,
  bg_image_url text,
  title_font_size int default 48,
  title_text_color text default '#000000',
  subtitle_font_size int default 16,
  subtitle_text_color text default '#666666',
  updated_at timestamp default now()
);

create table if not exists text_styles (
  style_id text primary key,
  element_name text not null,
  font_size int,
  text_color text,
  font_weight int,
  updated_at timestamp default now()
);
`;

async function setupDatabase() {
  try {
    // Supabase RPC를 사용하여 SQL 실행
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Database setup error:', error);
      process.exit(1);
    }

    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
