import type { ReactNode } from "react";
import Link from "next/link";

export function LinkCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: ReactNode;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-[0_18px_50px_rgba(7,25,38,0.12)]"
    >
      <div>
        {badge ? (
          <span className="inline-flex rounded-full bg-[color:var(--color-panel)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            {badge}
          </span>
        ) : null}
        <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-ink)]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--color-muted)]">{description}</p>
      </div>
      <span className="mt-8 inline-flex items-center text-sm font-semibold text-[color:var(--color-accent)]">
        进入页面
      </span>
    </Link>
  );
}
