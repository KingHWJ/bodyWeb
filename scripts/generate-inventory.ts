import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildContentInventory, extractSitemapUrls } from "../src/lib/content/inventory";

async function main() {
  const response = await fetch("https://strengthlevel.com/sitemap.xml");

  if (!response.ok) {
    throw new Error(`抓取 sitemap 失败: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const urls = extractSitemapUrls(xml);
  const inventory = buildContentInventory(urls);
  const outputDir = path.join(process.cwd(), "content");
  const outputPath = path.join(outputDir, "inventory.json");

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, JSON.stringify(inventory, null, 2) + "\n", "utf8");

  console.log(`已生成页面清单: ${outputPath}`);
  console.log(`普通动作数量: ${inventory.exerciseStandardSlugs.length}`);
  console.log(`比较页数量: ${inventory.comparisonStandardSlugs.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
