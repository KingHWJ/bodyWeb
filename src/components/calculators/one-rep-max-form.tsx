"use client";

import { useState } from "react";

import { estimateOneRepMax } from "@/lib/domain/one-rep-max";
import type { Unit } from "@/lib/domain/types";

export function OneRepMaxForm({ defaultExercise = "任意动作" }: { defaultExercise?: string }) {
  const [weight, setWeight] = useState("100");
  const [reps, setReps] = useState("5");
  const [unit, setUnit] = useState<Unit>("kg");

  const estimated = estimateOneRepMax(Number(weight || 0), Number(reps || 1));

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4">
        <Field label="动作">
          <input value={defaultExercise} readOnly className={inputClassName} />
        </Field>
        <Field label="训练重量">
          <input value={weight} onChange={(event) => setWeight(event.target.value)} type="number" className={inputClassName} />
        </Field>
        <Field label="重复次数">
          <input value={reps} onChange={(event) => setReps(event.target.value)} type="number" min="1" className={inputClassName} />
        </Field>
        <Field label="单位">
          <div className="flex gap-3">
            {(["kg", "lb"] as const).map((currentUnit) => (
              <button
                key={currentUnit}
                type="button"
                onClick={() => setUnit(currentUnit)}
                className={pillClassName(unit === currentUnit)}
              >
                {currentUnit.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <ResultCard
        title="估算结果"
        rows={[
          { label: "1RM", value: `${estimated.toFixed(1)} ${unit}` },
          { label: "输入重量", value: `${weight || 0} ${unit}` },
          { label: "输入次数", value: `${reps || 0} 次` },
        ]}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--color-muted-strong)]">{label}</span>
      {children}
    </label>
  );
}

function ResultCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-[1.75rem] bg-[color:var(--color-panel)] p-6">
      <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">{title}</h3>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-3 text-sm">
            <span className="text-[color:var(--color-muted)]">{row.label}</span>
            <span className="font-semibold text-[color:var(--color-ink)]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-[color:var(--color-border)] bg-white/70 px-4 text-sm outline-none transition focus:border-[color:var(--color-accent)]";

const pillClassName = (isActive: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
      : "bg-[color:var(--color-panel)] text-[color:var(--color-muted-strong)]"
  }`;

export { Field, ResultCard, inputClassName, pillClassName };
