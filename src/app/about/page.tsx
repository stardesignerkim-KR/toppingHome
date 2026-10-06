import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import StatTiles from "@/components/StatTiles";
import CTASection from "@/components/CTASection";

import { getPageHeader, getList, getPageMeta } from "@/lib/content";
import { getSiteCopy } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("about", {
    title: "회사 소개",
    description: "2010년 4월 설립. 업무시스템·AI 플랫폼 UIUX 전문 기업 주식회사 토핑인터랙티브.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function AboutPage() {
  const [header, copy, fields] = await Promise.all([
    getPageHeader("about", { title: "업무시스템 UIUX 한 우물, 15년" }),
    getSiteCopy(),
    getList("service_fields"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About"
        pageId="about"
        header={header}
        aside={[{ label: "2010년 설립" }, { label: "130여 건 수행", active: true }, { label: "AI 3개 기관" }]}
      >
        <p
          className="hero__sub text-lg"
          data-reveal
          style={{ "--d": "220ms" } as React.CSSProperties}
        >
          {copy.companyName}는 {copy.founded}에 설립된 산업디자인 UIUX 전문회사입니다.
        </p>
      </PageHero>

      <Section>
        <StatTiles />
      </Section>

      <Section eyebrow="Service Fields" title="서비스 분야" alt>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-2">
          {fields.map((f, i) => (
            <li key={f.f1} className="flex gap-4 bg-n-0 px-5 py-4">
              <span className="tnum w-6 shrink-0 text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] text-n-800">{f.f1}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Company" title="회사 정보">
        <dl className="max-w-[720px] divide-y divide-n-100 border-y border-n-100">
          {[
            ["상호", copy.companyName],
            ["설립", copy.founded],
            ["대표자", copy.ceo],
            ["주소", copy.address],
            ["전화", copy.tel],
            ["이메일", copy.email],
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
