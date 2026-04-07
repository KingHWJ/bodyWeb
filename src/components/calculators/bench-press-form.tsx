"use client";

import { useState } from "react";

import { estimateBenchPressMetrics } from "@/lib/calculators/formulas";
import type { Unit } from "@/lib/domain/types";

import { Field, ResultCard, inputClassName, pillClassName } from "@/components/calculators/one-rep-max-form";

export function BenchPressForm() {
  const [bodyweight, setBodyweight] = useState("75");
  const [weight, setWeight] = useState("80");
  const [reps, setReps] = useState("5");
  const [unit, setUnit] = useState<Unit>("kg");

  const result = estimateBenchPressMetrics({
    bodyweight: Number(bodyweight || 0),
    weight: Number(weight || 0),
    reps: Number(reps || 1),
    unit,
  });

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4">
        <Field label="体重">
          <input value={bodyweight} onChange={(event) => setBodyweight(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="卧推重量">
          <input value={weight} onChange={(event) => setWeight(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="重复次数">
          <input value={reps} onChange={(event) => setReps(event.target.value)} type="number" min="1" className={inputClassName} />
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
      </div>

      <ResultCard
        title="卧推结果"
        rows={[
          { label: "估算 1RM", value: `${result.estimatedOneRepMax} ${unit}` },
          { label: "体重比", value: `${result.bodyweightRatio}` },
          { label: "说明", value: "适合快速判断当前卧推处于什么水平区间" },
        ]}
      />
    </div>
  );
}
