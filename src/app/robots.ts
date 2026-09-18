import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      // 네이버 검색로봇 — 국내 B2B 유입의 핵심
      { userAgent: "Yeti", allow: "/", disallow: "/admin" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
