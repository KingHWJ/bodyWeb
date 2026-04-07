export type Unit = "kg" | "lb";

export type StrengthStandardsPath =
  | {
      kind: "exercise";
      slug: string;
      unit: Unit;
    }
  | {
      kind: "comparison";
      slug: string;
      leftSlug: string;
      rightSlug: string;
      unit: Unit;
    };
