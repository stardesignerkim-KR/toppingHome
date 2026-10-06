import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import CTASection from "@/components/CTASection";
import MockupFrame from "@/components/mockup/MockupFrame";
import { AiWorkspaceMock, GridCrudMock, DashboardMock } from "@/components/mockup";
import { getAiProjects, getAiCapabilities, getPageHeader, getPageMeta } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("ai", {
    title: "AI 업무지원시스템 UIUX",
    description: "공공·금융 3개 기관에 구축한 AI 업무지원시스템 UIUX. LLM Orchestration 플랫폼 설계.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function AiPage() {
  const [aiProjects, capabilities, header] = await Promise.all([
    getAiProjects(),
    getAiCapabilities(),
    getPageHeader("ai", {
      title: "AI 업무지원시스템 UIUX",
      subtitle: "공공 2곳, 금융 1곳. 업종이 다른 세 기관에 같은 시스템이 들어갔습니다.",
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="AI"
        pageId="ai"
        header={header}
        aside={[{ label: "AI 업무지원시스템", active: true }, { label: "KMS AI 시스템" }, { label: "원격훈련 AI 심사" }, { label: "LLM Orchestration" }]}
      />

      <Section eyebrow="Why Topping" title="AI를 화면에 붙이는 일과 업무 흐름에 넣는 일은 다릅니다">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-5 text-n-800">
            <p>
              AI 채팅 화면을 예쁘게 만드는 것은 어렵지 않습니다. 어려운 것은 이미 돌아가고 있는
              업무 흐름 안에 AI를 넣는 일입니다. 어느 화면에서 부를 것인지, 결과를 어디에 놓을
              것인지, 근거를 어떻게 보여줄 것인지 — 이 판단은 업무를 알아야 내릴 수 있습니다.
            </p>
            <p>
              토핑인터랙티브는 15년간 금융 계정계·정보계, 정부 차세대, ERP, Admin 시스템의 UIUX를
              설계해 왔습니다. AI는 그 위에 얹힌 새 레이어이지, 처음부터 다시 배우는 분야가
              아닙니다.
            </p>
            <p>
              업무시스템에서 AI가 신뢰를 얻는 지점은 답의 화려함이 아니라 근거입니다. 어떤 문서의
              몇 번째 항목에서 나온 숫자인지 한 번의 클릭으로 확인되지 않으면, 담당자는 그 답을
              결재에 쓰지 못합니다. 그래서 저희는 답변 영역과 근거 영역을 항상 함께 설계합니다.
            </p>
            <p className="rounded-lg border border-n-100 bg-n-0 p-5 text-[15px] text-n-600">
              공공·금융 3개 기관에 동일한 AI 업무지원시스템을 구축했습니다. 한 번 납품하고 끝난
              것이 아니라, 업종이 다른 조직들이 같은 구조를 채택했다는 뜻입니다.
            </p>
          </div>

          <MockupFrame caption="답변 옆에 근거 문서를 항상 붙여 둡니다. 출처 없는 답은 업무에 쓰이지 않습니다.">
            <AiWorkspaceMock />
          </MockupFrame>
        </div>
      </Section>

      <Section eyebrow="Projects" title="구축 사례" alt>
        <div className="grid gap-6 md:grid-cols-3">
          {aiProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Capability"
        title="AI Service UIUX 10"
        lead="LLM Orchestration Platform UIUX를 지원합니다."
      >
        <ol className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <li key={c.title} className="flex gap-4 border-b border-n-100 pb-4">
              <span className="tnum w-6 shrink-0 text-sm text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium text-n-900">{c.title}</p>
                <p className="text-sm text-n-600">{c.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Patterns"
        title="AI 이전에 업무 화면이 먼저 서 있어야 합니다"
        lead="AI는 그리드와 대시보드 위에 얹힙니다. 바탕이 되는 화면을 저희가 직접 설계해 온 이유입니다."
        alt
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <MockupFrame caption="업무 그리드 · CRUD 표준 — 조회 조건, 그리드, 상세 폼의 3단 구조">
            <GridCrudMock />
          </MockupFrame>
          <MockupFrame caption="업무 통계 대시보드 — KPI, 추이, 구성비, 처리 대기">
            <DashboardMock />
          </MockupFrame>
        </div>
      </Section>

      <Section eyebrow="Structure" title="공통 플랫폼 + 업종 특화">
        <div className="max-w-[720px] space-y-4 text-n-800">
          <p>
            세 기관에 공통으로 들어간 것은 <strong>AI 업무지원시스템</strong>입니다. 그 위에
            기관별 업무에 맞춘 시스템이 얹힙니다.
          </p>
          <ul className="space-y-3">
            <li className="rounded-lg border border-n-100 bg-n-0 p-4">
              <strong className="text-n-900">대신증권</strong> — 지식관리(KMS)와 AI를 결합
            </li>
            <li className="rounded-lg border border-n-100 bg-n-0 p-4">
              <strong className="text-n-900">직업능률개발원</strong> — 원격훈련 과정 심사 업무에
              AI를 적용
            </li>
            <li className="rounded-lg border border-n-100 bg-n-0 p-4">
              <strong className="text-n-900">경기도청</strong> — 광역자치단체 업무 흐름에 생성형
              AI를 결합
            </li>
          </ul>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
