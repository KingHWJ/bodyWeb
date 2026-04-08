import { load } from "cheerio";

import type { FaqSection } from "@/lib/content/types";

export function parseFaqHtml(html: string): FaqSection[] {
  const $ = load(html);
  const sections: FaqSection[] = [];
  let currentSection: FaqSection | null = null;
  let currentEntry: FaqSection["entries"][number] | null = null;

  $(".content")
    .children()
    .each((_, element) => {
      if (!("tagName" in element)) {
        return;
      }

      const node = $(element);
      const tagName = element.tagName.toLowerCase();

      if (tagName === "h2") {
        if (currentSection) {
          sections.push(currentSection);
        }

        currentSection = {
          title: node.text().trim(),
          entries: [],
        };
        currentEntry = null;
        return;
      }

      if (tagName === "h3" && currentSection) {
        currentEntry = {
          heading: node.text().trim(),
          body: "",
        };
        currentSection.entries.push(currentEntry);
        return;
      }

      if (tagName === "p" && currentEntry) {
        const paragraph = node.text().trim();
        currentEntry.body = currentEntry.body
          ? `${currentEntry.body}\n\n${paragraph}`
          : paragraph;
      }
    });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.filter((section) => section.entries.length > 0);
}
