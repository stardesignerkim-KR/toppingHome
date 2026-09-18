import Link from "next/link";
import Container from "./Container";
import { SITE } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-n-100 bg-n-50 py-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold text-n-900">{SITE.shortName}</p>
            <p className="mt-3 text-sm text-n-600">{SITE.name}</p>
            <p className="text-sm text-n-600">
              {SITE.founded} 설립 · 대표 {SITE.ceo}
            </p>
            <p className="mt-2 text-sm text-n-600">{SITE.address}</p>
            <p className="mt-2 text-sm text-n-600 tnum">
              Tel. {SITE.tel} · {SITE.email}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-n-600">
            <Link href="/terms" className="hover:text-n-900">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-n-900">
              개인정보처리방침
            </Link>
          </div>
        </div>

        <p className="mt-10 border-t border-n-100 pt-6 text-xs text-n-400">
          © {new Date().getFullYear()} {SITE.name}. ALL RIGHTS RESERVED.
        </p>
      </Container>
    </footer>
  );
}
