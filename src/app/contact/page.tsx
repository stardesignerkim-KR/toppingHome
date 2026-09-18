"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { SITE } from "@/content/site";

const INPUT =
  "h-10 w-full rounded-md border border-n-200 bg-n-0 px-3 text-[15px] outline-none focus:border-accent-600";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    type: "AI 업무지원시스템",
    message: "",
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          type: "AI 업무지원시스템",
          message: "",
          agree: false,
        });
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (error) {
      setMessage("❌ 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
          Contact
        </p>
        <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
          문의하기
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="max-w-[640px] space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-n-800">
                  이름 <span className="text-accent-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-[13px] font-medium text-n-800">
                  회사 / 기관
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-n-800">
                  이메일 <span className="text-accent-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-[13px] font-medium text-n-800">
                  연락처
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="mb-1.5 block text-[13px] font-medium text-n-800">
                문의 유형
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={INPUT}
              >
                <option>AI 업무지원시스템</option>
                <option>업무시스템 UIUX</option>
                <option>솔루션 지원 (넥사크로 / WebSquare / Xframe)</option>
                <option>X-Converting UI 고도화</option>
                <option>기타</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-n-800">
                문의 내용 <span className="text-accent-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={7}
                className="w-full rounded-md border border-n-200 bg-n-0 px-3 py-2 text-[15px] outline-none focus:border-accent-600"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-n-600">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className="mt-1"
              />
              <span>
                개인정보 수집·이용에 동의합니다. 수집 항목은 문의 응대 목적으로만 사용되며,
                목적 달성 후 파기합니다.
              </span>
            </label>

            {message && (
              <div className="rounded bg-n-100 px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-accent-600 px-6 py-3 font-medium text-white transition-colors hover:bg-accent-700 disabled:opacity-50"
            >
              {loading ? "전송 중..." : "문의 보내기"}
            </button>
          </form>

          <aside className="h-fit rounded-lg border border-n-100 bg-n-0 p-6">
            <h2 className="font-semibold text-n-900">직접 연락</h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div>
                <dt className="text-sm text-n-400">대표</dt>
                <dd className="tnum text-n-800">{SITE.tel}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">Direct</dt>
                <dd className="tnum text-n-800">{SITE.direct}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">이메일</dt>
                <dd className="text-n-800">{SITE.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">주소</dt>
                <dd className="text-n-800">{SITE.address}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Container>
    </section>
  );
}
