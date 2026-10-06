import Container from "@/components/Container";

export function LegalShell({
  eyebrow,
  title,
  effective,
  children,
}: {
  eyebrow: string;
  title: string;
  effective: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="text-[13px] font-medium tracking-wide text-accent-600 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[30px] leading-tight font-bold text-n-900 md:text-[40px]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-n-400">시행일 {effective}</p>

        <div className="mt-12 max-w-[720px] space-y-10">{children}</div>
      </Container>
    </section>
  );
}

export function Article({
  no,
  title,
  children,
}: {
  no: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-n-900">
        <span className="tnum mr-2 text-accent-600">{no}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-n-800">
        {children}
      </div>
    </section>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-5">
      {items.map((t) => (
        <li key={t} className="list-disc marker:text-n-400">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-n-100">
      <table className="w-full text-sm">
        <thead className="bg-n-50 text-left text-n-600">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-n-100 bg-n-0">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2 align-top text-n-800">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
