import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 관리자 영역 인증 게이트.
 *
 * 화면(/admin/*)과 API(/api/admin/*)를 모두 막는다.
 * API 를 빼먹으면 로그인 없이 fetch 만으로 데이터를 고칠 수 있게 되므로
 * matcher 를 줄일 때는 반드시 두 경로를 함께 본다.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/admin");

  // 인증 없이 열어 두는 경로
  const isPublicPath =
    pathname === "/admin/login" || pathname === "/admin/signup";

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const deny = () =>
    isApi
      ? NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경변수가 없으면 인증을 확인할 방법이 없다. 열어 주지 않고 막는다.
  if (!url || !key) {
    if (isPublicPath) return response;
    return isApi
      ? NextResponse.json(
          { error: "Supabase 환경변수가 설정되지 않았습니다." },
          { status: 500 }
        )
      : new NextResponse(
          "Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)가 없습니다. .env.local 을 확인하세요.",
          { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
        );
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    // 확인에 실패했으면 통과시키지 않는다 (fail closed).
    console.error("Middleware auth check failed:", error);
    if (isPublicPath) return response;
    return deny();
  }

  if (isPublicPath) {
    // 이미 로그인한 사람이 로그인 화면에 오면 대시보드로 보낸다.
    if (user) return NextResponse.redirect(new URL("/admin", request.url));
    return response;
  }

  if (!user) return deny();

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
