export type InventoryLike = {
  exerciseStandardSlugs: string[];
  comparisonStandardSlugs: string[];
};

type ScrapeFlags = {
  all: boolean;
  allExercises: boolean;
  allComparisons: boolean;
  resume: boolean;
  limit?: number;
};

export type ScrapePlan = {
  exerciseSlugs: string[];
  comparisonSlugs: string[];
  resume: boolean;
};

export type CoverageSummary = {
  exercise: {
    completed: number;
    total: number;
  };
  comparison: {
    completed: number;
    total: number;
  };
};

export function buildScrapePlan(
  args: string[],
  inventory: InventoryLike,
  existingFiles: string[],
): ScrapePlan {
  const { flags, positional } = parseScrapeArguments(args);
  const explicitExerciseTargets = positional.filter((target) => !target.includes("-vs-"));
  const explicitComparisonTargets = positional.filter((target) => target.includes("-vs-"));

  let exerciseSlugs = explicitExerciseTargets;
  let comparisonSlugs = explicitComparisonTargets;

  if (positional.length === 0) {
    if (flags.all || flags.allExercises) {
      exerciseSlugs = [...inventory.exerciseStandardSlugs];
    } else if (!flags.allComparisons) {
      exerciseSlugs = inventory.exerciseStandardSlugs.slice(0, 10);
    }

    if (flags.all || flags.allComparisons) {
      comparisonSlugs = [...inventory.comparisonStandardSlugs];
    } else if (!flags.allExercises) {
      comparisonSlugs = inventory.comparisonStandardSlugs.slice(0, 10);
    }
  }

  if (typeof flags.limit === "number") {
    exerciseSlugs = exerciseSlugs.slice(0, flags.limit);
    comparisonSlugs = comparisonSlugs.slice(0, flags.limit);
  }

  if (flags.resume) {
    const completedSlugs = collectCompletedSlugs(existingFiles);
    exerciseSlugs = exerciseSlugs.filter((slug) => !completedSlugs.has(slug));
    comparisonSlugs = comparisonSlugs.filter((slug) => !completedSlugs.has(slug));
  }

  return {
    exerciseSlugs,
    comparisonSlugs,
    resume: flags.resume,
  };
}

export function buildCoverageSummary(
  inventory: InventoryLike,
  existingFiles: string[],
): CoverageSummary {
  const completedSlugs = collectCompletedSlugs(existingFiles);

  return {
    exercise: {
      completed: inventory.exerciseStandardSlugs.filter((slug) => completedSlugs.has(slug)).length,
      total: inventory.exerciseStandardSlugs.length,
    },
    comparison: {
      completed: inventory.comparisonStandardSlugs.filter((slug) => completedSlugs.has(slug)).length,
      total: inventory.comparisonStandardSlugs.length,
    },
  };
}

function parseScrapeArguments(args: string[]) {
  const flags: ScrapeFlags = {
    all: false,
    allExercises: false,
    allComparisons: false,
    resume: false,
  };
  const positional: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (current === "--all") {
      flags.all = true;
      continue;
    }

    if (current === "--all-exercises") {
      flags.allExercises = true;
      continue;
    }

    if (current === "--all-comparisons") {
      flags.allComparisons = true;
      continue;
    }

    if (current === "--resume") {
      flags.resume = true;
      continue;
    }

    if (current === "--limit") {
      const nextValue = args[index + 1];
      if (nextValue) {
        flags.limit = Number(nextValue);
        index += 1;
      }
      continue;
    }

    if (current.startsWith("--limit=")) {
      flags.limit = Number(current.split("=")[1]);
      continue;
    }

    positional.push(current);
  }

  return { flags, positional };
}

function collectCompletedSlugs(existingFiles: string[]) {
  const unitsBySlug = new Map<string, Set<string>>();

  for (const fileName of existingFiles) {
    const match = fileName.match(/^(.*)\.(kg|lb)\.json$/);
    if (!match) {
      continue;
    }

    const [, slug, unit] = match;
    const units = unitsBySlug.get(slug) ?? new Set<string>();
    units.add(unit);
    unitsBySlug.set(slug, units);
  }

  return new Set(
    [...unitsBySlug.entries()]
      .filter(([, units]) => units.has("kg") && units.has("lb"))
      .map(([slug]) => slug),
  );
}
