import type { ReactNode } from "react";

export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-ink)] md:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-4 text-base leading-8 text-[color:var(--color-muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
