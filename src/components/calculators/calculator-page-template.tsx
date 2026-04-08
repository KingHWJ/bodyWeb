import type { ReactNode } from "react";

import { PageSection } from "@/components/ui/page-section";

export function CalculatorPageTemplate({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <PageSection eyebrow={eyebrow} title={title} description={description}>
      <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
        {children}
      </div>
    </PageSection>
  );
}
