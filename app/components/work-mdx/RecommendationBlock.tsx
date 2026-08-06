import Image from "next/image";
import Reveal from "@/app/components/Reveal";
import Narrow from "@/app/components/work-mdx/Narrow";

// MDX (next-mdx-remote) only reliably passes plain string attributes to
// custom components — array/number JSX expressions ({...}) are silently
// dropped. Multi-item props are therefore passed as "|"-delimited strings
// and split here, same workaround Shot.tsx uses for its boolean props.
export default function RecommendationBlock({
  number,
  title,
  intro,
  goal,
  actions,
  expectedImpact,
  expectedImpactList,
  image,
  imageAlt,
}: {
  number: string;
  title: string;
  intro: string;
  goal: string;
  actions: string;
  expectedImpact?: string;
  expectedImpactList?: string;
  image: string;
  imageAlt: string;
}) {
  const actionItems = actions.split("|");
  const impactItems = expectedImpactList?.split("|");

  return (
    <Narrow>
      <Reveal delay={0} className="mb-14">
        <h3 className="font-[family-name:var(--font-heading)] font-bold text-[20px] md:text-[24px] text-text mb-2">
          Recommendation {number}: {title}
        </h3>
        <p className="font-[family-name:var(--font-body)] font-light text-[15px] md:text-[16px] text-text/80 leading-relaxed mb-5">
          {intro}
        </p>

        <div className="flex flex-col gap-5 font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
          <div>
            <p className="font-semibold mb-1">Goal</p>
            <p>{goal}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Actions</p>
            <ul className="list-disc pl-5 space-y-1">
              {actionItems.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Expected impact</p>
            {impactItems ? (
              <ul className="list-disc pl-5 space-y-1">
                {impactItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{expectedImpact}</p>
            )}
          </div>
        </div>

        <div className="relative w-full rounded-[10px] overflow-hidden bg-tag mt-6" style={{ aspectRatio: "16 / 10" }}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>
      </Reveal>
    </Narrow>
  );
}
