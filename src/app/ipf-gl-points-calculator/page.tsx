import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { ScoreCalculatorForm } from "@/components/calculators/score-calculator-form";

export const metadata: Metadata = {
  title: "IPF GL 积分计算器",
  description: "计算力量举 IPF GL / Goodlift 评分。",
};

export default function IpfGlPointsCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="IPF GL"
      title="IPF GL 积分计算器"
      description="适合按当前体重和总成绩估算 Goodlift / IPF GL 分值，用来和力量举成绩做更公平的横向比较。"
    >
      <ScoreCalculatorForm type="ipf-gl" />
    </CalculatorPageTemplate>
  );
}
