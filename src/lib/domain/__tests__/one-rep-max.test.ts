import { describe, expect, it } from "vitest";

import { estimateOneRepMax } from "@/lib/domain/one-rep-max";

describe("一倍最大重量估算", () => {
  it("8 次以下使用 Brzycki 公式", () => {
    expect(estimateOneRepMax(100, 5)).toBeCloseTo(112.5, 1);
  });

  it("10 次以上使用 Epley 公式", () => {
    expect(estimateOneRepMax(100, 12)).toBeCloseTo(140, 1);
  });

  it("8 到 10 次之间使用插值", () => {
    const nineRepMax = estimateOneRepMax(100, 9);
    expect(nineRepMax).toBeGreaterThan(126);
    expect(nineRepMax).toBeLessThan(131);
  });

  it("1 次时返回原始重量", () => {
    expect(estimateOneRepMax(135, 1)).toBe(135);
  });
});
