import type { Metadata } from "next";
import Container from "@/components/Container";
import Section from "@/components/Section";
import WorkList from "@/components/WorkList";
import LogoGrid from "@/components/LogoGrid";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "수행 실적",
  description: "금융·공공·제조 업무시스템 UIUX 130여 건. 15년의 수행 실적.",
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-n-100 bg-n-0 py-16 md:py-24">
        <Container>
          <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            Work
          </p>
          <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
            15년, 130여 건
          </h1>
          <p className="mt-5 max-w-[720px] text-lg text-n-600">
            금융 계정계·정보계, 정부 차세대, ERP, Admin, 물류까지. 업무시스템 한 우물입니다.
          </p>
        </Container>
      </section>

      <Section>
        <WorkList />
      </Section>

      <Section eyebrow="Client" title="함께한 기업과 기관" alt>
        <LogoGrid />
      </Section>

      <CTASection />
    </>
  );
}
