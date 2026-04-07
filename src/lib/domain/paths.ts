import type { StrengthStandardsPath, Unit } from "@/lib/domain/types";

const STRENGTH_STANDARDS_PREFIX = "/strength-standards/";

export function buildExerciseStandardsPath(slug: string, unit: Unit): string {
  return `${STRENGTH_STANDARDS_PREFIX}${slug}/${unit}`;
}

export function buildStrengthStandardsComparisonPath(
  leftSlug: string,
  rightSlug: string,
  unit: Unit,
): string {
  return `${STRENGTH_STANDARDS_PREFIX}${leftSlug}-vs-${rightSlug}/${unit}`;
}

export function parseStrengthStandardsPath(pathname: string): StrengthStandardsPath | null {
  if (!pathname.startsWith(STRENGTH_STANDARDS_PREFIX)) {
    return null;
  }

  const remainder = pathname.slice(STRENGTH_STANDARDS_PREFIX.length);
  const parts = remainder.split("/").filter(Boolean);

  if (parts.length !== 2) {
    return null;
  }

  const [slug, unit] = parts;

  if (unit !== "kg" && unit !== "lb") {
    return null;
  }

  if (slug.includes("-vs-")) {
    const [leftSlug, rightSlug] = slug.split("-vs-");
    if (!leftSlug || !rightSlug) {
      return null;
    }

    return {
      kind: "comparison",
      slug,
      leftSlug,
      rightSlug,
      unit,
    };
  }

  return {
    kind: "exercise",
    slug,
    unit,
  };
}
