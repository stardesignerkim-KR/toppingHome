import type { ClientItem } from "@/lib/content";

export default function LogoGrid({ clients }: { clients: ClientItem[] }) {
  return (
    <>
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-4 lg:grid-cols-7">
        {clients.map((c) => (
          <li
            key={c.slug}
            className="flex aspect-[3/2] items-center justify-center bg-n-0 px-3 py-2"
          >
            {c.logo ? (
              // 로고 파일은 2.5:1 공통 틀에 여백까지 맞춰 저장한다(`/admin/clients`).
              // 그래서 여기서는 높이를 묶지 않고 폭을 채우게 둔다 —
              // max-h 로 묶으면 가로로 긴 로고가 글자 몇 px 짜리로 쪼그라든다.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.alt?.trim() || c.name}
                className="h-auto w-full object-contain opacity-80 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
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
