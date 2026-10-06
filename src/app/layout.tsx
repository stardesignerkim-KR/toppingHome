import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { getList, getPageMeta } from "@/lib/content";
import { getSiteCopy } from "@/lib/site-content";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { SITE } from "@/content/site";
import { buildOrganizationJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [copy, m] = await Promise.all([
    getSiteCopy(),
    getPageMeta("home", {
      title: `${SITE.name} | AI 업무지원시스템 UIUX`,
      description: SITE.description,
    }),
  ]);
  return {
  metadataBase: new URL(SITE.url),
  title: {
    default: m.title,
    template: `%s | ${copy.companyName}`,
  },
  description: m.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: copy.companyName,
    title: m.title,
    description: m.description,
    images: m.ogImage ? [m.ogImage] : undefined,
  },
  // 파비콘·앱 아이콘. public/ 에 파일을 넣으면 바로 붙는다.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // 검색엔진 소유확인. 관리자 → 검색엔진에서 코드를 넣으면 태그가 생긴다.
  verification: {
    google: copy.googleVerification || undefined,
    other: copy.naverVerification
      ? { "naver-site-verification": copy.naverVerification }
      : undefined,
  },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navRows, copy] = await Promise.all([getList("nav"), getSiteCopy()]);
  const nav = navRows.map((r) => ({ label: r.f1, href: r.f2 }));
  // 검색엔진용 회사 정보. 관리자에서 주소·전화를 바꾸면 여기도 같이 바뀐다.
  const jsonLd = buildOrganizationJsonLd(copy, SITE.url);

  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Reveal />
        <Header nav={nav} brand={copy.shortName} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
