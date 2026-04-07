import { estimateOneRepMax } from "@/lib/domain/one-rep-max";
import type { Unit } from "@/lib/domain/types";
import { convertWeight, roundDisplayWeight } from "@/lib/domain/units";

export type Gender = "male" | "female";

export function estimateBenchPressMetrics({
  bodyweight,
  weight,
  reps,
  unit,
}: {
  bodyweight: number;
  weight: number;
  reps: number;
  unit: Unit;
}) {
  const estimatedOneRepMax = estimateOneRepMax(weight, reps);
  const ratio = bodyweight > 0 ? estimatedOneRepMax / bodyweight : 0;

  return {
    estimatedOneRepMax: roundDisplayWeight(estimatedOneRepMax, unit),
    bodyweightRatio: Number(ratio.toFixed(2)),
  };
}

export function calculatePlateLoadout({
  targetWeight,
  barWeight,
  unit,
}: {
  targetWeight: number;
  barWeight: number;
  unit: Unit;
}) {
  const standardPlates = unit === "kg" ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5];
  const remainingEachSide = Math.max(targetWeight - barWeight, 0) / 2;

  let remaining = remainingEachSide;
  const plates: Array<{ size: number; count: number }> = [];

  for (const size of standardPlates) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      plates.push({ size, count });
      remaining -= size * count;
    }
  }

  return {
    perSideWeight: roundDisplayWeight(remainingEachSide, unit),
    plates,
    remainder: Number(remaining.toFixed(2)),
  };
}

export function calculatePowerliftingTotal(lifts: { bench: number; squat: number; deadlift: number }) {
  return lifts.bench + lifts.squat + lifts.deadlift;
}

export function calculateDots({ total, bodyweight, gender }: { total: number; bodyweight: number; gender: Gender }) {
  const coefficients =
    gender === "male"
      ? [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093] as const
      : [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706] as const;

  const denominator =
    coefficients[0] +
    coefficients[1] * bodyweight +
    coefficients[2] * bodyweight ** 2 +
    coefficients[3] * bodyweight ** 3 +
    coefficients[4] * bodyweight ** 4;

  return Number(((500 / denominator) * total).toFixed(2));
}

export function calculateWilks({
  total,
  bodyweight,
  gender,
}: {
  total: number;
  bodyweight: number;
  gender: Gender;
}) {
  const coefficients =
    gender === "male"
      ? [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 0.00000701863, -0.00000001291] as const
      : [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 0.00004731582, -0.00000009054] as const;

  const denominator =
    coefficients[0] +
    coefficients[1] * bodyweight +
    coefficients[2] * bodyweight ** 2 +
    coefficients[3] * bodyweight ** 3 +
    coefficients[4] * bodyweight ** 4 +
    coefficients[5] * bodyweight ** 5;

  return Number(((500 / denominator) * total).toFixed(2));
}

export function calculateIpfGl({
  total,
  bodyweight,
  gender,
}: {
  total: number;
  bodyweight: number;
  gender: Gender;
}) {
  const coefficients =
    gender === "male"
      ? { a: 1199.72839, b: 1025.18162, c: 0.00921 }
      : { a: 610.32796, b: 1045.59282, c: 0.03048 };

  const denominator = coefficients.a - coefficients.b * Math.exp(-coefficients.c * bodyweight);
  return Number(((100 / denominator) * total).toFixed(2));
}

export function normalizeToKg(value: number, unit: Unit) {
  return unit === "kg" ? value : convertWeight(value, "lb", "kg");
}
