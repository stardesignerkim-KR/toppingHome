import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Modal from "@/components/Modal";
import CTASection from "@/components/CTASection";
import LawFigure, { LAW_ORDER, type LawId } from "@/components/figures/LawFigure";

import { getPageHeader, getList, getPageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("service", {
    title: "UIUX Service",
    description: "업무시스템·AI 솔루션 UIUX 표준기획. 인지심리학 기반 업무 표준 UIUX와 UI 표준 정의서.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function ServicePage() {
  const [header, laws, flow, toc] = await Promise.all([
    getPageHeader("service", {
      title: "한 우물만 팝니다",
      subtitle:
        "AI · 업무시스템 · 솔루션 UIUX. 국내 최다의 업무시스템 구축 경험에서 나온 표준을 제공합니다.",
    }),
    getList("cognitive_laws"),
    getList("uiux_flow"),
    getList("standard_toc"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Service"
        pageId="service"
        header={header}
        aside={[{ label: "인지심리학 UIUX", active: true }, { label: "UIUX FLOW 37단계" }, { label: "UI 표준 정의서" }]}
      />

      <Section
        eyebrow="Cognitive Psychology"
        title="업무표준 인지심리학 UIUX"
        lead="인지심리학을 적용해 사용성을 끌어올린 업무 표준 UIUX를 제공합니다."
      >
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {laws.map((l, i) => (
            <li
              key={l.f1}
              className="overflow-hidden rounded-lg border border-n-100 bg-n-0 transition-colors hover:border-n-200"
              data-reveal
              style={{ "--d": `${(i % 3) * 70}ms` } as React.CSSProperties}
            >
              <div className="border-b border-n-100 bg-n-25 p-4">
                <LawFigure id={(l.f3 as LawId) || LAW_ORDER[i % LAW_ORDER.length]} delay={(i % 3) * 70} />
              </div>
              <div className="flex gap-3 p-5">
                <span className="tnum shrink-0 text-sm text-accent-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium text-n-900">{l.f1}</p>
                  <p className="mt-1 text-sm leading-relaxed text-n-600">{l.f2}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* 참고자료 — 강조하지 않고 링크 → 모달 */}
      <Section eyebrow="Methodology" title="Topping UIUX FLOW" alt>
        <div className="max-w-[720px]">
          <p className="text-n-800">
            현행 분석부터 이행 지원까지, 대규모 프로젝트에서 검증된 UIUX 방법론으로 체계적이고
            효과적으로 수행합니다.
          </p>
          <div className="mt-6">
            <Modal label="전체 프로세스 보기" title="Topping UIUX FLOW">
              <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {flow.map((f, i) => (
                  <li key={f.f1} className="flex gap-3">
                    <span className="tnum w-6 shrink-0 text-n-400">{i + 1}</span>
                    <span>{f.f1}</span>
                  </li>
                ))}
              </ol>
            </Modal>
          </div>
        </div>
      </Section>

      <Section eyebrow="Standard" title="업무표준 정의서">
        <div className="max-w-[720px]">
          <p className="text-n-800">
            표준 정의서가 확실히 성립되면 UI 문제로 재개발하는 위험이 없어집니다.
          </p>
          <div className="mt-6">
            <Modal label="정의서 목차 보기" title="UI 표준 정의서 목차">
              <div className="space-y-6">
                {toc.map((ch) => (
                  <div key={ch.f1}>
                    <p className="font-semibold text-n-900">
                      <span className="tnum mr-2 text-accent-600">{ch.f1}</span>
                      {ch.f2}
                    </p>
                    <ul className="mt-2 space-y-1 pl-6 text-[15px] text-n-600">
                      {ch.items.map((it) => (
                        <li key={it} className="list-disc">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Modal>
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
