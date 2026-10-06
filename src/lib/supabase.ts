import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials (.env.local 확인)');
}

/**
 * 브라우저용 클라이언트.
 *
 * ⚠️ 반드시 @supabase/ssr 의 createBrowserClient 를 쓸 것.
 * @supabase/supabase-js 의 createClient 를 쓰면 세션이 localStorage 에만 저장되어
 * middleware(createServerClient, 쿠키 기반)가 로그인 상태를 읽지 못한다.
 * → 로그인은 성공하는데 /admin 으로 가면 다시 /admin/login 으로 튕긴다.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * 서버 전용 (API Routes). RLS 를 우회하는 권한을 가진다.
 * SUPABASE_SERVICE_ROLE_KEY 는 NEXT_PUBLIC_ 접두사가 없으므로
 * 브라우저 번들에서는 undefined 로 치환되어 키가 노출되지 않는다.
 * 클라이언트 컴포넌트에서는 절대 import 하지 말 것.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
