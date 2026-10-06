"use client";

import { useState } from "react";


const INPUT =
  "h-10 w-full rounded-md border border-n-200 bg-n-0 px-3 text-[15px] outline-none focus:border-accent-600";

export type ContactInfo = { tel: string; direct: string; email: string; address: string };

export default function ContactForm({ info }: { info: ContactInfo }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
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
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "ok",
          text: "문의가 접수되었습니다. 확인 후 빠르게 회신드리겠습니다.",
        });
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
        setMessage({ type: "error", text: data?.error ?? "전송에 실패했습니다." });
      }
    } catch {
      setMessage({ type: "error", text: "네트워크 오류로 전송하지 못했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <div
                role="status"
                className={`rounded-md px-4 py-3 text-sm ${
                  message.type === "ok"
                    ? "border border-accent-200 bg-accent-50 text-accent-900"
                    : "border border-danger/30 bg-red-50 text-danger"
                }`}
              >
                {message.text}
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
                <dd className="tnum text-n-800">{info.tel}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">Direct</dt>
                <dd className="tnum text-n-800">{info.direct}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">이메일</dt>
                <dd className="text-n-800">{info.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-n-400">주소</dt>
                <dd className="text-n-800">{info.address}</dd>
              </div>
            </dl>
          </aside>
        </div>
    </>
  );
}
