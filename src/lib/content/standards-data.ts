import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ComparisonStandardData, ExerciseStandardData } from "@/lib/content/types";
import type { Unit } from "@/lib/domain/types";

export function buildNormalizedContentPath(slug: string, unit: Unit) {
  return path.join(process.cwd(), "content", "normalized", `${slug}.${unit}.json`);
}

export async function readNormalizedExerciseData(
  slug: string,
  unit: Unit,
): Promise<ExerciseStandardData | null> {
  const data = await readNormalizedJson(buildNormalizedContentPath(slug, unit));
  return data?.kind === "exercise"
    ? normalizeExerciseStandardData(data as Partial<ExerciseStandardData> & Pick<ExerciseStandardData, "kind" | "exerciseName" | "unit" | "male" | "female">)
    : null;
}

export async function readNormalizedComparisonData(
  slug: string,
  unit: Unit,
): Promise<ComparisonStandardData | null> {
  const data = await readNormalizedJson(buildNormalizedContentPath(slug, unit));
  return data?.kind === "comparison" ? (data as ComparisonStandardData) : null;
}

async function readNormalizedJson(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as { kind?: string };
  } catch {
    return null;
  }
}

export function normalizeExerciseStandardData(
  data: Partial<ExerciseStandardData> &
    Pick<ExerciseStandardData, "kind" | "exerciseName" | "unit" | "male" | "female">,
): ExerciseStandardData {
  // 历史抓取文件只有摘要表，新版页面渲染需要的明细字段在读取时统一补齐为空数组。
  return {
    ...data,
    maleBodyweightRatio: data.maleBodyweightRatio ?? [],
    femaleBodyweightRatio: data.femaleBodyweightRatio ?? [],
    maleByBodyweight: data.maleByBodyweight ?? [],
    femaleByBodyweight: data.femaleByBodyweight ?? [],
    maleByAge: data.maleByAge ?? [],
    femaleByAge: data.femaleByAge ?? [],
  };
}
