import type {
  ComparisonStandardData,
  ComparisonStandardSummaryRow,
  ExerciseStandardData,
  ExerciseStandardSummaryRow,
} from "@/lib/content/types";
import { buildExerciseDisplayName } from "@/lib/domain/exercise-translation";

export function findRelatedComparisonSlugs(
  exerciseSlug: string,
  comparisonSlugs: string[],
  limit = 6,
) {
  return comparisonSlugs
    .filter((slug) => slug.includes(`${exerciseSlug}-vs-`) || slug.includes(`-vs-${exerciseSlug}`))
    .slice(0, limit);
}

export function buildComparisonSwapSlug(
  leftSlug: string,
  rightSlug: string,
  comparisonSlugs: string[],
) {
  const reversedSlug = `${rightSlug}-vs-${leftSlug}`;
  if (comparisonSlugs.includes(reversedSlug)) {
    return reversedSlug;
  }

  const currentSlug = `${leftSlug}-vs-${rightSlug}`;
  if (comparisonSlugs.includes(currentSlug)) {
    return currentSlug;
  }

  return reversedSlug;
}

export function buildExercisePageDescription(data: ExerciseStandardData) {
  const maleIntermediate = findLevelValue(data.male, "Intermediate");
  const femaleIntermediate = findLevelValue(data.female, "Intermediate");

  return `${buildExerciseDisplayName(slugifyEnglishName(data.exerciseName))} 当前提供男女摘要表、按体重表和按年龄表。参考中级重量约为男性 ${maleIntermediate}、女性 ${femaleIntermediate}。`;
}

export function buildExerciseGuidance(data: ExerciseStandardData) {
  const maleAdvanced = findLevelValue(data.male, "Advanced");
  const femaleAdvanced = findLevelValue(data.female, "Advanced");

  return [
    "先看页面顶部的全体用户摘要表，可以快速判断自己大概落在哪个等级区间；如果你只想做一次粗略对标，这一块最够用。",
    "按体重和按年龄表更适合做精细判断。体重更接近你的现实训练环境，年龄则更适合横向理解不同训练阶段的大致表现。",
    `当前单位为 ${data.unit.toUpperCase()}。如果你更常用另一套单位，可以直接切换页面单位；例如高级参考大致是男性 ${maleAdvanced}、女性 ${femaleAdvanced}。`,
  ];
}

export function buildExerciseFaqEntries(slug: string) {
  const displayName = buildExerciseDisplayName(slug);
  const usesExternalLoad = mightUseExternalLoad(slug);

  return [
    `${displayName} 标准页里的重量一般按动作最终完成重量理解；如果你做的是杠铃、哑铃或器械动作，通常需要把器械本身的实际负重一起算进去。`,
    "这些等级更适合做群体参照，而不是训练计划本身。你可以把它当作位置判断工具，再结合自己的训练频率、动作标准和恢复情况来安排进度。",
    usesExternalLoad
      ? "如果你的动作受器械、握距、深度或比赛标准影响较大，最好把同一种执行标准下的成绩放在一起比较，这样参考价值会更高。"
      : "如果你的动作带有明显自重属性，体重变化会显著影响结果，建议优先结合按体重表来理解等级变化。",
  ];
}

export function buildComparisonPageDescription(data: ComparisonStandardData) {
  const maleIntermediate = findComparisonLevelValue(data.male, "Intermediate");

  return `当前对比页展示 ${buildExerciseDisplayName(slugifyEnglishName(data.leftName))} 与 ${buildExerciseDisplayName(slugifyEnglishName(data.rightName))} 在男女不同等级下的并列参考。以男性中级为例，大致是 ${maleIntermediate}。`;
}

export function buildComparisonGuidance(data: ComparisonStandardData) {
  const femaleIntermediate = findComparisonLevelValue(data.female, "Intermediate");

  return [
    "对比页更适合回答“两个动作通常差多少”这类问题，尤其适合给辅助动作选重、估计迁移关系，或者快速理解不同动作的常见难度。",
    "建议先看中级和高级两行，这两档最能反映一般持续训练者的常见水平；如果你还是入门期，再回看新手和初学者会更贴切。",
    `当前单位为 ${data.unit.toUpperCase()}。例如女性中级大致可对照为 ${femaleIntermediate}，你可以据此判断两个动作之间的相对差距。`,
  ];
}

function findLevelValue(rows: ExerciseStandardSummaryRow[], level: string) {
  return rows.find((row) => row.level === level)?.value ?? "暂无数据";
}

function findComparisonLevelValue(rows: ComparisonStandardSummaryRow[], level: string) {
  const match = rows.find((row) => row.level === level);
  if (!match) {
    return "暂无数据";
  }

  return `${match.leftValue} vs ${match.rightValue}`;
}

function mightUseExternalLoad(slug: string) {
  return !slug.includes("push-up") && !slug.includes("pull-up") && !slug.includes("chin-up") && !slug.includes("sit-up");
}

function slugifyEnglishName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
