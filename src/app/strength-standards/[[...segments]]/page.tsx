import type { Metadata } from "next";
import Link from "next/link";
import inventory from "../../../../content/inventory.json";

import { LinkCard } from "@/components/ui/link-card";
import { PageSection } from "@/components/ui/page-section";
import {
  readNormalizedComparisonData,
  readNormalizedExerciseData,
} from "@/lib/content/standards-data";
import type {
  ComparisonStandardData,
  ExerciseStandardDetailRow,
  ComparisonStandardSummaryRow,
  ExerciseStandardSummaryRow,
} from "@/lib/content/types";
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
      description="聚合页先承接高频动作入口；随着真实数据持续抓取，这里会继续补全更多动作矩阵。"
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

async function ExerciseStandardsPage({ slug, unit }: { slug: string; unit: Unit }) {
  const title = toDisplayExerciseName(slug);
  const fallbackText = translateExerciseSlugToZhCn(slug)
    ? "该动作已接入中文动作名映射。"
    : "该动作暂时使用 slug 自动生成标题，后续会继续补全术语表。";
  const data = await readNormalizedExerciseData(slug, unit);

  return (
    <PageSection
      eyebrow="Exercise Standard"
      title={`${title} 标准 (${unit})`}
      description={
        data
          ? "当前页面已经接入真实摘要表数据，可直接查看男女等级重量对照。"
          : "当前页面已接通标准页模板和路由；该动作的本地摘要表还需要继续抓取。"
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
          <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">动作摘要</h3>
          {data ? (
            <div className="mt-5 grid gap-6">
              <SummaryBlock title="男性重量" rows={data.male} />
              <SummaryBlock title="男性体重倍数" rows={data.maleBodyweightRatio} />
              <SummaryBlock title="女性重量" rows={data.female} />
              <SummaryBlock title="女性体重倍数" rows={data.femaleBodyweightRatio} />
            </div>
          ) : (
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--color-muted)]">
              <p>动作 slug：{slug}</p>
              <p>展示单位：{unit.toUpperCase()}</p>
              <p>{fallbackText}</p>
            </div>
          )}
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
          <div className="mt-6 rounded-[1.5rem] border border-white/60 bg-white/40 p-4 text-sm leading-7 text-[color:var(--color-muted-strong)]">
            <p>当前动作：{data?.exerciseName ?? title}</p>
            <p>展示单位：{unit.toUpperCase()}</p>
            <p>{fallbackText}</p>
          </div>
          </div>
      </div>
      {/* 真实数据到位后，标准页会同时展示摘要表和按体重/年龄的等级矩阵，尽量贴近原站信息密度。 */}
      {data ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <DetailTableBlock title="男性按体重参考" label="体重" rows={data.maleByBodyweight} />
          <DetailTableBlock title="女性按体重参考" label="体重" rows={data.femaleByBodyweight} />
          <DetailTableBlock title="男性按年龄参考" label="年龄" rows={data.maleByAge} />
          <DetailTableBlock title="女性按年龄参考" label="年龄" rows={data.femaleByAge} />
        </div>
      ) : null}
    </PageSection>
  );
}

async function ComparisonStandardsPage({ slug, unit }: { slug: string; unit: Unit }) {
  const [leftSlug, rightSlug] = slug.split("-vs-");
  const title = buildComparisonDisplayName(leftSlug, rightSlug);
  const data = await readNormalizedComparisonData(slug, unit);

  return (
    <PageSection
      eyebrow="Comparison"
      title={`${title} (${unit})`}
      description={
        data
          ? "当前页面已经接入真实对比摘要表，可直接查看两项动作在同一等级下的重量差异。"
          : "对比页模板已打通，当前用于承接大量动作对比路由，并提供双动作互链入口。"
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
          {data ? (
            <div className="grid gap-6">
              <ComparisonBlock title="男性" data={data} rows={data.male} />
              <ComparisonBlock title="女性" data={data} rows={data.female} />
            </div>
          ) : (
            <p className="text-sm leading-7 text-[color:var(--color-muted)]">
              当前对比页还没有本地 normalized 数据，后续会通过抓取脚本补齐。
            </p>
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
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
      </div>
    </PageSection>
  );
}

function isAggregateGender(value: string) {
  return value === "male" || value === "female";
}

function SummaryBlock({
  title,
  rows,
}: {
  title: string;
  rows: ExerciseStandardSummaryRow[];
}) {
  return (
    <section>
      <h4 className="text-lg font-semibold text-[color:var(--color-ink)]">{title}</h4>
      <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-panel)] text-[color:var(--color-muted-strong)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">等级</th>
              <th className="px-4 py-3 text-right font-semibold">重量</th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            {rows.map((row) => (
              <tr key={`${title}-${row.level}`} className="border-t border-[color:var(--color-border)]">
                <td className="px-4 py-3 text-[color:var(--color-ink)]">{translateLevel(row.level)}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DetailTableBlock({
  title,
  label,
  rows,
}: {
  title: string;
  label: string;
  rows: ExerciseStandardDetailRow[];
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
      <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[color:var(--color-panel)] text-[color:var(--color-muted-strong)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">{label}</th>
              <th className="px-4 py-3 text-right font-semibold">初学者</th>
              <th className="px-4 py-3 text-right font-semibold">新手</th>
              <th className="px-4 py-3 text-right font-semibold">中级</th>
              <th className="px-4 py-3 text-right font-semibold">高级</th>
              <th className="px-4 py-3 text-right font-semibold">精英</th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            {rows.map((row) => (
              <tr key={`${title}-${row.label}`} className="border-t border-[color:var(--color-border)]">
                <td className="px-4 py-3 text-[color:var(--color-ink)]">{row.label}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.beginner}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.novice}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.intermediate}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.advanced}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.elite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonBlock({
  title,
  data,
  rows,
}: {
  title: string;
  data: ComparisonStandardData;
  rows: ComparisonStandardSummaryRow[];
}) {
  return (
    <section>
      <h4 className="text-lg font-semibold text-[color:var(--color-ink)]">{title}</h4>
      <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-panel)] text-[color:var(--color-muted-strong)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">等级</th>
              <th className="px-4 py-3 text-right font-semibold">{toDisplayExerciseName(slugifyName(data.leftName))}</th>
              <th className="px-4 py-3 text-right font-semibold">{toDisplayExerciseName(slugifyName(data.rightName))}</th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            {rows.map((row) => (
              <tr key={`${title}-${row.level}`} className="border-t border-[color:var(--color-border)]">
                <td className="px-4 py-3 text-[color:var(--color-ink)]">{translateLevel(row.level)}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.leftValue}</td>
                <td className="px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">{row.rightValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function translateLevel(level: string) {
  const map: Record<string, string> = {
    Beginner: "新手",
    Novice: "入门",
    Intermediate: "中级",
    Advanced: "高级",
    Elite: "精英",
  };

  return map[level] ?? level;
}

function slugifyName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}
