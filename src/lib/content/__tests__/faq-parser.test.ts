import { describe, expect, it } from "vitest";

import { parseFaqHtml } from "@/lib/content/faq-parser";

describe("FAQ HTML 解析", () => {
  it("可以提取 FAQ 分组和问答条目", () => {
    const html = `
      <div class="content">
        <h2 class="title">Strength Level standards</h2>
        <h3 class="subtitle">Are the strength standards based on lifts entered?</h3>
        <p>Yes, we take all the lifts entered.</p>
        <h3 class="subtitle">How do you stop false lifts?</h3>
        <p>We use algorithms.</p>
        <h2 class="title">Strength Level accounts</h2>
        <h3 class="subtitle">How do I delete my account?</h3>
        <p>Go to settings.</p>
      </div>
    `;

    expect(parseFaqHtml(html)).toEqual([
      {
        title: "Strength Level standards",
        entries: [
          {
            heading: "Are the strength standards based on lifts entered?",
            body: "Yes, we take all the lifts entered.",
          },
          {
            heading: "How do you stop false lifts?",
            body: "We use algorithms.",
          },
        ],
      },
      {
        title: "Strength Level accounts",
        entries: [
          {
            heading: "How do I delete my account?",
            body: "Go to settings.",
          },
        ],
      },
    ]);
  });
});
