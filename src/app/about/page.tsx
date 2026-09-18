import type { Metadata } from "next";
import Container from "@/components/Container";
import Section from "@/components/Section";
import StatTiles from "@/components/StatTiles";
import CTASection from "@/components/CTASection";
import { SITE, SERVICE_FIELDS } from "@/content/site";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "2010년 4월 설립. 업무시스템·AI 플랫폼 UIUX 전문 기업 주식회사 토핑인터랙티브.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-n-100 bg-n-0 py-16 md:py-24">
        <Container>
          <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            About
          </p>
          <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
            업무시스템 UIUX 한 우물, 15년
          </h1>
          <p className="mt-5 max-w-[720px] text-lg text-n-600">
            {SITE.name}는 2010년 4월에 설립된 산업디자인 UIUX 전문회사입니다.
          </p>
        </Container>
      </section>

      <Section>
        <StatTiles />
      </Section>

      <Section eyebrow="Service Fields" title="서비스 분야" alt>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-2">
          {SERVICE_FIELDS.map((f, i) => (
            <li key={f} className="flex gap-4 bg-n-0 px-5 py-4">
              <span className="tnum w-6 shrink-0 text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] text-n-800">{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Company" title="회사 정보">
        <dl className="max-w-[720px] divide-y divide-n-100 border-y border-n-100">
          {[
            ["상호", SITE.name],
            ["설립", SITE.founded],
            ["대표자", SITE.ceo],
            ["주소", SITE.address],
            ["전화", SITE.tel],
            ["이메일", SITE.email],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-6 py-4">
              <dt className="w-24 shrink-0 text-sm text-n-400">{k}</dt>
              <dd className="text-n-800">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CTASection />
    </>
  );
}
