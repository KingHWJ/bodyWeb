import { describe, expect, it } from "vitest";

import { convertWeight, normalizeWeightToKg, roundDisplayWeight } from "@/lib/domain/units";

describe("重量单位转换", () => {
  it("可以把磅转换为公斤基准值", () => {
    expect(normalizeWeightToKg(220.5, "lb")).toBeCloseTo(100.0172, 3);
  });

  it("可以在公斤和磅之间互转", () => {
    expect(convertWeight(100, "kg", "lb")).toBeCloseTo(220.462, 2);
    expect(convertWeight(220.462, "lb", "kg")).toBeCloseTo(100, 2);
  });

  it("会按展示单位做合理四舍五入", () => {
    expect(roundDisplayWeight(100.0185, "kg")).toBe(100);
    expect(roundDisplayWeight(220.462, "lb")).toBe(220.5);
  });
});
