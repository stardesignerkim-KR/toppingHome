"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export type NavItem = { href: string; label: string };

export default function Header({
  nav,
  brand,
}: {
  nav: NavItem[];
  brand: string;
}) {
  const [open, setOpen] = useState(false);
  // 어두운 히어로 위에서는 투명하게 얹히고, 스크롤하면 흰 바로 굳는다.
  // 내려간 상태는 메뉴를 열었을 때도 강제한다 — 투명 위에 드롭다운은 안 읽힌다.
  const [lifted, setLifted] = useState(false);
  // 어두운 히어로가 없는 페이지(/terms, /privacy 등)에서는 투명해지면
  // 흰 글자가 흰 배경에 묻힌다. 히어로가 있을 때만 투명을 허용한다.
  const [overHero, setOverHero] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOverHero(!!document.querySelector(".hero"));
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const solid = lifted || open || !overHero;

  return (
    <header
      data-solid={solid ? "" : undefined}
      className={`site-header sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-n-100 bg-n-0/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="site-header__brand text-lg font-bold tracking-tight">
          {brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-header__link text-[15px] font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md bg-accent-600 px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-accent-700"
          >
            문의하기
          </Link>
        </nav>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          <span className="site-header__bar block h-0.5 w-6" />
          <span className="site-header__bar mt-1.5 block h-0.5 w-6" />
          <span className="site-header__bar mt-1.5 block h-0.5 w-6" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-n-100 bg-n-0 md:hidden">
          <ul className="px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-n-100 py-3 text-n-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-accent-600 py-3 text-center font-medium text-white"
            >
              문의하기
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
