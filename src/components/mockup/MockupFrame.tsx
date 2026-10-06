import { MOCKUP_NOTICE } from "./index";

/**
 * 목업 SVG 를 감싸는 공통 액자.
 * 목업이 실제 납품 화면으로 오해되지 않도록 배지와 캡션을 항상 함께 둔다.
 */
export default function MockupFrame({
  children,
  caption,
  ratio = "16/10",
}: {
  children: React.ReactNode;
  caption?: string;
  ratio?: "16/10" | "16/9" | "8/5";
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-n-100 bg-n-0">
      <div
        className="relative w-full bg-n-50"
        style={{ aspectRatio: ratio.replace("/", " / ") }}
      >
        {children}
        <span className="absolute top-3 right-3 rounded-full bg-n-900/70 px-2.5 py-1 text-[11px] text-n-0">
          UI 목업
        </span>
      </div>
      <figcaption className="border-t border-n-100 px-5 py-3">
        {caption && <p className="text-[15px] text-n-800">{caption}</p>}
        <p className="mt-1 text-[13px] text-n-400">{MOCKUP_NOTICE}</p>
      </figcaption>
    </figure>
  );
}
