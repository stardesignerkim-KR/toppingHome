export default function PageHead({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-n-900">
        {title}
        {typeof count === "number" && (
          <span className="tnum ml-3 text-lg font-medium text-n-400">{count}개</span>
        )}
      </h1>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
