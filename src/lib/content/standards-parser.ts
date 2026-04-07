import { load } from "cheerio";

type ExerciseSummaryRow = {
  level: string;
  value: string;
};

type ComparisonSummaryRow = {
  level: string;
  leftValue: string;
  rightValue: string;
};

export function parseExerciseStandardsHtml(html: string) {
  const $ = load(html);
  const maleHeading = $("h2").filter((_, element) => $(element).text().includes("Male")).first();
  const femaleHeading = $("h2").filter((_, element) => $(element).text().includes("Female")).first();
  const maleTitle = maleHeading.text().trim();

  return {
    kind: "exercise" as const,
    exerciseName: maleTitle.replace(/^Male\s+/, "").replace(/\s+Standards\s+\((kg|lb)\)$/, ""),
    unit: extractUnit(maleTitle),
    male: readExerciseSummaryTable(maleHeading.nextAll("table").first(), $),
    female: readExerciseSummaryTable(femaleHeading.nextAll("table").first(), $),
  };
}

export function parseComparisonStandardsHtml(html: string, slug: string) {
  const $ = load(html);
  const maleHeading = $("h2").filter((_, element) => $(element).text().includes("Male")).first();
  const femaleHeading = $("h2").filter((_, element) => $(element).text().includes("Female")).first();
  const [leftName, rightName] = slug.split("-vs-").map(titleizeSlug);

  return {
    kind: "comparison" as const,
    leftName,
    rightName,
    unit: extractUnit(maleHeading.text().trim()),
    male: readComparisonSummaryTable(maleHeading.nextAll("table").first(), $),
    female: readComparisonSummaryTable(femaleHeading.nextAll("table").first(), $),
  };
}

function readExerciseSummaryTable(
  table: cheerio.Cheerio,
  $: ReturnType<typeof load>,
): ExerciseSummaryRow[] {
  return table
    .find("tr")
    .toArray()
    .map((row) => {
      const cells = $(row).find("td").toArray().map((cell) => $(cell).text().trim());
      if (cells.length < 2) {
        return null;
      }

      return {
        level: cells[0],
        value: cells[1],
      };
    })
    .filter((row): row is ExerciseSummaryRow => row !== null);
}

function readComparisonSummaryTable(
  table: cheerio.Cheerio,
  $: ReturnType<typeof load>,
): ComparisonSummaryRow[] {
  return table
    .find("tbody tr")
    .toArray()
    .map((row) => {
      const cells = $(row).find("td").toArray().map((cell) => $(cell).text().trim());
      if (cells.length < 3) {
        return null;
      }

      return {
        level: cells[0],
        leftValue: cells[1],
        rightValue: cells[2],
      };
    })
    .filter((row): row is ComparisonSummaryRow => row !== null);
}

function extractUnit(title: string) {
  return title.includes("(lb)") ? "lb" : "kg";
}

function titleizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
