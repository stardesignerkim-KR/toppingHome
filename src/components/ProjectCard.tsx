import type { AiProjectItem } from "@/lib/content";
import { getMockupForProject, MOCKUP_NOTICE } from "@/components/mockup";

export default function ProjectCard({ project }: { project: AiProjectItem }) {
  // 관리자에서 올린 이미지가 있으면 그것을 쓰고, 없으면 UI 목업을 그린다.
  const Mock = project.thumbnail ? null : getMockupForProject(project.id);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-n-100 bg-n-0 transition-colors hover:border-n-200">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-n-100 bg-n-50">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.thumbnail} alt={project.alt?.trim() || project.org} className="h-full w-full object-cover" />
        ) : Mock ? (
          <>
            <Mock />
            <span
              className="absolute top-2 right-2 rounded-full bg-n-900/70 px-2 py-0.5 text-[10px] text-n-0"
              title={MOCKUP_NOTICE}
            >
              UI 목업
            </span>
          </>
        ) : (
          <span className="text-sm text-n-400">이미지 준비 중</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="self-start rounded-full bg-n-50 px-2.5 py-1 text-[13px] text-n-600">
          {project.industry}
        </span>

        <h3 className="mt-4 text-xl font-semibold text-n-900">{project.org}</h3>

        <ul className="mt-3 space-y-1">
          {project.systems.map((s) => (
            <li
              key={s}
              className={`text-[15px] ${
                s === "AI 업무지원시스템" ? "font-medium text-accent-900" : "text-n-800"
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
