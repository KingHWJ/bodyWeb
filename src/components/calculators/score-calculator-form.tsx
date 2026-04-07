"use client";

import { useState } from "react";

import { calculateDots, calculateIpfGl, calculateWilks } from "@/lib/calculators/formulas";

import { Field, ResultCard, inputClassName, pillClassName } from "@/components/calculators/one-rep-max-form";

type ScoreType = "dots" | "ipf-gl" | "wilks";

const SCORE_LABEL_MAP: Record<ScoreType, string> = {
  dots: "DOTS",
  "ipf-gl": "IPF GL",
  wilks: "Wilks",
};

export function ScoreCalculatorForm({ type }: { type: ScoreType }) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyweight, setBodyweight] = useState("83");
  const [total, setTotal] = useState("600");

  const score = getScore(type, {
    gender,
    bodyweight: Number(bodyweight || 0),
    total: Number(total || 0),
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
        <Field label="总成绩 (kg)">
          <input value={total} onChange={(event) => setTotal(event.target.value)} type="number" className={inputClassName} />
        </Field>
      </div>

      <ResultCard
        title={`${SCORE_LABEL_MAP[type]} 结果`}
        rows={[
          { label: "积分", value: `${score}` },
          { label: "体重", value: `${bodyweight || 0} kg` },
          { label: "总成绩", value: `${total || 0} kg` },
        ]}
      />
    </div>
  );
}

function getScore(
  type: ScoreType,
  values: { total: number; bodyweight: number; gender: "male" | "female" },
) {
  if (type === "dots") {
    return calculateDots(values);
  }

  if (type === "ipf-gl") {
    return calculateIpfGl(values);
  }

  return calculateWilks(values);
}
