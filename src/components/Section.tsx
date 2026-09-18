import Container from "./Container";

export default function Section({
  eyebrow,
  title,
  lead,
  children,
  alt = false,
  id,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children?: React.ReactNode;
  alt?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`border-t border-n-100 py-16 md:py-24 ${alt ? "bg-n-50" : "bg-n-25"}`}
    >
      <Container>
        {eyebrow && (
          <p className="mb-3 text-[13px] font-medium tracking-wide text-accent-600 uppercase">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-2xl font-semibold text-n-900 md:text-[28px]">{title}</h2>
        )}
        {lead && <p className="mt-3 max-w-[720px] text-n-600">{lead}</p>}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  );
}
