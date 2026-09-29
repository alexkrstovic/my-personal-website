import type { MetadataRoute } from "next";
import { getAvailableWorkSlugs, hasCaseStudy } from "@/lib/work";
import { getAllJournalPosts } from "@/lib/journal";

const BASE_URL = "https://alexkrstovic.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = getAvailableWorkSlugs();
  const posts = await getAllJournalPosts();

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

  const journalPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

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
    {
      url: `${BASE_URL}/journal`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...workPages,
    ...journalPages,
  ];
}
