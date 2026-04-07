import { describe, expect, it } from "vitest";

import {
  buildComparisonGuidance,
  buildComparisonPageDescription,
  buildExerciseFaqEntries,
  buildExerciseGuidance,
  buildExercisePageDescription,
  buildComparisonSwapSlug,
  findRelatedComparisonSlugs,
} from "@/lib/content/standards-page-content";

describe("标准页增强内容", () => {
  it("可以找出与动作相关的对比页", () => {
    const result = findRelatedComparisonSlugs(
      "bench-press",
      [
        "bench-press-vs-squat",
        "deadlift-vs-bench-press",
        "pull-ups-vs-push-ups",
      ],
      4,
    );

    expect(result).toEqual([
      "bench-press-vs-squat",
      "deadlift-vs-bench-press",
    ]);
  });

  it("可以优先返回存在的 swap slug", () => {
    expect(
      buildComparisonSwapSlug(
        "bench-press",
        "squat",
        ["bench-press-vs-squat", "squat-vs-bench-press"],
      ),
    ).toBe("squat-vs-bench-press");

    expect(
      buildComparisonSwapSlug(
        "bench-press",
        "squat",
        ["bench-press-vs-squat"],
      ),
    ).toBe("bench-press-vs-squat");
  });

  it("可以生成普通动作页描述和说明文案", () => {
    const data = {
      kind: "exercise" as const,
      exerciseName: "Bench Press",
      unit: "kg" as const,
      male: [
        { level: "Beginner", value: "44kg" },
        { level: "Intermediate", value: "98kg" },
        { level: "Advanced", value: "140kg" },
      ],
      female: [
        { level: "Beginner", value: "20kg" },
        { level: "Intermediate", value: "49kg" },
        { level: "Advanced", value: "73kg" },
      ],
      maleBodyweightRatio: [],
      femaleBodyweightRatio: [],
      maleByBodyweight: [],
      femaleByBodyweight: [],
      maleByAge: [],
      femaleByAge: [],
    };

    expect(buildExercisePageDescription(data)).toContain("卧推（Bench Press）");
    expect(buildExercisePageDescription(data)).toContain("男性 98kg");
    expect(buildExerciseGuidance(data)).toHaveLength(3);
    expect(buildExerciseFaqEntries("bench-press")[0]).toContain("卧推（Bench Press）");
  });

  it("可以生成动作对比页描述和说明文案", () => {
    const data = {
      kind: "comparison" as const,
      leftName: "Bench Press",
      rightName: "Squat",
      unit: "kg" as const,
      male: [
        { level: "Intermediate", leftValue: "98kg", rightValue: "130kg" },
      ],
      female: [
        { level: "Intermediate", leftValue: "49kg", rightValue: "82kg" },
      ],
    };

    expect(buildComparisonPageDescription(data)).toContain("卧推（Bench Press）");
    expect(buildComparisonPageDescription(data)).toContain("98kg vs 130kg");
    expect(buildComparisonGuidance(data)).toHaveLength(3);
  });
});
