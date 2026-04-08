import type { Metadata } from "next";

import { PageSection } from "@/components/ui/page-section";
import { TRANSLATED_FAQ_SECTIONS } from "@/lib/content/translated-faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "训练记录、力量标准与 1RM 公式相关的常见问题。",
};

export default function FaqPage() {
  return (
    <PageSection
      eyebrow="Training FAQ"
      title="只保留对训练和计算真正有帮助的常见问题"
      description="这些条目主要围绕重量记录、动作口径、力量标准解释和常见估算公式，去掉了账号、公司与客服相关内容。"
    >
      <div className="grid gap-6">
        {TRANSLATED_FAQ_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-[color:var(--color-ink)]">{section.title}</h2>
            <div className="mt-6 grid gap-5">
              {section.entries.map((entry) => (
                <article
                  key={entry.heading}
                  className="rounded-[1.5rem] bg-[color:var(--color-panel)] p-5"
                >
                  <h3 className="text-lg font-semibold text-[color:var(--color-ink)]">{entry.heading}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--color-muted)]">
                    {entry.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageSection>
  );
}
