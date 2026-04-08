import type { ReactNode } from "react";

import { HeaderNav } from "@/components/layout/header-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-ink)]">
      <HeaderNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
