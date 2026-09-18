import type { Metadata } from "next";
import Container from "@/components/Container";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import { SOLUTIONS, X_CONVERTING_STEPS, EASY_GUIDE } from "@/content/solutions";

export const metadata: Metadata = {
  title: "UIUX Solution 지원",
  description:
    "넥사크로 · WebSquare5 · Xframe · MIP 마이플랫폼 기획·디자인·퍼블리싱 지원. X-Converting UI 고도화.",
};

export default function SolutionPage() {
  return (
    <>
      <section className="border-b border-n-100 bg-n-0 py-16 md:py-24">
        <Container>
          <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            Solution
          </p>
          <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
            국내 UI 솔루션의 기획 · 디자인 · 퍼블리싱
          </h1>
          <p className="mt-5 max-w-[720px] text-lg text-n-600">
            넥사크로, WebSquare5, Xframe, MIP 마이플랫폼. 개발회사와의 파트너십을 통해
            공통개발도 지원합니다.
          </p>
        </Container>
      </section>

      <Section eyebrow="Process" title="X-Converting UI 고도화">
        <div className="max-w-[720px] text-n-800">
          <p>
            오래된 업무시스템의 UI를 업그레이드합니다. X컨버팅 프로그램을 통해 프로그램 리소스는
            그대로 사용하므로, UI와 공통프레임 그리고 외부 연동 파트만 업그레이드해 시간과 비용을
            모두 줄일 수 있습니다.
          </p>
        </div>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-2 lg:grid-cols-4">
          {X_CONVERTING_STEPS.map((s, i) => (
            <li key={s} className="bg-n-0 px-5 py-4">
              <span className="tnum text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[15px] text-n-800">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Solutions" title="지원 솔루션" alt>
        <div className="grid gap-6 md:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <article
              key={s.id}
              className="rounded-lg border border-n-100 bg-n-0 p-6"
            >
              <h3 className="text-lg font-semibold tracking-wide text-n-900">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-n-600">{s.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Reference" title="EASY GUIDE — 해외 사례 (Salesforce)">
        <div className="max-w-[720px] text-n-800">
          <p>
            업무시스템에서 신규 기능을 소개하거나 공지를 전달할 때, 직원들이 내용을 쉽게 이해할
            수 있도록 친근한 가이드를 지원합니다.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {EASY_GUIDE.map((g) => (
              <li
                key={g}
                className="rounded-md border border-n-100 bg-n-0 px-4 py-3 text-[15px]"
              >
                {g}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
