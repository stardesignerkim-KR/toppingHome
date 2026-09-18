import Link from "next/link";
import Container from "@/components/Container";
import Section from "@/components/Section";
import StatTiles from "@/components/StatTiles";
import ProjectCard from "@/components/ProjectCard";
import LogoGrid from "@/components/LogoGrid";
import CTASection from "@/components/CTASection";
import { HERO } from "@/content/site";
import { AI_PROJECTS, AI_CAPABILITIES } from "@/content/ai-projects";
import { X_CONVERTING_STEPS } from "@/content/solutions";

export default function HomePage() {
  return (
    <>
      {/* 1층 — Hero */}
      <section className="border-b border-n-100 bg-n-0 py-20 md:py-32">
        <Container>
          <h1 className="text-[34px] leading-[1.2] font-bold tracking-tight text-n-900 md:text-[56px]">
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}
          </h1>
          <p className="mt-6 text-lg text-n-600">{HERO.sub}</p>
          <p className="mt-2 text-sm tracking-wide text-n-400 uppercase">
            {HERO.tagline}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/ai"
              className="rounded-md bg-accent-600 px-6 py-3 font-medium text-white transition-colors hover:bg-accent-700"
            >
              AI 업무지원시스템 보기
            </Link>
            <Link
              href="/work"
              className="rounded-md border border-n-200 px-6 py-3 font-medium text-n-800 transition-colors hover:border-n-400"
            >
              수행 실적
            </Link>
          </div>
        </Container>
      </section>

      {/* 2·3층 — AI 3건이 히어로 주장을 곧바로 받는다. 이 연결을 끊지 말 것 */}
      <Section
        eyebrow="AI Projects"
        title="같은 AI 업무지원시스템이 세 기관에 들어갔습니다"
        lead="공공 2곳, 금융 1곳. 업종이 전부 다른데 같은 시스템이 들어갔다는 것은, 한 번 넣고 끝난 것이 아니라 계속 쓰이고 있다는 뜻입니다."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {AI_PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <div className="mt-8">
          <StatTiles />
        </div>
      </Section>

      {/* 4층 — AI 역량 */}
      <Section
        eyebrow="AI Service UIUX"
        title="LLM Orchestration Platform UIUX"
        lead="AI를 화면에 붙이는 일과 업무 흐름에 넣는 일은 다릅니다."
        alt
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
        <Link
          href="/ai"
          className="mt-8 inline-block text-[15px] font-medium text-accent-600 underline underline-offset-4"
        >
          AI 업무지원시스템 자세히 보기 →
        </Link>
      </Section>

      {/* 5층 — 클라이언트 */}
      <Section eyebrow="Client" title="함께한 기업과 기관">
        <LogoGrid />
      </Section>

      {/* 6층 — 솔루션 */}
      <Section
        eyebrow="for Solution"
        title="UIUX 기획 · 디자인 · 퍼블리싱"
        lead="AI 솔루션, 투비소프트 넥사크로, 소프트베이스 Xframe, 인스웨이브 WebSquare의 UIUX 표준기획 · 디자인 · 퍼블리싱을 지원합니다."
        alt
      >
        <div>
          <p className="mb-4 text-sm font-medium text-n-900">
            X-Converting UI 고도화 PROCESS
          </p>
          <ol className="grid gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-2 lg:grid-cols-4">
            {X_CONVERTING_STEPS.map((s, i) => (
              <li key={s} className="bg-n-0 px-5 py-4">
                <span className="tnum text-sm text-accent-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-[15px] text-n-800">{s}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/solution"
            className="mt-8 inline-block text-[15px] font-medium text-accent-600 underline underline-offset-4"
          >
            솔루션 지원 전체 보기 →
          </Link>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
