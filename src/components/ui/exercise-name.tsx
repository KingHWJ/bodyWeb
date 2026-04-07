import type { ReactNode } from "react";

import {
  buildExerciseNameParts,
  buildExerciseNamePartsFromEnglishName,
} from "@/lib/domain/exercise-translation";

export function ExerciseName({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const parts = buildExerciseNameParts(slug);
  return <ExerciseNameText parts={parts} className={className} />;
}

export function ExerciseNameFromEnglish({
  englishName,
  className,
}: {
  englishName: string;
  className?: string;
}) {
  const parts = buildExerciseNamePartsFromEnglishName(englishName);
  return <ExerciseNameText parts={parts} className={className} />;
}

function ExerciseNameText({
  parts,
  className,
}: {
  parts: {
    primary: string;
    secondary: string | null;
  };
  className?: string;
}) {
  return (
    <span className={className}>
      <span>{parts.primary}</span>
      {parts.secondary ? (
        <span className="ml-1 text-[0.72em] font-medium text-[color:var(--color-muted)]">
          （{parts.secondary}）
        </span>
      ) : null}
    </span>
  );
}

export function withExerciseName(slug: string): ReactNode {
  return <ExerciseName slug={slug} />;
}
