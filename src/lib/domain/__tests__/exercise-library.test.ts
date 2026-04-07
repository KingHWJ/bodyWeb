import { describe, expect, it } from "vitest";

import {
  buildExerciseLibraryItem,
  searchExerciseLibrary,
} from "@/lib/domain/exercise-library";

describe("动作库", () => {
  it("可以生成带动作说明和能力要求的列表项", () => {
    const item = buildExerciseLibraryItem("bench-press", {
      kind: "exercise",
      exerciseName: "Bench Press",
      unit: "kg",
      male: [
        { level: "Intermediate", value: "98 kg" },
        { level: "Advanced", value: "132 kg" },
      ],
      female: [
        { level: "Intermediate", value: "51 kg" },
        { level: "Advanced", value: "74 kg" },
      ],
      maleBodyweightRatio: [],
      femaleBodyweightRatio: [],
      maleByBodyweight: [],
      femaleByBodyweight: [],
      maleByAge: [],
      femaleByAge: [],
    });

    expect(item.chineseName).toBe("卧推");
    expect(item.description).toContain("上肢推");
    expect(item.requirements.maleIntermediate).toBe("98 kg");
    expect(item.requirements.femaleAdvanced).toBe("74 kg");
  });

  it("可以按中文、英文和缩写做模糊搜索", () => {
    const items = [
      buildExerciseLibraryItem("bench-press", {
        kind: "exercise",
        exerciseName: "Bench Press",
        unit: "kg",
        male: [],
        female: [],
        maleBodyweightRatio: [],
        femaleBodyweightRatio: [],
        maleByBodyweight: [],
        femaleByBodyweight: [],
        maleByAge: [],
        femaleByAge: [],
      }),
      buildExerciseLibraryItem("squat", {
        kind: "exercise",
        exerciseName: "Squat",
        unit: "kg",
        male: [],
        female: [],
        maleBodyweightRatio: [],
        femaleBodyweightRatio: [],
        maleByBodyweight: [],
        femaleByBodyweight: [],
        maleByAge: [],
        femaleByAge: [],
      }),
    ];

    expect(searchExerciseLibrary(items, "卧推")[0]?.slug).toBe("bench-press");
    expect(searchExerciseLibrary(items, "bench")[0]?.slug).toBe("bench-press");
    expect(searchExerciseLibrary(items, "bp")[0]?.slug).toBe("bench-press");
  });
});
