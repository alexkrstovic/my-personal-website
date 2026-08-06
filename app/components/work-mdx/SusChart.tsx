"use client";

import GroupedBarChart from "@/app/components/work-mdx/GroupedBarChart";
import Reveal from "@/app/components/Reveal";
import { susScores, susBenchmarks, CHART_COLORS } from "@/lib/data/zealty-research";

export default function SusChart() {
  const categories = ["New home buyers", "Expert users"];

  return (
    <Reveal delay={0} className="mb-10">
      <GroupedBarChart
        title="SUS Score (Novice VS Expert)"
        categories={categories}
        series={[
          {
            key: "zealty",
            label: "Zealty SUS",
            color: CHART_COLORS.zealty,
            values: [susScores.novice.zealty, susScores.expert.zealty],
          },
          {
            key: "rew",
            label: "REW SUS",
            color: CHART_COLORS.rew,
            values: [susScores.novice.rew, susScores.expert.rew],
          },
        ]}
        benchmarks={[
          { value: susBenchmarks.b2c.value, label: susBenchmarks.b2c.label },
          { value: susBenchmarks.b2b.value, label: susBenchmarks.b2b.label },
        ]}
        height={420}
        yMax={80}
        barWidth={150}
        barGap={2}
        gradient
        legendStyle="stacked"
        tickSize="lg"
        tooltipExtra={(i) => {
          const stat = i === 0 ? susScores.novice : susScores.expert;
          return `n=${stat.n} · p=${stat.pValue.toFixed(3)} · ${stat.interpretation}`;
        }}
      />
    </Reveal>
  );
}
