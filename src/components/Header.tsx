"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV, SITE } from "@/content/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-n-100 bg-n-0/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-n-900">
          {SITE.shortName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-n-600 transition-colors hover:text-n-900"
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
          <span className="block h-0.5 w-6 bg-n-800" />
          <span className="mt-1.5 block h-0.5 w-6 bg-n-800" />
          <span className="mt-1.5 block h-0.5 w-6 bg-n-800" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-n-100 bg-n-0 md:hidden">
          <ul className="px-4 py-2">
            {NAV.map((item) => (
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
