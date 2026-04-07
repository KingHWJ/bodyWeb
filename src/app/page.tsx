import type { Metadata } from "next";
import Link from "next/link";

import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";
import { CALCULATOR_DEFINITIONS, FAQ_SECTION_SUMMARY, FEATURED_STANDARDS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "首页",
  description: "查看中文力量标准、动作对比与常用力量计算器。",
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-glow),transparent_45%),linear-gradient(180deg,var(--color-hero),transparent)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-muted)]">
              Strength Standards In Chinese
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-[color:var(--color-ink)] md:text-7xl">
              把 StrengthLevel 里真正有用的健身内容，整理成一个顺手的中文工具站。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[color:var(--color-muted)]">
              这里保留力量标准、三大项对比、动作比较页和常用力量公式，默认面向中文训练者，用更直接的表达把查数、对比和估算串起来。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/strength-standards/bench-press/kg"
                className="rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-accent-foreground)] transition hover:brightness-110"
              >
                从卧推标准开始
              </Link>
              <Link
                href="/calculators"
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:border-[color:var(--color-accent)]"
              >
                打开计算器总览
              </Link>
            </div>
          </div>

          <div className="grid gap-4 self-end">
            <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">当前收录</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <StatCard label="普通动作" value="287" />
                <StatCard label="动作对比" value="1337" />
                <StatCard label="详情页" value="3248" />
                <StatCard label="核心计算器" value="7+" />
              </div>
            </div>
            <div className="rounded-[2rem] bg-[color:var(--color-panel-strong)] p-6 text-[color:var(--color-panel-foreground)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-panel-foreground-muted)]">
                FAQ 会覆盖
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7">
                {FAQ_SECTION_SUMMARY.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PageSection
        eyebrow="Featured Standards"
        title="先从最常用的力量标准和三大项入口开始"
        description="三大项和总成绩页是最常用的入口，先把这些核心页面放到首页，后面再扩展到全部动作和动作对比。"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {FEATURED_STANDARDS.map((item) => (
            <LinkCard key={item.href} {...item} badge="标准页" />
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Calculators"
        title="训练中最常用的 7 类计算器"
        description="先把日常最常打开的工具收口到一处，方便查 1RM、总成绩、配重和力量举评分。"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CALCULATOR_DEFINITIONS.map((item) => (
            <LinkCard key={item.href} {...item} />
          ))}
        </div>
      </PageSection>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[color:var(--color-panel)] p-4">
      <p className="text-3xl font-semibold text-[color:var(--color-ink)]">{value}</p>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">{label}</p>
    </div>
  );
}
