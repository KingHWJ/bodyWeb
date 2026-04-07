import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { ScoreCalculatorForm } from "@/components/calculators/score-calculator-form";

export const metadata: Metadata = {
  title: "Wilks 计算器",
  description: "计算经典力量举 Wilks 分值。",
};

export default function WilksCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="Wilks"
      title="Wilks 计算器"
      description="Wilks 是历史上最常见的力量举评分系数之一，适合和旧记录、旧榜单或历史训练日志做对比。"
    >
      <ScoreCalculatorForm type="wilks" />
    </CalculatorPageTemplate>
  );
}
