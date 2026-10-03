# 栏目设计与新闻归类

栏目由 `lib/categories.mjs` 统一定义；Markdown 转换器、JSON v1 契约、导航和静态路由共用该清单。每篇文章只有一个主栏目，标签补充细分主题。同一 `translationKey` 的所有语言版本必须使用相同栏目，构建时校验。

| 栏目 | category | 边界 |
| --- | --- | --- |
| 科技 | technology | AI、前沿技术、数字工具与基础设施 |
| 创新 | innovation | 新服务、设计方法与协作实践 |
| 商业 | business | 财经、投资、企业、市场与供应链 |
| 就业与城市生活 | work-life | 就业、职场发展、城市服务与日常生活 |
| 国内外要闻 | current-affairs | 国内外重要新闻、外交与公共政策 |
| 能源与产业 | energy | 新能源、储能、产业动态与能源供应 |

保留原来的 technology、innovation、business 栏目及 URL；复用科技覆盖 AI 与前沿技术，复用商业覆盖财经与投资，不再增加同义栏目。work-life、current-affairs、energy 补齐原先缺失的广义领域。能源栏目覆盖新能源与传统能源供应，不能把石油储备释放称为“新能源”。

## 归类规则

- 按文章的主要问题选择栏目，不按报道国家、人物或单篇热点创建栏目，不为了数量均分
- 企业融资可归商业；以 AI 产品、技术及相关政策风险为主的文章可归科技
- 关注就业处境、职业与城市生活的文章归 work-life；纯资产定价或宏观投资分析可归商业
- 外交协商、共同声明和国际政策分歧归 current-affairs；国际贸易、投资等可用标签补充
- 储能、双向充电、电力市场及能源供应归 energy；不要只因为内容较新而归创新
- 当前栏目没有稿件时保留可访问的栏目页并显示对应语言空态；首页不借用其他栏目文章填满栏目

## 2026-10-03 期

- Anthropic 政策风险：technology
- 美国就业报告：work-life
- 德国 MiSpeL 储能与双向充电：energy
- G7 石油储备释放：energy
- G20 贸易部长会议及共识分歧：current-affairs

目前首批为五篇简体中文文章。五语言导航与栏目页完整保留；正文译文只在相应 Markdown 文件发布后出现。商业、创新及其他语言的暂无稿件栏目会显示空态。

## 兼容性与验收

不修改既有文章的 slug、translationKey、issue、正文语言路径或标签 URL。Vercel 原有 world / politics / culture / cities 栏目和标签的永久跳转全部保留，仍进入对应语言的全部文章页；新增栏目避开这些旧 slug。静态预览服务器不会执行 Vercel 重定向。

JSON v1 字段及 schemaVersion 保持不变，允许的栏目扩展为上表六项。categoryLabel 必须使用 registry 中对应的固定英文键，前端以五语言词典显示。旧的三个栏目值继续有效。

验收：`npm test`、`npm run lint`、`npm run build`、`npm run check:export`、`node scripts/check-seo.mjs`。栏目导出检查覆盖 30 个语言栏目页、6 个兼容入口、导航、空态、精确文章集合、首页栏目成员、canonical/hreflang 与 sitemap。
