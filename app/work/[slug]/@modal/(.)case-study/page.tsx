import { notFound } from "next/navigation";
import { getAvailableWorkSlugs, hasCaseStudy } from "@/lib/work";
import CaseStudyContent from "@/app/components/work/CaseStudyContent";
import CaseStudyModalShell from "@/app/components/work/CaseStudyModalShell";
import ModalCloseButton from "@/app/components/work/ModalCloseButton";

export default async function CaseStudyModalRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAvailableWorkSlugs();
  if (!slugs.includes(slug) || !hasCaseStudy(slug)) notFound();

  return (
    <CaseStudyModalShell>
      <CaseStudyContent slug={slug} closeButton={<ModalCloseButton />} />
    </CaseStudyModalShell>
  );
}
