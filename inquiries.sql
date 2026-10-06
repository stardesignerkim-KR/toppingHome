-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN
create table if not exists inquiries (
  id            bigint primary key generated always as identity,
  name          text not null,
  company       text,
  position      text,
  email         text not null,
  phone         text,
  inquiry_type  text,
  message       text not null,
  status        text default 'new',   -- new | doing | done
  memo          text,
  agreed_at     timestamptz,
  created_at    timestamptz default now()
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_status_idx     on inquiries (status);
