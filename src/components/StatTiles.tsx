import { STATS } from "@/content/site";

export default function StatTiles() {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-n-100 bg-n-100 sm:grid-cols-3">
      {STATS.map((s) => (
        <div key={s.label} className="bg-n-0 px-6 py-8">
          <dd className="flex items-baseline gap-1">
            <span className="tnum text-4xl font-bold text-accent-600">{s.value}</span>
            <span className="text-lg font-medium text-n-600">{s.unit}</span>
          </dd>
          <dt className="mt-2 text-sm text-n-600">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
