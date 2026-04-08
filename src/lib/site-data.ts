export type NavItem = {
  href: string;
  label: string;
};

export type CalculatorDefinition = {
  href: string;
  title: string;
  description: string;
  badge: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/strength-standards", label: "力量标准" },
  { href: "/exercise-library", label: "动作列表" },
  { href: "/calculators", label: "计算器" },
  { href: "/content-coverage", label: "覆盖清单" },
  { href: "/faq", label: "FAQ" },
];

export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = [
  {
    href: "/one-rep-max-calculator",
    title: "1RM 计算器",
    description: "根据训练重量和次数估算一倍最大重量，适合规划训练强度。",
    badge: "基础",
  },
  {
    href: "/bench-press-calculator",
    title: "卧推计算器",
    description: "围绕卧推做更聚焦的估算与结果展示，适合日常查数。",
    badge: "热门",
  },
  {
    href: "/plate-barbell-racking-calculator",
    title: "杠铃配重计算器",
    description: "输入目标重量后，快速得出每侧应该挂哪些杠铃片。",
    badge: "实用",
  },
  {
    href: "/powerlifting-calculator",
    title: "力量举计算器",
    description: "汇总卧推、深蹲、硬拉三项成绩，查看总成绩与体重相关指标。",
    badge: "三大项",
  },
  {
    href: "/dots-calculator",
    title: "DOTS 计算器",
    description: "使用 DOTS 系数公平比较不同体重力量举选手的总成绩。",
    badge: "评分",
  },
  {
    href: "/ipf-gl-points-calculator",
    title: "IPF GL 积分计算器",
    description: "使用 Goodlift / IPF GL 公式评估总成绩在当前体重下的表现。",
    badge: "评分",
  },
  {
    href: "/wilks-calculator",
    title: "Wilks 计算器",
    description: "传统力量举系数，方便与老数据或历史记录做横向对比。",
    badge: "经典",
  },
];

export const FEATURED_STANDARDS = [
  { href: "/strength-standards/bench-press/kg", title: "卧推标准", description: "查看男女卧推等级、按体重和年龄分布。" },
  { href: "/strength-standards/squat/kg", title: "深蹲标准", description: "快速比对深蹲强度，适合三大项训练者。" },
  { href: "/strength-standards/deadlift/kg", title: "硬拉标准", description: "查看硬拉各等级的重量阈值和对照表。" },
  { href: "/powerlifting-standards", title: "三项总成绩", description: "把三大项汇总到同一个页面，评估整体力量水平。" },
];

export const FAQ_SECTION_SUMMARY = [
  "如何记录杠铃、哑铃、自重和器械动作",
  "力量标准为什么会偏高，以及如何理解这些等级",
  "1RM 公式的适用范围和输入注意事项",
];
