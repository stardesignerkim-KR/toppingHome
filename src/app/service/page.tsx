import type { Metadata } from "next";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Modal from "@/components/Modal";
import CTASection from "@/components/CTASection";
import { COGNITIVE_LAWS, UIUX_FLOW, UI_STANDARD_TOC } from "@/content/methodology";

export const metadata: Metadata = {
  title: "UIUX Service",
  description:
    "업무시스템·AI 솔루션 UIUX 표준기획. 인지심리학 기반 업무 표준 UIUX와 UI 표준 정의서.",
};

export default function ServicePage() {
  return (
    <>
      <section className="border-b border-n-100 bg-n-0 py-16 md:py-24">
        <Container>
          <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            Service
          </p>
          <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
            한 우물만 팝니다
          </h1>
          <p className="mt-5 max-w-[720px] text-lg text-n-600">
            AI · 업무시스템 · 솔루션 UIUX. 국내 최다의 업무시스템 구축 경험에서 나온 표준을
            제공합니다.
          </p>
        </Container>
      </section>

      <Section
        eyebrow="Cognitive Psychology"
        title="업무표준 인지심리학 UIUX"
        lead="인지심리학을 적용해 사용성을 끌어올린 업무 표준 UIUX를 제공합니다."
      >
        <ol className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {COGNITIVE_LAWS.map((l, i) => (
            <li key={l.name} className="flex gap-4 border-b border-n-100 pb-4">
              <span className="tnum w-6 shrink-0 text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium text-n-900">{l.name}</p>
                <p className="text-sm text-n-600">{l.desc}</p>
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
                {UIUX_FLOW.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="tnum w-6 shrink-0 text-n-400">{i + 1}</span>
                    <span>{s}</span>
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
                {UI_STANDARD_TOC.map((ch) => (
                  <div key={ch.no}>
                    <p className="font-semibold text-n-900">
                      <span className="tnum mr-2 text-accent-600">{ch.no}</span>
                      {ch.title}
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
