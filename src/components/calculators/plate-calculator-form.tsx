"use client";

import { useState } from "react";

import { calculatePlateLoadout } from "@/lib/calculators/formulas";
import type { Unit } from "@/lib/domain/types";

import { Field, ResultCard, inputClassName, pillClassName } from "@/components/calculators/one-rep-max-form";

export function PlateCalculatorForm() {
  const [targetWeight, setTargetWeight] = useState("140");
  const [unit, setUnit] = useState<Unit>("kg");

  const barWeight = unit === "kg" ? 20 : 45;
  const result = calculatePlateLoadout({
    targetWeight: Number(targetWeight || 0),
    barWeight,
    unit,
  });

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4">
        <Field label="目标总重量">
          <input value={targetWeight} onChange={(event) => setTargetWeight(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="单位">
          <div className="flex gap-3">
            {(["kg", "lb"] as const).map((currentUnit) => (
              <button key={currentUnit} type="button" onClick={() => setUnit(currentUnit)} className={pillClassName(unit === currentUnit)}>
                {currentUnit.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>
        <Field label="默认杆重">
          <input value={`${barWeight} ${unit}`} readOnly className={inputClassName} />
        </Field>
      </div>

      <ResultCard
        title="每侧配重"
        rows={[
          { label: "每侧总重量", value: `${result.perSideWeight} ${unit}` },
          {
            label: "推荐杠铃片",
            value: result.plates.length > 0 ? result.plates.map((item) => `${item.size} x ${item.count}`).join(" / ") : "无需加片",
          },
          { label: "剩余误差", value: `${result.remainder} ${unit}` },
        ]}
      />
    </div>
  );
}
