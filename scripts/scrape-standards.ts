import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildCoverageSummary, buildScrapePlan } from "../src/lib/content/scrape-plan";
import { parseComparisonStandardsHtml, parseExerciseStandardsHtml } from "../src/lib/content/standards-parser";

type Inventory = {
  exerciseStandardSlugs: string[];
  comparisonStandardSlugs: string[];
};

async function main() {
  const inventoryPath = path.join(process.cwd(), "content", "inventory.json");
  const normalizedDir = path.join(process.cwd(), "content", "normalized");
  const rawInventory = await readFile(inventoryPath, "utf8");
  const inventory = JSON.parse(rawInventory) as Inventory;

  await mkdir(normalizedDir, { recursive: true });

  const existingFiles = await readdir(normalizedDir);
  const plan = buildScrapePlan(process.argv.slice(2), inventory, existingFiles);

  console.log(
    `抓取计划：普通动作 ${plan.exerciseSlugs.length} 个，对比页 ${plan.comparisonSlugs.length} 个，续跑模式 ${plan.resume ? "开启" : "关闭"}`,
  );

  await scrapeExercisePages(plan.exerciseSlugs, normalizedDir);
  await scrapeComparisonPages(plan.comparisonSlugs, normalizedDir);

  const finalFiles = await readdir(normalizedDir);
  const coverage = buildCoverageSummary(inventory, finalFiles);
  console.log(
    `覆盖率：普通动作 ${coverage.exercise.completed}/${coverage.exercise.total}，对比页 ${coverage.comparison.completed}/${coverage.comparison.total}`,
  );
}

async function scrapeExercisePages(slugs: string[], normalizedDir: string) {
  for (const slug of slugs) {
    for (const unit of ["kg", "lb"] as const) {
      const url = `https://strengthlevel.com/strength-standards/${slug}/${unit}`;
      const html = await fetchHtml(url);
      const parsed = parseExerciseStandardsHtml(html);
      const outputPath = path.join(normalizedDir, `${slug}.${unit}.json`);
      await writeFile(outputPath, JSON.stringify(parsed, null, 2) + "\n", "utf8");
      console.log(`已写入动作标准: ${outputPath}`);
    }
  }
}

async function scrapeComparisonPages(slugs: string[], normalizedDir: string) {
  for (const slug of slugs) {
    for (const unit of ["kg", "lb"] as const) {
      const url = `https://strengthlevel.com/strength-standards/${slug}/${unit}`;
      const html = await fetchHtml(url);
      const parsed = parseComparisonStandardsHtml(html, slug);
      const outputPath = path.join(normalizedDir, `${slug}.${unit}.json`);
      await writeFile(outputPath, JSON.stringify(parsed, null, 2) + "\n", "utf8");
      console.log(`已写入动作对比: ${outputPath}`);
    }
  }
}

async function fetchHtml(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`抓取失败: ${url} -> ${response.status}`);
  }

  return response.text();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
