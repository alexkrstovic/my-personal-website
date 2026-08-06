import Reveal from "@/app/components/Reveal";
import Narrow from "@/app/components/work-mdx/Narrow";
import { fullTaskStats, taskLabels, taskDescriptions, type Group } from "@/lib/data/zealty-research";

const ROWS: { key: keyof (typeof fullTaskStats)["novice"][1]["zealty"]; label: string; format: (v: number) => string }[] = [
  { key: "mean", label: "Mean time (sec)", format: (v) => v.toFixed(2) },
  { key: "sd", label: "Standard deviation", format: (v) => v.toFixed(2) },
  { key: "n", label: "N", format: (v) => String(v) },
  { key: "successRate", label: "Success rate", format: (v) => `${v.toFixed(1)}%` },
  { key: "avgErrors", label: "Avg errors", format: (v) => v.toFixed(2) },
  { key: "min", label: "Min time", format: (v) => v.toFixed(2) },
  { key: "max", label: "Max time", format: (v) => v.toFixed(2) },
];

export default function TaskStatsTable({ group }: { group: Group | "Novice" | "Expert" }) {
  const key = (group.toLowerCase() as Group) === "novice" ? "novice" : "expert";
  const stats = fullTaskStats[key];

  return (
    <Narrow>
      <Reveal delay={0} className="mb-10">
        <h3 className="font-[family-name:var(--font-heading)] font-normal text-[20px] md:text-[24px] text-text mb-5">
          Time on Task - {key === "novice" ? "Novice" : "Expert"}
        </h3>
        <div className="flex flex-col gap-8">
          {[1, 2, 3, 4].map((task) => (
            <div key={task}>
              <p className="font-[family-name:var(--font-body)] font-semibold text-[15px] text-text mb-3">
                Task {task}: {taskLabels[task - 1]}
                <span className="block font-light text-text/60 text-[13px] mt-1">{taskDescriptions[task - 1]}</span>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px] md:text-[14px] font-[family-name:var(--font-body)] font-light text-text">
                  <thead>
                    <tr className="border-b border-text/20">
                      <th className="text-left py-2 pr-3 font-semibold">Metric</th>
                      <th className="text-right py-2 px-3 font-semibold">Zealty</th>
                      <th className="text-right py-2 pl-3 font-semibold">REW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row) => (
                      <tr key={row.key} className="border-b border-text/10">
                        <td className="py-2 pr-3 text-text/70">{row.label}</td>
                        <td className="py-2 px-3 text-right tabular-nums">
                          {row.format(stats[task].zealty[row.key])}
                        </td>
                        <td className="py-2 pl-3 text-right tabular-nums">{row.format(stats[task].rew[row.key])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Narrow>
  );
}
