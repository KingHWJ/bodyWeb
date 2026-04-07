import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { PowerliftingCalculatorForm } from "@/components/calculators/powerlifting-calculator-form";

export const metadata: Metadata = {
  title: "力量举计算器",
  description: "汇总卧推、深蹲、硬拉总成绩，并计算常见评分。",
};

export default function PowerliftingCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="Powerlifting"
      title="力量举计算器"
      description="把卧推、深蹲和硬拉放到一个表单中，快速得到总成绩以及 DOTS、IPF GL、Wilks 评分。"
    >
      <PowerliftingCalculatorForm />
    </CalculatorPageTemplate>
  );
}
