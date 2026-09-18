import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 관리자 페이지 보호
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // 로그인/회원가입 페이지는 인증 없이 접근 가능
      if (
        request.nextUrl.pathname === "/admin/login" ||
        request.nextUrl.pathname === "/admin/signup"
      ) {
        // 이미 로그인한 경우 대시보드로 리다이렉트
        if (user) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return response;
      }

      // 다른 관리자 페이지는 인증 필요
      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
