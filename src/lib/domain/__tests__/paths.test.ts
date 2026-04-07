import { describe, expect, it } from "vitest";

import {
  buildExerciseStandardsPath,
  buildStrengthStandardsComparisonPath,
  parseStrengthStandardsPath,
} from "@/lib/domain/paths";

describe("力量标准路径工具", () => {
  it("可以解析普通动作标准页路径", () => {
    expect(parseStrengthStandardsPath("/strength-standards/bench-press/kg")).toEqual({
      kind: "exercise",
      slug: "bench-press",
      unit: "kg",
    });
  });

  it("可以解析动作对比页路径", () => {
    expect(parseStrengthStandardsPath("/strength-standards/bench-press-vs-squat/lb")).toEqual({
      kind: "comparison",
      slug: "bench-press-vs-squat",
      leftSlug: "bench-press",
      rightSlug: "squat",
      unit: "lb",
    });
  });

  it("可以生成普通动作标准页路径", () => {
    expect(buildExerciseStandardsPath("deadlift", "kg")).toBe("/strength-standards/deadlift/kg");
  });

  it("可以生成动作对比页路径", () => {
    expect(buildStrengthStandardsComparisonPath("bench-press", "squat", "lb")).toBe(
      "/strength-standards/bench-press-vs-squat/lb",
    );
  });
});
