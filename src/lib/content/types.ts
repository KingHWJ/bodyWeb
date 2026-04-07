export type FaqEntry = {
  heading: string;
  body: string;
};

export type FaqSection = {
  title: string;
  entries: FaqEntry[];
};

export type ExerciseStandardSummaryRow = {
  level: string;
  value: string;
};

export type ExerciseStandardDetailRow = {
  label: string;
  beginner: string;
  novice: string;
  intermediate: string;
  advanced: string;
  elite: string;
};

export type ComparisonStandardSummaryRow = {
  level: string;
  leftValue: string;
  rightValue: string;
};

export type ExerciseStandardData = {
  kind: "exercise";
  exerciseName: string;
  unit: "kg" | "lb";
  male: ExerciseStandardSummaryRow[];
  female: ExerciseStandardSummaryRow[];
  maleBodyweightRatio: ExerciseStandardSummaryRow[];
  femaleBodyweightRatio: ExerciseStandardSummaryRow[];
  maleByBodyweight: ExerciseStandardDetailRow[];
  femaleByBodyweight: ExerciseStandardDetailRow[];
  maleByAge: ExerciseStandardDetailRow[];
  femaleByAge: ExerciseStandardDetailRow[];
};

export type ComparisonStandardData = {
  kind: "comparison";
  leftName: string;
  rightName: string;
  unit: "kg" | "lb";
  male: ComparisonStandardSummaryRow[];
  female: ComparisonStandardSummaryRow[];
};

export type ContentInventory = {
  generatedAt: string;
  staticPages: string[];
  calculatorPages: string[];
  aggregateStandardPages: string[];
  exerciseStandardSlugs: string[];
  comparisonStandardSlugs: string[];
};
