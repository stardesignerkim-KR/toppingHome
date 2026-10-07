import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Supabase 를 깨워 두는 장치.
 *
 * ── 왜 필요한가 ───────────────────────────────────────────────
 * Supabase 무료 플랜은 일정 기간(약 7일) API 요청이 없으면 DB 를 멈춘다.
 * 멈추면 사이트는 **에러 없이** 코드 안의 기본값으로 떨어진다.
 *   - 클라이언트 로고가 글자로 바뀐다 (방문자가 본다)
 *   - 관리자에서 고친 내용이 안 보인다
 *   - 관리자 로그인이 안 된다
 * 조용히 망가지는 것이 제일 위험하다. 그래서 하루 한 번 깨운다.
 *
 * ── 어떻게 ────────────────────────────────────────────────────
 * vercel.json 의 crons 설정이 하루 한 번 이 주소를 부른다.
 * **반드시 DB 를 실제로 읽어야** 활동으로 인정된다.
 * 단순히 200 만 돌려주면 Vercel 만 깨어 있고 Supabase 는 그대로 잠든다.
 *
 * 브라우저로 직접 열어도 동작하므로, 수동 점검용으로도 쓸 수 있다.
 */
export async function GET(request: NextRequest) {
  // CRON_SECRET 을 Vercel 환경변수에 넣어 두면 그 값을 가진 요청만 받는다.
  // 넣지 않으면 누구나 부를 수 있지만, 하는 일이 읽기 한 번뿐이라 위험하지 않다.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const startedAt = Date.now();

  // 가장 작은 테이블을 한 줄만 센다. 비용은 사실상 0.
  const { count, error } = await supabaseAdmin
    .from("site_info")
    .select("*", { count: "exact", head: true });

  const ms = Date.now() - startedAt;

  if (error) {
    // 실패해도 500 을 돌려준다 — Vercel 의 Cron 로그에 빨갛게 남아야
    // 나중에 "언제부터 안 깨어났나"를 추적할 수 있다.
    return NextResponse.json(
      { ok: false, error: error.message, ms },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    rows: count,
    ms,
    checkedAt: new Date().toISOString(),
  });
}
