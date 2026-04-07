import { describe, expect, it } from "vitest";

import {
  parseComparisonStandardsHtml,
  parseExerciseStandardsHtml,
} from "@/lib/content/standards-parser";

describe("力量标准 HTML 解析", () => {
  it("可以提取普通动作标准页摘要表", () => {
    const html = `
      <h2>Male Bench Press Standards (kg)</h2>
      <table>
        <tr><td>Beginner</td><td>47 kg</td></tr>
        <tr><td>Novice</td><td>70 kg</td></tr>
      </table>
      <h2>Female Bench Press Standards (kg)</h2>
      <table>
        <tr><td>Beginner</td><td>17 kg</td></tr>
        <tr><td>Novice</td><td>31 kg</td></tr>
      </table>
    `;

    expect(parseExerciseStandardsHtml(html)).toEqual({
      kind: "exercise",
      exerciseName: "Bench Press",
      unit: "kg",
      male: [
        { level: "Beginner", value: "47 kg" },
        { level: "Novice", value: "70 kg" },
      ],
      female: [
        { level: "Beginner", value: "17 kg" },
        { level: "Novice", value: "31 kg" },
      ],
    });
  });

  it("可以提取动作对比页摘要表", () => {
    const html = `
      <h2>Male Strength Standards (kg)</h2>
      <table>
        <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
        <tbody>
          <tr><td>Beginner</td><td>47 kg</td><td>64 kg</td></tr>
        </tbody>
      </table>
      <h2>Female Strength Standards (kg)</h2>
      <table>
        <thead><tr><th>Strength Level</th><th>Bench Press</th><th>Squat</th></tr></thead>
        <tbody>
          <tr><td>Beginner</td><td>17 kg</td><td>30 kg</td></tr>
        </tbody>
      </table>
    `;

    expect(parseComparisonStandardsHtml(html, "bench-press-vs-squat")).toEqual({
      kind: "comparison",
      leftName: "Bench Press",
      rightName: "Squat",
      unit: "kg",
      male: [
        { level: "Beginner", leftValue: "47 kg", rightValue: "64 kg" },
      ],
      female: [
        { level: "Beginner", leftValue: "17 kg", rightValue: "30 kg" },
      ],
    });
  });
});
