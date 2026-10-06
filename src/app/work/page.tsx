import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import WorkList from "@/components/WorkList";
import LogoGrid from "@/components/LogoGrid";
import CTASection from "@/components/CTASection";
import { getWorks, getAiProjects, getClients, getPageHeader, getPageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("work", {
    title: "수행 실적",
    description: "금융·공공·제조 업무시스템 UIUX 130여 건. 15년의 수행 실적.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function WorkPage() {
  const [works, aiProjects, clients, header] = await Promise.all([
    getWorks(),
    getAiProjects(),
    getClients(),
    getPageHeader("work", {
      title: "15년, 130여 건",
      subtitle:
        "금융 계정계·정보계, 정부 차세대, ERP, Admin, 물류까지. 업무시스템 한 우물입니다.",
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Work"
        pageId="work"
        header={header}
        aside={[{ label: "금융 계정계·정보계" }, { label: "정부 차세대", active: true }, { label: "ERP · Admin" }, { label: "물류 · 제조" }]}
      />

      <Section>
        <WorkList works={works} aiProjects={aiProjects} />
      </Section>

      <Section eyebrow="Client" title="함께한 기업과 기관" alt>
        <LogoGrid clients={clients} />
      </Section>

      <CTASection />
    </>
  );
}
