import { describe, expect, it } from "vitest";

import {
  buildExerciseDisplayName,
  buildExerciseNameParts,
  buildComparisonDisplayName,
  toDisplayExerciseName,
  translateExerciseSlugToZhCn,
} from "@/lib/domain/exercise-translation";

describe("动作名称中文化", () => {
  it("可以把常见动作 slug 翻译为中文", () => {
    expect(translateExerciseSlugToZhCn("bench-press")).toBe("卧推");
    expect(translateExerciseSlugToZhCn("incline-dumbbell-bench-press")).toBe("上斜哑铃卧推");
    expect(translateExerciseSlugToZhCn("pull-ups")).toBe("引体向上");
    expect(translateExerciseSlugToZhCn("close-grip-bench-press")).toBe("窄握卧推");
    expect(translateExerciseSlugToZhCn("lat-pulldown")).toBe("高位下拉");
  });

  it("可以输出带回退能力的展示名称", () => {
    expect(toDisplayExerciseName("romanian-deadlift")).toBe("罗马尼亚硬拉");
    expect(toDisplayExerciseName("mystery-lift")).toBe("Mystery Lift");
  });

  it("可以生成中文优先、英文辅助的动作展示文案", () => {
    expect(buildExerciseNameParts("bench-press")).toEqual({
      primary: "卧推",
      secondary: "Bench Press",
      plainText: "卧推（Bench Press）",
    });

    expect(buildExerciseDisplayName("mystery-lift")).toBe("Mystery Lift");
  });

  it("可以生成对比页中文标题", () => {
    expect(buildComparisonDisplayName("bench-press", "squat")).toBe("卧推（Bench Press） vs 深蹲（Squat）");
  });
});
