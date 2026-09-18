import { INDUSTRY_LABEL, type AiProject } from "@/content/ai-projects";

export default function ProjectCard({ project }: { project: AiProject }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-n-100 bg-n-0 transition-colors hover:border-n-200">
      {/* 이미지 자리 — public/ 에 자산 추가 후 next/image 로 교체 */}
      <div className="flex aspect-[16/10] items-center justify-center border-b border-n-100 bg-n-50 text-sm text-n-400">
        이미지 준비 중
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="self-start rounded-full bg-n-50 px-2.5 py-1 text-[13px] text-n-600">
          {INDUSTRY_LABEL[project.industry]}
        </span>

        <h3 className="mt-4 text-xl font-semibold text-n-900">{project.org}</h3>

        <ul className="mt-3 space-y-1">
          {project.systems.map((s) => (
            <li
              key={s}
              className={`text-[15px] ${
                s === "AI 업무지원시스템"
                  ? "font-medium text-accent-900"
                  : "text-n-800"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-n-600">{project.summary}</p>
      </div>
    </article>
  );
}
