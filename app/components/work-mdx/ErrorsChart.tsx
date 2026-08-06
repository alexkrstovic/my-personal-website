"use client";

import GroupedBarChart from "@/app/components/work-mdx/GroupedBarChart";
import Reveal from "@/app/components/Reveal";
import { avgErrors, CHART_COLORS, type Group } from "@/lib/data/zealty-research";

export default function ErrorsChart({ group }: { group: Group | "Novice" | "Expert" }) {
  const key = (group.toLowerCase() as Group) === "novice" ? "novice" : "expert";
  const stats = avgErrors[key];
  const title = key === "novice" ? "Novice - Avg Errors per Task (Zealty vs REW)" : "Expert - Avg Errors per Task (Zealty vs REW)";

  // Callout on Task 4 (complex filtering) for the expert group only — the
  // specific comparison the case study copy calls out ("4.6x more errors").
  const task4Index = stats.findIndex((t) => t.task === 4);
  const task4 = stats[task4Index];
  const annotate =
    key === "expert" && task4 && task4.rew > 0
      ? { categoryIndex: task4Index, text: `${(task4.zealty / task4.rew).toFixed(1)}× more errors` }
      : undefined;

  return (
    <Reveal delay={0} className="mb-0">
      <GroupedBarChart
        title={title}
        categories={stats.map((t) => t.label)}
        series={[
          { key: "zealty", label: "Zealty", color: CHART_COLORS.zealty, values: stats.map((t) => t.zealty) },
          { key: "rew", label: "REW", color: CHART_COLORS.rew, values: stats.map((t) => t.rew) },
        ]}
        unit=""
        valueFormatter={(v) => v.toFixed(2)}
        height={340}
        barWidth={56}
        barGap={2}
        gradient
        legendStyle="stacked"
        tickSize="lg"
        annotate={annotate}
      />
    </Reveal>
  );
}
