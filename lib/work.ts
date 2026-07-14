import fs from "fs";
import path from "path";
import matter from "gray-matter";

const workDirectory = path.join(process.cwd(), "content/work");

export type WorkProjectMeta = {
  slug: string;
  title: string;
  description: string;
  subtitle: string;
  tagline: string;
  introText: string;
  tags: string[];
  heroImage: string;
  listingImage: string;
  industry: string;
  whatIDidSummary: string;
  whatIDid: string[];
  impact: string[];
  timeline: string;
  order: number;
  comingSoon: boolean;
};

export type WorkCaseStudyMeta = {
  title: string;
  subtitle: string;
  role: string[];
  methodology: string;
  researchMethods: string[];
  platform: string;
  tools: string[];
  teamMembers: string[];
};

export function getAllWorkSlugs(): string[] {
  return fs
    .readdirSync(workDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getWorkProjectMeta(slug: string): WorkProjectMeta {
  const filePath = path.join(workDirectory, slug, "project.mdx");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    subtitle: data.subtitle ?? "",
    tagline: data.tagline ?? "",
    introText: data.introText ?? "",
    tags: data.tags ?? [],
    heroImage: data.heroImage ?? "",
    listingImage: data.listingImage ?? data.heroImage ?? "",
    industry: data.industry ?? "",
    whatIDidSummary: data.whatIDidSummary ?? "",
    whatIDid: data.whatIDid ?? [],
    impact: data.impact ?? [],
    timeline: data.timeline ?? "",
    order: data.order ?? 0,
    comingSoon: data.comingSoon ?? false,
  };
}

export function getWorkProjectRaw(slug: string): string {
  const filePath = path.join(workDirectory, slug, "project.mdx");
  return fs.readFileSync(filePath, "utf8");
}

export function getWorkCaseStudyMeta(slug: string): WorkCaseStudyMeta {
  const filePath = path.join(workDirectory, slug, "case-study.mdx");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    title: data.title ?? slug,
    subtitle: data.subtitle ?? "",
    role: data.role ?? [],
    methodology: data.methodology ?? "",
    researchMethods: data.researchMethods ?? [],
    platform: data.platform ?? "",
    tools: data.tools ?? [],
    teamMembers: data.teamMembers ?? [],
  };
}

export function getWorkCaseStudyRaw(slug: string): string {
  const filePath = path.join(workDirectory, slug, "case-study.mdx");
  return fs.readFileSync(filePath, "utf8");
}

export function getAllWorkProjects(): WorkProjectMeta[] {
  return getAllWorkSlugs()
    .map(getWorkProjectMeta)
    .sort((a, b) => a.order - b.order);
}

// Slugs with a real project/case-study page — excludes "coming soon" placeholders,
// which are listed on the home page but have no route of their own.
export function getAvailableWorkSlugs(): string[] {
  return getAllWorkSlugs().filter((slug) => !getWorkProjectMeta(slug).comingSoon);
}
