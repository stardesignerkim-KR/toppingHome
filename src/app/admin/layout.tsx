"use client";

import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // 로그인 전 화면에는 관리자 사이드바를 씌우지 않는다
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-n-0">
      {/* 사이드바 */}
      <aside className="w-64 border-r border-n-100 bg-n-25 p-6 flex flex-col">
        <div className="flex-1">
          <h1 className="mb-8 text-lg font-bold text-n-900">관리자</h1>
          <nav className="space-y-2">
            <a
              href="/admin"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              대시보드
            </a>
            <a
              href="/admin/site"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              사이트 정보
            </a>
            <a
              href="/admin/ai-projects"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              AI 프로젝트
            </a>
            <a
              href="/admin/works"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              실적
            </a>
            <a
              href="/admin/clients"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              클라이언트
            </a>
            <a
              href="/admin/solutions"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              솔루션
            </a>
            <a
              href="/admin/lists"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              목록 관리
            </a>
            <a
              href="/admin/media"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              이미지
            </a>
            <a
              href="/admin/seo"
              className="block rounded px-4 py-2 hover:bg-n-100"
            >
              검색엔진
            </a>
            <a
              href="/admin/inquiries"
              className="mt-4 block rounded px-4 py-2 font-medium hover:bg-n-100"
            >
              문의 접수함
            </a>
          </nav>
        </div>

        {/* 사용자 정보 & 로그아웃 */}
        <div className="border-t border-n-100 pt-4">
          {user && (
            <div className="mb-4">
              <p className="mb-2 text-xs text-n-600">{user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full rounded border border-n-200 px-4 py-2 text-sm hover:bg-n-100"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
