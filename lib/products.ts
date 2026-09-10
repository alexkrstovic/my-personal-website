import fs from "fs";
import path from "path";
import matter from "gray-matter";

const productsDirectory = path.join(process.cwd(), "content/products");

export type PersonalProduct = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  link: string;
  logoImage?: string;
  videoSrc?: string;
  videoPoster?: string;
};

export const personalProducts: PersonalProduct[] = [
  {
    slug: "friendly",
    name: "Friendly",
    description: "A journaling companion to help when writers block takes over",
    tags: ["SaaS", "Web application", "IOS", "Android", "Branding"],
    link: "https://myfriendly.app",
    videoSrc: "/images/products/friendly/friendly-hero-video.mp4",
    videoPoster: "/images/products/friendly/friendly-hero-poster.jpg",
    logoImage: "/images/products/friendly/friendly-logo.svg",
  },
];

export type ProductTechGroup = { label: string; items: string[] };

export type ProductCaseStudyMeta = {
  title: string;
  subtitle: string;
  tags: string[];
  productType: string;
  designMethodology: string;
  technologies: ProductTechGroup[];
  currentPhase: string;
  nextStep: string;
  productLink: string;
  synopsis: string[];
};

export function hasProductCaseStudy(slug: string): boolean {
  return fs.existsSync(path.join(productsDirectory, slug, "case-study.mdx"));
}

export function getProductCaseStudyMeta(slug: string): ProductCaseStudyMeta {
  const filePath = path.join(productsDirectory, slug, "case-study.mdx");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    title: data.title ?? slug,
    subtitle: data.subtitle ?? "",
    tags: data.tags ?? [],
    productType: data.productType ?? "",
    designMethodology: data.designMethodology ?? "",
    technologies: data.technologies ?? [],
    currentPhase: data.currentPhase ?? "",
    nextStep: data.nextStep ?? "",
    productLink: data.productLink ?? "",
    synopsis: data.synopsis ?? [],
  };
}

export function getProductCaseStudyRaw(slug: string): string {
  const filePath = path.join(productsDirectory, slug, "case-study.mdx");
  return fs.readFileSync(filePath, "utf8");
}
