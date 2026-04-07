export type FaqEntry = {
  heading: string;
  body: string;
};

export type ContentInventory = {
  generatedAt: string;
  staticPages: string[];
  calculatorPages: string[];
  aggregateStandardPages: string[];
  exerciseStandardSlugs: string[];
  comparisonStandardSlugs: string[];
};
