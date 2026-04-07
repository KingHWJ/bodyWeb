import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

  const targets = process.argv.slice(2);
  const exerciseTargets = targets.filter((target) => !target.includes("-vs-"));
  const comparisonTargets = targets.filter((target) => target.includes("-vs-"));

  await scrapeExercisePages(
    exerciseTargets.length > 0 ? exerciseTargets : inventory.exerciseStandardSlugs.slice(0, 10),
    normalizedDir,
  );
  await scrapeComparisonPages(
    comparisonTargets.length > 0 ? comparisonTargets : inventory.comparisonStandardSlugs.slice(0, 10),
    normalizedDir,
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
