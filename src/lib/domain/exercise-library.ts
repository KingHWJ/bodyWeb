import type { ExerciseStandardData, ExerciseStandardSummaryRow } from "@/lib/content/types";
import {
  buildExerciseNameParts,
  buildExerciseNamePartsFromEnglishName,
} from "@/lib/domain/exercise-translation";
import { buildExerciseStandardsPath } from "@/lib/domain/paths";

export type ExerciseLibraryItem = {
  slug: string;
  chineseName: string;
  englishName: string;
  description: string;
  searchTokens: string[];
  href: string;
  requirements: {
    maleIntermediate: string;
    maleAdvanced: string;
    femaleIntermediate: string;
    femaleAdvanced: string;
  };
};

export function buildExerciseLibraryItem(
  slug: string,
  data: ExerciseStandardData | null,
): ExerciseLibraryItem {
  // 动作库页面统一使用 kg 基准摘要，便于在搜索结果里直接展示一眼能看懂的能力要求。
  const parts = data
    ? buildExerciseNamePartsFromEnglishName(data.exerciseName)
    : buildExerciseNameParts(slug);
  const englishName = data?.exerciseName ?? parts.secondary ?? parts.primary;

  return {
    slug,
    chineseName: parts.primary,
    englishName,
    description: buildExerciseMotionDescription(slug, parts.primary),
    searchTokens: buildExerciseSearchTokens(slug, parts.primary, englishName),
    href: buildExerciseStandardsPath(slug, "kg"),
    requirements: {
      maleIntermediate: findLevelValue(data?.male ?? [], "Intermediate"),
      maleAdvanced: findLevelValue(data?.male ?? [], "Advanced"),
      femaleIntermediate: findLevelValue(data?.female ?? [], "Intermediate"),
      femaleAdvanced: findLevelValue(data?.female ?? [], "Advanced"),
    },
  };
}

export function searchExerciseLibrary(
  items: ExerciseLibraryItem[],
  query: string,
) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return items;
  }

  return items
    .map((item) => ({
      item,
      score: scoreExerciseLibraryItem(item, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.item.slug.localeCompare(right.item.slug))
    .map((entry) => entry.item);
}

function scoreExerciseLibraryItem(item: ExerciseLibraryItem, normalizedQuery: string) {
  return item.searchTokens.reduce((bestScore, token) => {
    const normalizedToken = normalizeSearchText(token);

    if (!normalizedToken) {
      return bestScore;
    }

    if (normalizedToken === normalizedQuery) {
      return Math.max(bestScore, 1000);
    }

    if (normalizedToken.startsWith(normalizedQuery)) {
      return Math.max(bestScore, 800 - Math.max(0, normalizedToken.length - normalizedQuery.length));
    }

    const includesIndex = normalizedToken.indexOf(normalizedQuery);
    if (includesIndex >= 0) {
      return Math.max(bestScore, 600 - includesIndex);
    }

    const subsequenceScore = scoreSubsequenceMatch(normalizedToken, normalizedQuery);
    return Math.max(bestScore, subsequenceScore);
  }, 0);
}

function scoreSubsequenceMatch(token: string, query: string) {
  // 这里用轻量级子序列匹配兜底，让 bp / dl 这类缩写也能命中对应动作。
  let queryIndex = 0;
  let gapPenalty = 0;
  let previousMatchIndex = -1;

  for (let tokenIndex = 0; tokenIndex < token.length; tokenIndex += 1) {
    if (token[tokenIndex] !== query[queryIndex]) {
      continue;
    }

    if (previousMatchIndex >= 0) {
      gapPenalty += tokenIndex - previousMatchIndex - 1;
    }

    previousMatchIndex = tokenIndex;
    queryIndex += 1;

    if (queryIndex === query.length) {
      return Math.max(1, 400 - gapPenalty * 4 - (token.length - query.length));
    }
  }

  return 0;
}

function buildExerciseSearchTokens(slug: string, chineseName: string, englishName: string) {
  return [
    slug,
    slug.replace(/-/g, ""),
    chineseName,
    englishName,
    englishName.replace(/\s+/g, ""),
    buildInitials(englishName),
  ].filter(Boolean);
}

function buildInitials(englishName: string) {
  return englishName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toLowerCase() ?? "")
    .join("");
}

function buildExerciseMotionDescription(slug: string, displayName: string) {
  if (matchesAny(slug, ["squat", "lunge", "split-squat", "step-up"])) {
    return `${displayName} 属于以下肢蹲类发力为主的动作，重点考察股四头肌、臀部和核心稳定能力。`;
  }

  if (matchesAny(slug, ["deadlift", "romanian", "hip-thrust", "good-morning", "pull-through"])) {
    return `${displayName} 属于以后链和髋主导发力为主的动作，重点考察臀腿后侧、下背稳定和握持能力。`;
  }

  if (matchesAny(slug, ["bench", "push-up", "dip", "chest-press", "fly"])) {
    return `${displayName} 属于以上肢推为主的动作，重点考察胸部、前三角、肱三头和肩胛稳定。`;
  }

  if (matchesAny(slug, ["press", "jerk", "thruster"])) {
    return `${displayName} 属于以上举推举为主的动作，重点考察肩部、肱三头、核心张力和全身协同。`;
  }

  if (matchesAny(slug, ["row", "pulldown", "pull-up", "chin-up", "face-pull", "pullover"])) {
    return `${displayName} 属于以上肢拉为主的动作，重点考察背阔肌、上背、肩胛控制和手臂屈肌参与。`;
  }

  if (matchesAny(slug, ["curl"])) {
    return `${displayName} 属于以肘屈曲为主的孤立动作，重点考察肱二头肌、肱肌和前臂控制。`;
  }

  if (matchesAny(slug, ["tricep", "pushdown", "kickback"])) {
    return `${displayName} 属于以肘伸展为主的孤立动作，重点考察肱三头肌发力和上臂稳定。`;
  }

  if (matchesAny(slug, ["crunch", "sit-up", "leg-raise", "twist", "climber", "rollout"])) {
    return `${displayName} 属于以核心控制为主的动作，重点考察腹部发力、骨盆控制和躯干稳定。`;
  }

  if (matchesAny(slug, ["calf-raise"])) {
    return `${displayName} 属于以下肢小腿发力为主的动作，重点考察踝关节控制和小腿力量耐受。`;
  }

  return `${displayName} 属于力量训练中的常见动作，页面会提供对应等级标准、能力要求摘要和进一步查看入口。`;
}

function matchesAny(slug: string, keywords: string[]) {
  return keywords.some((keyword) => slug.includes(keyword));
}

function findLevelValue(rows: ExerciseStandardSummaryRow[], level: string) {
  return rows.find((row) => row.level === level)?.value ?? "暂无数据";
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
}
