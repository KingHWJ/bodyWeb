import { describe, expect, it } from "vitest";

import {
  buildContentInventory,
  extractSitemapUrls,
  filterUsefulFaqEntries,
} from "@/lib/content/inventory";

describe("站点清单生成", () => {
  it("可以从 sitemap XML 中提取 URL", () => {
    const xml = `
      <urlset>
        <url><loc>https://strengthlevel.com/</loc></url>
        <url><loc>https://strengthlevel.com/strength-standards/bench-press/kg</loc></url>
      </urlset>
    `;

    expect(extractSitemapUrls(xml)).toEqual([
      "https://strengthlevel.com/",
      "https://strengthlevel.com/strength-standards/bench-press/kg",
    ]);
  });

  it("可以把 URL 分类为普通标准页、比较页和计算器页", () => {
    const inventory = buildContentInventory([
      "https://strengthlevel.com/",
      "https://strengthlevel.com/calculators",
      "https://strengthlevel.com/faq",
      "https://strengthlevel.com/one-rep-max-calculator",
      "https://strengthlevel.com/strength-standards/bench-press/kg",
      "https://strengthlevel.com/strength-standards/bench-press/lb",
      "https://strengthlevel.com/strength-standards/bench-press-vs-squat/kg",
      "https://strengthlevel.com/strength-standards/male/kg",
    ]);

    expect(inventory.staticPages).toContain("/");
    expect(inventory.calculatorPages).toContain("/one-rep-max-calculator");
    expect(inventory.aggregateStandardPages).toContain("/strength-standards/male/kg");
    expect(inventory.exerciseStandardSlugs).toEqual(["bench-press"]);
    expect(inventory.comparisonStandardSlugs).toEqual(["bench-press-vs-squat"]);
  });

  it("只保留对健身有帮助的 FAQ 条目", () => {
    const entries = [
      { heading: "Should I include the weight of the bar?", body: "A" },
      { heading: "How do I delete my account?", body: "B" },
      { heading: "What formula do you use on the 1RM calculator?", body: "C" },
    ];

    expect(filterUsefulFaqEntries(entries)).toEqual([
      { heading: "Should I include the weight of the bar?", body: "A" },
      { heading: "What formula do you use on the 1RM calculator?", body: "C" },
    ]);
  });
});
