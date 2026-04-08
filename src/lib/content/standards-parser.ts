import { load } from "cheerio";

type ExerciseSummaryRow = {
  level: string;
  value: string;
};

type ExerciseDetailRow = {
  label: string;
  beginner: string;
  novice: string;
  intermediate: string;
  advanced: string;
  elite: string;
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
  const maleSection = findExerciseSectionForHeading(maleHeading, $);
  const femaleSection = findExerciseSectionForHeading(femaleHeading, $);

  return {
    kind: "exercise" as const,
    exerciseName: maleTitle.replace(/^Male\s+/, "").replace(/\s+Standards\s+\((kg|lb)\)$/, ""),
    unit: extractUnit(maleTitle),
    male: readExerciseSummaryTable(findExerciseSummaryTable(maleHeading, maleSection, "Weight", $), $),
    female: readExerciseSummaryTable(findExerciseSummaryTable(femaleHeading, femaleSection, "Weight", $), $),
    maleBodyweightRatio: readExerciseSummaryTable(
      findExerciseSummaryTable(maleHeading, maleSection, "Bodyweight Ratio", $),
      $,
    ),
    femaleBodyweightRatio: readExerciseSummaryTable(
      findExerciseSummaryTable(femaleHeading, femaleSection, "Bodyweight Ratio", $),
      $,
    ),
    maleByBodyweight: readExerciseDetailTable(findExerciseDetailTable(maleSection, "By Bodyweight", $), $),
    femaleByBodyweight: readExerciseDetailTable(findExerciseDetailTable(femaleSection, "By Bodyweight", $), $),
    maleByAge: readExerciseDetailTable(findExerciseDetailTable(maleSection, "By Age", $), $),
    femaleByAge: readExerciseDetailTable(findExerciseDetailTable(femaleSection, "By Age", $), $),
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
    male: readComparisonSummaryTable(findSummaryTableForHeading(maleHeading), $),
    female: readComparisonSummaryTable(findSummaryTableForHeading(femaleHeading), $),
  };
}

function findSummaryTableForHeading(
  heading: cheerio.Cheerio,
): cheerio.Cheerio {
  const directSiblingTable = heading.nextAll("table").first();
  if (directSiblingTable.length > 0) {
    return directSiblingTable;
  }

  const sectionBox = heading.closest(".section-box");
  if (sectionBox.length > 0) {
    return sectionBox.find("table").first();
  }

  return heading.parent().find("table").first();
}

function findExerciseSectionForHeading(
  heading: cheerio.Cheerio,
  $: ReturnType<typeof load>,
) {
  // 真实页面里男/女动作标准内容都包在各自的 section-box 内，后续表格查找都以这个区域为边界。
  const sectionBox = heading.closest(".section-box");
  if (sectionBox.length > 0) {
    return sectionBox;
  }

  const headingParent = heading.parent();
  if (headingParent.length > 0) {
    return headingParent;
  }

  return $.root();
}

function findExerciseSummaryTable(
  heading: cheerio.Cheerio,
  section: cheerio.Cheerio,
  tabTitle: string,
  $: ReturnType<typeof load>,
) {
  const table = findTabTable(section, "Entire Community", tabTitle, $);
  if (table.length > 0) {
    return table;
  }

  if (tabTitle === "Weight") {
    return findSummaryTableForHeading(heading);
  }

  return section.find("__missing__");
}

function findExerciseDetailTable(
  section: cheerio.Cheerio,
  tabTitle: string,
  $: ReturnType<typeof load>,
) {
  return findTabTable(section, "By Weight and Age", tabTitle, $);
}

function findTabTable(
  root: cheerio.Cheerio,
  groupName: string,
  tabTitle: string,
  $: ReturnType<typeof load>,
) {
  const group = root.find(`[data-tab-group="${groupName}"]`).first();
  const searchRoot = group.length > 0 ? group : root;
  const titledTab = searchRoot
    .find(".tab")
    .filter((_, element) => $(element).find(".tab-title").text().trim() === tabTitle)
    .first();

  if (titledTab.length > 0) {
    return titledTab.find("table").first();
  }

  // 有些简化结构或回退结构没有 tab-title，只能靠表头语义来兜底匹配。
  const matchedTable = searchRoot
    .find("table")
    .filter((_, element) => matchesExpectedTable($(element), tabTitle, $))
    .first();
  if (matchedTable.length > 0) {
    return matchedTable;
  }

  if (group.length > 0) {
    return group.find("table").first();
  }

  return root.find("__missing__");
}

function matchesExpectedTable(
  table: cheerio.Cheerio,
  tabTitle: string,
  $: ReturnType<typeof load>,
) {
  const headerTexts = table
    .find("thead th")
    .toArray()
    .map((cell) => $(cell).text().trim());

  if (tabTitle === "Weight") {
    return headerTexts[0] === "Strength Level" && headerTexts[1] === "Weight";
  }

  if (tabTitle === "Bodyweight Ratio") {
    return headerTexts.includes("Bodyweight Ratio");
  }

  if (tabTitle === "By Bodyweight") {
    return headerTexts[0] === "BW" || headerTexts[0] === "Bodyweight";
  }

  if (tabTitle === "By Age") {
    return headerTexts[0] === "Age";
  }

  return false;
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

function readExerciseDetailTable(
  table: cheerio.Cheerio,
  $: ReturnType<typeof load>,
): ExerciseDetailRow[] {
  // 明细表固定是“标签列 + 五个等级列”，这里统一整理成便于前端渲染的矩阵行结构。
  return table
    .find("tbody tr")
    .toArray()
    .map((row) => {
      const cells = $(row).find("td").toArray().map((cell) => $(cell).text().trim());
      if (cells.length < 6) {
        return null;
      }

      return {
        label: cells[0],
        beginner: cells[1],
        novice: cells[2],
        intermediate: cells[3],
        advanced: cells[4],
        elite: cells[5],
      };
    })
    .filter((row): row is ExerciseDetailRow => row !== null);
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
