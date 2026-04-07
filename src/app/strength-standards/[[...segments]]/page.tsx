import type { Metadata } from "next";
import Link from "next/link";
import inventory from "../../../../content/inventory.json";

import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";
import {
  buildComparisonDisplayName,
  toDisplayExerciseName,
  translateExerciseSlugToZhCn,
} from "@/lib/domain/exercise-translation";
import { buildExerciseStandardsPath } from "@/lib/domain/paths";
import type { Unit } from "@/lib/domain/types";

type Params = {
  segments?: string[];
};

export async function generateStaticParams() {
  const params: Array<{ segments?: string[] }> = [{ segments: undefined }];

  for (const path of inventory.aggregateStandardPages) {
    const segments = path.split("/").filter(Boolean).slice(1);
    params.push({ segments });
  }

  for (const slug of inventory.exerciseStandardSlugs) {
    params.push({ segments: [slug, "kg"] });
    params.push({ segments: [slug, "lb"] });
  }

  for (const slug of inventory.comparisonStandardSlugs) {
    params.push({ segments: [slug, "kg"] });
    params.push({ segments: [slug, "lb"] });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { segments } = await params;

  if (!segments || segments.length === 0) {
    return {
      title: "力量标准总览",
      description: "查看普通动作标准页、动作对比页和男女性聚合入口。",
    };
  }

  if (segments.length === 1) {
    return {
      title: `${segments[0]} 力量标准`,
    };
  }

  const [slug, unit] = segments;
  if (slug.includes("-vs-")) {
    const [left, right] = slug.split("-vs-");
    return {
      title: `${buildComparisonDisplayName(left, right)} (${unit})`,
      description: "查看两项动作在不同等级下的对照关系。",
    };
  }

  return {
    title: `${toDisplayExerciseName(slug)} 标准 (${unit})`,
    description: "查看动作在不同等级、单位和入口下的标准页面。",
  };
}

export default async function StrengthStandardsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { segments } = await params;

  if (!segments || segments.length === 0) {
    return <StrengthStandardsOverview />;
  }

  if (segments.length === 1 || segments.length === 2 && isAggregateGender(segments[0])) {
    return <AggregateStandardsPage segments={segments} />;
  }

  const [slug, unit] = segments as [string, Unit];
  if (slug.includes("-vs-")) {
    return <ComparisonStandardsPage slug={slug} unit={unit} />;
  }

  return <ExerciseStandardsPage slug={slug} unit={unit} />;
}

function StrengthStandardsOverview() {
  const popularSlugs = inventory.exerciseStandardSlugs.slice(0, 12);

  return (
    <PageSection
      eyebrow="Strength Standards"
      title="力量标准入口总览"
      description="这里先把男女性聚合页、热门动作标准页和高频动作对比入口铺开。后续结构化数据接入后，页面会继续补上完整表格和说明文案。"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <LinkCard
          href="/strength-standards/male/kg"
          title="男性标准"
          description="从男性聚合页进入，快速查看常见动作的标准入口。"
          badge="聚合"
        />
        <LinkCard
          href="/strength-standards/female/kg"
          title="女性标准"
          description="从女性聚合页进入，查看常见动作的中文力量标准入口。"
          badge="聚合"
        />
        <LinkCard
          href="/strength-standards/bench-press/kg"
          title="卧推标准"
          description="热门三大项入口，适合先验证标准页结构。"
          badge="热门"
        />
        <LinkCard
          href="/strength-standards/bench-press-vs-squat/kg"
          title="卧推 vs 深蹲"
          description="动作对比页模板入口，用于承接大量对比页。"
          badge="比较"
        />
      </div>

      <div className="mt-10 rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">热门动作标准</h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {popularSlugs.map((slug) => (
            <Link
              key={slug}
              href={buildExerciseStandardsPath(slug, "kg")}
              className="rounded-full bg-[color:var(--color-panel)] px-4 py-2 text-sm font-medium text-[color:var(--color-muted-strong)] transition hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-accent-foreground)]"
            >
              {toDisplayExerciseName(slug)}
            </Link>
          ))}
        </div>
      </div>
    </PageSection>
  );
}

function AggregateStandardsPage({ segments }: { segments: string[] }) {
  const gender = segments[0];
  const unit = (segments[1] as Unit | undefined) ?? "kg";
  const hotSlugs = ["bench-press", "squat", "deadlift", "overhead-squat", "pull-ups", "dips"];

  return (
    <PageSection
      eyebrow="Aggregate Standards"
      title={`${gender === "male" ? "男性" : "女性"}力量标准 (${unit})`}
      description="聚合页先用于承接站内入口和路由结构，后面会继续接入完整热门动作矩阵与等级表。"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {hotSlugs.map((slug) => (
          <LinkCard
            key={slug}
            href={buildExerciseStandardsPath(slug, unit)}
            title={`${toDisplayExerciseName(slug)} 标准`}
            description={`查看 ${gender === "male" ? "男性" : "女性"} ${toDisplayExerciseName(slug)} 的标准入口。`}
            badge={gender === "male" ? "男性" : "女性"}
          />
        ))}
      </div>
    </PageSection>
  );
}

function ExerciseStandardsPage({ slug, unit }: { slug: string; unit: Unit }) {
  const title = toDisplayExerciseName(slug);
  const fallbackText = translateExerciseSlugToZhCn(slug)
    ? "该动作已接入中文动作名映射。"
    : "该动作暂时使用 slug 自动生成标题，后续会继续补全术语表。";

  return (
    <PageSection
      eyebrow="Exercise Standard"
      title={`${title} 标准 (${unit})`}
      description="动作标准页模板已经就位，当前优先打通静态路由、中文标题和站内互链，后续继续接入完整表格与说明数据。"
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
          <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">页面状态</h3>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--color-muted)]">
            <p>动作 slug：{slug}</p>
            <p>展示单位：{unit.toUpperCase()}</p>
            <p>{fallbackText}</p>
          </div>
        </div>
        <div className="rounded-[2rem] bg-[color:var(--color-panel)] p-6">
          <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">推荐入口</h3>
          <div className="mt-5 grid gap-3">
            <Link className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--color-ink)]" href="/one-rep-max-calculator">
              打开 1RM 计算器
            </Link>
            <Link className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--color-ink)]" href="/bench-press-calculator">
              打开卧推计算器
            </Link>
            <Link className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--color-ink)]" href="/powerlifting-standards">
              返回三大项入口
            </Link>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function ComparisonStandardsPage({ slug, unit }: { slug: string; unit: Unit }) {
  const [leftSlug, rightSlug] = slug.split("-vs-");
  const title = buildComparisonDisplayName(leftSlug, rightSlug);

  return (
    <PageSection
      eyebrow="Comparison"
      title={`${title} (${unit})`}
      description="对比页模板已打通，当前用于承接大量动作对比路由，并提供双动作互链入口。"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <LinkCard
          href={buildExerciseStandardsPath(leftSlug, unit)}
          title={`${toDisplayExerciseName(leftSlug)} 标准`}
          description="返回左侧动作标准页。"
          badge="左侧动作"
        />
        <LinkCard
          href={buildExerciseStandardsPath(rightSlug, unit)}
          title={`${toDisplayExerciseName(rightSlug)} 标准`}
          description="返回右侧动作标准页。"
          badge="右侧动作"
        />
      </div>
    </PageSection>
  );
}

function isAggregateGender(value: string) {
  return value === "male" || value === "female";
}
