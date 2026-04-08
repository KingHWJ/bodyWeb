import { describe, expect, it } from "vitest";

import {
  buildCoverageSummary,
  buildScrapePlan,
  type InventoryLike,
} from "@/lib/content/scrape-plan";

const inventory: InventoryLike = {
  exerciseStandardSlugs: ["bench-press", "squat", "deadlift"],
  comparisonStandardSlugs: ["bench-press-vs-squat", "deadlift-vs-squat"],
};

describe("标准页抓取计划", () => {
  it("默认返回示例抓取队列", () => {
    const plan = buildScrapePlan([], inventory, []);

    expect(plan.exerciseSlugs).toEqual(["bench-press", "squat", "deadlift"]);
    expect(plan.comparisonSlugs).toEqual(["bench-press-vs-squat", "deadlift-vs-squat"]);
    expect(plan.resume).toBe(false);
  });

  it("可以按标记选择全部普通动作并限制数量", () => {
    const plan = buildScrapePlan(["--all-exercises", "--limit", "2"], inventory, []);

    expect(plan.exerciseSlugs).toEqual(["bench-press", "squat"]);
    expect(plan.comparisonSlugs).toEqual([]);
  });

  it("显式传入 slug 时优先使用显式目标", () => {
    const plan = buildScrapePlan(["bench-press", "deadlift-vs-squat", "--all"], inventory, []);

    expect(plan.exerciseSlugs).toEqual(["bench-press"]);
    expect(plan.comparisonSlugs).toEqual(["deadlift-vs-squat"]);
  });

  it("resume 模式会跳过已有双单位文件的 slug", () => {
    const existingFiles = [
      "bench-press.kg.json",
      "bench-press.lb.json",
      "bench-press-vs-squat.kg.json",
      "bench-press-vs-squat.lb.json",
    ];

    const plan = buildScrapePlan(["--all", "--resume"], inventory, existingFiles);

    expect(plan.exerciseSlugs).toEqual(["squat", "deadlift"]);
    expect(plan.comparisonSlugs).toEqual(["deadlift-vs-squat"]);
    expect(plan.resume).toBe(true);
  });
});

describe("标准页覆盖率统计", () => {
  it("可以按双单位文件统计动作页和对比页覆盖率", () => {
    const summary = buildCoverageSummary(inventory, [
      "bench-press.kg.json",
      "bench-press.lb.json",
      "squat.kg.json",
      "squat.lb.json",
      "bench-press-vs-squat.kg.json",
      "bench-press-vs-squat.lb.json",
    ]);

    expect(summary.exercise.completed).toBe(2);
    expect(summary.exercise.total).toBe(3);
    expect(summary.comparison.completed).toBe(1);
    expect(summary.comparison.total).toBe(2);
  });
});
