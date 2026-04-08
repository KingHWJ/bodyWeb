import Link from "next/link";

import { NAV_ITEMS } from "@/lib/site-data";

export function HeaderNav() {
  return (
    <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-accent)] text-sm font-bold text-[color:var(--color-accent-foreground)]">
            BW
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-[color:var(--color-ink)]">
              BodyWeb 力量标准
            </span>
            <span className="text-sm text-[color:var(--color-muted)]">简体中文训练工具站</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[color:var(--color-muted)] transition hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
