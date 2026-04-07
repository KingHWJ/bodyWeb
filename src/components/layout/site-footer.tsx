export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--color-muted)]">BodyWeb</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--color-ink)]">
            把力量标准、三大项对比和常用公式放到一个中文工作台里。
          </h2>
        </div>
        <div className="space-y-2 text-sm text-[color:var(--color-muted)]">
          <p>仅保留训练和计算真正有帮助的内容。</p>
          <p>不包含登录系统、公司宣传页与法律说明页。</p>
          <p className="font-mono text-xs text-[color:var(--color-muted-strong)]">BodyWeb / Strength Tools</p>
        </div>
      </div>
    </footer>
  );
}
