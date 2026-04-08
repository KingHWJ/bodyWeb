"use client";

import { useState } from "react";

import {
  calculateDots,
  calculateIpfGl,
  calculatePowerliftingTotal,
  calculateWilks,
} from "@/lib/calculators/formulas";

import { Field, ResultCard, inputClassName, pillClassName } from "@/components/calculators/one-rep-max-form";

export function PowerliftingCalculatorForm() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyweight, setBodyweight] = useState("83");
  const [bench, setBench] = useState("140");
  const [squat, setSquat] = useState("200");
  const [deadlift, setDeadlift] = useState("240");

  const total = calculatePowerliftingTotal({
    bench: Number(bench || 0),
    squat: Number(squat || 0),
    deadlift: Number(deadlift || 0),
  });

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4">
        <Field label="性别">
          <div className="flex gap-3">
            {([
              ["male", "男性"],
              ["female", "女性"],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setGender(value)} className={pillClassName(gender === value)}>
                {label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="体重 (kg)">
          <input value={bodyweight} onChange={(event) => setBodyweight(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="卧推 (kg)">
          <input value={bench} onChange={(event) => setBench(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="深蹲 (kg)">
          <input value={squat} onChange={(event) => setSquat(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="硬拉 (kg)">
          <input value={deadlift} onChange={(event) => setDeadlift(event.target.value)} type="number" className={inputClassName} />
        </Field>
      </div>

      <ResultCard
        title="三项总成绩"
        rows={[
          { label: "总成绩", value: `${total.toFixed(1)} kg` },
          { label: "DOTS", value: `${calculateDots({ total, bodyweight: Number(bodyweight || 0), gender })}` },
          { label: "IPF GL", value: `${calculateIpfGl({ total, bodyweight: Number(bodyweight || 0), gender })}` },
          { label: "Wilks", value: `${calculateWilks({ total, bodyweight: Number(bodyweight || 0), gender })}` },
        ]}
      />
    </div>
  );
}
