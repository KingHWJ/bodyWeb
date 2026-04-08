import { readdir } from "node:fs/promises";

import type { Metadata } from "next";
import Link from "next/link";

import inventory from "../../../content/inventory.json";

import { ExerciseName } from "@/components/ui/exercise-name";
import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";
import { buildCoverageSummary } from "@/lib/content/scrape-plan";
import { buildExerciseStandardsPath } from "@/lib/domain/paths";

export const metadata: Metadata = {
  title: "内容覆盖清单",
  description: "查看普通动作页、动作对比页、静态页面和计算器页面的当前覆盖状态。",
};

export default async function ContentCoveragePage() {
  const normalizedFiles = await readdir("content/normalized");
  const coverage = buildCoverageSummary(inventory, normalizedFiles);
  const detailPageTotal = coverage.exercise.total + coverage.comparison.total;
  const detailPageCompleted = coverage.exercise.completed + coverage.comparison.completed;

  return (
    <PageSection
      eyebrow="Coverage"
      title="公开健身内容覆盖清单"
      description="这个页面用来透明展示当前站点已经接入了哪些核心内容，以及普通动作页和动作对比页的数据覆盖是否已经到位。"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <CoverageStatCard label="普通动作页" value={`${coverage.exercise.completed}/${coverage.exercise.total}`} />
        <CoverageStatCard label="动作对比页" value={`${coverage.comparison.completed}/${coverage.comparison.total}`} />
        <CoverageStatCard label="详情页总数" value={`${detailPageCompleted}/${detailPageTotal}`} />
        <CoverageStatCard label="本地 JSON 文件" value={`${normalizedFiles.length}`} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
          <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">当前已纳入的页面族</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <CoverageListCard
              title="静态页与总览页"
              items={inventory.staticPages}
            />
            <CoverageListCard
              title={`计算器页 (${inventory.calculatorPages.length})`}
              items={inventory.calculatorPages}
            />
            <CoverageListCard
              title={`聚合标准页 (${inventory.aggregateStandardPages.length})`}
              items={inventory.aggregateStandardPages}
            />
            <CoverageListCard
              title="核心说明"
              items={[
                "公开训练内容完整保留",
                "账号、公司、法律与社媒页面已排除",
                "页面路径保留英文 slug，正文与说明采用简体中文",
              ]}
            />
          </div>
        </section>

        <section className="rounded-[2rem] bg-[color:var(--color-panel)] p-6">
          <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">抽样查看入口</h3>
          <div className="mt-5 grid gap-4">
            <LinkCard
              href={buildExerciseStandardsPath("bench-press", "kg")}
              title={<><ExerciseName slug="bench-press" /> 标准</>}
              description="查看完整普通动作页，包括摘要表、按体重表、按年龄表和说明区。"
              badge="普通动作"
            />
            <LinkCard
              href="/strength-standards/deadlift-vs-squat/kg"
              title={<><ExerciseName slug="deadlift" /> vs <ExerciseName slug="squat" /></>}
              description="查看动作对比页、左右跳转和 swap 入口。"
              badge="动作对比"
            />
            <LinkCard
              href="/strength-standards"
              title="力量标准总览"
              description="从中文总览页进入动作标准、对比页和覆盖清单。"
              badge="总览"
            />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-white/60 bg-white/40 p-4 text-sm leading-7 text-[color:var(--color-muted-strong)]">
            <p>普通动作数据覆盖：{coverage.exercise.completed === coverage.exercise.total ? "已完成" : "进行中"}</p>
            <p>动作对比数据覆盖：{coverage.comparison.completed === coverage.comparison.total ? "已完成" : "进行中"}</p>
            <p>当前覆盖统计基于 `content/inventory.json` 与 `content/normalized` 的本地文件实时计算。</p>
          </div>
        </section>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">热门动作抽样</h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {inventory.exerciseStandardSlugs.slice(0, 12).map((slug) => (
            <Link
              key={slug}
              href={buildExerciseStandardsPath(slug, "kg")}
              className="rounded-full bg-[color:var(--color-panel)] px-4 py-2 text-sm font-medium text-[color:var(--color-muted-strong)] transition hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-accent-foreground)]"
            >
              <ExerciseName slug={slug} />
            </Link>
          ))}
        </div>
      </div>
    </PageSection>
  );
}

function CoverageStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
      <p className="text-3xl font-semibold text-[color:var(--color-ink)]">{value}</p>
      <p className="mt-3 text-sm text-[color:var(--color-muted)]">{label}</p>
    </div>
  );
}

function CoverageListCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-white/70 p-5">
      <h4 className="text-base font-semibold text-[color:var(--color-ink)]">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--color-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
