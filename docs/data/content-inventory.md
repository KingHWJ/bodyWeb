# 内容清单

## 来源
- 上游公开 `sitemap.xml`
- FAQ 公共页面
- 公开力量标准页
- 公开动作对比页
- 公开计算器页

## 输出文件
- `content/inventory.json`

## 关键字段
- `staticPages`：静态内容页与总览页
- `calculatorPages`：显式计算器路由
- `aggregateStandardPages`：男/女聚合力量标准页
- `exerciseStandardSlugs`：普通动作标准页 slug
- `comparisonStandardSlugs`：动作对比页 slug

## 当前统计
- 普通动作：287
- 比较页：1337
- 详情页总数：3248
- 2026-04-07 本地 normalized 覆盖：普通动作 `287/287`，比较页 `1337/1337`

## 使用方式
- `generateStaticParams` 从该文件读取路由参数。
- 数据采集脚本基于该文件决定抓取队列。
- 页面覆盖率检查也以该文件为准。
- 标准页抓取脚本会基于该文件计算“普通动作 / 对比页”的覆盖率摘要。
