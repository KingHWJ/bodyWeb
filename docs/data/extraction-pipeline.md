# 数据采集管线

## 第一阶段：清单生成
- 脚本：`npm run inventory`
- 输入：`https://strengthlevel.com/sitemap.xml`
- 输出：`content/inventory.json`

## 第二阶段：页面抓取
- 目标：按页面族抓取 HTML 快照与结构化数据
- 页面族：
  - FAQ
  - 计算器页
  - 普通动作标准页
  - 动作对比页
  - 聚合标准页

## 第三阶段：标准化
- 统一枚举：
  - `Unit = kg | lb`
  - `Gender = male | female`
  - `Level = beginner | novice | intermediate | advanced | elite`
- `ExerciseStandardData` 当前已标准化出以下字段：
  - `male` / `female`：全体用户重量摘要表
  - `maleBodyweightRatio` / `femaleBodyweightRatio`：全体用户体重倍数摘要表
  - `maleByBodyweight` / `femaleByBodyweight`：按体重等级矩阵
  - `maleByAge` / `femaleByAge`：按年龄等级矩阵
- 动作对比页当前先保留男/女摘要对照表，后续再继续补抓更多结构化内容
- 所有重量先归一到公斤，再派生展示单位
- 普通动作标准页当前 normalized 输出至少包含：
  - 男 / 女摘要重量表
  - 男 / 女摘要体重倍数表
  - 男 / 女按体重明细表
  - 男 / 女按年龄明细表
- 动作对比页当前 normalized 输出包含男 / 女等级对照摘要表

## 第四阶段：中文化
- 动作名使用术语表统一翻译
- FAQ 与模板文案使用统一中文表达
- 标题、表头、按钮和 SEO 文案统一维护

## 注意事项
- 抓取逻辑只依赖公开页面
- 不采集登录态内容
- 不保留非训练核心页面
- 抓取脚本支持按 slug 定向补抓，便于先验证重点动作页再扩展到全量目录
- 抓取脚本当前支持通过命令行传入指定 slug，便于分批补齐和断点续抓
