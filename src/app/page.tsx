import Link from "next/link";
import Container from "@/components/Container";
import HeaderPattern from "@/components/HeaderPattern";
import Section from "@/components/Section";
import StatTiles from "@/components/StatTiles";
import ProjectCard from "@/components/ProjectCard";
import LogoGrid from "@/components/LogoGrid";
import CTASection from "@/components/CTASection";
import { getSiteCopy } from "@/lib/site-content";
import {
  getAiProjects,
  getAiCapabilities,
  getClients,
  getList,
} from "@/lib/content";

// 관리자에서 저장한 값이 바로 보이도록 매 요청마다 새로 렌더
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [copy, aiProjects, capabilities, clients, xSteps] = await Promise.all([
    getSiteCopy(),
    getAiProjects(),
    getAiCapabilities(),
    getClients(),
    getList("x_steps"),
  ]);

  return (
    <>
      {/* 1층 — Hero */}
      <section className="hero hero-grade--home">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
        <HeaderPattern pageId="home" />
        <div className="hero__grain" />
        <div className="hero__scrim" />

        <Container className="hero__inner">
          <div className="hero__text">
            <h1 className="hero__title text-[34px] md:text-[56px]">
              {/* 두 줄을 따로 쪼갠다 — 한 덩어리로 넘기면 <br /> 때문에 단어 분해가 안 된다 */}
              <span className="block" data-reveal="words">
                {copy.heroHeadline1}
              </span>
              <span
                className="block"
                data-reveal="words"
                style={{ "--d": "160ms" } as React.CSSProperties}
              >
                {copy.heroHeadline2}
              </span>
            </h1>
            <p
              className="hero__sub text-lg"
              data-reveal
              style={{ "--d": "420ms" } as React.CSSProperties}
            >
              {copy.heroSub}
            </p>
            <p
              className="mt-2 text-sm tracking-wide uppercase"
              style={{ color: "rgb(255 255 255 / 0.4)", "--d": "500ms" } as React.CSSProperties}
              data-reveal
            >
              {copy.heroTagline}
            </p>

            <div
              className="mt-10 flex flex-wrap gap-3"
              data-reveal
              style={{ "--d": "580ms" } as React.CSSProperties}
            >
              <Link
                href="/ai"
                className="rounded-md bg-accent-600 px-6 py-3 font-medium text-white transition-colors hover:bg-accent-700"
              >
                AI 업무지원시스템 보기
              </Link>
              <Link
                href="/work"
                className="rounded-md border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:border-white/70"
              >
                수행 실적
              </Link>
            </div>
          </div>

          <ul className="hero__aside" aria-hidden="true">
            {[
              { label: "경기도청", active: true },
              { label: "대신증권" },
              { label: "직업능률개발원" },
            ].map((a, i) => (
              <li
                key={a.label}
                className={a.active ? "is-active" : undefined}
                data-reveal
                style={{ "--d": `${300 + i * 70}ms` } as React.CSSProperties}
              >
                {a.label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2·3층 — AI 3건이 히어로 주장을 곧바로 받는다. 이 연결을 끊지 말 것 */}
      <Section
        eyebrow="AI Projects"
        title="같은 AI 업무지원시스템이 세 기관에 들어갔습니다"
        lead="공공 2곳, 금융 1곳. 업종이 전부 다른데 같은 시스템이 들어갔다는 것은, 한 번 넣고 끝난 것이 아니라 계속 쓰이고 있다는 뜻입니다."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {aiProjects.map((p) => (
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
        <Link
          href="/ai"
          className="mt-8 inline-block text-[15px] font-medium text-accent-600 underline underline-offset-4"
        >
          AI 업무지원시스템 자세히 보기 →
        </Link>
      </Section>

      {/* 5층 — 클라이언트 */}
      <Section eyebrow="Client" title="함께한 기업과 기관">
        <LogoGrid clients={clients} />
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
            {xSteps.map((s, i) => (
              <li key={s.f1} className="bg-n-0 px-5 py-4">
                <span className="tnum text-sm text-accent-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-[15px] text-n-800">{s.f1}</p>
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
