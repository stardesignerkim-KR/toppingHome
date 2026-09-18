import { CLIENTS } from "@/content/clients";

export default function LogoGrid() {
  return (
    <>
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-4 lg:grid-cols-7">
        {CLIENTS.map((c) => (
          <li
            key={c.slug}
            className="flex aspect-[3/2] items-center justify-center bg-n-0 p-4"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-10 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="text-center text-xs text-n-400">{c.name}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-n-400">
        각 사의 로고는 수행 실적 표기 목적으로 사용되었으며, 해당 상표의 권리는 각 사에 있습니다.
      </p>
    </>
  );
}
