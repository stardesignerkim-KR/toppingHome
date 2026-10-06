import Link from "next/link";
import Container from "./Container";
import { getSiteCopy } from "@/lib/site-content";

export default async function Footer() {
  const copy = await getSiteCopy();

  return (
    <footer className="border-t border-n-100 bg-n-50 py-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold text-n-900">{copy.shortName}</p>
            <p className="mt-3 text-sm text-n-600">{copy.companyName}</p>
            <p className="text-sm text-n-600">
              {copy.founded} 설립 · 대표 {copy.ceo}
            </p>
            <p className="mt-2 text-sm text-n-600">{copy.address}</p>
            <p className="mt-2 text-sm text-n-600 tnum">
              Tel. {copy.tel} · {copy.email}
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
          © {new Date().getFullYear()} {copy.companyName}. ALL RIGHTS RESERVED.
        </p>
      </Container>
    </footer>
  );
}
