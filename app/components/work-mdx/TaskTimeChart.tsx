"use client";

import GroupedBarChart from "@/app/components/work-mdx/GroupedBarChart";
import Reveal from "@/app/components/Reveal";
import { taskTime, CHART_COLORS, type Group } from "@/lib/data/zealty-research";

export default function TaskTimeChart({ group }: { group: Group | "Novice" | "Expert" }) {
  const key = (group.toLowerCase() as Group) === "novice" ? "novice" : "expert";
  const stats = taskTime[key];
  const title = key === "novice" ? "Novice - Task Time (Zealty vs REW)" : "Expert - Task Time (Zealty vs REW)";

  return (
    <Reveal delay={0} className="mb-0">
      <GroupedBarChart
        title={title}
        categories={stats.map((t) => t.label)}
        series={[
          { key: "zealty", label: "Zealty", color: CHART_COLORS.zealty, values: stats.map((t) => t.zealty) },
          { key: "rew", label: "REW", color: CHART_COLORS.rew, values: stats.map((t) => t.rew) },
        ]}
        unit="s"
        height={340}
        barWidth={56}
        barGap={2}
        gradient
        legendStyle="stacked"
        tickSize="lg"
        tooltipExtra={(i) => `p=${stats[i].pValue.toFixed(3)} · ${stats[i].interpretation}`}
      />
    </Reveal>
  );
}
