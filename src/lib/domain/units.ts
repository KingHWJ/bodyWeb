import type { Unit } from "@/lib/domain/types";

const LB_PER_KG = 2.20462;

export function normalizeWeightToKg(value: number, unit: Unit): number {
  return unit === "kg" ? value : value / LB_PER_KG;
}

export function convertWeight(value: number, from: Unit, to: Unit): number {
  if (from === to) {
    return value;
  }

  const valueInKg = normalizeWeightToKg(value, from);
  return to === "kg" ? valueInKg : valueInKg * LB_PER_KG;
}

export function roundDisplayWeight(value: number, unit: Unit): number {
  const precision = unit === "kg" ? 0 : 1;
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}
