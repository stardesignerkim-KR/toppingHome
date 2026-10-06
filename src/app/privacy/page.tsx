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
    getPageMeta("privacy", { title: "개인정보처리방침", description: "" }),
  ]);
  return {
    title: meta.title,
    description: meta.description || `${copy.companyName} 개인정보 수집·이용·보관에 관한 안내.`,
    robots: { index: true, follow: true },
    openGraph: meta.ogImage ? { images: [meta.ogImage] } : undefined,
  };
}

export default async function PrivacyPage() {
  const [articles, copy] = await Promise.all([getList("privacy"), getSiteCopy()]);
  const fill = fillLegalTokens(copy, copy.privacyEffective);

  return (
    <LegalShell eyebrow="Privacy" title="개인정보처리방침" effective={copy.privacyEffective}>
      {articles.map((a) => (
        <Article key={a.f1 + a.f2} no={fill(a.f1)} title={fill(a.f2)}>
          <LegalBody items={a.items.map(fill)} />
        </Article>
      ))}
    </LegalShell>
  );
}
