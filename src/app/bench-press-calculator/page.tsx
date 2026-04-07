import type { Metadata } from "next";

import { BenchPressForm } from "@/components/calculators/bench-press-form";
import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";

export const metadata: Metadata = {
  title: "卧推计算器",
  description: "快速估算卧推 1RM 和体重比。",
};

export default function BenchPressCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="Bench Press"
      title="卧推计算器"
      description="比通用 1RM 更聚焦卧推动作，同时给出当前体重比，适合训练日快速查数。"
    >
      <BenchPressForm />
    </CalculatorPageTemplate>
  );
}
