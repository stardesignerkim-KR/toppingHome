import Link from "next/link";
import Container from "./Container";
import { getSiteCopy } from "@/lib/site-content";

export default async function CTASection() {
  const copy = await getSiteCopy();
  return (
    <section className="border-t border-n-100 bg-n-0 py-16 md:py-20">
      <Container className="text-center">
        <h2 className="text-2xl font-semibold text-n-900 md:text-[28px]">
          프로젝트를 준비 중이신가요?
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-n-600">
          업무시스템 · AI 플랫폼 UIUX에 대해 무엇이든 문의해 주세요.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-md bg-accent-600 px-6 py-3 font-medium text-white transition-colors hover:bg-accent-700"
          >
            문의하기
          </Link>
          <a
            href={`tel:${copy.tel.replace(/-/g, "")}`}
            className="tnum rounded-md border border-n-200 px-6 py-3 font-medium text-n-800 transition-colors hover:border-n-400"
          >
            {copy.tel}
          </a>
        </div>
      </Container>
    </section>
  );
}
