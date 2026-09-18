import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | AI 업무지원시스템 UIUX`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: `${SITE.name} | AI 업무지원시스템 UIUX`,
    description: SITE.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  alternateName: "Topping Interactive",
  description: SITE.description,
  foundingDate: "2010-04",
  founder: { "@type": "Person", name: SITE.ceo },
  url: SITE.url,
  email: SITE.email,
  telephone: "+82-70-8875-5559",
  address: {
    "@type": "PostalAddress",
    streetAddress: "서현로 170 풍림아이원플러스 D-1907",
    addressLocality: "성남시 분당구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  areaServed: "KR",
  knowsAbout: [
    "AI 업무지원시스템 UIUX",
    "업무시스템 UI 표준",
    "LLM Orchestration UX",
    "Nexacro",
    "WebSquare",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
