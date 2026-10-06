import type { Metadata } from "next";
import { LegalShell, Article } from "@/components/legal/LegalPage";
import LegalBody from "@/components/legal/LegalBody";
import { getList, getPageMeta } from "@/lib/content";
import { getSiteCopy } from "@/lib/site-content";
import { fillLegalTokens } from "@/lib/legal-tokens";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [copy, meta] = await Promise.all([
    getSiteCopy(),
    getPageMeta("terms", { title: "이용약관", description: "" }),
  ]);
  return {
    title: meta.title,
    description: meta.description || `${copy.companyName} 홈페이지 이용약관.`,
    robots: { index: true, follow: true },
    openGraph: meta.ogImage ? { images: [meta.ogImage] } : undefined,
  };
}

export default async function TermsPage() {
  const [articles, copy] = await Promise.all([getList("terms"), getSiteCopy()]);
  const fill = fillLegalTokens(copy, copy.termsEffective);

  return (
    <LegalShell eyebrow="Terms" title="이용약관" effective={copy.termsEffective}>
      {articles.map((a) => (
        <Article key={a.f1 + a.f2} no={fill(a.f1)} title={fill(a.f2)}>
          <LegalBody items={a.items.map(fill)} />
        </Article>
      ))}
    </LegalShell>
  );
}
