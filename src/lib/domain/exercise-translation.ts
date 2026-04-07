const EXERCISE_TRANSLATION_MAP: Record<string, string> = {
  "bench-press": "卧推",
  squat: "深蹲",
  deadlift: "硬拉",
  "pull-ups": "引体向上",
  "romanian-deadlift": "罗马尼亚硬拉",
  "incline-dumbbell-bench-press": "上斜哑铃卧推",
};

function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function translateExerciseSlugToZhCn(slug: string): string | null {
  return EXERCISE_TRANSLATION_MAP[slug] ?? null;
}

export function toDisplayExerciseName(slug: string): string {
  return translateExerciseSlugToZhCn(slug) ?? titleizeSlug(slug);
}

export function buildComparisonDisplayName(leftSlug: string, rightSlug: string): string {
  return `${toDisplayExerciseName(leftSlug)} vs ${toDisplayExerciseName(rightSlug)}`;
}
