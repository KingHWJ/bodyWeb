import type { Metadata } from "next";

import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";
import { CALCULATOR_DEFINITIONS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "计算器总览",
  description: "中文力量训练常用计算器，包括 1RM、配重、力量举和评分工具。",
};

export default function CalculatorsPage() {
  return (
    <PageSection
      eyebrow="All Calculators"
      title="把最常用的力量计算器集中到一个目录"
      description="这里保留了力量训练里最常打开的几种工具，优先覆盖三大项训练者和力量举用户的日常需要。"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CALCULATOR_DEFINITIONS.map((item) => (
          <LinkCard key={item.href} {...item} />
        ))}
      </div>
    </PageSection>
  );
}
