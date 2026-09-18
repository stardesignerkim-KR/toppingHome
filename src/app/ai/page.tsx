import type { Metadata } from "next";
import Container from "@/components/Container";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import CTASection from "@/components/CTASection";
import { AI_PROJECTS, AI_CAPABILITIES } from "@/content/ai-projects";

export const metadata: Metadata = {
  title: "AI 업무지원시스템 UIUX",
  description:
    "공공·금융 3개 기관에 구축한 AI 업무지원시스템 UIUX. LLM Orchestration 플랫폼 설계.",
};

export default function AiPage() {
  return (
    <>
      <section className="border-b border-n-100 bg-n-0 py-16 md:py-24">
        <Container>
          <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            AI
          </p>
          <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[44px]">
            AI 업무지원시스템 UIUX
          </h1>
          <p className="mt-5 max-w-[720px] text-lg text-n-600">
            공공 2곳, 금융 1곳. 업종이 다른 세 기관에 같은 시스템이 들어갔습니다.
          </p>
        </Container>
      </section>

      {/* 왜 우리인가 — TODO: 본문 보강 */}
      <Section eyebrow="Why Topping" title="AI를 화면에 붙이는 일과 업무 흐름에 넣는 일은 다릅니다">
        <div className="max-w-[720px] space-y-5 text-n-800">
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
          <p className="rounded-lg border border-n-100 bg-n-0 p-5 text-[15px] text-n-600">
            {/* TODO: 실제 성과 지표·사용률 등 확보 시 교체 */}
            공공·금융 3개 기관에 동일한 AI 업무지원시스템을 구축했습니다. 한 번 납품하고 끝난
            것이 아니라, 업종이 다른 조직들이 같은 구조를 채택했다는 뜻입니다.
          </p>
        </div>
      </Section>

      <Section eyebrow="Projects" title="구축 사례" alt>
        <div className="grid gap-6 md:grid-cols-3">
          {AI_PROJECTS.map((p) => (
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
          {AI_CAPABILITIES.map((c, i) => (
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

      <Section eyebrow="Structure" title="공통 플랫폼 + 업종 특화" alt>
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
