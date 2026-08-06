import Reveal from "@/app/components/Reveal";
import Narrow from "@/app/components/work-mdx/Narrow";
import { susScores, susGrades } from "@/lib/data/zealty-research";

export default function SusGradeTable() {
  return (
    <Narrow>
      <Reveal delay={0} className="mb-10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] md:text-[14px] font-[family-name:var(--font-body)] font-light text-text">
            <thead>
              <tr className="border-b border-text/20">
                <th className="text-left py-2 pr-3 font-semibold"></th>
                <th className="text-left py-2 px-3 font-semibold">Zealty</th>
                <th className="text-left py-2 px-3 font-semibold">REW</th>
                <th className="text-left py-2 pl-3 font-semibold">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-text/10">
                <td className="py-2 pr-3 text-text/70">Novices</td>
                <td className="py-2 px-3 tabular-nums">
                  {susScores.novice.zealty.toFixed(1)} (Grade {susGrades.novice.zealty})
                </td>
                <td className="py-2 px-3 tabular-nums">
                  {susScores.novice.rew.toFixed(1)} (Grade {susGrades.novice.rew})
                </td>
                <td className="py-2 pl-3">68 general average</td>
              </tr>
              <tr className="border-b border-text/10">
                <td className="py-2 pr-3 text-text/70">Experts</td>
                <td className="py-2 px-3 tabular-nums">
                  {susScores.expert.zealty.toFixed(1)} (Grade {susGrades.expert.zealty})
                </td>
                <td className="py-2 px-3 tabular-nums">
                  {susScores.expert.rew.toFixed(1)} (Grade {susGrades.expert.rew})
                </td>
                <td className="py-2 pl-3">57 = B2B/professional threshold, 75 = B2C threshold</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>
    </Narrow>
  );
}
