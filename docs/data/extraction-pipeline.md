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
- 所有重量先归一到公斤，再派生展示单位

## 第四阶段：中文化
- 动作名使用术语表统一翻译
- FAQ 与模板文案使用统一中文表达
- 标题、表头、按钮和 SEO 文案统一维护

## 注意事项
- 抓取逻辑只依赖公开页面
- 不采集登录态内容
- 不保留非训练核心页面
