import type { Metadata } from "next";

import { CalculatorPageTemplate } from "@/components/calculators/calculator-page-template";
import { PlateCalculatorForm } from "@/components/calculators/plate-calculator-form";

export const metadata: Metadata = {
  title: "杠铃配重计算器",
  description: "快速计算每侧杠铃片挂法。",
};

export default function PlateBarbellRackingCalculatorPage() {
  return (
    <CalculatorPageTemplate
      eyebrow="Plate Loading"
      title="杠铃配重计算器"
      description="输入目标重量后，直接得到每侧大致需要挂哪些杠铃片，减少算片时间。"
    >
      <PlateCalculatorForm />
    </CalculatorPageTemplate>
  );
}
