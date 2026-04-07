"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { ExerciseName } from "@/components/ui/exercise-name";
import type { ExerciseLibraryItem } from "@/lib/domain/exercise-library";
import { searchExerciseLibrary } from "@/lib/domain/exercise-library";

export function ExerciseLibraryClient({
  items,
}: {
  items: ExerciseLibraryItem[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = searchExerciseLibrary(items, deferredQuery);

  return (
    <>
      <section className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div>
            <label className="text-sm font-semibold text-[color:var(--color-muted-strong)]" htmlFor="exercise-search">
              搜索动作
            </label>
            <input
              id="exercise-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入中文、英文、slug 或缩写，例如 卧推 / bench / bp"
              className="mt-3 w-full rounded-[1.4rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[color:var(--color-accent)]"
            />
          </div>
          <div className="rounded-[1.5rem] bg-[color:var(--color-panel)] p-4 text-sm leading-7 text-[color:var(--color-muted-strong)]">
            <p>当前动作总数：{items.length}</p>
            <p>搜索结果：{results.length}</p>
            <p>能力要求默认展示 kg 下的男性 / 女性中级与高级参考。</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((item) => (
          <article
            key={item.slug}
            className="flex h-full flex-col rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">
                  <ExerciseName slug={item.slug} />
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                  {item.slug}
                </p>
              </div>
              <span className="rounded-full bg-[color:var(--color-panel)] px-3 py-1 text-xs font-semibold text-[color:var(--color-muted-strong)]">
                kg
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[color:var(--color-muted)]">{item.description}</p>

            <div className="mt-5 rounded-[1.5rem] border border-[color:var(--color-border)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[color:var(--color-ink)]">能力要求摘要</p>
              <div className="mt-3 grid gap-3 text-sm text-[color:var(--color-muted-strong)]">
                <RequirementLine
                  label="男性"
                  intermediate={item.requirements.maleIntermediate}
                  advanced={item.requirements.maleAdvanced}
                />
                <RequirementLine
                  label="女性"
                  intermediate={item.requirements.femaleIntermediate}
                  advanced={item.requirements.femaleAdvanced}
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                href={item.href}
                className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-accent-foreground)] transition hover:brightness-110"
              >
                查看标准
              </Link>
              <Link
                href={item.href.replace("/kg", "/lb")}
                className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-muted-strong)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-ink)]"
              >
                查看 lb
              </Link>
            </div>
          </article>
        ))}
      </section>

      {results.length === 0 ? (
        <section className="mt-8 rounded-[2rem] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center text-sm leading-7 text-[color:var(--color-muted)]">
          没有找到匹配动作。可以换成中文名、英文名、slug 或缩写继续搜索。
        </section>
      ) : null}
    </>
  );
}

function RequirementLine({
  label,
  intermediate,
  advanced,
}: {
  label: string;
  intermediate: string;
  advanced: string;
}) {
  return (
    <p>
      <span className="font-semibold text-[color:var(--color-ink)]">{label}</span>
      <span className="ml-2">中级 {intermediate}</span>
      <span className="ml-3">高级 {advanced}</span>
    </p>
  );
}
