import type { Metadata } from "next";

import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "力量举总成绩标准",
  description: "从三大项入口快速跳转到卧推、深蹲、硬拉和力量举计算器。",
};

const POWERLIFTING_LINKS = [
  {
    href: "/strength-standards/bench-press/kg",
    title: "卧推标准",
    description: "查看卧推在不同性别、体重和年龄下的等级区间。",
  },
  {
    href: "/strength-standards/squat/kg",
    title: "深蹲标准",
    description: "快速查看深蹲强度阈值和常见对比入口。",
  },
  {
    href: "/strength-standards/deadlift/kg",
    title: "硬拉标准",
    description: "查看硬拉在中文站中的标准页和相关对比页面。",
  },
  {
    href: "/powerlifting-calculator",
    title: "力量举计算器",
    description: "直接输入三项数据，得到总成绩和评分。",
  },
];

export default function PowerliftingStandardsPage() {
  return (
    <PageSection
      eyebrow="Powerlifting Standards"
      title="三大项与总成绩入口"
      description="这里先提供力量举相关的主入口和说明，后续会继续把总成绩标准表与更完整的数据抓取结果接进来。"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {POWERLIFTING_LINKS.map((item) => (
          <LinkCard key={item.href} {...item} badge="三大项" />
        ))}
      </div>
    </PageSection>
  );
}
