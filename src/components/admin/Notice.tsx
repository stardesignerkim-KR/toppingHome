export type NoticeState = { type: "ok" | "error"; text: string } | null;

export default function Notice({ state }: { state: NoticeState }) {
  if (!state) return null;
  return (
    <div
      className={`mb-6 rounded-md px-4 py-3 text-sm ${
        state.type === "ok"
          ? "bg-accent-50 text-accent-900"
          : "border border-danger/30 bg-red-50 text-danger"
      }`}
    >
      {state.text}
    </div>
  );
}
