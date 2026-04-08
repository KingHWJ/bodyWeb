import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { OneRepMaxForm } from "@/components/calculators/one-rep-max-form";

export const metadata: Metadata = {
  title: "1RM 计算器",
  description: "根据重量和次数估算一倍最大重量。",
};

export default function OneRepMaxCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="One Rep Max"
      title="1RM 计算器"
      description="输入某一组的训练重量和次数，快速估算当前的一倍最大重量。"
    >
      <OneRepMaxForm />
    </CalculatorPageTemplate>
  );
}
