import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BodyWeb 力量标准",
    template: "%s | BodyWeb 力量标准",
  },
  description: "面向中文训练者的力量标准、动作对比与常用力量计算工具。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
