import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  return [
    { url: base, priority: 1.0, changeFrequency: "monthly" },
    { url: `${base}/ai`, priority: 0.95, changeFrequency: "monthly" },
    { url: `${base}/work`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/service`, priority: 0.85, changeFrequency: "monthly" },
    { url: `${base}/solution`, priority: 0.85, changeFrequency: "monthly" },
    { url: `${base}/about`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/contact`, priority: 0.8, changeFrequency: "yearly" },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  ];
}
