export default function Container({
  children,
  prose = false,
  className = "",
}: {
  children: React.ReactNode;
  prose?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 md:px-8 ${prose ? "max-w-[720px]" : "max-w-[1280px]"} ${className}`}
    >
      {children}
    </div>
  );
}
