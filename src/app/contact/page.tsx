import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { getPageHeader, getPageMeta } from "@/lib/content";
import { getSiteCopy } from "@/lib/site-content";

export const dynamic = "force-dynamic";

// ⚠️ metadata 는 서버 컴포넌트에서만 동작한다.
// 폼은 "use client" 가 필요하므로 ContactForm 으로 분리했다.
export async function generateMetadata(): Promise<Metadata> {
  const m = await getPageMeta("contact", {
    title: "문의하기",
    description: "업무시스템·AI 플랫폼 UIUX 프로젝트 문의. 주식회사 토핑인터랙티브.",
  });
  return {
    title: m.title,
    description: m.description,
    openGraph: m.ogImage ? { images: [m.ogImage] } : undefined,
  };
}

export default async function ContactPage() {
  const [header, copy] = await Promise.all([
    getPageHeader("contact", { title: "문의하기" }),
    getSiteCopy(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        pageId="contact"
        header={header}
        aside={[{ label: "프로젝트 문의", active: true }, { label: "견적 요청" }, { label: "파트너십" }]}
      />

      <section className="py-12 md:py-16">
        <Container>
          <ContactForm
            info={{ tel: copy.tel, direct: copy.direct, email: copy.email, address: copy.address }}
          />
        </Container>
      </section>
    </>
  );
}
