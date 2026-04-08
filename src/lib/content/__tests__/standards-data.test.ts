import { describe, expect, it } from "vitest";

import {
  buildNormalizedContentPath,
  normalizeExerciseStandardData,
  readNormalizedComparisonData,
  readNormalizedExerciseData,
} from "@/lib/content/standards-data";

describe("标准页数据读取", () => {
  it("可以生成 normalized 数据文件路径", () => {
    expect(buildNormalizedContentPath("bench-press", "kg")).toMatch(/content\/normalized\/bench-press\.kg\.json$/);
  });

  it("可以读取已有的普通动作标准数据", async () => {
    const data = await readNormalizedExerciseData("bench-press", "kg");
    expect(data?.kind).toBe("exercise");
    expect(data?.male?.length).toBeGreaterThan(0);
    expect(data?.maleByBodyweight?.length).toBeGreaterThan(0);
    expect(data?.maleByAge?.length).toBeGreaterThan(0);
  });

  it("可以读取已有的动作对比标准数据", async () => {
    const data = await readNormalizedComparisonData("bench-press-vs-squat", "kg");
    expect(data?.kind).toBe("comparison");
    expect(data?.male?.length).toBeGreaterThan(0);
  });

  it("可以为旧版普通动作数据补齐新增字段", () => {
    const data = normalizeExerciseStandardData({
      kind: "exercise",
      exerciseName: "Archer Push Ups",
      unit: "lb",
      male: [{ level: "Beginner", value: "40 lb" }],
      female: [{ level: "Beginner", value: "20 lb" }],
    });

    expect(data.maleBodyweightRatio).toEqual([]);
    expect(data.femaleBodyweightRatio).toEqual([]);
    expect(data.maleByBodyweight).toEqual([]);
    expect(data.femaleByBodyweight).toEqual([]);
    expect(data.maleByAge).toEqual([]);
    expect(data.femaleByAge).toEqual([]);
  });
});
