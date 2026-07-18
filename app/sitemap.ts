import type { MetadataRoute } from "next";
import { getAvailableWorkSlugs, hasCaseStudy } from "@/lib/work";

const BASE_URL = "https://alexkrstovic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAvailableWorkSlugs();

  const workPages: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const pages: MetadataRoute.Sitemap = [
      {
        url: `${BASE_URL}/work/${slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];
    if (hasCaseStudy(slug)) {
      pages.push({
        url: `${BASE_URL}/work/${slug}/case-study`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    return pages;
  });

  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...workPages,
  ];
}
