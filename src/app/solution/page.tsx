import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import MockupFrame from "@/components/mockup/MockupFrame";
import { XConvertingMock } from "@/components/mockup";

import { getSolutions, getPageHeader, getList, getPageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("solution", {
    title: "UIUX Solution 지원",
    description: "넥사크로 · WebSquare5 · Xframe · MIP 마이플랫폼 기획·디자인·퍼블리싱 지원. X-Converting UI 고도화.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function SolutionPage() {
  const [solutions, xSteps, header, easyGuide] = await Promise.all([
    getSolutions(),
    getList("x_steps"),
    getPageHeader("solution", {
      title: "국내 UI 솔루션의 기획 · 디자인 · 퍼블리싱",
      subtitle:
        "넥사크로, WebSquare5, Xframe, MIP 마이플랫폼. 개발회사와의 파트너십을 통해 공통개발도 지원합니다.",
    }),
    getList("easy_guide"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Solution"
        pageId="solution"
        header={header}
        aside={[{ label: "NEXACRO" }, { label: "X-CONVERTING", active: true }, { label: "WEBSQUARE" }, { label: "XFRAME · MIP" }]}
      />

      <Section eyebrow="Process" title="X-Converting UI 고도화">
        <div className="max-w-[720px] text-n-800">
          <p>
            오래된 업무시스템의 UI를 업그레이드합니다. X컨버팅 프로그램을 통해 프로그램 리소스는
            그대로 사용하므로, UI와 공통프레임 그리고 외부 연동 파트만 업그레이드해 시간과 비용을
            모두 줄일 수 있습니다.
          </p>
        </div>
        <div className="mt-8">
          <MockupFrame
            ratio="8/5"
            caption="같은 업무, 같은 데이터. 클릭 타겟과 정보 위계만 바꿔도 처리 속도가 달라집니다."
          >
            <XConvertingMock />
          </MockupFrame>
        </div>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-2 lg:grid-cols-4">
          {xSteps.map((s, i) => (
            <li key={s.f1} className="bg-n-0 px-5 py-4">
              <span className="tnum text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[15px] text-n-800">{s.f1}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Solutions" title="지원 솔루션" alt>
        <div className="grid gap-6 md:grid-cols-2">
          {solutions.map((s) => (
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
            {easyGuide.map((g) => (
              <li
                key={g.f1}
                className="rounded-md border border-n-100 bg-n-0 px-4 py-3 text-[15px]"
              >
                {g.f1}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
