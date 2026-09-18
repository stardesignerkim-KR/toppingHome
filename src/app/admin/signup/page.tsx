"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      alert("가입되었습니다. 로그인해주세요.");
      router.push("/admin/login");
    } catch (err) {
      setError("가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-n-25">
      <div className="w-full max-w-md rounded-lg border border-n-100 bg-n-0 p-8">
        <h1 className="mb-8 text-center text-3xl font-bold">관리자 가입</h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* 이메일 */}
          <div>
            <label className="mb-2 block font-medium">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded border border-n-100 px-4 py-2"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="mb-2 block font-medium">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-n-100 px-4 py-2"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="mb-2 block font-medium">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-n-100 px-4 py-2"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-accent-600 px-4 py-2 text-white hover:bg-accent-700 disabled:opacity-50"
          >
            {loading ? "가입 중..." : "가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-n-600">
          이미 계정이 있으신가요?{" "}
          <a href="/admin/login" className="text-accent-600 hover:underline">
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
}
