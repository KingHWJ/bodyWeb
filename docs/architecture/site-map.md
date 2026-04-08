# 站点地图

## 目标
构建一个面向自用的 StrengthLevel 简体中文版健身内容站，只保留对训练和计算有帮助的核心页面。

## 页面族
- `/`：首页，同时承担 Strength Level Calculator 的主入口角色。
- `/calculators`：计算器总览页。
- `/exercise-library`：可搜索的动作列表页，展示动作说明与能力要求摘要。
- `/faq`：只保留训练、录入、标准解释、计算公式相关 FAQ。
- `/powerlifting-standards`：力量举总成绩标准页。
- `/strength-standards`：力量标准总览页。
- `/content-coverage`：内容覆盖清单页。
- `/strength-standards/male`
- `/strength-standards/female`
- `/strength-standards/male/{unit}`
- `/strength-standards/female/{unit}`
- `/strength-standards/{exercise}/{unit}`
- `/strength-standards/{exercise1}-vs-{exercise2}/{unit}`
- 7 个显式计算器页：
  - `/one-rep-max-calculator`
  - `/bench-press-calculator`
  - `/plate-barbell-racking-calculator`
  - `/powerlifting-calculator`
  - `/dots-calculator`
  - `/ipf-gl-points-calculator`
  - `/wilks-calculator`

## 明确排除
- `my.strengthlevel.com` 登录与训练日志
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-and-conditions`
- 公司信息、社媒导流、法律页脚

## 当前清单快照
- 普通动作标准 slug：287
- 动作对比 slug：1337
- 聚合标准页：6
- 计算器页：7
- 静态核心页：7

## 路由策略
- URL 保持英文 slug，避免为大量页面维护中文映射。
- 页面内容统一输出简体中文。
- 单位继续使用段路由：`kg` / `lb`。
- 动作列表页支持按中文、英文、slug 和缩写做模糊搜索。
