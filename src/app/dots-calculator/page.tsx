import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { ScoreCalculatorForm } from "@/components/calculators/score-calculator-form";

export const metadata: Metadata = {
  title: "DOTS 计算器",
  description: "计算力量举 DOTS 评分。",
};

export default function DotsCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="DOTS"
      title="DOTS 计算器"
      description="DOTS 是现代力量举里最常见的跨体重比较分数之一，适合评估不同体重选手的总成绩。"
    >
      <ScoreCalculatorForm type="dots" />
    </CalculatorPageTemplate>
  );
}
