import type { ContentInventory, FaqEntry } from "@/lib/content/types";

const DEFAULT_STATIC_PAGES = ["/", "/calculators", "/strength-standards", "/faq"];

const EXCLUDED_INFO_PAGES = new Set([
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
]);

const USEFUL_FAQ_KEYWORDS = [
  "weight",
  "bar",
  "repetition",
  "reps",
  "formula",
  "1rm",
  "strength",
  "standards",
  "dumbbell",
  "barbell",
  "bodyweight",
  "cable",
  "machine",
  "exercise",
  "paused",
  "touch-and-go",
];

export function extractSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

export function buildContentInventory(urls: string[]): ContentInventory {
  const staticPages = new Set(DEFAULT_STATIC_PAGES);
  const calculatorPages = new Set<string>();
  const aggregateStandardPages = new Set<string>();
  const exerciseStandardSlugs = new Set<string>();
  const comparisonStandardSlugs = new Set<string>();

  for (const url of urls) {
    const pathname = normalizePathname(url);

    if (!pathname || EXCLUDED_INFO_PAGES.has(pathname)) {
      continue;
    }

    if (pathname === "/faq" || pathname === "/" || pathname === "/calculators") {
      staticPages.add(pathname);
      continue;
    }

    if (pathname.includes("calculator")) {
      calculatorPages.add(pathname);
      continue;
    }

    if (pathname === "/powerlifting-standards") {
      staticPages.add(pathname);
      continue;
    }

    const aggregateMatch = pathname.match(/^\/strength-standards\/(male|female)(\/(kg|lb))?$/);
    if (aggregateMatch) {
      aggregateStandardPages.add(pathname);
      continue;
    }

    const standardDetailMatch = pathname.match(/^\/strength-standards\/([^/]+)\/(kg|lb)$/);
    if (standardDetailMatch) {
      const slug = standardDetailMatch[1];
      if (slug.includes("-vs-")) {
        comparisonStandardSlugs.add(slug);
      } else {
        exerciseStandardSlugs.add(slug);
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    staticPages: sortValues(staticPages),
    calculatorPages: sortValues(calculatorPages),
    aggregateStandardPages: sortValues(aggregateStandardPages),
    exerciseStandardSlugs: sortValues(exerciseStandardSlugs),
    comparisonStandardSlugs: sortValues(comparisonStandardSlugs),
  };
}

export function filterUsefulFaqEntries(entries: FaqEntry[]): FaqEntry[] {
  return entries.filter((entry) => {
    const normalizedHeading = entry.heading.toLowerCase();
    return USEFUL_FAQ_KEYWORDS.some((keyword) => normalizedHeading.includes(keyword));
  });
}

function normalizePathname(urlOrPath: string): string {
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return new URL(urlOrPath).pathname;
  }

  return urlOrPath;
}

function sortValues(values: Set<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}
